import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignMember } from "@/hooks/useDeliveryOrg";
import { MapPin, DollarSign, Package, User } from "lucide-react";

interface AcceptedTabProps {
  org: any;
}

export const AcceptedTab = ({ org }: AcceptedTabProps) => {
  const assignMember = useAssignMember();

  // Filter assignments with status ASSIGNED (accepted but not yet assigned to a person)
  const acceptedAssignments = org.assignments?.filter(
    (assignment: any) => assignment.status === "ASSIGNED" && !assignment.deliveryUserId
  ) || [];

  const handleAssign = async (assignmentId: string, memberId: string) => {
    await assignMember.mutateAsync({ assignmentId, memberId });
  };

  if (acceptedAssignments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No accepted deliveries waiting for assignment.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {acceptedAssignments.map((assignment: any) => (
        <Card key={assignment.id}>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              {/* Left side - Order details */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">
                    Order #{assignment.order.orderNumber}
                  </h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Accepted
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {/* Delivery Address */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700">Delivery Address</p>
                      <p className="text-gray-600">{assignment.deliveryAddress}</p>
                    </div>
                  </div>

                  {/* Delivery Fee */}
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700">Delivery Fee</p>
                      <p className="text-gray-600">
                        ETB {Number(assignment.deliveryFee).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  {assignment.order.user && (
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">Customer</p>
                        <p className="text-gray-600">
                          {assignment.order.user.firstName} {assignment.order.user.lastName}
                        </p>
                        {assignment.order.user.phone && (
                          <p className="text-gray-500 text-xs">
                            {assignment.order.user.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Order Items Details */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-gray-700" />
                    <p className="font-medium text-gray-700">Order Items</p>
                  </div>
                  {assignment.order.orderItems && assignment.order.orderItems.length > 0 ? (
                    <div className="space-y-2">
                      {assignment.order.orderItems.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded-md"
                        >
                          {item.product?.mainImage && (
                            <img
                              src={item.product.mainImage}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {item.product?.name || "Unknown Product"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Quantity: {item.quantity} × ETB {Number(item.price).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-sm font-semibold text-gray-700">
                            ETB {Number(item.total).toFixed(2)}
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Total Items: <strong>{assignment.order.orderItems.length}</strong>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No items information available</p>
                  )}
                </div>

                {/* Special Instructions */}
                {assignment.instructions && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-900">
                      Special Instructions:
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {assignment.instructions}
                    </p>
                  </div>
                )}
              </div>

              {/* Right side - Assignment */}
              <div className="lg:w-80 flex flex-col justify-center">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Assign to Delivery Person
                  </label>
                  <Select
                    onValueChange={(value) => handleAssign(assignment.id, value)}
                    disabled={assignMember.isPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a team member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {org.members?.map((member: any) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <span>
                              {member.firstName} {member.lastName}
                            </span>
                            {member.email && (
                              <span className="text-xs text-gray-500">
                                ({member.email})
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {org.members?.length === 0 && (
                    <p className="text-xs text-amber-600">
                      No team members available. Invite delivery personnel first.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
