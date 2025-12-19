// import { PrismaClient } from "@prisma/client";
// import { env } from "prisma/config";


// declare global {
//   var __prisma: PrismaClient | undefined;
// }
// const prisma =
//   globalThis.__prisma ||
//   new PrismaClient({
//     datasources: {
//       db: {
//         url: env("DATABASE_URL"),
//       },
//     },
//     log:
//       process.env.NODE_ENV === "development"
//         ? ["query", "error", "warn"]
//         : ["error"],
//   });

// if (process.env.NODE_ENV !== "production") {
//   globalThis.__prisma = prisma;
// }

// export default prisma;

// src/db/client.ts
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

// Never use env("DATABASE_URL") which loads after the prisma client is initialized so use process.env.DATABASE_URL in this file(prisma.ts)

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma