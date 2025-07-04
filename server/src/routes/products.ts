import { Router } from "express";
import prisma from "../lib/prisma";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";
import {
  validateCreateProduct,
  validateUpdateProduct,
  validatePagination,
} from "../utils/validation";
import {
  formatResponse,
  formatError,
  paginateResults,
  createSlug,
} from "../utils/helpers";

const router = Router();

// Get all products with pagination and filtering
router.get("/", validatePagination, async (req: import("express").Request, res: import("express").Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
      featured,
      onSale,
    } = req.query;

    const { offset, limit: take } = paginateResults(
      Number(page),
      Number(limit)
    );

    // Build where clause
    const where: {
      isActive: boolean;
      category?: { slug: string };
      OR?: Array<{ name?: { contains: string; mode: "insensitive" }; description?: { contains: string; mode: "insensitive" }; brand?: { contains: string; mode: "insensitive" } }>;
      price?: { gte?: number; lte?: number };
      isFeatured?: boolean;
      isOnSale?: boolean;
    } = {
      isActive: true,
    };

    if (category) {
      where.category = {
        slug: category as string,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { brand: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (onSale === "true") {
      where.isOnSale = true;
    }

    // Build order by
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
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
        orderBy,
        skip: offset,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average ratings
    const productsWithRating = products.map((product) => {
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

    const totalPages = Math.ceil(total / take);

    return formatResponse(res, {
      products: productsWithRating,
      pagination: {
        page: Number(page),
        limit: take,
        total,
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return formatError(res, "Failed to fetch products", 500);
  }
});


// Get featured products (for frontend compatibility)
router.get("/featured", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
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
      take: 8,
    });

    const productsWithRating = products.map((product) => {
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

    return formatResponse(res, { products: productsWithRating });
  } catch (error) {
    console.error("Get featured products error:", error);
    return formatError(res, "Failed to fetch featured products", 500);
  }
});

// Get single product by ID or slug
router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        reviews: {
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
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      return formatError(res, "Product not found", 404);
    }

    // Calculate average rating
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
        : 0;

    const productWithRating = {
      ...product,
      averageRating: Number(avgRating.toFixed(1)),
      reviewCount: product._count.reviews,
      _count: undefined,
    };

    return formatResponse(res, { product: productWithRating });
  } catch (error) {
    console.error("Get product error:", error);
    return formatError(res, "Failed to fetch product", 500);
  }
});

// Create new product (Admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validateCreateProduct,
  async (req: AuthRequest, res) => {
    try {
      const {
        name,
        description,
        shortDescription,
        price,
        originalPrice,
        costPrice,
        sku,
        barcode,
        weight,
        dimensions,
        stockQuantity,
        minStockLevel,
        isFeatured,
        isOnSale,
        salePercentage,
        categoryId,
        brand,
        tags,
        images,
        mainImage,
      } = req.body;

      const slug = createSlug(name);

      const product = await prisma.product.create({
        data: {
          name,
          slug,
          description,
          shortDescription,
          price,
          originalPrice,
          costPrice,
          sku,
          barcode,
          weight,
          dimensions,
          stockQuantity,
          minStockLevel,
          isFeatured,
          isOnSale,
          salePercentage,
          categoryId,
          brand,
          tags: tags || [],
          images: images || [],
          mainImage,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return formatResponse(
        res,
        { product },
        "Product created successfully",
        201
      );
    } catch (error) {
      console.error("Create product error:", error);
      return formatError(res, "Failed to create product", 500);
    }
  }
);

// Update product (Admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  validateUpdateProduct,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // If name is being updated, generate new slug
      if (updateData.name) {
        updateData.slug = createSlug(updateData.name);
      }

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return formatResponse(res, { product }, "Product updated successfully");
    } catch (error) {
      console.error("Update product error:", error);
      return formatError(res, "Failed to update product", 500);
    }
  }
);

// Delete product (Admin only)
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      await prisma.product.delete({
        where: { id },
      });

      return formatResponse(res, null, "Product deleted successfully");
    } catch (error) {
      console.error("Delete product error:", error);
      return formatError(res, "Failed to delete product", 500);
    }
  }
);

// Get featured products
router.get("/featured/list", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
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
      take: 8,
    });

    const productsWithRating = products.map((product) => {
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

    return formatResponse(res, { products: productsWithRating });
  } catch (error) {
    console.error("Get featured products error:", error);
    return formatError(res, "Failed to fetch featured products", 500);
  }
});

// Get products on sale
router.get("/sale/list", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isOnSale: true,
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
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
      take: 12,
    });

    const productsWithRating = products.map((product) => {
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

    return formatResponse(res, { products: productsWithRating });
  } catch (error) {
    console.error("Get sale products error:", error);
    return formatError(res, "Failed to fetch sale products", 500);
  }
});

export default router;
