import apiClient, { Product } from "@/lib/api";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Edit, Eye, Plus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

// Products Tab Component
export const ProductsTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getMerchantProducts({ limit: 20 });
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4">Loading products...</div>;
  }

  console.log("products", products);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Products</h3>
        <Button
          onClick={() => (window.location.href = "/merchant/products/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="aspect-square mb-4">
                <img
                  src={
                    product.mainImage || product.images[0] || "/placeholder.svg"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h4 className="font-semibold mb-2">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-2">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    product.stockQuantity > 0 ? "default" : "destructive"
                  }
                >
                  {product.stockQuantity} in stock
                </Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
