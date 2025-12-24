import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";
import {
  authenticateToken,
  AuthRequest,
  requireDelivery,
  canAssignDelivery,
  canManageDeliveryPayments,
} from "../middleware/auth";
import { formatResponse, formatError } from "../utils/helpers";
import { DeliveryStatus } from "@prisma/client";

const router = Router();

// Get delivery person's assigned orders
router.get(
  "/orders",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const deliveryUserId = req.user!.id;
      const { status, page = 1, limit = 10 } = req.query;
      const user = await prisma.user.findUnique({
        where: { id: deliveryUserId },
        include: { ownedDeliveryOrg: true },
      });

      const where: any = {
        OR: [{ deliveryUserId }],
      };

      if (user?.ownedDeliveryOrg) {
        where.OR.push({ deliveryOrganizationId: user.ownedDeliveryOrg.id });
      }

      if (status) {
        where.status = status as DeliveryStatus;
      }

      const orders = await prisma.deliveryAssignment.findMany({
        where,
        include: {
          order: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phone: true,
                },
              },
              orderItems: {
                include: {
                  product: {
                    select: { name: true, weight: true },
                  },
                },
              },
              shippingAddress: true,
            },
          },
          merchant: {
            select: { id: true, firstName: true, lastName: true, phone: true },
          },
        },
        orderBy: { assignedAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.deliveryAssignment.count({ where });

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
      console.error("Error fetching delivery orders:", error);
      return formatError(res, "Failed to fetch orders", 500);
    }
  }
);

// Update delivery assignment status
router.patch(
  "/orders/:assignmentId/status",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const { assignmentId } = req.params;
      const { status, instructions } = req.body;
      const deliveryUserId = req.user!.id;

      // Verify assignment belongs to this delivery person
      const assignment = await prisma.deliveryAssignment.findFirst({
        where: {
          id: assignmentId,
          deliveryUserId,
        },
        include: {
          order: {
            select: { status: true },
          },
        },
      });

      if (!assignment) {
        return formatError(res, "Assignment not found", 404);
      }

      const updateData: {
        status: DeliveryStatus;
        pickedUpAt?: Date;
        completedAt?: Date;
      } = { status: status as DeliveryStatus };

      if (status === "IN_TRANSIT" && !assignment.pickedUpAt) {
        updateData.pickedUpAt = new Date();
        // Update order status to SHIPPED
        await prisma.order.update({
          where: { id: assignment.orderId },
          data: { status: "SHIPPED", shippedAt: new Date() },
        });
      }

      if (status === "COMPLETED") {
        updateData.completedAt = new Date();
        // Update order status to DELIVERED
        await prisma.order.update({
          where: { id: assignment.orderId },
          data: {
            status: "DELIVERED",
            deliveredAt: new Date(),
            deliveryUserId: deliveryUserId,
          },
        });
      }

      const updatedAssignment = await prisma.deliveryAssignment.update({
        where: { id: assignmentId },
        data: updateData,
      });

      // Create status history entry
      await prisma.orderStatusHistory.create({
        data: {
          orderId: assignment.orderId,
          status:
            status === "COMPLETED"
              ? "DELIVERED"
              : status === "IN_TRANSIT"
              ? "SHIPPED"
              : assignment.order.status,
          notes: instructions || `Status updated by delivery person`,
          updatedBy: deliveryUserId,
        },
      });

      return formatResponse(
        res,
        updatedAssignment,
        "Status updated successfully"
      );
    } catch (error) {
      console.error("Error updating delivery status:", error);
      return formatError(res, "Failed to update status", 500);
    }
  }
);

// Get available delivery persons for merchant
router.get(
  "/available",
  authenticateToken,
  canAssignDelivery,
  async (req: Request, res: Response) => {
    try {
      const deliveryPersons = await prisma.user.findMany({
        where: {
          role: "DELIVERY",
          isActive: true,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
        },
      });

      return formatResponse(
        res,
        deliveryPersons,
        "Available delivery persons retrieved"
      );
    } catch (error) {
      console.error("Error fetching delivery persons:", error);
      return formatError(res, "Failed to fetch delivery persons", 500);
    }
  }
);

// Assign order to delivery person (merchant only)
router.post(
  "/assign",
  authenticateToken,
  canAssignDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const merchantId = req.user!.id;
      const {
        orderId,
        deliveryUserId,
        deliveryFee,
        paymentType,
        estimatedTime,
        instructions,
      } = req.body;

      // Verify order belongs to merchant
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          merchantId,
        },
        include: { shippingAddress: true },
      });

      if (!order) {
        return formatError(res, "Order not found or access denied", 404);
      }

      // Create delivery assignment
      const assignment = await prisma.deliveryAssignment.create({
        data: {
          orderId,
          deliveryUserId,
          merchantId,
          deliveryAddress: order.shippingAddress.address1,
          deliveryFee: Number(deliveryFee),
          paymentType,
          estimatedTime: estimatedTime ? Number(estimatedTime) : null,
          instructions: instructions || null,
        },
      });

      // Update order with delivery person and set status to CONFIRMED
      await prisma.order.update({
        where: { id: orderId },
        data: { deliveryUserId, status: "CONFIRMED" },
      });

      // Create status history entry
      await prisma.orderStatusHistory.create({
        data: {
          orderId,
          status: "CONFIRMED",
          notes:
            instructions || `Order confirmed and assigned to delivery person`,
          updatedBy: merchantId,
        },
      });

      return formatResponse(
        res,
        assignment,
        "Order assigned to delivery person successfully",
        201
      );
    } catch (error) {
      console.error("Error assigning delivery:", error);
      return formatError(res, "Failed to assign delivery", 500);
    }
  }
);

// Get delivery statistics
router.get(
  "/stats",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { ownedDeliveryOrg: true },
      });

      const baseWhere: any = {
        OR: [{ deliveryUserId: userId }],
      };

      if (user?.ownedDeliveryOrg) {
        baseWhere.OR.push({ deliveryOrganizationId: user.ownedDeliveryOrg.id });
      }

      const [total, inTransit, completed, pending, requested] =
        await Promise.all([
          prisma.deliveryAssignment.count({
            where: baseWhere,
          }),
          prisma.deliveryAssignment.count({
            where: { ...baseWhere, status: "IN_TRANSIT" },
          }),
          prisma.deliveryAssignment.count({
            where: { ...baseWhere, status: "COMPLETED" },
          }),
          prisma.deliveryAssignment.count({
            where: { ...baseWhere, status: "ASSIGNED" },
          }),
          prisma.deliveryAssignment.count({
            where: { ...baseWhere, status: "REQUESTED" },
          }),
        ]);

      const stats = {
        total,
        inTransit,
        completed,
        pending: pending + requested, // Both are pending action
      };

      return formatResponse(res, stats, "Statistics retrieved successfully");
    } catch (error) {
      console.error("Error fetching delivery stats:", error);
      return formatError(res, "Failed to fetch statistics", 500);
    }
  }
);

// Get delivery payment history
router.get(
  "/payments",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const deliveryUserId = req.user!.id;
      const { page = 1, limit = 10 } = req.query;

      const payments = await prisma.deliveryPayment.findMany({
        where: { deliveryUserId },
        include: {
          assignment: {
            include: {
              order: {
                select: { orderNumber: true },
              },
            },
          },
          merchant: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.deliveryPayment.count({
        where: { deliveryUserId },
      });

      return formatResponse(
        res,
        {
          payments,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Payments retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching delivery payments:", error);
      return formatError(res, "Failed to fetch payments", 500);
    }
  }
);

export default router;
