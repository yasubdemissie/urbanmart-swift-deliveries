import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./utils/helpers";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create Super Admin user
  const superAdminPassword = await hashPassword("superadmin123");
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@urbanmart.com" },
    update: {},
    create: {
      email: "superadmin@urbanmart.com",
      password: superAdminPassword,
      firstName: "Super",
      lastName: "Admin",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  // Create Admin user
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

  // Create Merchant users
  const merchant1Password = await hashPassword("merchant123");
  const merchant1 = await prisma.user.upsert({
    where: { email: "merchant1@urbanmart.com" },
    update: {},
    create: {
      email: "merchant1@urbanmart.com",
      password: merchant1Password,
      firstName: "Sarah",
      lastName: "Johnson",
      role: "MERCHANT",
      isActive: true,
    },
  });

  const merchant2Password = await hashPassword("merchant123");
  const merchant2 = await prisma.user.upsert({
    where: { email: "merchant2@urbanmart.com" },
    update: {},
    create: {
      email: "merchant2@urbanmart.com",
      password: merchant2Password,
      firstName: "Michael",
      lastName: "Chen",
      role: "MERCHANT",
      isActive: true,
    },
  });

  const merchant3Password = await hashPassword("merchant123");
  const merchant3 = await prisma.user.upsert({
    where: { email: "merchant3@urbanmart.com" },
    update: {},
    create: {
      email: "merchant3@urbanmart.com",
      password: merchant3Password,
      firstName: "Emily",
      lastName: "Rodriguez",
      role: "MERCHANT",
      isActive: true,
    },
  });

  // Create Customer users
  const customer1Password = await hashPassword("customer123");
  const customer1 = await prisma.user.upsert({
    where: { email: "customer1@example.com" },
    update: {},
    create: {
      email: "customer1@example.com",
      password: customer1Password,
      firstName: "John",
      lastName: "Doe",
      role: "CUSTOMER",
      isActive: true,
    },
  });

  const customer2Password = await hashPassword("customer123");
  const customer2 = await prisma.user.upsert({
    where: { email: "customer2@example.com" },
    update: {},
    create: {
      email: "customer2@example.com",
      password: customer2Password,
      firstName: "Jane",
      lastName: "Smith",
      role: "CUSTOMER",
      isActive: true,
    },
  });

  const customer3Password = await hashPassword("customer123");
  const customer3 = await prisma.user.upsert({
    where: { email: "customer3@example.com" },
    update: {},
    create: {
      email: "customer3@example.com",
      password: customer3Password,
      firstName: "David",
      lastName: "Wilson",
      role: "CUSTOMER",
      isActive: true,
    },
  });

  const customer4Password = await hashPassword("customer123");
  const customer4 = await prisma.user.upsert({
    where: { email: "customer4@example.com" },
    update: {},
    create: {
      email: "customer4@example.com",
      password: customer4Password,
      firstName: "Lisa",
      lastName: "Brown",
      role: "CUSTOMER",
      isActive: true,
    },
  });

  const customer5Password = await hashPassword("customer123");
  const customer5 = await prisma.user.upsert({
    where: { email: "customer5@example.com" },
    update: {},
    create: {
      email: "customer5@example.com",
      password: customer5Password,
      firstName: "Robert",
      lastName: "Taylor",
      role: "CUSTOMER",
      isActive: true,
    },
  });

  // Create Merchant Stores
  const store1 = await prisma.merchantStore.upsert({
    where: { merchantId: merchant1.id },
    update: {},
    create: {
      merchantId: merchant1.id,
      name: "TechGear Store",
      description: "Premium electronics and gadgets for tech enthusiasts",
      address: "123 Tech Street, Silicon Valley, CA 94000",
      phone: "+1-555-0123",
      email: "contact@techgear.com",
      website: "https://techgear.com",
      isActive: true,
      isVerified: true,
    },
  });

  const store2 = await prisma.merchantStore.upsert({
    where: { merchantId: merchant2.id },
    update: {},
    create: {
      merchantId: merchant2.id,
      name: "Fashion Forward",
      description: "Trendy clothing and accessories for modern lifestyle",
      address: "456 Fashion Ave, New York, NY 10001",
      phone: "+1-555-0456",
      email: "hello@fashionforward.com",
      website: "https://fashionforward.com",
      isActive: true,
      isVerified: true,
    },
  });

  const store3 = await prisma.merchantStore.upsert({
    where: { merchantId: merchant3.id },
    update: {},
    create: {
      merchantId: merchant3.id,
      name: "Home & Garden Essentials",
      description: "Everything you need for your home and garden",
      address: "789 Garden Lane, Portland, OR 97201",
      phone: "+1-555-0789",
      email: "info@homegarden.com",
      website: "https://homegarden.com",
      isActive: true,
      isVerified: false, // This store is pending verification
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

  // Create sample products (some owned by merchants)
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
        merchantStoreId: store1.id, // Owned by TechGear Store
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
        merchantStoreId: store2.id, // Owned by Fashion Forward
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
        merchantStoreId: store1.id, // Owned by TechGear Store
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
        merchantStoreId: store3.id, // Owned by Home & Garden Essentials
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
        merchantStoreId: store2.id, // Owned by Fashion Forward
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
        merchantStoreId: store3.id, // Owned by Home & Garden Essentials
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

  // Create sample reports
  const reports = await Promise.all([
    prisma.report.create({
      data: {
        reporterId: customer1.id,
        type: "TECHNICAL_ISSUE",
        title: "Website loading slowly",
        description: "The website takes too long to load on mobile devices",
        priority: "MEDIUM",
        status: "OPEN",
      },
    }),
    prisma.report.create({
      data: {
        reporterId: customer2.id,
        type: "PAYMENT_PROBLEM",
        title: "Payment not processed",
        description: "My payment was declined but the money was charged",
        priority: "HIGH",
        status: "IN_PROGRESS",
        assignedAdminId: admin.id,
      },
    }),
    prisma.report.create({
      data: {
        reporterId: merchant1.id,
        type: "MERCHANT_COMPLAINT",
        title: "Product review system issue",
        description: "Cannot respond to customer reviews on my products",
        priority: "MEDIUM",
        status: "OPEN",
      },
    }),
  ]);

  console.log("✅ Database seeded successfully!");
  console.log("\n👥 User Accounts Created:");
  console.log(`🔑 Super Admin: superadmin@urbanmart.com / superadmin123`);
  console.log(`👨‍💼 Admin: admin@urbanmart.com / admin123`);
  console.log(
    `🏪 Merchant 1: merchant1@urbanmart.com / merchant123 (TechGear Store)`
  );
  console.log(
    `🏪 Merchant 2: merchant2@urbanmart.com / merchant123 (Fashion Forward)`
  );
  console.log(
    `🏪 Merchant 3: merchant3@urbanmart.com / merchant123 (Home & Garden Essentials)`
  );
  console.log(`👤 Customer 1: customer1@example.com / customer123`);
  console.log(`👤 Customer 2: customer2@example.com / customer123`);
  console.log(`👤 Customer 3: customer3@example.com / customer123`);
  console.log(`👤 Customer 4: customer4@example.com / customer123`);
  console.log(`👤 Customer 5: customer5@example.com / customer123`);

  console.log("\n📊 Summary:");
  console.log(
    `👥 Created ${8} users (1 Super Admin, 1 Admin, 3 Merchants, 5 Customers)`
  );
  console.log(`🏪 Created ${3} merchant stores`);
  console.log(`📦 Created ${categories.length} categories`);
  console.log(`🛍️ Created ${products.length} products`);
  console.log(`📋 Created ${reports.length} sample reports`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
