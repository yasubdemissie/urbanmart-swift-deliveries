import { Router, Response, Request } from "express";
import prisma from "../lib/prisma";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";
import bcrypt from "bcryptjs";

const router = Router();

// Get all users (admin only)
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          countryCode: true,
          location: true,
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
  }
);

// Get all merchants (all users)
router.get("/merchants", async (req: Request, res: Response) => {
  try {
    const merchants = await prisma.user.findMany({
      where: { role: "MERCHANT" },
    });
    res.json(merchants);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch merchants" });
  }
});

// Get a user by ID (admin or self)
router.get(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
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
          countryCode: true,
          location: true,
          avatar: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          orders: {
            select: {
              id: true,
              total: true,
              status: true,
              createdAt: true,
              orderItems: {
                select: {
                  id: true,
                  quantity: true,
                  price: true,
                  product: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  }
);

// Create a user (public, for registration)
router.post("/", async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phone, countryCode, location, avatarUrl } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        countryCode,
        location,
        avatar: avatarUrl,
      },
    });
    return res.status(201).json({ id: user.id, email: user.email });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return res.status(409).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Failed to create user" });
  }
});

// Update a user (admin or self)
router.put(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (req.user?.id !== id && req.user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { firstName, lastName, phone, countryCode, location, avatarUrl, isActive } = req.body;
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          phone,
          countryCode,
          location,
          avatar: avatarUrl,
          isActive,
        },
      });
      return res.json(updatedUser);
    } catch (err) {
      return res.status(500).json({ error: "Failed to update user" });
    }
  }
);

// Request Role Change (Self)
router.patch(
  "/role",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const { role, merchantData, deliveryData } = req.body;

      if (!["MERCHANT", "DELIVERY"].includes(role)) {
        return res.status(400).json({ error: "Invalid role requested" });
      }

      // Start transaction to update usage and optional store creation
      const result = await prisma.$transaction(async (tx) => {
        // 1. Update user role
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: { role },
        });

        // 2. If Merchant, create store
        if (role === "MERCHANT") {
          if (!merchantData?.shopName || !merchantData?.businessType) {
            throw new Error("Missing merchant details");
          }

          // Check if store already exists for this user
          const existingStore = await tx.merchantStore.findUnique({
            where: { merchantId: userId },
          });

          if (!existingStore) {
            await tx.merchantStore.create({
              data: {
                merchantId: userId,
                name: merchantData.shopName,
                description: merchantData.description || "",
                // Store businessType in description or separate logic if schema permits.
                // Schema has name, description, logo, banner, address, etc.
                // We'll append business type to description for now or just ignore if strict.
              },
            });
          } else {
             // Optional: Update existing store? For now, we just ensure it exists.
             await tx.merchantStore.update({
               where: { merchantId: userId },
               data: {
                  name: merchantData.shopName,
                  description: merchantData.description,
               }
             })
          }
        }

        // 3. If Delivery, we just update role (per plan/schema limits)
        if (role === "DELIVERY") {
           // No dedicated delivery profile table exists yet.
           // Future: create DeliveryProfile record with deliveryData
        }

        return updatedUser;
      });

      return res.json({ success: true, user: result });

    } catch (err: any) {
      console.error("Role update error: ", err);
      // Prisma transaction error or custom error
      return res.status(400).json({ error: err.message || "Failed to update role" });
    }
  }
);

// Delete a user (admin or self)
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (req.user?.id !== id && req.user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    try {
      await prisma.user.delete({ where: { id } });
      return res.json({ message: "User deleted" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

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
  async (req: AuthRequest, res: Response) => {
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

      return res.json(address);
    } catch (err) {
      console.error("Update address error:", err);
      return res.status(500).json({ error: "Failed to update address" });
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

      return res.json({ message: "Address deleted successfully" });
    } catch (err) {
      console.error("Delete address error:", err);
      return res.status(500).json({ error: "Failed to delete address" });
    }
  }
);

export default router;
