import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const q1: any = { product: { merchantStoreId: "test" } };
    const items = await prisma.cartItem.findMany({ where: q1 });
    console.log("Query 1 success");
  } catch (e) {
    console.error("Query 1 failed:", e);
  }
  
  process.exit(0);
}
main();
