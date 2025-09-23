import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";
import {
  authenticateToken,
  AuthRequest,
  requireMerchant,
  requireAdmin,
} from "../middleware/auth";
import { formatResponse, formatError } from "../utils/helpers";

const router = Router();

// Get merchant dashboard data
router.get(
  "/dashboard",
  authenticateToken,
  requireMerchant,
  async (req: AuthRequest, res: Response) => {
    try {
      const merchantId = req.user!.id;

      // Get merchant store
      const store = await prisma.merchantStore.findUnique({
        where: { merchantId },
        include: {
          products: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              price: true,
              stockQuantity: true,
              isActive: true,
              createdAt: true,
            },
          },
        },
      });

      if (!store) {
        return formatError(res, "Merchant store not found", 404);
      }

      // Get order statistics
      const orderStats = await prisma.order.aggregate({
        where: { merchantId },
        _count: { id: true },
        _sum: { total: true },
      });

      // Get recent orders
      const recentOrders = await prisma.order.findMany({
        where: { merchantId },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          orderItems: {
            include: {
              product: {
                select: { id: true, name: true, price: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      // Get low stock products
      const lowStockProducts = await prisma.product.findMany({
        where: {
          merchantStoreId: store.id,
          stockQuantity: { lte: prisma.product.fields.minStockLevel },
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          stockQuantity: true,
          minStockLevel: true,
        },
      });

      const dashboardData = {
        store,
        stats: {
          totalOrders: orderStats._count.id || 0,
          totalRevenue: orderStats._sum.total || 0,
          totalProducts: store.products.length,
          lowStockCount: lowStockProducts.length,
        },
        recentOrders,
        lowStockProducts,
      };

      return formatResponse(
        res,
        dashboardData,
        "Merchant dashboard data retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching merchant dashboard:", error);
      return formatError(res, "Failed to fetch dashboard data", 500);
    }
  }
);

// Get merchant products
router.get(
  "/products",
  authenticateToken,
  requireMerchant,
  async (req: AuthRequest, res: Response) => {
    try {
      const merchantId = req.user!.id;
      const { page = 1, limit = 10, search, category } = req.query;

      const store = await prisma.merchantStore.findUnique({
        where: { merchantId },
      });

      if (!store) {
        return formatError(res, "Merchant store not found", 404);
      }

      const where: any = {
        merchantStoreId: store.id,
      };

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: "insensitive" } },
          { description: { contains: search as string, mode: "insensitive" } },
        ];
      }

      if (category) {
        where.categoryId = category;
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.product.count({ where });

      return formatResponse(
        res,
        {
          products,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Products retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching merchant products:", error);
      return formatError(res, "Failed to fetch products", 500);
    }
  }
);

// Create new product
router.post(
  "/products",
  authenticateToken,
  requireMerchant,
  async (req: AuthRequest, res: Response) => {
    try {
      const merchantId = req.user!.id;
      const productData = req.body;

      const store = await prisma.merchantStore.findUnique({
        where: { merchantId },
      });

      if (!store) {
        return formatError(res, "Merchant store not found", 404);
      }

      const product = await prisma.product.create({
        data: {
          ...productData,
          merchantStoreId: store.id,
        },
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      });

      return formatResponse(res, product, "Product created successfully", 201);
    } catch (error) {
      console.error("Error creating product:", error);
      return formatError(res, "Failed to create product", 500);
    }
  }
);

// Update product
router.put(
  "/products/:id",
  authenticateToken,
  requireMerchant,
  async (req: AuthRequest, res: Response) => {
    try {
      const merchantId = req.user!.id;
      const { id } = req.params;
      const productData = req.body;

      const store = await prisma.merchantStore.findUnique({
        where: { merchantId },
      });

      if (!store) {
        return formatError(res, "Merchant store not found", 404);
      }

      // Check if product belongs to this merchant
      const existingProduct = await prisma.product.findFirst({
        where: {
          id,
          merchantStoreId: store.id,
        },
      });

      if (!existingProduct) {
        return formatError(res, "Product not found or access denied", 404);
      }

      const product = await prisma.product.update({
        where: { id },
        data: productData,
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      });

      return formatResponse(res, product, "Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      return formatError(res, "Failed to update product", 500);
    }
  }
);

// Get merchant orders
router.get(
  "/orders",
  authenticateToken,
  requireMerchant,
  async (req: AuthRequest, res: Response) => {
    try {
      const merchantId = req.user!.id;
      const { page = 1, limit = 10, status } = req.query;

      const where: any = { merchantId };

      if (status) {
        where.status = status;
      }

      const orders = await prisma.order.findMany({
        where,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          orderItems: {
            include: {
              product: {
                select: { id: true, name: true, price: true },
              },
            },
          },
          statusHistory: {
            orderBy: { timestamp: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.order.count({ where });

      return formatResponse(
        res,
        {
          orders,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Orders retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching merchant orders:", error);
      return formatError(res, "Failed to fetch orders", 500);
    }
  }
);

// Update order status (merchant can update their orders)
router.patch(
  "/orders/:id/status",
  authenticateToken,
  requireMerchant,
  async (req: AuthRequest, res: Response) => {
    try {
      const merchantId = req.user!.id;
      const { id } = req.params;
      const { status, notes } = req.body;

      // Check if order belongs to this merchant
      const order = await prisma.order.findFirst({
        where: {
          id,
          merchantId,
        },
      });

      if (!order) {
        return formatError(res, "Order not found or access denied", 404);
      }

      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
      });

      // Add status history
      await prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          status,
          notes,
          updatedBy: merchantId,
        },
      });

      return formatResponse(
        res,
        updatedOrder,
        "Order status updated successfully"
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      return formatError(res, "Failed to update order status", 500);
    }
  }
);

// Get merchant customers
router.get(
  "/customers",
  authenticateToken,
  requireMerchant,
  async (req: AuthRequest, res: Response) => {
    try {
      const merchantId = req.user!.id;
      const { page = 1, limit = 10 } = req.query;

      // Get customers who have ordered from this merchant
      const customers = await prisma.user.findMany({
        where: {
          orders: {
            some: {
              merchantId,
            },
          },
          role: "CUSTOMER",
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          orders: {
            where: { merchantId },
            select: {
              id: true,
              total: true,
              status: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.user.count({
        where: {
          orders: {
            some: {
              merchantId,
            },
          },
          role: "CUSTOMER",
        },
      });

      return formatResponse(
        res,
        {
          customers,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Customers retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching merchant customers:", error);
      return formatError(res, "Failed to fetch customers", 500);
    }
  }
);

// Create or update merchant store
router.post(
  "/store",
  authenticateToken,
  requireMerchant,
  async (req: AuthRequest, res: Response) => {
    try {
      const merchantId = req.user!.id;
      const storeData = req.body;

      const store = await prisma.merchantStore.upsert({
        where: { merchantId },
        update: storeData,
        create: {
          ...storeData,
          merchantId,
        },
      });

      return formatResponse(res, store, "Store updated successfully");
    } catch (error) {
      console.error("Error updating store:", error);
      return formatError(res, "Failed to update store", 500);
    }
  }
);

export default router;
