"use client";

import { Shield, Truck, Clock, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Header from "@/components/Custom/Header";
import MerchantList from "@/components/Home/merchantList";
import Categories from "@/components/Home/categories";
import FeaturedProducts from "@/components/Home/featuredProducts";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-56 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />

      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <main className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-500">
              Welcome to the Future of Shopping
            </div>
            <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-6xl">
              Shop Smarter with{" "}
              <span className="bg-gradient-to-r from-blue-500 to-accent bg-clip-text text-transparent">
                UrbanMart
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Discover an amazing selection of products, unbeatable prices, and
              lightning-fast delivery. Your perfect shopping experience starts
              here.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {/* <Button
                onClick={() => navigate("/signin")}
                size="lg"
                className="w-full shadow-xl sm:w-auto"
              >
                Get Started
              </Button> */}
              <Button
                onClick={() => navigate("/shop")}
                variant="outline"
                size="lg"
                className="w-full transition-all duration-300 hover:border-blue-500 hover:text-blue-500 sm:w-auto"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mx-auto mt-20 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-3 transition-all duration-300 group-hover:bg-blue-500 group-hover:shadow-lg">
                <Sparkles className="h-6 w-6 text-blue-500 transition-colors duration-300 group-hover:text-blue-100" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-card-foreground">
                Premium Quality
              </h3>
              <p className="text-muted-foreground">
                Curated selection of high-quality products from trusted brands
                worldwide.
              </p>
            </div>

            <div className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10">
              <div className="mb-4 inline-flex rounded-lg bg-orange-500/10 p-3 transition-all duration-300 group-hover:bg-orange-500 group-hover:shadow-lg">
                <Zap className="h-6 w-6 text-orange-500 transition-colors duration-300 group-hover:text-orange-100" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-card-foreground">
                Fast Delivery
              </h3>
              <p className="text-muted-foreground">
                Lightning-fast shipping to your doorstep. Track your orders in
                real-time.
              </p>
            </div>

            <div className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 sm:col-span-2 lg:col-span-1">
              <div className="mb-4 inline-flex rounded-lg bg-green-500/10 p-3 transition-all duration-300 group-hover:bg-green-500 group-hover:shadow-lg">
                <Shield className="h-6 w-6 text-green-500 transition-colors duration-300 group-hover:text-green-100" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-card-foreground">
                Secure Payments
              </h3>
              <p className="text-muted-foreground">
                Shop with confidence using our secure, encrypted payment system.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Stunning Hero Section */}
      <MerchantList />

      {/* Beautiful Categories Section */}
      <Categories />

      {/* Premium Featured Products */}
      <FeaturedProducts />

      {/* Enhanced Delivery Promise */}

      <div className="mx-auto mt-20 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
          <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-3 transition-all duration-300 group-hover:bg-blue-500 group-hover:shadow-lg">
            <Truck className="h-6 w-6 text-blue-500 transition-colors duration-300 group-hover:text-blue-100" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-card-foreground">
            Lightning Fast Delivery
          </h3>
          <p className="text-muted-foreground">
            Experience the future of shopping with our premium delivery service
          </p>
        </div>

        <div className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10">
          <div className="mb-4 inline-flex rounded-lg bg-orange-500/10 p-3 transition-all duration-300 group-hover:bg-orange-500 group-hover:shadow-lg">
            <Clock className="h-6 w-6 text-orange-500 transition-colors duration-300 group-hover:text-orange-100" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-card-foreground">
            Same Day Delivery
          </h3>
          <p className="text-muted-foreground">
            Order before 2 PM and get your items delivered the same day in
            select metropolitan areas
          </p>
        </div>

        <div className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 sm:col-span-2 lg:col-span-1">
          <div className="mb-4 inline-flex rounded-lg bg-green-500/10 p-3 transition-all duration-300 group-hover:bg-green-500 group-hover:shadow-lg">
            <Clock className="h-6 w-6 text-green-500 transition-colors duration-300 group-hover:text-green-100" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-card-foreground">
            Real-time Tracking
          </h3>
          <p className="text-muted-foreground">
            Follow your package journey with live GPS tracking and instant
            notifications
          </p>
        </div>
      </div>

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
