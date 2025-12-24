import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  MapPin,
  Clock,
  Phone,
  User,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import {
  useDeliveryOrders,
  useUpdateDeliveryStatus,
  useDeliveryPayments,
} from "@/hooks/useDelivery";
import { toast } from "sonner";
import Header from "@/components/Custom/Header";

const DeliveryDashboardPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const updateStatusMutation = useUpdateDeliveryStatus();

  const { data: ordersData, isLoading: ordersLoading } = useDeliveryOrders({
    page: 1,
    limit: 20,
    status: selectedStatus === "all" ? undefined : selectedStatus,
  });

  const { data: paymentsData, isLoading: paymentsLoading } =
    useDeliveryPayments({
      page: 1,
      limit: 10,
    });

  const handleStatusUpdate = async (
    assignmentId: string,
    newStatus: string
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        assignmentId,
        status: newStatus,
      });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "bg-blue-100 text-blue-800";
      case "IN_TRANSIT":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const orders = ordersData?.orders || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Delivery Dashboard
          </h1> */}
          <p className="text-gray-600">
            Manage your delivery assignments and track payments
          </p>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-blue-600"
            >
              Delivery Orders
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="data-[state=active]:bg-blue-600"
            >
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Assignments</h2>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ASSIGNED">Assigned</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No assignments yet
                  </h3>
                  <p className="text-gray-600">
                    You don't have any delivery assignments at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((assignment) => (
                  <Card key={assignment.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            Order #{assignment.order.orderNumber}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Assigned {formatDate(assignment.assignedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status.replace("_", " ")}
                          </Badge>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${assignment.deliveryFee.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {assignment.paymentType === "PER_DELIVERY"
                                ? "Per Delivery"
                                : "Salary"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Customer info */}
                      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">
                            {assignment.order.user.firstName}{" "}
                            {assignment.order.user.lastName}
                          </p>
                          {assignment.order.user.phone && (
                            <p className="text-sm text-gray-600">
                              <Phone className="h-3 w-3 inline mr-1" />
                              {assignment.order.user.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delivery address */}
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Delivery Address</p>
                          <p className="text-sm text-gray-600">
                            {assignment.deliveryAddress}
                          </p>
                          <p className="text-sm text-gray-500">
                            {assignment.order.shippingAddress.city},{" "}
                            {assignment.order.shippingAddress.state}{" "}
                            {assignment.order.shippingAddress.postalCode}
                          </p>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">
                          Items to deliver:
                        </h4>
                        {assignment.order.orderItems
                          .slice(0, 2)
                          .map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm bg-gray-50 p-2 rounded"
                            >
                              <span>{item.product.name}</span>
                              <span className="text-gray-600">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          ))}
                        {assignment.order.orderItems.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{assignment.order.orderItems.length - 2} more items
                          </p>
                        )}
                      </div>

                      {/* Instructions */}
                      {assignment.instructions && (
                        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                          <p className="text-sm">
                            <strong>Special Instructions:</strong>{" "}
                            {assignment.instructions}
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-4 border-t">
                        {assignment.status === "ASSIGNED" && (
                          <Button
                            onClick={() =>
                              handleStatusUpdate(assignment.id, "IN_TRANSIT")
                            }
                            disabled={updateStatusMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Mark as Picked Up
                          </Button>
                        )}
                        {assignment.status === "IN_TRANSIT" && (
                          <Button
                            onClick={() =>
                              handleStatusUpdate(assignment.id, "COMPLETED")
                            }
                            disabled={updateStatusMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Payment History</h2>

              {paymentsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : paymentsData?.payments.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No payments yet
                    </h3>
                    <p className="text-gray-600">
                      Payments will appear here once you complete deliveries.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {paymentsData?.payments.map((payment) => (
                    <Card key={payment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">
                              Order #{payment.assignment?.order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Payment for {payment.merchant.firstName}{" "}
                              {payment.merchant.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(payment.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ${payment.amount.toFixed(2)}
                            </p>
                            <Badge
                              variant={
                                payment.status === "PAID"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {payment.status}
                            </Badge>
                            {payment.paymentType === "PER_DELIVERY" && (
                              <div className="text-xs text-gray-500 mt-1">
                                Per Delivery (${payment.baseAmount?.toFixed(2)}{" "}
                                base
                                {payment.distanceBonus && (
                                  <span>
                                    {" "}
                                    + ${payment.distanceBonus.toFixed(2)}{" "}
                                    distance
                                  </span>
                                )}
                                {payment.weightBonus && (
                                  <span>
                                    {" "}
                                    + ${payment.weightBonus.toFixed(2)} weight
                                  </span>
                                )}
                                )
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeliveryDashboardPage;
