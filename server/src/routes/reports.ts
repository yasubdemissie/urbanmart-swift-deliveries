import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { formatResponse, formatError } from "../utils/helpers";

const router = Router();

// Submit a report
router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const reporterId = req.user!.id;
    const { type, title, description, priority = "MEDIUM" } = req.body;

    const report = await prisma.report.create({
      data: {
        reporterId,
        type,
        title,
        description,
        priority,
      },
      include: {
        reporter: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return formatResponse(res, report, "Report submitted successfully", 201);
  } catch (error) {
    console.error("Error submitting report:", error);
    return formatError(res, "Failed to submit report", 500);
  }
});

// Get user's reports
router.get(
  "/my-reports",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const reporterId = req.user!.id;
      const { page = 1, limit = 10, status } = req.query;

      const where: any = { reporterId };

      if (status) {
        where.status = status;
      }

      const reports = await prisma.report.findMany({
        where,
        include: {
          assignedAdmin: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.report.count({ where });

      return formatResponse(
        res,
        {
          reports,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Reports retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching user reports:", error);
      return formatError(res, "Failed to fetch reports", 500);
    }
  }
);

export default router;
