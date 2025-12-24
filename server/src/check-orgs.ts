import prisma from "./lib/prisma";
import "dotenv/config";

async function main() {
  try {
    const orgs = await prisma.deliveryOrganization.findMany({
      select: {
        id: true,
        name: true,
        isActive: true,
        ownerId: true,
      },
    });

    console.log("Delivery Organizations count:", orgs.length);
    console.log("Delivery Organizations found:", JSON.stringify(orgs, null, 2));

    if (orgs.length === 0) {
      console.log("No delivery organizations found in the database.");
    }
  } catch (error) {
    console.error("Error fetching organizations:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
