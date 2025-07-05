"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Download,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import ProductForm from "./ProductForm";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import type { Category, Product } from "@/lib/api";

interface ProductsTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: Category[];
  productsData:
    | {
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
      }
    | undefined;
  productsLoading: boolean;
  handleDeleteProduct: (productId: string) => void;
  handleExport: (type: "orders" | "products" | "customers") => void;
  exportProductsMutation: { isPending: boolean };
  deleteProductMutation: { isPending: boolean };
}

const ProductsTab = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  productsData,
  productsLoading,
  handleDeleteProduct,
  handleExport,
  exportProductsMutation,
  deleteProductMutation,
}: ProductsTabProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const { toast } = useToast();

  const handleAddProduct = (formData: {
    name: string;
    description: string;
    shortDescription: string;
    price: string;
    originalPrice: string;
    costPrice: string;
    sku: string;
    barcode: string;
    weight: string;
    dimensions: string;
    stockQuantity: string;
    minStockLevel: string;
    isFeatured: boolean;
    isOnSale: boolean;
    salePercentage: string;
    categoryId: string;
    brand: string;
    tags: string[];
    images: string[];
    mainImage: string;
  }) => {
    const productData = {
      name: formData.name,
      description: formData.description,
      shortDescription: formData.shortDescription || undefined,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : undefined,
      costPrice: formData.costPrice
        ? parseFloat(formData.costPrice)
        : undefined,
      sku: formData.sku || undefined,
      barcode: formData.barcode || undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      dimensions: formData.dimensions || undefined,
      stockQuantity: parseInt(formData.stockQuantity),
      minStockLevel: parseInt(formData.minStockLevel),
      isFeatured: formData.isFeatured,
      isOnSale: formData.isOnSale,
      salePercentage:
        formData.isOnSale && formData.salePercentage
          ? parseInt(formData.salePercentage)
          : undefined,
      categoryId: formData.categoryId,
      brand: formData.brand || undefined,
      tags: formData.tags,
      images: formData.images,
      mainImage: formData.mainImage || undefined,
    };

    // Remove undefined values to avoid sending them to the API
    const cleanProductData = Object.fromEntries(
      Object.entries(productData).filter(([_, value]) => value !== undefined)
    );

    console.log("Sending product data:", cleanProductData);

    createProductMutation.mutate(cleanProductData, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Product created successfully!",
        });
        setShowForm(false);
      },
      onError: (error: Error) => {
        console.error("Product creation error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to create product",
          variant: "destructive",
        });
      },
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleUpdateProduct = (formData: {
    name: string;
    description: string;
    shortDescription: string;
    price: string;
    originalPrice: string;
    costPrice: string;
    sku: string;
    barcode: string;
    weight: string;
    dimensions: string;
    stockQuantity: string;
    minStockLevel: string;
    isFeatured: boolean;
    isOnSale: boolean;
    salePercentage: string;
    categoryId: string;
    brand: string;
    tags: string[];
    images: string[];
    mainImage: string;
  }) => {
    if (!editingProduct) return;

    const productData = {
      name: formData.name,
      description: formData.description,
      shortDescription: formData.shortDescription || undefined,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : undefined,
      costPrice: formData.costPrice
        ? parseFloat(formData.costPrice)
        : undefined,
      sku: formData.sku || undefined,
      barcode: formData.barcode || undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      dimensions: formData.dimensions || undefined,
      stockQuantity: parseInt(formData.stockQuantity),
      minStockLevel: parseInt(formData.minStockLevel),
      isFeatured: formData.isFeatured,
      isOnSale: formData.isOnSale,
      salePercentage:
        formData.isOnSale && formData.salePercentage
          ? parseInt(formData.salePercentage)
          : undefined,
      categoryId: formData.categoryId,
      brand: formData.brand || undefined,
      tags: formData.tags,
      images: formData.images,
      mainImage: formData.mainImage || undefined,
    };

    // Remove undefined values to avoid sending them to the API
    const cleanProductData = Object.fromEntries(
      Object.entries(productData).filter(([_, value]) => value !== undefined)
    );

    console.log("Updating product data:", cleanProductData);

    updateProductMutation.mutate(
      {
        id: editingProduct.id,
        data: cleanProductData as unknown as Partial<Product>,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Product updated successfully!",
          });
          setShowForm(false);
          setEditingProduct(null);
        },
        onError: (error: Error) => {
          console.error("Product update error:", error);
          toast({
            title: "Error",
            description: error.message || "Failed to update product",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteProductConfirm = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      // Call the parent's delete handler
      handleDeleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-12" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold">
              Product Management
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => handleExport("products")}
                disabled={exportProductsMutation.isPending}
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                {exportProductsMutation.isPending ? "Exporting..." : "Export"}
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Price</TableHead>
                  <TableHead className="font-semibold">Stock</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsLoading ? (
                  [...Array(5)].map((_, i) => <LoadingSkeleton key={i} />)
                ) : productsData?.products?.length > 0 ? (
                  productsData.products.map((product: Product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={
                                product.images[0] ||
                                "/placeholder.svg?height=48&width=48"
                              }
                              alt={product.name}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              <Package className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="font-medium leading-none">
                              {product.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              SKU: {product.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {product.category?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(product.price).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            product.stockQuantity <= 10
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stockQuantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.stockQuantity > 0
                              ? "default"
                              : "destructive"
                          }
                          className={
                            product.stockQuantity > 0
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {product.stockQuantity > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditProduct(product)}
                            disabled={updateProductMutation.isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              handleDeleteProductConfirm(product.id)
                            }
                            disabled={deleteProductMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No products found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          categories={categories}
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          isLoading={
            editingProduct
              ? updateProductMutation.isPending
              : createProductMutation.isPending
          }
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default ProductsTab;
