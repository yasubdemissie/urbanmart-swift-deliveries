# UrbanMart Server

Backend server for UrbanMart Swift Deliveries e-commerce application.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the server directory with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/urbanmart_db"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   
   # Server
   PORT=5000
   NODE_ENV="development"
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed the database with sample data
   npx tsx src/seed.ts
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 📚 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🔐 Default Users

After seeding the database, you can use these test accounts:

- **Admin:** admin@urbanmart.com / admin123
- **Customer:** customer@example.com / customer123

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with pagination/filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/featured/list` - Get featured products
- `GET /api/products/sale/list` - Get products on sale

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category with products
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart
- `GET /api/cart/count` - Get cart item count

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status (Admin only)
- `GET /api/orders/admin/all` - Get all orders (Admin only)

### Users
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Add new address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address
- `PATCH /api/users/addresses/:id/default` - Set default address
- `GET /api/users/orders/summary` - Get orders summary

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/reviews/user/me` - Get user's reviews

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **Users** - Customer accounts with roles
- **Products** - Product catalog with categories
- **Categories** - Product categorization
- **Orders** - Order management
- **Cart Items** - Shopping cart
- **Reviews** - Product reviews
- **Addresses** - User addresses

## 🔧 Development

### Project Structure
```
src/
├── index.ts              # Main server entry point
├── lib/
│   └── prisma.ts         # Prisma client
├── middleware/
│   └── auth.ts           # Authentication middleware
├── routes/               # API route handlers
├── utils/                # Utility functions
└── seed.ts              # Database seed file
```

### Adding New Features

1. Create new route files in `src/routes/`
2. Add validation in `src/utils/validation.ts`
3. Update Prisma schema if needed
4. Add tests for new functionality

## 🚀 Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables
3. Start the production server:
   ```bash
   npm start
   ```

## 📝 License

This project is part of the UrbanMart Swift Deliveries application. 