import { Router } from "express";
import prisma from "../lib/prisma";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";
import bcrypt from "bcryptjs";

const router = Router();

// Get all users (admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get a user by ID (admin or self)
router.get("/:id", authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  if (req.user?.id !== id && req.user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Create a user (public, for registration)
router.post("/", async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName, phone },
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Update a user (admin or self)
router.put("/:id", authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  if (req.user?.id !== id && req.user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }
  const { firstName, lastName, phone, avatar, isActive } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: { firstName, lastName, phone, avatar, isActive },
    });
    res.json({ id: updatedUser.id, email: updatedUser.email });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete a user (admin or self)
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  if (req.user?.id !== id && req.user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Address endpoints
// Get user addresses
router.get("/addresses", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// Add new address
router.post("/addresses", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      type,
      firstName,
      lastName,
      company,
      address1,
      address2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
    } = req.body;

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user!.id,
        type,
        firstName,
        lastName,
        company,
        address1,
        address2,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault,
      },
    });

    res.status(201).json(address);
  } catch (err) {
    console.error("Add address error:", err);
    res.status(500).json({ error: "Failed to add address" });
  }
});

// Update address
router.put(
  "/addresses/:id",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const {
        type,
        firstName,
        lastName,
        company,
        address1,
        address2,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault,
      } = req.body;

      // Check if address belongs to user
      const existingAddress = await prisma.address.findFirst({
        where: { id, userId: req.user!.id },
      });

      if (!existingAddress) {
        return res.status(404).json({ error: "Address not found" });
      }

      // If this is set as default, unset other default addresses
      if (isDefault) {
        await prisma.address.updateMany({
          where: { userId: req.user!.id, isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
      }

      const address = await prisma.address.update({
        where: { id },
        data: {
          type,
          firstName,
          lastName,
          company,
          address1,
          address2,
          city,
          state,
          postalCode,
          country,
          phone,
          isDefault,
        },
      });

      res.json(address);
    } catch (err) {
      console.error("Update address error:", err);
      res.status(500).json({ error: "Failed to update address" });
    }
  }
);

// Delete address
router.delete(
  "/addresses/:id",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      // Check if address belongs to user
      const existingAddress = await prisma.address.findFirst({
        where: { id, userId: req.user!.id },
      });

      if (!existingAddress) {
        return res.status(404).json({ error: "Address not found" });
      }

      await prisma.address.delete({
        where: { id },
      });

      res.json({ message: "Address deleted successfully" });
    } catch (err) {
      console.error("Delete address error:", err);
      res.status(500).json({ error: "Failed to delete address" });
    }
  }
);

export default router;
