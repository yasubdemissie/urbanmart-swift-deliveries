import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DeliveryOrg, useAssignMember } from "@/hooks/useDeliveryOrg";
import { MapPin, User } from "lucide-react";

export const AssignmentsTab = ({ org }: { org: DeliveryOrg }) => {
  const assignMember = useAssignMember();

  const handleAssign = (assignmentId: string, memberId: string) => {
    assignMember.mutate({ assignmentId, memberId });
  };

  if (!org.assignments || org.assignments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No assignments found.
        </CardContent>
      </Card>
    );
  }

  // Filter assignments that have been assigned to a delivery person
  const assignedDeliveries =
    org.assignments?.filter(
      (assignment: any) => assignment.deliveryUserId !== null
    ) || [];

  if (assignedDeliveries.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No deliveries have been assigned to team members yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {assignedDeliveries.map((assignment: any) => (
        <Card key={assignment.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">
                    Order #{assignment.order.orderNumber}
                  </h3>
                  <Badge
                    variant={
                      assignment.status === "COMPLETED"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {assignment.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Assigned to:{" "}
                    <strong>
                      {assignment.deliveryUser.firstName}{" "}
                      {assignment.deliveryUser.lastName}
                    </strong>
                  </p>
                  <p>Delivery Address: {assignment.deliveryAddress}</p>
                  <p>Fee: ETB {Number(assignment.deliveryFee).toFixed(2)}</p>
                </div>
              </div>

              {org.isOwner &&
                assignment.status !== "COMPLETED" &&
                assignment.status !== "IN_TRANSIT" && (
                  <div className="w-full md:w-64">
                    <Select
                      defaultValue={assignment.deliveryUserId}
                      onValueChange={(value) =>
                        handleAssign(assignment.id, value)
                      }
                      disabled={assignMember.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Re-assign to..." />
                      </SelectTrigger>
                      <SelectContent>
                        {org.members.map((member: any) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.firstName} {member.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
