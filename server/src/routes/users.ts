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
    const user = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, phone, avatar, isActive },
    });
    res.json({ id: user.id, email: user.email });
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

export default router;
