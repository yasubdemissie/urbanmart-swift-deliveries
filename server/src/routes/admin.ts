import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";
import {
  authenticateToken,
  AuthRequest,
  requireAdmin,
  requireSuperAdmin,
  canManageUsers,
  canViewReports,
} from "../middleware/auth";
import { formatResponse, formatError } from "../utils/helpers";

const router = Router();

// Get admin dashboard data
router.get(
  "/dashboard",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      // Get user statistics
      const userStats = await prisma.user.groupBy({
        by: ["role"],
        _count: { id: true },
      });

      // Get order statistics
      const orderStats = await prisma.order.aggregate({
        _count: { id: true },
        _sum: { total: true },
      });

      // Get product statistics
      const productStats = await prisma.product.aggregate({
        _count: { id: true },
      });

      // Get recent reports
      const recentReports = await prisma.report.findMany({
        include: {
          reporter: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          assignedAdmin: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      // Get recent transactions
      const recentTransactions = await prisma.transaction.findMany({
        include: {
          order: {
            select: { id: true, orderNumber: true },
          },
          merchant: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      const dashboardData = {
        stats: {
          users: userStats.reduce((acc, stat) => {
            acc[stat.role.toLowerCase()] = stat._count.id;
            return acc;
          }, {} as Record<string, number>),
          totalOrders: orderStats._count.id || 0,
          totalRevenue: orderStats._sum.total || 0,
          totalProducts: productStats._count.id || 0,
        },
        recentReports,
        recentTransactions,
      };

      return formatResponse(
        res,
        dashboardData,
        "Admin dashboard data retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching admin dashboard:", error);
      return formatError(res, "Failed to fetch dashboard data", 500);
    }
  }
);

// Get all users (Admin only)
router.get(
  "/users",
  authenticateToken,
  canManageUsers,
  async (req: AuthRequest, res: Response) => {
    try {
      const { page = 1, limit = 10, role, search } = req.query;

      const where: any = {};

      if (role) {
        where.role = role;
      }

      if (search) {
        where.OR = [
          { firstName: { contains: search as string, mode: "insensitive" } },
          { lastName: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }

      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          merchantStore: {
            select: { id: true, name: true, isVerified: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.user.count({ where });

      return formatResponse(
        res,
        {
          users,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Users retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      return formatError(res, "Failed to fetch users", 500);
    }
  }
);

// Update user role (Super Admin only)
router.patch(
  "/users/:id/role",
  authenticateToken,
  requireSuperAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const validRoles = ["CUSTOMER", "MERCHANT", "ADMIN"];
      if (!validRoles.includes(role)) {
        return formatError(res, "Invalid role", 400);
      }

      const user = await prisma.user.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      return formatResponse(res, user, "User role updated successfully");
    } catch (error) {
      console.error("Error updating user role:", error);
      return formatError(res, "Failed to update user role", 500);
    }
  }
);

// Toggle user active status
router.patch(
  "/users/:id/status",
  authenticateToken,
  canManageUsers,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const user = await prisma.user.update({
        where: { id },
        data: { isActive },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
      });

      return formatResponse(res, user, "User status updated successfully");
    } catch (error) {
      console.error("Error updating user status:", error);
      return formatError(res, "Failed to update user status", 500);
    }
  }
);

// Get all reports
router.get(
  "/reports",
  authenticateToken,
  canViewReports,
  async (req: AuthRequest, res: Response) => {
    try {
      const { page = 1, limit = 10, status, priority, type } = req.query;

      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (priority) {
        where.priority = priority;
      }

      if (type) {
        where.type = type;
      }

      const reports = await prisma.report.findMany({
        where,
        include: {
          reporter: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          assignedAdmin: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.report.count({ where });

      return formatResponse(
        res,
        {
          reports,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Reports retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching reports:", error);
      return formatError(res, "Failed to fetch reports", 500);
    }
  }
);

// Assign report to admin
router.patch(
  "/reports/:id/assign",
  authenticateToken,
  canViewReports,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { assignedAdminId } = req.body;

      const report = await prisma.report.update({
        where: { id },
        data: {
          assignedAdminId,
          status: "IN_PROGRESS",
        },
        include: {
          reporter: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          assignedAdmin: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      });

      return formatResponse(res, report, "Report assigned successfully");
    } catch (error) {
      console.error("Error assigning report:", error);
      return formatError(res, "Failed to assign report", 500);
    }
  }
);

// Update report status
router.patch(
  "/reports/:id/status",
  authenticateToken,
  canViewReports,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const report = await prisma.report.update({
        where: { id },
        data: { status },
        include: {
          reporter: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          assignedAdmin: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      });

      return formatResponse(res, report, "Report status updated successfully");
    } catch (error) {
      console.error("Error updating report status:", error);
      return formatError(res, "Failed to update report status", 500);
    }
  }
);

// Get all transactions
router.get(
  "/transactions",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { page = 1, limit = 10, status, type } = req.query;

      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (type) {
        where.type = type;
      }

      const transactions = await prisma.transaction.findMany({
        where,
        include: {
          order: {
            select: { id: true, orderNumber: true },
          },
          merchant: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.transaction.count({ where });

      return formatResponse(
        res,
        {
          transactions,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Transactions retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return formatError(res, "Failed to fetch transactions", 500);
    }
  }
);

// Get merchant stores
router.get(
  "/merchant-stores",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { page = 1, limit = 10, isVerified, search } = req.query;

      const where: any = {};

      if (isVerified !== undefined) {
        where.isVerified = isVerified === "true";
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: "insensitive" } },
          { description: { contains: search as string, mode: "insensitive" } },
        ];
      }

      const stores = await prisma.merchantStore.findMany({
        where,
        include: {
          merchant: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          _count: {
            select: { products: true, orders: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.merchantStore.count({ where });

      return formatResponse(
        res,
        {
          stores,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Merchant stores retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching merchant stores:", error);
      return formatError(res, "Failed to fetch merchant stores", 500);
    }
  }
);

// Verify merchant store
router.patch(
  "/merchant-stores/:id/verify",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { isVerified } = req.body;

      const store = await prisma.merchantStore.update({
        where: { id },
        data: { isVerified },
        include: {
          merchant: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      });

      return formatResponse(
        res,
        store,
        "Store verification status updated successfully"
      );
    } catch (error) {
      console.error("Error updating store verification:", error);
      return formatError(res, "Failed to update store verification", 500);
    }
  }
);

export default router;
