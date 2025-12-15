import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";
import { validateCreateOrder, validatePagination } from "../utils/validation";
import {
  formatResponse,
  formatError,
  generateOrderNumber,
  calculateOrderTotals,
} from "../utils/helpers";

const router = Router();

// Get user's orders
router.get(
  "/",
  authenticateToken,
  validatePagination,
  async (req: AuthRequest, res: Response) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where: { userId: req.user!.id },
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    mainImage: true,
                    slug: true,
                  },
                },
              },
            },
            shippingAddress: true,
            billingAddress: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: offset,
          take: Number(limit),
        }),
        prisma.order.count({
          where: { userId: req.user!.id },
        }),
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      return formatResponse(res, {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
        },
      });
    } catch (error) {
      console.error("Get orders error:", error);
      return formatError(res, "Failed to fetch orders", 500);
    }
  }
);

// Get single order
router.get(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const order = await prisma.order.findFirst({
        where: {
          id,
          userId: req.user!.id,
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  mainImage: true,
                  slug: true,
                  description: true,
                },
              },
            },
          },
          shippingAddress: true,
          billingAddress: true,
          // statusHistory: {
          //   orderBy: { timestamp: "desc" },
          //   include: {
          //     updater: {
          //       select: {
          //         id: true,
          //         firstName: true,
          //         lastName: true,
          //         role: true,
          //       },
          //     },
          //   },
          // },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      });

      if (!order) {
        return formatError(res, "Order not found", 404);
      }

      return formatResponse(res, order);
    } catch (error) {
      console.error("Get order error:", error);
      return formatError(res, "Failed to fetch order", 500);
    }
  }
);

// Create new order
router.post(
  "/",
  authenticateToken,
  validateCreateOrder,
  async (req: AuthRequest, res: Response) => {
    try {
      const { shippingAddressId, billingAddressId, paymentMethod, notes } =
        req.body;

      // Get user's cart items
      const cartItems = await prisma.cartItem.findMany({
        where: { userId: req.user!.id },
        include: {
          product: {
            include: {
              merchantStore: {
                select: {
                  merchantId: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      console.log("Cart items:", cartItems);

      if (cartItems.length === 0) {
        return formatError(res, "Cart is empty", 400);
      }

      // Validate addresses belong to user
      const [shippingAddress, billingAddress] = await Promise.all([
        prisma.address.findFirst({
          where: {
            id: shippingAddressId,
            userId: req.user!.id,
          },
        }),
        prisma.address.findFirst({
          where: {
            id: billingAddressId,
            userId: req.user!.id,
          },
        }),
      ]);

      if (!shippingAddress || !billingAddress) {
        return formatError(res, "Invalid address", 400);
      }

      // Check stock availability
      for (const cartItem of cartItems) {
        if (cartItem.quantity > cartItem.product.stockQuantity) {
          return formatError(
            res,
            `Insufficient stock for ${cartItem.product.name}`,
            400
          );
        }
      }

      // Calculate totals
      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.product.price),
        total: Number(item.product.price) * item.quantity,
      }));

      console.log("Order items:", orderItems);

      const totals = calculateOrderTotals(orderItems);
      console.log("Order totals:", totals);

      // Get merchant info safely
      let merchantId = null;
      let storeId = null;

      if (cartItems.length > 0 && cartItems[0].product) {
        merchantId = cartItems[0].product.merchantStore?.merchantId || null;
        storeId = cartItems[0].product.merchantStoreId || null;
      }

      console.log("Merchant info:", { merchantId, storeId });

      // Use transaction to ensure data consistency
      const result = await prisma.$transaction(async (tx) => {
        // Create order
        const order = await tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            userId: req.user!.id,
            merchantId,
            storeId,
            subtotal: totals.subtotal,
            tax: totals.tax,
            shipping: totals.shipping,
            total: totals.total,
            paymentMethod,
            shippingAddressId,
            billingAddressId,
            notes,
          },
        });

        console.log("Order created:", order);

        // Create order items
        await Promise.all(
          orderItems.map((item) =>
            tx.orderItem.create({
              data: {
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
              },
            })
          )
        );

        // Update product stock
        await Promise.all(
          cartItems.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: {
                  decrement: item.quantity,
                },
              },
            })
          )
        );

        // Create or update customer relationship
        if (merchantId) {
          const existingCustomer = await tx.customer.findFirst({
            where: {
              customerId: req.user!.id,
              merchantId: merchantId,
              storeId: storeId,
            },
          });

          if (existingCustomer) {
            // Update existing customer relationship
            await tx.customer.update({
              where: { id: existingCustomer.id },
              data: {
                lastOrderAt: new Date(),
                totalOrders: {
                  increment: 1,
                },
                totalSpent: {
                  increment: totals.total,
                },
              },
            });
          } else {
            // Create new customer relationship
            await tx.customer.create({
              data: {
                customerId: req.user!.id,
                merchantId: merchantId,
                storeId: storeId,
                firstOrderAt: new Date(),
                lastOrderAt: new Date(),
                totalOrders: 1,
                totalSpent: totals.total,
              },
            });
          }
        }

        // Clear cart
        await tx.cartItem.deleteMany({
          where: { userId: req.user!.id },
        });

        return order;
      });

      // Get complete order with items
      const completeOrder = await prisma.order.findUnique({
        where: { id: result.id },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  mainImage: true,
                  price: true,
                  slug: true,
                },
              },
            },
          },
          shippingAddress: true,
          billingAddress: true,
        },
      });

      return formatResponse(
        res,
        { order: completeOrder },
        "Order created successfully",
        201
      );
    } catch (error) {
      console.error("Create order error:", error);
      return formatError(res, "Failed to create order", 500);
    }
  }
);

// Update order status (Admin only) - ENHANCED WITH STATUS HISTORY
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status, trackingNumber, notes } = req.body;

      const updateData: Record<string, unknown> = { status };

      // Handle specific status updates - only use fields that exist in the schema
      if (status === "SHIPPED") {
        updateData.shippedAt = new Date();
        if (trackingNumber) {
          updateData.trackingNumber = trackingNumber;
        }
      }

      if (status === "DELIVERED") {
        updateData.deliveredAt = new Date();
      }

      // Note: CONFIRMED, PROCESSING, and CANCELLED statuses don't have specific timestamp fields
      // in the current schema, but the status change will still be tracked in statusHistory

      // Use transaction with increased timeout and simplified operations
      const result = await prisma.$transaction(
        async (tx) => {
          // Update the order (simplified - no complex includes)
          const order = await tx.order.update({
            where: { id },
            data: updateData,
          });

          // Create status history entry
          const statusHistory = await tx.orderStatusHistory.create({
            data: {
              orderId: id,
              status: status,
              updatedBy: req.user!.id,
              notes: notes || `Order status changed to ${status}`,
            },
          });

          return { order, statusHistory };
        },
        {
          timeout: 10000, // Increase timeout to 10 seconds
        }
      );

      // Fetch the complete order data after the transaction
      const completeOrder = await prisma.order.findUnique({
        where: { id },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  mainImage: true,
                  slug: true,
                },
              },
            },
          },
          shippingAddress: true,
          billingAddress: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Fetch the complete status history with updater info
      const completeStatusHistory = await prisma.orderStatusHistory.findUnique({
        where: { id: result.statusHistory.id },
        include: {
          updater: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      });

      return formatResponse(
        res,
        {
          order: completeOrder,
          statusHistory: completeStatusHistory,
        },
        "Order status updated successfully"
      );
    } catch (error) {
      console.error("Update order status error:", error);
      return formatError(res, "Failed to update order status", 500);
    }
  }
);

// Get order status history
router.get(
  "/:id/status-history",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      // Check if user owns the order or is admin
      const order = await prisma.order.findFirst({
        where: {
          id,
          OR: [
            { userId: req.user!.id },
            req.user!.role === "ADMIN" ? {} : { id: "nonexistent" },
          ],
        },
      });

      if (!order) {
        return formatError(res, "Order not found", 404);
      }

      const statusHistory = await prisma.orderStatusHistory.findMany({
        where: { orderId: id },
        orderBy: { timestamp: "desc" },
        include: {
          updater: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      });

      return formatResponse(res, { statusHistory });
    } catch (error) {
      console.error("Get order status history error:", error);
      return formatError(res, "Failed to fetch order status history", 500);
    }
  }
);

// Get all orders (Admin only)
router.get(
  "/admin/all",
  authenticateToken,
  requireAdmin,
  validatePagination,
  async (req: AuthRequest, res: Response) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const where: Record<string, unknown> = {};
      if (status) {
        where.status = status;
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    mainImage: true,
                    slug: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            shippingAddress: true,
            billingAddress: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: offset,
          take: Number(limit),
        }),
        prisma.order.count({ where }),
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      return formatResponse(res, {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
        },
      });
    } catch (error) {
      console.error("Get all orders error:", error);
      return formatError(res, "Failed to fetch orders", 500);
    }
  }
);

export default router;
