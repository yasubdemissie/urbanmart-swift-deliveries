"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Eye, Edit, Download, List, Table as TableIcon } from "lucide-react";
import type { Order } from "@/lib/api";
import OrderCard from "../Order/OrderCard";
import OrderDetails from "../Order/orderDetails";

interface OrdersTabProps {
  ordersData:
    | {
        orders: Order[];
        total: number;
        page: number;
        totalPages: number;
      }
    | undefined;
  ordersLoading: boolean;
  handleUpdateOrderStatus: (orderId: string, status: string) => void;
  handleExport: (type: "orders" | "products" | "customers") => void;
  exportOrdersMutation: {
    isPending: boolean;
  };
}

const OrdersTab = ({
  ordersData,
  ordersLoading,
  handleUpdateOrderStatus,
  handleExport,
  exportOrdersMutation,
}: OrdersTabProps) => {
  const [viewMode, setViewMode] = useState<"table" | "list">("table");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "CONFIRMED":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-24 rounded" />
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  );

  const LoadingCardSkeleton = () => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handleViewDetails = (orderId: string) => {
    const order = ordersData?.orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
    }
  };

  const handleEditOrder = (orderId: string) => {
    // TODO: Implement edit order functionality
    console.log("Edit order:", orderId);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  // If an order is selected, show the order details
  if (selectedOrder) {
    return (
      <OrderDetails order={selectedOrder} onClose={handleCloseOrderDetails} />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold">
              Order Management
            </CardTitle>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-lg p-1 bg-muted">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8 px-3"
                >
                  <TableIcon className="h-4 w-4 mr-2" />
                  Table
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => handleExport("orders")}
                disabled={exportOrdersMutation.isPending}
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                {exportOrdersMutation.isPending ? "Exporting..." : "Export"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            // Table View
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Order ID</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersLoading ? (
                    [...Array(5)].map((_, i) => <LoadingSkeleton key={i} />)
                  ) : ordersData?.orders?.length > 0 ? (
                    ordersData.orders.map((order: Order) => (
                      <TableRow key={order.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono font-medium">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {order.user?.firstName} {order.user?.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.user?.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">
                          $
                          {(() => {
                            const total = Number(order.total);
                            return isNaN(total) ? "0.00" : total.toFixed(2);
                          })()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleUpdateOrderStatus(order.id, value)
                            }
                          >
                            <SelectTrigger
                              className={`w-32 border-0 ${getStatusColor(
                                order.status
                              )}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="CONFIRMED">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="PROCESSING">
                                Processing
                              </SelectItem>
                              <SelectItem value="SHIPPED">Shipped</SelectItem>
                              <SelectItem value="DELIVERED">
                                Delivered
                              </SelectItem>
                              <SelectItem value="CANCELLED">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewDetails(order.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <List className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            No orders found
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {ordersLoading ? (
                [...Array(5)].map((_, i) => <LoadingCardSkeleton key={i} />)
              ) : ordersData?.orders?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ordersData.orders.map((order: Order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onViewDetails={handleViewDetails}
                      onEditOrder={handleEditOrder}
                      onUpdateStatus={handleUpdateOrderStatus}
                      isAdmin={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersTab;
