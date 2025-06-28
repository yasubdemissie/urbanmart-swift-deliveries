import { Router } from "express";
import prisma from "../lib/prisma";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";
import { validateCreateCategory } from "../utils/validation";
import { formatResponse, formatError, createSlug } from "../utils/helpers";

const router = Router();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    const categoriesWithCount = categories.map((category) => ({
      ...category,
      productCount: category._count.products,
      _count: undefined,
    }));

    return formatResponse(res, { categories: categoriesWithCount });
  } catch (error) {
    console.error("Get categories error:", error);
    return formatError(res, "Failed to fetch categories", 500);
  }
});

// Get single category by ID or slug
router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
        isActive: true,
      },
      include: {
        products: {
          where: { isActive: true },
          include: {
            reviews: {
              select: {
                rating: true,
              },
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!category) {
      return formatError(res, "Category not found", 404);
    }

    // Calculate average ratings for products
    const productsWithRating = category.products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
          : 0;

      return {
        ...product,
        averageRating: Number(avgRating.toFixed(1)),
        reviewCount: product._count.reviews,
        reviews: undefined,
        _count: undefined,
      };
    });

    const categoryWithData = {
      ...category,
      products: productsWithRating,
      productCount: category._count.products,
      _count: undefined,
    };

    return formatResponse(res, { category: categoryWithData });
  } catch (error) {
    console.error("Get category error:", error);
    return formatError(res, "Failed to fetch category", 500);
  }
});

// Create new category (Admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validateCreateCategory,
  async (req: AuthRequest, res) => {
    try {
      const { name, description, image, sortOrder } = req.body;

      const slug = createSlug(name);

      const category = await prisma.category.create({
        data: {
          name,
          slug,
          description,
          image,
          sortOrder: sortOrder || 0,
        },
      });

      return formatResponse(
        res,
        { category },
        "Category created successfully",
        201
      );
    } catch (error) {
      console.error("Create category error:", error);
      return formatError(res, "Failed to create category", 500);
    }
  }
);

// Update category (Admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // If name is being updated, generate new slug
      if (updateData.name) {
        updateData.slug = createSlug(updateData.name);
      }

      const category = await prisma.category.update({
        where: { id },
        data: updateData,
      });

      return formatResponse(res, { category }, "Category updated successfully");
    } catch (error) {
      console.error("Update category error:", error);
      return formatError(res, "Failed to update category", 500);
    }
  }
);

// Delete category (Admin only)
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      // Check if category has products
      const categoryWithProducts = await prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      if (!categoryWithProducts) {
        return formatError(res, "Category not found", 404);
      }

      if (categoryWithProducts._count.products > 0) {
        return formatError(
          res,
          "Cannot delete category with existing products",
          400
        );
      }

      await prisma.category.delete({
        where: { id },
      });

      return formatResponse(res, null, "Category deleted successfully");
    } catch (error) {
      console.error("Delete category error:", error);
      return formatError(res, "Failed to delete category", 500);
    }
  }
);

export default router;
