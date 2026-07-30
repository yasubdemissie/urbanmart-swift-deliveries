# UrbanMart Swift Deliveries

UrbanMart Swift Deliveries is a full-stack e-commerce and delivery management platform built with React, TypeScript, Vite, Express, and Prisma. It supports customer shopping flows, order tracking, and role-based dashboards for admins, merchants, and delivery teams.

## Features

- Customer storefront with product browsing, categories, deals, and search
- Shopping cart and checkout experience
- Order placement and order tracking
- User authentication and profile management
- Admin dashboard for managing users, products, orders, and merchants
- Merchant dashboard for product and order management
- Delivery dashboard and delivery organization workflows

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT authentication
- CORS and security middleware

## Project Structure

```text
src/                 # Frontend React application
server/              # Backend Express + Prisma API
  src/               # Server routes, middleware, and utilities
  prisma/            # Prisma schema and migrations
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL database

### 1. Install dependencies

Install the frontend dependencies:

```bash
npm install
```

Install the backend dependencies:

```bash
cd server
npm install
```

### 2. Configure environment variables

Create a `.env` file inside the server directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/urbanmart_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

### 3. Set up the database

From the server folder:

```bash
npx prisma generate
npx prisma db push
npx tsx src/seed.ts
```

### 4. Start the app

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in a second terminal:

```bash
npm run dev
```

The frontend should be available at http://localhost:5173 and the backend at http://localhost:5000.

## Default Test Accounts

After seeding, you can sign in with:

- Admin: `admin@urbanmart.com` / `admin123`
- Customer: `customer@example.com` / `customer123`

## Useful Scripts

### Root app

- `npm run dev` – start the Vite frontend
- `npm run build` – build the frontend for production
- `npm run preview` – preview the production build

### Server

- `npm run dev` – start the backend in development mode
- `npm run build` – compile the TypeScript server
- `npm run start` – run the compiled server
- `npm run db:push` – push Prisma schema changes to the database
- `npm run db:migrate` – run Prisma migrations
- `npm run db:studio` – open Prisma Studio

## Deployment Notes

- The frontend can be deployed to Vercel or a similar static hosting provider.
- The backend should be deployed to a Node.js-compatible host such as Render, Railway, or VPS.
- Make sure to configure production environment variables and a managed PostgreSQL database.

## License

This project is maintained as a full-stack commerce and delivery application for UrbanMart Swift Deliveries.
