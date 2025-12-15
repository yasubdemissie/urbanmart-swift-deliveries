import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database seeding...");

  // Clear existing data
  console.log("🗑️ Clearing existing data...");
  await prisma.deliveryPayment.deleteMany();
  await prisma.deliveryAssignment.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.report.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.merchantStore.deleteMany();
  await prisma.user.deleteMany();

  // Hash password helper
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  // Create Super Admin
  console.log("👑 Creating SuperAdmin...");
  const superAdmin = await prisma.user.create({
    data: {
      email: "superadmin@urbanmart.com",
      password: await hashPassword("admin123"),
      firstName: "Super",
      lastName: "Admin",
      phone: "+251911123456",
      role: UserRole.SUPER_ADMIN,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin",
    },
  });

  // Create Admin
  console.log("👨‍💼 Creating Admin...");
  const admin = await prisma.user.create({
    data: {
      email: "admin@urbanmart.com",
      password: await hashPassword("admin123"),
      firstName: "System",
      lastName: "Administrator",
      phone: "+251911123457",
      role: UserRole.ADMIN,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  });

  // Create Merchants
  console.log("🏪 Creating Merchants...");
  const merchant1 = await prisma.user.create({
    data: {
      email: "merchant1@example.com",
      password: await hashPassword("merchant123"),
      firstName: "John",
      lastName: "Smith",
      phone: "+251911123458",
      role: UserRole.MERCHANT,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=merchant1",
    },
  });

  const merchant2 = await prisma.user.create({
    data: {
      email: "merchant2@example.com",
      password: await hashPassword("merchant123"),
      firstName: "Sarah",
      lastName: "Johnson",
      phone: "+251911123459",
      role: UserRole.MERCHANT,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=merchant2",
    },
  });

  // Create Customers
  console.log("👥 Creating Customers...");
  const customer1 = await prisma.user.create({
    data: {
      email: "customer1@example.com",
      password: await hashPassword("customer123"),
      firstName: "Alice",
      lastName: "Johnson",
      phone: "+251911123460",
      role: UserRole.CUSTOMER,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=customer1",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: "customer2@example.com",
      password: await hashPassword("customer123"),
      firstName: "Bob",
      lastName: "Wilson",
      phone: "+251911123461",
      role: UserRole.CUSTOMER,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=customer2",
    },
  });

  // Create Delivery Persons
  console.log("🚚 Creating Delivery Persons...");
  const delivery1 = await prisma.user.create({
    data: {
      email: "delivery1@urbanmart.com",
      password: await hashPassword("delivery123"),
      firstName: "Mike",
      lastName: "Delivery",
      phone: "+251911123462",
      role: UserRole.DELIVERY,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=delivery1",
    },
  });

  const delivery2 = await prisma.user.create({
    data: {
      email: "delivery2@urbanmart.com",
      password: await hashPassword("delivery123"),
      firstName: "Emma",
      lastName: "Rider",
      phone: "+251911123463",
      role: UserRole.DELIVERY,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=delivery2",
    },
  });

  // Create Categories
  console.log("📂 Creating Categories...");
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
      description: "Electronic devices and accessories",
      sortOrder: 1,
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: "Clothing",
      slug: "clothing",
      description: "Fashion and clothing items",
      sortOrder: 2,
    },
  });

  const home = await prisma.category.create({
    data: {
      name: "Home & Garden",
      slug: "home-garden",
      description: "Home improvement and garden supplies",
      sortOrder: 3,
    },
  });

  // Create Merchant Stores
  console.log("🏬 Creating Merchant Stores...");
  const store1 = await prisma.merchantStore.create({
    data: {
      merchantId: merchant1.id,
      name: "John's Electronics Store",
      description: "Premium electronics and gadgets store",
      address: "Bole Road, Addis Ababa, Ethiopia",
      phone: "+251911123458",
      email: "store1@example.com",
      isVerified: true,
    },
  });

  const store2 = await prisma.merchantStore.create({
    data: {
      merchantId: merchant2.id,
      name: "Sarah's Fashion Boutique",
      description: "Trendy fashion and clothing boutique",
      address: "Kazanches Street, Addis Ababa, Ethiopia",
      phone: "+251911123459",
      email: "store2@example.com",
      isVerified: true,
    },
  });

  // Create Sample Products
  console.log("📦 Creating Products...");
  const products = await Promise.all([
    // Electronics from Store 1
    prisma.product.create({
      data: {
        name: "Samsung Galaxy S24",
        slug: "samsung-galaxy-s24",
        description: "Latest Samsung smartphone with advanced features",
        price: 45000,
        originalPrice: 50000,
        weight: 0.168,
        stockQuantity: 50,
        minStockLevel: 5,
        isFeatured: true,
        isOnSale: true,
        salePercentage: 10,
        categoryId: electronics.id,
        merchantStoreId: store1.id,
        brand: "Samsung",
        tags: ["smartphone", "samsung", "android"],
        images: [
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        ],
        mainImage:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      },
    }),
    prisma.product.create({
      data: {
        name: "MacBook Pro 16-inch",
        slug: "macbook-pro-16-inch",
        description: "Apple MacBook Pro with M3 chip",
        price: 180000,
        weight: 2.14,
        stockQuantity: 25,
        minStockLevel: 3,
        isFeatured: true,
        categoryId: electronics.id,
        merchantStoreId: store1.id,
        brand: "Apple",
        tags: ["laptop", "macbook", "apple"],
        images: [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
        ],
        mainImage:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      },
    }),
    // Clothing from Store 2
    prisma.product.create({
      data: {
        name: "Designer Jeans",
        slug: "designer-jeans",
        description: "Premium quality designer jeans",
        price: 3500,
        originalPrice: 4000,
        weight: 0.8,
        stockQuantity: 100,
        minStockLevel: 10,
        isOnSale: true,
        salePercentage: 12,
        categoryId: clothing.id,
        merchantStoreId: store2.id,
        brand: "Urban Style",
        tags: ["jeans", "designer", "clothing"],
        images: [
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
        ],
        mainImage:
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
      },
    }),
    prisma.product.create({
      data: {
        name: "Cotton T-Shirt",
        slug: "cotton-t-shirt",
        description: "100% Organic cotton t-shirt",
        price: 1200,
        weight: 0.2,
        stockQuantity: 200,
        minStockLevel: 20,
        categoryId: clothing.id,
        merchantStoreId: store2.id,
        brand: "EcoWear",
        tags: ["t-shirt", "cotton", "organic"],
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        ],
        mainImage:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      },
    }),
  ]);

  // Create Sample Addresses for customers
  console.log("🏠 Creating Customer Addresses...");
  const addresses = await Promise.all([
    prisma.address.create({
      data: {
        userId: customer1.id,
        type: "SHIPPING",
        firstName: "Alice",
        lastName: "Johnson",
        address1: "123 Bole Road",
        city: "Addis Ababa",
        state: "Addis Ababa",
        postalCode: "1000",
        country: "Ethiopia",
        phone: "+251911123460",
        isDefault: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: customer2.id,
        type: "SHIPPING",
        firstName: "Bob",
        lastName: "Wilson",
        address1: "456 Kazanches Street",
        city: "Addis Ababa",
        state: "Addis Ababa",
        postalCode: "1001",
        country: "Ethiopia",
        phone: "+251911123461",
        isDefault: true,
      },
    }),
  ]);

  // Create Sample Orders
  console.log("📋 Creating Sample Orders...");
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "ORD-001",
      userId: customer1.id,
      merchantId: merchant1.id,
      storeId: store1.id,
      subtotal: 45000,
      tax: 3600,
      shipping: 500,
      total: 49400,
      paymentMethod: "CASH_ON_DELIVERY",
      shippingAddressId: addresses[0].id,
      billingAddressId: addresses[0].id,
      notes: "Please handle with care",
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: "ORD-002",
      userId: customer2.id,
      merchantId: merchant2.id,
      storeId: store2.id,
      subtotal: 5800,
      tax: 464,
      shipping: 500,
      total: 7164,
      paymentMethod: "CREDIT_CARD",
      shippingAddressId: addresses[1].id,
      billingAddressId: addresses[1].id,
    },
  });

  // Create Order Items
  console.log("📦 Creating Order Items...");
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        productId: products[0].id,
        quantity: 1,
        price: Number(products[0].price), // Convert Decimal to Number
        total: Number(products[0].price), // Convert Decimal to Number
      },
      {
        orderId: order2.id,
        productId: products[2].id,
        quantity: 1,
        price: Number(products[2].price), // Convert Decimal to Number
        total: Number(products[2].price), // Convert Decimal to Number
      },
      {
        orderId: order2.id,
        productId: products[3].id,
        quantity: 2,
        price: Number(products[3].price), // Convert Decimal to Number
        total: Number(products[3].price) * 2, // Convert Decimal to Number first
      },
    ],
  });

  // Create Customer Relationships
  console.log("🤝 Creating Customer Relationships...");
  await prisma.customer.createMany({
    data: [
      {
        customerId: customer1.id,
        merchantId: merchant1.id,
        storeId: store1.id,
        firstOrderAt: new Date(),
        lastOrderAt: new Date(),
        totalOrders: 1,
        totalSpent: 49400,
      },
      {
        customerId: customer2.id,
        merchantId: merchant2.id,
        storeId: store2.id,
        firstOrderAt: new Date(),
        lastOrderAt: new Date(),
        totalOrders: 1,
        totalSpent: 7164,
      },
    ],
  });

  // Create Sample Reports
  console.log("📝 Creating Sample Reports...");
  await prisma.report.createMany({
    data: [
      {
        reporterId: customer1.id,
        type: "GENERAL_INQUIRY",
        title: "Delivery Question",
        description: "How long does delivery usually take?",
        status: "OPEN",
        priority: "MEDIUM",
      },
      {
        reporterId: merchant1.id,
        type: "TECHNICAL_ISSUE",
        title: "Payment Gateway Issue",
        description: "Having trouble with payment processing",
        status: "IN_PROGRESS",
        priority: "HIGH",
        assignedAdminId: admin.id,
      },
    ],
  });

  console.log("✅ Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`- Super Admin: ${superAdmin.email}`);
  console.log(`- Admin: ${admin.email}`);
  console.log(`- Merchants: ${merchant1.email}, ${merchant2.email}`);
  console.log(`- Customers: ${customer1.email}, ${customer2.email}`);
  console.log(`- Delivery Persons: ${delivery1.email}, ${delivery2.email}`);
  console.log(
    "\n🔐 Default passwords: admin123, merchant123, customer123, delivery123"
  );
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
