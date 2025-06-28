import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./utils/helpers";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.upsert({
    where: { email: "admin@urbanmart.com" },
    update: {},
    create: {
      email: "admin@urbanmart.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      isActive: true,
    },
  });

  // Create sample customer
  const customerPassword = await hashPassword("customer123");
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      password: customerPassword,
      firstName: "John",
      lastName: "Doe",
      role: "CUSTOMER",
      isActive: true,
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        name: "Electronics",
        slug: "electronics",
        description: "Latest electronic devices and gadgets",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "clothing" },
      update: {},
      create: {
        name: "Clothing",
        slug: "clothing",
        description: "Fashion and apparel for all ages",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "home-garden" },
      update: {},
      create: {
        name: "Home & Garden",
        slug: "home-garden",
        description: "Home improvement and garden supplies",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        slug: "accessories",
        description: "Fashion accessories and personal items",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "food-beverages" },
      update: {},
      create: {
        name: "Food & Beverages",
        slug: "food-beverages",
        description: "Fresh food and beverages",
        sortOrder: 5,
      },
    }),
  ]);

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "wireless-bluetooth-headphones" },
      update: {},
      create: {
        name: "Wireless Bluetooth Headphones",
        slug: "wireless-bluetooth-headphones",
        description: "High-quality wireless headphones with noise cancellation",
        shortDescription: "Premium wireless headphones",
        price: 79.99,
        originalPrice: 99.99,
        stockQuantity: 50,
        categoryId: categories[0].id, // Electronics
        brand: "AudioTech",
        tags: ["wireless", "bluetooth", "headphones"],
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        ],
        mainImage:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "premium-cotton-tshirt" },
      update: {},
      create: {
        name: "Premium Cotton T-Shirt",
        slug: "premium-cotton-tshirt",
        description: "Comfortable and durable cotton t-shirt",
        shortDescription: "Soft cotton t-shirt",
        price: 29.99,
        stockQuantity: 100,
        categoryId: categories[1].id, // Clothing
        brand: "UrbanWear",
        tags: ["cotton", "tshirt", "casual"],
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
        ],
        mainImage:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
      },
    }),
    prisma.product.upsert({
      where: { slug: "smart-watch-series-5" },
      update: {},
      create: {
        name: "Smart Watch Series 5",
        slug: "smart-watch-series-5",
        description: "Advanced smartwatch with health monitoring",
        shortDescription: "Smart health monitoring watch",
        price: 249.99,
        originalPrice: 299.99,
        stockQuantity: 25,
        categoryId: categories[0].id, // Electronics
        brand: "TechWatch",
        tags: ["smartwatch", "health", "fitness"],
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
        ],
        mainImage:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
        isFeatured: true,
        isOnSale: true,
        salePercentage: 17,
      },
    }),
    prisma.product.upsert({
      where: { slug: "ceramic-coffee-mug-set" },
      update: {},
      create: {
        name: "Ceramic Coffee Mug Set",
        slug: "ceramic-coffee-mug-set",
        description: "Beautiful ceramic coffee mug set for your kitchen",
        shortDescription: "Elegant coffee mug set",
        price: 24.99,
        stockQuantity: 75,
        categoryId: categories[2].id, // Home & Garden
        brand: "HomeStyle",
        tags: ["ceramic", "coffee", "mugs"],
        images: [
          "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=300&fit=crop",
        ],
        mainImage:
          "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=300&fit=crop",
      },
    }),
    prisma.product.upsert({
      where: { slug: "leather-laptop-bag" },
      update: {},
      create: {
        name: "Leather Laptop Bag",
        slug: "leather-laptop-bag",
        description: "Premium leather laptop bag with multiple compartments",
        shortDescription: "Stylish leather laptop bag",
        price: 89.99,
        originalPrice: 120.0,
        stockQuantity: 30,
        categoryId: categories[3].id, // Accessories
        brand: "LeatherCraft",
        tags: ["leather", "laptop", "bag"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
        ],
        mainImage:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
        isOnSale: true,
        salePercentage: 25,
      },
    }),
    prisma.product.upsert({
      where: { slug: "organic-green-tea" },
      update: {},
      create: {
        name: "Organic Green Tea",
        slug: "organic-green-tea",
        description: "Premium organic green tea with health benefits",
        shortDescription: "Natural organic green tea",
        price: 19.99,
        stockQuantity: 200,
        categoryId: categories[4].id, // Food & Beverages
        brand: "NatureTea",
        tags: ["organic", "tea", "green"],
        images: [
          "https://images.unsplash.com/photo-1594631661960-4c86b8d12e4a?w=400&h=300&fit=crop",
        ],
        mainImage:
          "https://images.unsplash.com/photo-1594631661960-4c86b8d12e4a?w=400&h=300&fit=crop",
      },
    }),
  ]);

  console.log("✅ Database seeded successfully!");
  console.log(`👤 Admin user: admin@urbanmart.com / admin123`);
  console.log(`👤 Customer user: customer@example.com / customer123`);
  console.log(`📦 Created ${categories.length} categories`);
  console.log(`🛍️ Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
