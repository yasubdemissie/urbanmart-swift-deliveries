import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeliveryRequests, useReviewDeliveryRequest } from "@/hooks/useDeliveryOrg";
import { Clock, MapPin, DollarSign, Package } from "lucide-react";

export const RequestsTab = () => {
  const { data: requests, isLoading } = useDeliveryRequests();
  const reviewRequest = useReviewDeliveryRequest();

  if (isLoading) return <div>Loading requests...</div>;

  if (!requests || requests?.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No pending delivery requests.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests?.map((request: any) => (
        <Card key={request.id}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    Order #{request.order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Merchant: {request.merchant.firstName} {request.merchant.lastName}
                  </p>
                  <div className="space-y-2 text-sm text-gray-700">
                     <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {request.order.shippingAddress.address1}, {request.order.shippingAddress.city}
                      </span>
                    </div>
                     <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Delivery Fee: ETB {Number(request.deliveryFee).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => reviewRequest.mutate({ id: request.id, status: "CANCELLED" })}
                    disabled={reviewRequest.isPending}
                  >
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => reviewRequest.mutate({ id: request.id, status: "ASSIGNED" })}
                    disabled={reviewRequest.isPending}
                  >
                    Accept & Add to Queue
                  </Button>
                </div>
              </div>

              {/* Order Items */}
              {request.order.orderItems && request.order.orderItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-gray-700" />
                    <p className="font-medium text-gray-700">Order Items ({request.order.orderItems.length})</p>
                  </div>
                  <div className="space-y-2">
                    {request.order.orderItems.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-md"
                      >
                        {item.product?.mainImage && (
                          <img
                            src={item.product.mainImage}
                            alt={item.product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.product?.name || "Unknown Product"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
