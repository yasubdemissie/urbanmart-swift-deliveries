import { ArrowRight } from "lucide-react";
import ProductCard from "../Custom/ProductCard";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useCategories, useProducts } from "@/hooks/useProducts";
import { useState } from "react";

export default function FeaturedProducts() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: Products } = useProducts({
    featured: true,
  });
  const navigate = useNavigate();

  const featuredProducts = Products?.products || [];
  const { data: categories } = useCategories();

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-2xl font-bold">Featured Products</h1>
            <p className="text-sm text-muted-foreground">
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
  );
}
