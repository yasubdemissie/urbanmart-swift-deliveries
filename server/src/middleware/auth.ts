import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

type JwtPayload = { userId: string; email: string; role: string };

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "User not found or inactive" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(500).json({ error: "Authentication error" });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    return next();
  };
};

// Role-based middleware functions
export const requireSuperAdmin = requireRole(["SUPER_ADMIN"]);
export const requireAdmin = requireRole(["ADMIN", "SUPER_ADMIN"]);
export const requireMerchant = requireRole([
  "MERCHANT",
  "ADMIN",
  "SUPER_ADMIN",
]);
export const requireCustomer = requireRole([
  "CUSTOMER",
  "ADMIN",
  "SUPER_ADMIN",
]);
export const requireDelivery = requireRole([
  "DELIVERY",
  "ADMIN",
  "SUPER_ADMIN",
]);

// Legacy support
export const requireVendor = requireRole(["VENDOR", "ADMIN", "SUPER_ADMIN"]);

// Permission-based middleware
export const canManageUsers = requireRole(["ADMIN", "SUPER_ADMIN"]);
export const canManageMerchants = requireRole(["ADMIN", "SUPER_ADMIN"]);
export const canManageProducts = requireRole([
  "MERCHANT",
  "ADMIN",
  "SUPER_ADMIN",
]);
export const canViewReports = requireRole(["ADMIN", "SUPER_ADMIN"]);
export const canManageTransactions = requireRole(["ADMIN", "SUPER_ADMIN"]);
export const canViewOrders = requireRole([
  "DELIVERY",
  "MERCHANT",
  "ADMIN",
  "SUPER_ADMIN",
]);
export const canUpdateOrderStatus = requireRole([
  "DELIVERY",
  "MERCHANT",
  "ADMIN",
  "SUPER_ADMIN",
]);
export const canAssignDelivery = requireRole([
  "MERCHANT",
  "ADMIN",
  "SUPER_ADMIN",
]);
export const canManageDeliveryPayments = requireRole([
  "MERCHANT",
  "ADMIN",
  "SUPER_ADMIN",
]);
