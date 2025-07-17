import { Router, Response, Request } from "express";
import prisma from "../lib/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { validateAddToCart, validateUpdateCartItem } from "../utils/validation";
import { formatResponse, formatError } from "../utils/helpers";

const router = Router();

// Get user's cart
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
      include: {
        product: {
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate totals and add product ratings
    let subtotal = 0;
    const itemsWithRating = cartItems.map((item) => {
      const avgRating =
        item.product.reviews.length > 0
          ? item.product.reviews.reduce(
              (sum, review) => sum + review.rating,
              0
            ) / item.product.reviews.length
          : 0;

      const itemTotal = Number(item.product.price) * item.quantity;
      subtotal += itemTotal;

      return {
        ...item,
        itemTotal: Number(itemTotal.toFixed(2)),
        product: {
          ...item.product,
          averageRating: Number(avgRating.toFixed(1)),
          reviewCount: item.product._count.reviews,
          reviews: undefined,
          _count: undefined,
        },
      };
    });

    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return formatResponse(res, {
      items: itemsWithRating,
      summary: {
        subtotal: Number(subtotal.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2)),
        itemCount: cartItems.length,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return formatError(res, "Failed to fetch cart", 500);
  }
});

// Add item to cart
router.post(
  "/",
  authenticateToken,
  validateAddToCart,
  async (req: AuthRequest, res: Response) => {
    try {
      const { productId, quantity } = req.body;

      // Check if product exists and is active
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product || !product.isActive) {
        return formatError(res, "Product not found or unavailable", 404);
      }

      // Check if product is already in cart
      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId: req.user!.id,
            productId,
          },
        },
      });

      if (existingCartItem) {
        // Update quantity
        const updatedCartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
          include: {
            product: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        });

        return formatResponse(
          res,
          { cartItem: updatedCartItem },
          "Cart item updated successfully"
        );
      }

      // Add new item to cart
      const cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user!.id,
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      return formatResponse(
        res,
        { cartItem },
        "Item added to cart successfully",
        201
      );
    } catch (error) {
      console.error("Add to cart error:", error);
      return formatError(res, "Failed to add item to cart", 500);
    }
  }
);

// Update cart item quantity
router.put(
  "/:id",
  authenticateToken,
  validateUpdateCartItem,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      // Check if cart item belongs to user
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id,
          userId: req.user!.id,
        },
        include: {
          product: true,
        },
      });

      if (!cartItem) {
        return formatError(res, "Cart item not found", 404);
      }

      // Check if product is still available
      if (!cartItem.product.isActive) {
        return formatError(res, "Product is no longer available", 400);
      }

      // Check stock availability
      if (quantity > cartItem.product.stockQuantity) {
        return formatError(
          res,
          "Requested quantity exceeds available stock",
          400
        );
      }

      const updatedCartItem = await prisma.cartItem.update({
        where: { id },
        data: { quantity },
        include: {
          product: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      return formatResponse(
        res,
        { cartItem: updatedCartItem },
        "Cart item updated successfully"
      );
    } catch (error) {
      console.error("Update cart item error:", error);
      return formatError(res, "Failed to update cart item", 500);
    }
  }
);

// Remove item from cart
router.delete("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!cartItem) {
      return formatError(res, "Cart item not found", 404);
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return formatResponse(res, null, "Item removed from cart successfully");
  } catch (error) {
    console.error("Remove cart item error:", error);
    return formatError(res, "Failed to remove item from cart", 500);
  }
});

// Clear cart
router.delete("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user!.id },
    });

    return formatResponse(res, null, "Cart cleared successfully");
  } catch (error) {
    console.error("Clear cart error:", error);
    return formatError(res, "Failed to clear cart", 500);
  }
});

// Get cart count
router.get("/count", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const count = await prisma.cartItem.count({
      where: { userId: req.user!.id },
    });

    return formatResponse(res, { count });
  } catch (error) {
    console.error("Get cart count error:", error);
    return formatError(res, "Failed to get cart count", 500);
  }
});

export default router;
