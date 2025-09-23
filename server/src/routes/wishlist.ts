import { Router } from "express";
import prisma from "../lib/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { formatResponse, formatError } from "../utils/helpers";

const router = Router();

// Get user's wishlistItem
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const wishlistItem = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      include: { product: true },
    });
    return formatResponse(res, wishlistItem);
  } catch (error) {
    return formatError(res, "Failed to fetch wishlistItem", 500);
  }
});

// Add to wishlistItem
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  const { productId } = req.body;
  try {
    const item = await prisma.wishlistItem.create({
      data: { userId: req.user!.id, productId },
    });
    return formatResponse(res, item, "Added to wishlistItem");
  } catch (error) {
    return formatError(res, "Failed to add to wishlistItem", 500);
  }
});

// Remove from wishlistItem
router.delete(
  "/:productId",
  authenticateToken,
  async (req: AuthRequest, res) => {
    const { productId } = req.params;
    try {
      await prisma.wishlistItem.deleteMany({
        where: { userId: req.user!.id, productId },
      });
      return formatResponse(res, null, "Removed from wishlistItem");
    } catch (error) {
      return formatError(res, "Failed to remove from wishlistItem", 500);
    }
  }
);

export default router;
