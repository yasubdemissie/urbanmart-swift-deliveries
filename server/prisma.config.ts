// import 'dotenv/config'
// import { PrismaConfig } from 'prisma/config'

// export default {
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//     // seed: 'tsx prisma/seed.ts',
//   },
//   datasource: { 
//     url: process.env.DATABASE_URL 
//   }
// } satisfies PrismaConfig

// prisma.config.ts
import 'dotenv/config'
import type { PrismaConfig } from 'prisma'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL!, // assumes it exists
  },
}) satisfies PrismaConfig