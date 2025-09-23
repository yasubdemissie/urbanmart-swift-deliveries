"use client";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Truck,
  Clock,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// import { useState } from "react";
// import { Search, ShoppingCart, User, ArrowRight } from "lucide-react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import ProductCard from "@/components/ProductCard";
import Header from "@/components/Custom/Header";
import { useCategories, useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/Custom/ProductCard";
import { useNavigate } from "react-router-dom";
import { Category } from "@/lib/api";
// import Footer from "@/components/Footer";
// import {
//   useFeaturedProducts,
//   useSaleProducts,
//   useCategories,
// } from "@/hooks/useProducts";
// import { useAddToCart } from "@/hooks/useCart";
// import { toast } from "sonner";

// const Index = () => {
//   const [searchQuery, setSearchQuery] = useState("");

//   // Fetch real data from API
//   const { data: featuredProducts = [], isLoading: featuredLoading } =
//     useFeaturedProducts();
//   const { data: saleProducts = [], isLoading: saleLoading } = useSaleProducts();
//   const { data: categories = [], isLoading: categoriesLoading } =
//     useCategories();
//   const addToCartMutation = useAddToCart();

//   // Handle add to cart
//   const handleAddToCart = async (productId: string) => {
//     try {
//       await addToCartMutation.mutateAsync({ productId, quantity: 1 });
//       toast.success("Product added to cart!");
//     } catch (error: unknown) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Failed to add to cart";
//       toast.error(errorMessage);
//     }
//   };

//   // Sample categories with icons (since API doesn't have icons)
//   const categoryIcons = {
//     electronics: "📱",
//     clothing: "👔",
//     "home-garden": "🏠",
//     "food-beverages": "🍕",
//     "sports-fitness": "⚽",
//     "books-media": "📚",
//     "beauty-health": "💄",
//     "toys-games": "🎮",
//     automotive: "🚗",
//     "pet-supplies": "🐕",
//   };

//   const getCategoryIcon = (slug: string) => {
//     return categoryIcons[slug as keyof typeof categoryIcons] || "📦";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
//         <div className="container mx-auto px-4 py-16 md:py-24">
//           <div className="text-center max-w-4xl mx-auto">
//             <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
//               Shop Smart,{" "}
//               <span className="text-yellow-300">Delivered Fast</span>
//             </h1>
//             <p className="text-xl md:text-2xl mb-8 text-blue-100">
//               Discover amazing products with lightning-fast delivery to your
//               doorstep
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
//               <div className="relative flex-1 max-w-md">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <Input
//                   placeholder="Search for products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 py-3 text-gray-900"
//                 />
//               </div>
//               <Link to={`/shop?search=${searchQuery}`}>
//                 <Button
//                   size="lg"
//                   className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
//                 >
//                   Search
//                 </Button>
//               </Link>
//             </div>
//             <div className="flex flex-wrap justify-center gap-4 text-sm">
//               <div className="flex items-center gap-2">
//                 <span className="w-2 h-2 bg-green-400 rounded-full"></span>
//                 Free shipping over $50
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="w-2 h-2 bg-green-400 rounded-full"></span>
//                 24/7 customer support
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="w-2 h-2 bg-green-400 rounded-full"></span>
//                 30-day return policy
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
//             Shop by Category
//           </h2>
//           {categoriesLoading ? (
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//               {Array.from({ length: 6 }).map((_, index) => (
//                 <div
//                   key={index}
//                   className="bg-gray-50 rounded-lg p-6 text-center animate-pulse"
//                 >
//                   <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
//                   <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                   <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//               {categories.slice(0, 6).map((category) => (
//                 <Link
//                   key={category.id}
//                   to={`/shop?category=${category.slug}`}
//                   className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group"
//                 >
//                   <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
//                     {getCategoryIcon(category.slug)}
//                   </div>
//                   <h3 className="font-semibold text-gray-800 mb-1">
//                     {category.name}
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     {category.productCount || 0} items
//                   </p>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-800">
//               Featured Products
//             </h2>
//             <Link to="/shop">
//               <Button variant="outline" className="flex items-center gap-2">
//                 View All <ArrowRight className="h-4 w-4" />
//               </Button>
//             </Link>
//           </div>
//           {featuredLoading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {Array.from({ length: 4 }).map((_, index) => (
//                 <div
//                   key={index}
//                   className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
//                 >
//                   <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
//                   <div className="bg-gray-200 h-4 rounded mb-2"></div>
//                   <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
//                   <div className="bg-gray-200 h-6 rounded w-1/2"></div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {featuredProducts.slice(0, 4).map((product) => (
//                 <ProductCard
//                   key={product.id}
//                   product={product}
//                   onAddToCart={() => handleAddToCart(product.id)}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Sale Products */}
//       {saleProducts.length > 0 && (
//         <section className="py-16 bg-white">
//           <div className="container mx-auto px-4">
//             <div className="flex justify-between items-center mb-12">
//               <h2 className="text-3xl font-bold text-gray-800">On Sale</h2>
//               <Link to="/deals">
//                 <Button variant="outline" className="flex items-center gap-2">
//                   View All <ArrowRight className="h-4 w-4" />
//                 </Button>
//               </Link>
//             </div>
//             {saleLoading ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {Array.from({ length: 4 }).map((_, index) => (
//                   <div
//                     key={index}
//                     className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
//                   >
//                     <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
//                     <div className="bg-gray-200 h-4 rounded mb-2"></div>
//                     <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
//                     <div className="bg-gray-200 h-6 rounded w-1/2"></div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {saleProducts.slice(0, 4).map((product) => (
//                   <ProductCard
//                     key={product.id}
//                     product={product}
//                     onAddToCart={() => handleAddToCart(product.id)}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       )}

//       {/* Delivery Promise */}
//       <section className="py-16 bg-blue-600 text-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold mb-8">Fast & Reliable Delivery</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//             <div className="flex flex-col items-center">
//               <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl mb-4">
//                 🚚
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Same Day Delivery</h3>
//               <p className="text-blue-100">
//                 Order before 2 PM for same-day delivery in select areas
//               </p>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl mb-4">
//                 📍
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
//               <p className="text-blue-100">
//                 Track your order from warehouse to your doorstep
//               </p>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl mb-4">
//                 🛡️
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
//               <p className="text-blue-100">
//                 Your packages are insured and handled with care
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Newsletter */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold mb-4 text-gray-800">
//             Stay Updated
//           </h2>
//           <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
//             Subscribe to our newsletter for exclusive deals, product updates,
//             and delivery notifications
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
//             <Input placeholder="Enter your email" className="flex-1" />
//             <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Index;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: Products } = useProducts({
    featured: true,
  });
  const navigate = useNavigate();

  const featuredProducts = Products?.products || [];
  // Mock data for the perfect design
  // const featuredProducts = [
  //   {
  //     id: "1",
  //     name: "Premium Wireless Headphones",
  //     price: 299,
  //     originalPrice: 399,
  //     image: "/premium-wireless-headphones.png",
  //     rating: 4.8,
  //     reviews: 2847,
  //     badge: "Best Seller",
  //   },
  //   {
  //     id: "2",
  //     name: "Smart Fitness Watch",
  //     price: 249,
  //     originalPrice: 329,
  //     image: "/smart-fitness-watch.png",
  //     rating: 4.9,
  //     reviews: 1923,
  //     badge: "New",
  //   },
  //   {
  //     id: "3",
  //     name: "Minimalist Desk Lamp",
  //     price: 89,
  //     originalPrice: 129,
  //     image: "/minimalist-desk-lamp.png",
  //     rating: 4.7,
  //     reviews: 856,
  //     badge: "Sale",
  //   },
  //   {
  //     id: "4",
  //     name: "Organic Coffee Beans",
  //     price: 24,
  //     originalPrice: 32,
  //     image: "/organic-coffee-beans.png",
  //     rating: 4.6,
  //     reviews: 1247,
  //     badge: "Trending",
  //   },
  // ];

  const { data: categories } = useCategories();

  console.log(categories);

  const colorAndIcon = [
    { color: "from-blue-500 to-cyan-500", icon: "⚡" },
    { color: "from-pink-500 to-rose-500", icon: "👗" },
    { color: "from-green-500 to-emerald-500", icon: "🏡" },
    { color: "from-orange-500 to-amber-500", icon: "🏃" },
    { color: "from-purple-500 to-violet-500", icon: "📚" },
    { color: "from-red-500 to-pink-500", icon: "💄" },
  ];

  // Extend the Category type to include icon and color for local use
  type CategoryWithIcon = Category & {
    icon: string;
    color: string;
  };

  const categoriesData: CategoryWithIcon[] =
    categories?.map(
      (category: Category, i: number): CategoryWithIcon => ({
        ...category,
        slug: category.name.toLowerCase().replace(/\s+/g, "-"),
        icon: colorAndIcon[i].icon,
        color: colorAndIcon[i].color,
      })
    ) ?? [];

  console.log("data: ", categoriesData);

  return (
    <div className="min-h-56 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced Header */}
      {/* <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ShopFlow
              </div>
              <nav className="hidden md:flex space-x-6">
                <a
                  href="#"
                  className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  Categories
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  Deals
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  New
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-indigo-600">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header> */}

      <Header />

      {/* Stunning Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
              <Zap className="h-4 w-4 mr-2 text-yellow-400" />
              Free shipping on orders over $50
            </div>
            <h1 className="text-3xl md:text-7xl font-semibold md:font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Discover{" "}
              </span>
              <span className="text-white">Amazing Products</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Experience premium shopping with lightning-fast delivery, curated
              collections, and unmatched quality
            </p>

            {/* Enhanced Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search for anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-4 text-lg bg-white/95 backdrop-blur-sm border-white/20 focus:border-white/40 rounded-2xl shadow-xl"
                />
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105"
              >
                Search
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-5 md:gap-8 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                Secure payments
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-green-400" />
                Fast delivery
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-green-400" />
                Quality guaranteed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beautiful Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover our carefully curated collections across all your
              favorite categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center mx-auto max-w-7xl">
            {categoriesData?.map((category: CategoryWithIcon) => (
              <div
                key={category.id}
                className="group relative overflow-hidden rounded-3xl p-8 text-center cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2 w-full max-w-xs"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                ></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {category.productCount.toLocaleString()} items
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Featured Products */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-slate-600">
                Hand-picked favorites that our customers love
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/shop")}
              className="hidden md:flex items-center gap-2 rounded-full px-6 py-3 border-2 hover:bg-slate-50 bg-transparent"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))
            ) : (
              <p>No featured products available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Delivery Promise */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/delivery-truck-pattern.png')] opacity-5"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Lightning Fast Delivery
          </h2>
          <p className="text-xl text-blue-100 mb-16 max-w-3xl mx-auto">
            Experience the future of shopping with our premium delivery service
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Same Day Delivery</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Order before 2 PM and get your items delivered the same day in
                select metropolitan areas
              </p>
            </div>

            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-time Tracking</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Follow your package journey with live GPS tracking and instant
                notifications
              </p>
            </div>

            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Safe & Insured</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Every package is fully insured and handled with premium care by
                our trained professionals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Newsletter */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800">
              Stay in the Loop
            </h2>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Join over 100,000 happy customers and be the first to know about
              exclusive deals, new arrivals, and insider tips
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <Input
                placeholder="Enter your email address"
                className="flex-1 py-4 px-6 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 text-lg"
              />
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Subscribe
              </Button>
            </div>

            <p className="text-sm text-slate-500 mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                ShopFlow
              </div>
              <p className="text-slate-400 leading-relaxed">
                Your premium destination for quality products and exceptional
                shopping experiences.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Shop</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    All Products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sale Items
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>
              &copy; 2024 ShopFlow. All rights reserved. Made with ❤️ for
              amazing customers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
