import { Router } from "express";
import prisma from "../lib/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { formatResponse, formatError } from "../utils/helpers";

const router = Router();

// Get user's wishlist
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user!.id },
      include: { product: true },
    });
    return formatResponse(res, wishlist);
  } catch (error) {
    return formatError(res, "Failed to fetch wishlist", 500);
  }
});

// Add to wishlist
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  const { productId } = req.body;
  try {
    const item = await prisma.wishlist.create({
      data: { userId: req.user!.id, productId },
    });
    return formatResponse(res, item, "Added to wishlist");
  } catch (error) {
    return formatError(res, "Failed to add to wishlist", 500);
  }
});

// Remove from wishlist
router.delete(
  "/:productId",
  authenticateToken,
  async (req: AuthRequest, res) => {
    const { productId } = req.params;
    try {
      await prisma.wishlist.deleteMany({
        where: { userId: req.user!.id, productId },
      });
      return formatResponse(res, null, "Removed from wishlist");
    } catch (error) {
      return formatError(res, "Failed to remove from wishlist", 500);
    }
  }
);

export default router;
