import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import "dotenv/config";

// Setup for Node.js environment
neonConfig.webSocketConstructor = ws;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
      console.error("DATABASE_URL not set");
      return;
  }
  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const allOrgs = await prisma.deliveryOrganization.findMany();
    console.log("Total Delivery Organizations in DB:", allOrgs.length);
    console.log("All Organizations:", JSON.stringify(allOrgs, null, 2));

    const activeOrgs = await prisma.deliveryOrganization.findMany({
      where: { isActive: true }
    });
    console.log("Active Delivery Organizations:", activeOrgs.length);

    const deliveryPerson = await prisma.user.findMany({
      where: { role: "DELIVERY" }
    });
    console.log("Delivery Persons:", deliveryPerson.length);

    const deliveryPersonOrgs = await prisma.deliveryOrganization.findMany({
      where: {
        ownerId: {
          in: deliveryPerson.map((dp) => dp.id)
        }
      }
    });
    console.log("Delivery Person Organizations:", deliveryPersonOrgs.length);

  } catch (error) {
    console.error("Query failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
