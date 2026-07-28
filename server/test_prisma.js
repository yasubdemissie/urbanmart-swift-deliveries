const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const q1 = { product: { merchantStoreId: "test" } };
    const items = await prisma.cartItem.findMany({ where: q1 });
    console.log("Query 1 success", items);
  } catch (e) {
    console.error("Query 1 failed:", e.message);
  }
}
main();
