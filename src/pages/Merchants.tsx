import { useState } from "react";
import Header from "@/components/Custom/Header";
import MerchantList from "@/components/Home/merchantList";
import { Search, Store, ShieldCheck, Truck, Star } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Merchants() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border/50 py-12 px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" /> Direct From Sellers
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            Discover Verified Merchants
          </h1>

          <p className="max-w-2xl text-muted-foreground text-base md:text-lg">
            Shop directly from trusted local stores, brands, and boutique sellers with fast & secure delivery.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-xl relative mt-2 shadow-lg rounded-xl overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search merchants by store name or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-base bg-card border-border/60 focus-visible:ring-primary shadow-inner rounded-xl"
            />
          </div>

          {/* Features Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm text-muted-foreground pt-4">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Businesses
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-4 h-4 text-blue-500" /> Swift Local Delivery
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Top Rated Stores
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-10 flex-1">
        <MerchantList searchQuery={searchQuery} />
      </main>
    </div>
  );
}
