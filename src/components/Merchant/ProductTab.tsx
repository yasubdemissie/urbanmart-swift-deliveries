import { Product } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Edit, Eye, Plus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useMerchantProducts } from "@/hooks/useMerchant";

// Products Tab Component
export const ProductsTab = () => {
  const navigate = useNavigate();
  const { data: productsData, isLoading } = useMerchantProducts({ limit: 20 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  const products = productsData?.products || [];
  console.log("Products data:", products);

  return (
    <div className="space-y-4">
      {products?.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start building your store by adding your first product.
          </p>
          <Button onClick={() => navigate("/merchant/products/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="aspect-square mb-4">
                  <img
                    src={
                      product.mainImage ||
                      product.images[0] ||
                      "/placeholder.svg"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h4 className="font-semibold mb-2">{product.name}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  ${Number(product.price).toFixed(2)}
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
      )}
    </div>
  );
};
