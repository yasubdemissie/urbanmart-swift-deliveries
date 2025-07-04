import { Router } from "express";
import prisma from "../lib/prisma";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";
import { formatResponse, formatError } from "../utils/helpers";
import { $Enums } from "@prisma/client";

const router = Router();

// GET /admin/stats - Dashboard stats
router.get(
  "/stats",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const [
        totalSales,
        totalOrders,
        totalCustomers,
        totalProducts,
        recentOrders,
      ] = await Promise.all([
        prisma.order.aggregate({ _sum: { total: true } }),
        prisma.order.count(),
        prisma.user.count({ where: { role: $Enums.UserRole.CUSTOMER } }),
        prisma.product.count(),
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { user: true, orderItems: true },
        }),
      ]);

      // 1. Get top 5 product IDs by average rating
      const topRated = await prisma.review.groupBy({
        by: ["productId"],
        _avg: { rating: true },
        orderBy: { _avg: { rating: "desc" } },
        take: 5,
      });

      // 2. Fetch the product details for those IDs
      const productIds = topRated.map((r) => r.productId);

      const topProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { reviews: true },
      });

      // 3. Optionally, sort the products array to match the order of average ratings
      const topProductsSorted = productIds.map((id) =>
        topProducts.find((p) => p.id === id)
      );

      return formatResponse(res, {
        totalSales: totalSales._sum.total || 0,
        totalOrders,
        totalCustomers,
        totalProducts,
        recentOrders,
        topProducts: topProductsSorted,
      });
    } catch (error) {
      return formatError(res, "Failed to fetch admin stats", 500);
    }
  }
);

// GET /admin/products - List products with filters
router.get(
  "/products",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { page = 1, limit = 20, search, category, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const where: any = {};
      if (search) where.name = { contains: search, mode: "insensitive" };
      if (category) where.categoryId = category;
      if (status) where.status = status;
      const [products, total] = await Promise.all([
        prisma.product.findMany({ where, skip, take: Number(limit) }),
        prisma.product.count({ where }),
      ]);
      return formatResponse(res, {
        products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      return formatError(res, "Failed to fetch products", 500);
    }
  }
);

// GET /admin/orders - List orders with filters
router.get(
  "/orders",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { page = 1, limit = 20, status, dateFrom, dateTo } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const where: any = {};
      if (status) where.status = status;
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
        if (dateTo) where.createdAt.lte = new Date(dateTo as string);
      }
      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          skip,
          take: Number(limit),
          include: { user: true, orderItems: true },
        }),
        prisma.order.count({ where }),
      ]);
      return formatResponse(res, {
        orders,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      return formatError(res, "Failed to fetch orders", 500);
    }
  }
);

// PUT /admin/orders/:id/status - Update order status
router.put(
  "/orders/:id/status",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await prisma.order.update({
        where: { id },
        data: { status },
      });
      return formatResponse(res, { order }, "Order status updated");
    } catch (error) {
      return formatError(res, "Failed to update order status", 500);
    }
  }
);

// GET /admin/customers - List customers with filters
router.get(
  "/customers",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const where: any = { role: $Enums.UserRole.CUSTOMER };
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }
      const [customers, total] = await Promise.all([
        prisma.user.findMany({ where, skip, take: Number(limit) }),
        prisma.user.count({ where }),
      ]);
      return formatResponse(res, {
        customers,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      return formatError(res, "Failed to fetch customers", 500);
    }
  }
);

// Export endpoints (dummy implementation, replace with real export logic)
router.get(
  "/orders/export",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    // TODO: Implement export logic
    return res.status(501).json({ message: "Export orders not implemented" });
  }
);

router.get(
  "/products/export",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    // TODO: Implement export logic
    return res.status(501).json({ message: "Export products not implemented" });
  }
);

router.get(
  "/customers/export",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    // TODO: Implement export logic
    return res
      .status(501)
      .json({ message: "Export customers not implemented" });
  }
);

export default router;
