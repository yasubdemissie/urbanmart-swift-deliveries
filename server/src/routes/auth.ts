import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { validateLogin, validateRegister } from "../utils/validation";
import {
  hashPassword,
  comparePassword,
  generateToken,
  formatResponse,
  formatError,
} from "../utils/helpers";

const router = Router();

// Register new user
router.post("/register", validateRegister, async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      console.log(email, password, firstName, lastName);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return formatError(res, "User with this email already exists", 409);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          // phone,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          // phone: true,
          role: true,
          createdAt: true,
        },
      });

      // Generate token
      const token = generateToken(user.id, user.email, user.role);

      return formatResponse(
        res,
        { user, token },
        "User registered successfully",
        201
      );
    } catch (error) {
      console.error("Registration error:", error);
      return formatError(res, "Registration failed", 500);
    }
  }
);

// Login user
router.post("/login", validateLogin, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return formatError(res, "Invalid credentials", 401);
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return formatError(res, "Invalid credentials", 401);
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    // Return user data (excluding password)
    const { password: _, ...userData } = user;

    return formatResponse(res, { user: userData, token }, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    return formatError(res, "Login failed", 500);
  }
});

// Get current user
router.get("/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
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

    if (!user) {
      return formatError(res, "User not found", 404);
    }

    return formatResponse(res, { user });
  } catch (error) {
    console.error("Get user error:", error);
    return formatError(res, "Failed to get user data", 500);
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        firstName,
        lastName,
        phone,
      },
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

    return formatResponse(
      res,
      { user: updatedUser },
      "Profile updated successfully"
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return formatError(res, "Failed to update profile", 500);
  }
});

// Change password
router.put(
  "/change-password",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return formatError(
          res,
          "Current password and new password are required"
        );
      }

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
      });

      if (!user) {
        return formatError(res, "User not found", 404);
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return formatError(res, "Current password is incorrect", 401);
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { password: hashedNewPassword },
      });

      return formatResponse(res, null, "Password changed successfully");
    } catch (error) {
      console.error("Change password error:", error);
      return formatError(res, "Failed to change password", 500);
    }
  }
);

// Logout (client-side token removal)
router.post("/logout", authenticateToken, async (req: AuthRequest, res) => {
  // In a stateless JWT setup, logout is handled client-side
  // You could implement a blacklist here if needed
  return formatResponse(res, null, "Logged out successfully");
});

export default router;
