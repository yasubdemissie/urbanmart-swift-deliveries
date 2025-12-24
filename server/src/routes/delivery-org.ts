import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";
import {
  authenticateToken,
  AuthRequest,
  requireDelivery,
} from "../middleware/auth";
import { formatResponse, formatError } from "../utils/helpers";
import {
  HiringRequestStatus,
  DeliveryStatus,
  HiringRequestType,
} from "@prisma/client";

const router = Router();

// Get all active delivery organizations
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    let orgs = await prisma.deliveryOrganization.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        isActive: true,
      },
    });

    if (orgs.length === 0) {
      orgs = [
        {
          id: "mock-id-123",
          name: "Mock Delivery Co (DEBUG)",
          description: "This is a mock organization for debugging purposes.",
          logo: null,
          isActive: true,
        },
      ] as any;
    }

    return formatResponse(res, orgs, "Organizations retrieved successfully");
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return formatError(res, "Failed to fetch organizations", 500);
  }
});

// Create Delivery Organization
router.post(
  "/",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, description, logo } = req.body;
      const userId = req.user!.id;

      // Check if user already has an org
      const existingOrg = await prisma.deliveryOrganization.findUnique({
        where: { ownerId: userId },
      });

      if (existingOrg) {
        return formatError(res, "User already owns an organization", 400);
      }

      const org = await prisma.deliveryOrganization.create({
        data: {
          name,
          description,
          logo,
          ownerId: userId,
          members: {
            connect: { id: userId }, // Owner is also a member
          },
        },
      });

      return formatResponse(res, org, "Organization created successfully", 201);
    } catch (error) {
      console.error("Error creating organization:", error);
      return formatError(res, "Failed to create organization", 500);
    }
  }
);

// Get my organization (Owner or Member)
router.get(
  "/me",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          ownedDeliveryOrg: {
            include: {
              members: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                  avatar: true,
                },
              },
              assignments: {
                include: {
                  order: {
                    select: {
                      orderNumber: true,
                      status: true,
                      user: {
                        select: {
                          firstName: true,
                          lastName: true,
                          phone: true,
                          email: true,
                        },
                      },
                      shippingAddress: true,
                      orderItems: {
                        include: {
                          product: {
                            select: {
                              name: true,
                              mainImage: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  deliveryUser: { select: { firstName: true, lastName: true } },
                },
                orderBy: { createdAt: "desc" },
                take: 50, // Increased to show more assignments
              },
              hiringRequests: {
                where: {
                  OR: [
                    { status: "PENDING", type: "INVITATION" },
                    { status: "PENDING", type: "APPLICATION" },
                  ],
                },
                include: {
                  receiver: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
          deliveryOrg: {
            include: {
              owner: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return formatError(res, "User not found", 404);
      }

      const org = user.ownedDeliveryOrg || user.deliveryOrg;

      if (!org) {
        return formatResponse(res, null, "No organization found");
      }

      return formatResponse(
        res,
        {
          ...org,
          isOwner: !!user.ownedDeliveryOrg,
        },
        "Organization retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching organization:", error);
      return formatError(res, "Failed to fetch organization", 500);
    }
  }
);

// Send Hiring Request
router.post(
  "/members/invite",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const { email, message } = req.body;
      const ownerId = req.user!.id;

      const org = await prisma.deliveryOrganization.findUnique({
        where: { ownerId },
      });

      if (!org) {
        return formatError(res, "Organization not found", 404);
      }

      const receiver = await prisma.user.findUnique({
        where: { email },
      });

      if (!receiver || receiver.role !== "DELIVERY") {
        return formatError(res, "User not found or not a delivery person", 404);
      }

      if (receiver.deliveryOrgId) {
        return formatError(
          res,
          "User is already a member of an organization",
          400
        );
      }

      // Check if request already exists
      const existingRequest = await prisma.hiringRequest.findFirst({
        where: {
          organizationId: org.id,
          receiverId: receiver.id,
          status: "PENDING",
        },
      });

      if (existingRequest) {
        return formatError(res, "Invitation already sent", 400);
      }

      const request = await prisma.hiringRequest.create({
        data: {
          organizationId: org.id,
          receiverId: receiver.id,
          type: "INVITATION",
          message,
        },
      });

      return formatResponse(res, request, "Invitation sent successfully", 201);
    } catch (error) {
      console.error("Error sending invitation:", error);
      return formatError(res, "Failed to send invitation", 500);
    }
  }
);

// Apply for Hiring
router.post(
  "/requests/apply",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const { organizationId, message } = req.body;
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.deliveryOrgId) {
        return formatError(
          res,
          "You are already a member of an organization",
          400
        );
      }

      const existingRequest = await prisma.hiringRequest.findFirst({
        where: {
          organizationId,
          receiverId: userId,
          status: "PENDING",
          type: "APPLICATION",
        },
      });

      if (existingRequest) {
        return formatError(res, "Application already sent", 400);
      }

      const request = await prisma.hiringRequest.create({
        data: {
          organizationId,
          receiverId: userId,
          type: "APPLICATION",
          message,
        },
      });

      return formatResponse(res, request, "Application sent successfully", 201);
    } catch (error) {
      console.error("Error sending application:", error);
      return formatError(res, "Failed to send application", 500);
    }
  }
);

// Get my hiring requests (Received Invitations and Sent Applications)
router.get(
  "/requests/hiring",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;

      const requests = await prisma.hiringRequest.findMany({
        where: {
          receiverId: userId,
        },
        include: {
          organization: {
            include: {
              owner: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return formatResponse(
        res,
        requests,
        "Hiring requests retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching hiring requests:", error);
      return formatError(res, "Failed to fetch requests", 500);
    }
  }
);

// Respond to hiring request
router.patch(
  "/requests/hiring/:id",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // ACCEPTED or REJECTED
      const userId = req.user!.id;

      const request = await prisma.hiringRequest.findUnique({
        where: { id },
      });

      if (!request || request.receiverId !== userId) {
        return formatError(res, "Request not found", 404);
      }

      if (request.status !== "PENDING") {
        return formatError(res, "Request already processed", 400);
      }

      const isInvitation = request.type === "INVITATION";

      if (status === "ACCEPTED") {
        // If it's an invitation, only the receiver (user) can accept.
        // If it's an application, only the Org owner can accept.

        if (isInvitation && request.receiverId !== userId) {
          return formatError(res, "Not authorized", 403);
        }

        if (!isInvitation) {
          // Check if user is owner of the org
          const org = await prisma.deliveryOrganization.findUnique({
            where: { id: request.organizationId },
          });
          if (org?.ownerId !== userId) {
            return formatError(
              res,
              "Only organization owners can accept applications",
              403
            );
          }
        }

        const personToJoinId = isInvitation
          ? request.receiverId
          : request.receiverId;
        // In both cases, the receiverId of the HiringRequest is the delivery person.

        await prisma.$transaction([
          prisma.hiringRequest.update({
            where: { id },
            data: { status: "ACCEPTED" },
          }),
          prisma.user.update({
            where: { id: personToJoinId },
            data: { deliveryOrgId: request.organizationId },
          }),
        ]);
        return formatResponse(res, null, "Organization joined successfully");
      } else {
        // Rejecting
        if (!isInvitation) {
          const org = await prisma.deliveryOrganization.findUnique({
            where: { id: request.organizationId },
          });
          if (org?.ownerId !== userId && request.receiverId !== userId) {
            return formatError(res, "Not authorized", 403);
          }
        }

        await prisma.hiringRequest.update({
          where: { id },
          data: { status: "REJECTED" },
        });
        return formatResponse(res, null, "Request rejected");
      }
    } catch (error) {
      console.error("Error responding to invitation:", error);
      return formatError(res, "Failed to respond to invitation", 500);
    }
  }
);

// Get incoming delivery requests (from merchants)
router.get(
  "/requests/delivery",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const org = await prisma.deliveryOrganization.findUnique({
        where: { ownerId: userId },
      });

      if (!org) {
        return formatError(
          res,
          "Only organization owners can view delivery requests",
          403
        );
      }

      const requests = await prisma.deliveryAssignment.findMany({
        where: {
          deliveryOrganizationId: org.id,
          status: "REQUESTED",
        },
        include: {
          order: {
            include: {
              user: {
                select: { firstName: true, lastName: true, phone: true },
              },
              shippingAddress: true,
              orderItems: { include: { product: true } },
            },
          },
          merchant: { select: { firstName: true, lastName: true } },
        },
      });

      return formatResponse(
        res,
        requests,
        "Delivery requests retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching delivery requests:", error);
      return formatError(res, "Failed to fetch delivery requests", 500);
    }
  }
);

// Accept/Reject Delivery Request
router.patch(
  "/requests/delivery/:id",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // ASSIGNED (Accept) or CANCELLED (Reject)
      const userId = req.user!.id;

      const org = await prisma.deliveryOrganization.findUnique({
        where: { ownerId: userId },
      });

      if (!org) {
        return formatError(res, "Not authorized", 403);
      }

      const assignment = await prisma.deliveryAssignment.findFirst({
        where: {
          id,
          deliveryOrganizationId: org.id,
          status: "REQUESTED",
        },
      });

      if (!assignment) {
        return formatError(res, "Request not found", 404);
      }

      const updatedAssignment = await prisma.deliveryAssignment.update({
        where: { id },
        data: {
          status: status as DeliveryStatus,
        },
      });

      if (status === "ASSIGNED") {
        // Update order status to CONFIRMED
        await prisma.order.update({
          where: { id: assignment.orderId },
          data: { status: "CONFIRMED" },
        });

        // Create status history entry
        await prisma.orderStatusHistory.create({
          data: {
            orderId: assignment.orderId,
            status: "CONFIRMED",
            notes: `Delivery request accepted by organization`,
            updatedBy: userId,
          },
        });
      }

      return formatResponse(
        res,
        updatedAssignment,
        `Request ${status === "ASSIGNED" ? "accepted" : "rejected"}`
      );
    } catch (error) {
      console.error("Error updating delivery request:", error);
      return formatError(res, "Failed to update request", 500);
    }
  }
);

// Assign delivery to member
router.post(
  "/assignments/:id/assign",
  authenticateToken,
  requireDelivery,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { memberId } = req.body;
      const userId = req.user!.id;

      const org = await prisma.deliveryOrganization.findUnique({
        where: { ownerId: userId },
      });

      if (!org) {
        return formatError(res, "Not authorized", 403);
      }

      // Verify member is in org
      const member = await prisma.user.findFirst({
        where: {
          id: memberId,
          deliveryOrgId: org.id,
        },
      });

      if (!member) {
        return formatError(res, "Member not found in organization", 404);
      }

      const assignment = await prisma.deliveryAssignment.findFirst({
        where: {
          id,
          deliveryOrganizationId: org.id,
        },
        include: {
          order: {
            select: { status: true },
          },
        },
      });

      if (!assignment) {
        return formatError(res, "Assignment not found", 404);
      }

      // Prevent re-assignment if the order is already in transit or completed
      if (
        assignment.status === "IN_TRANSIT" ||
        assignment.status === "COMPLETED" ||
        assignment.order.status === "SHIPPED" ||
        assignment.order.status === "DELIVERED"
      ) {
        return formatError(
          res,
          "Cannot re-assign delivery after it has been picked up or completed",
          400
        );
      }

      const updated = await prisma.deliveryAssignment.update({
        where: { id },
        data: {
          deliveryUserId: memberId, // Re-assign to member
        },
      });

      return formatResponse(res, updated, "Assigned to member successfully");
    } catch (error) {
      console.error("Error assigning to member:", error);
      return formatError(res, "Failed to assign", 500);
    }
  }
);

export default router;
