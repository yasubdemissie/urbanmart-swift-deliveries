import prisma from './src/lib/prisma';

async function main() {
  try {
    console.log("Attempting to connect to database...");
    await prisma.$connect();
    console.log("Connected successfully!");
    // Check if we can run a simple query
    const count = await prisma.user.count();
    console.log(`User count: ${count}`);
    await prisma.$disconnect();
  } catch (e) {
    console.error("Connection failed:", e);
    process.exit(1);
  }
}

main();
