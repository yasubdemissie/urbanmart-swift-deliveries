import { Router } from "express";
import prisma from "../lib/prisma";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";
import { validateCreateReview, validatePagination } from "../utils/validation";
import { formatResponse, formatError } from "../utils/helpers";

const router = Router();

// Get product reviews
router.get("/product/:productId", validatePagination, async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return formatError(res, "Product not found", 404);
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: Number(limit),
      }),
      prisma.review.count({
        where: { productId },
      }),
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    return formatResponse(res, {
      reviews,
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
    console.error("Get product reviews error:", error);
    return formatError(res, "Failed to fetch reviews", 500);
  }
});

// Create review
router.post(
  "/",
  authenticateToken,
  validateCreateReview,
  async (req: AuthRequest, res) => {
    try {
      const { productId, rating, title, comment } = req.body;

      // Check if product exists and is active
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product || !product.isActive) {
        return formatError(res, "Product not found or unavailable", 404);
      }

      // Check if user has already reviewed this product
      const existingReview = await prisma.review.findUnique({
        where: {
          userId_productId: {
            userId: req.user!.id,
            productId,
          },
        },
      });

      if (existingReview) {
        return formatError(res, "You have already reviewed this product", 400);
      }

      // Check if user has purchased this product (optional validation)
      const hasPurchased = await prisma.orderItem.findFirst({
        where: {
          order: {
            userId: req.user!.id,
            status: { in: ["DELIVERED", "SHIPPED"] },
          },
          productId,
        },
      });

      if (!hasPurchased) {
        return formatError(
          res,
          "You can only review products you have purchased",
          400
        );
      }

      const review = await prisma.review.create({
        data: {
          userId: req.user!.id,
          productId,
          rating,
          title,
          comment,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      });

      return formatResponse(
        res,
        { review },
        "Review created successfully",
        201
      );
    } catch (error) {
      console.error("Create review error:", error);
      return formatError(res, "Failed to create review", 500);
    }
  }
);

// Update review
router.put("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;

    // Check if review belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!review) {
      return formatError(res, "Review not found", 404);
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating,
        title,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return formatResponse(
      res,
      { review: updatedReview },
      "Review updated successfully"
    );
  } catch (error) {
    console.error("Update review error:", error);
    return formatError(res, "Failed to update review", 500);
  }
});

// Delete review
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if review belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!review) {
      return formatError(res, "Review not found", 404);
    }

    await prisma.review.delete({
      where: { id },
    });

    return formatResponse(res, null, "Review deleted successfully");
  } catch (error) {
    console.error("Delete review error:", error);
    return formatError(res, "Failed to delete review", 500);
  }
});

// Get user's reviews
router.get(
  "/user/me",
  authenticateToken,
  validatePagination,
  async (req: AuthRequest, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { userId: req.user!.id },
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
          orderBy: {
            createdAt: "desc",
          },
          skip: offset,
          take: Number(limit),
        }),
        prisma.review.count({
          where: { userId: req.user!.id },
        }),
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      return formatResponse(res, {
        reviews,
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
      console.error("Get user reviews error:", error);
      return formatError(res, "Failed to fetch reviews", 500);
    }
  }
);

// Get all reviews (Admin only)
router.get(
  "/admin/all",
  authenticateToken,
  requireAdmin,
  validatePagination,
  async (req: AuthRequest, res) => {
    try {
      const { page = 1, limit = 10, verified } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (verified !== undefined) {
        where.isVerified = verified === "true";
      }

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: offset,
          take: Number(limit),
        }),
        prisma.review.count({ where }),
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      return formatResponse(res, {
        reviews,
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
      console.error("Get all reviews error:", error);
      return formatError(res, "Failed to fetch reviews", 500);
    }
  }
);

// Verify review (Admin only)
router.patch(
  "/admin/:id/verify",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      const review = await prisma.review.update({
        where: { id },
        data: { isVerified: true },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return formatResponse(res, { review }, "Review verified successfully");
    } catch (error) {
      console.error("Verify review error:", error);
      return formatError(res, "Failed to verify review", 500);
    }
  }
);

export default router;
