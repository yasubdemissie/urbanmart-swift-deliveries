import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useDeliveryOrders,
  useUpdateDeliveryStatus,
} from "@/hooks/useDelivery";
import { useReviewDeliveryRequest } from "@/hooks/useDeliveryOrg";
import {
  MapPin,
  Phone,
  User,
  Package,
  DollarSign,
  TruckIcon,
} from "lucide-react";
import { toast } from "sonner";

interface AssignedDeliveriesTabProps {
  statusFilter?: string;
}

export const AssignedDeliveriesTab = ({
  statusFilter,
}: AssignedDeliveriesTabProps) => {
  const { data, isLoading } = useDeliveryOrders();
  const updateStatus = useUpdateDeliveryStatus();
  const reviewRequest = useReviewDeliveryRequest();

  if (isLoading) {
    return <div className="text-center py-8">Loading deliveries...</div>;
  }

  const deliveries = statusFilter
    ? data?.orders?.filter((d: any) => d.status === statusFilter)
    : data?.orders?.filter((d: any) => d.status !== "COMPLETED");

  if (!deliveries || deliveries.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          {statusFilter === "COMPLETED"
            ? "No completed deliveries yet."
            : "No assigned deliveries at the moment."}
        </CardContent>
      </Card>
    );
  }

  const handleStatusUpdate = async (
    assignmentId: string,
    newStatus: string
  ) => {
    try {
      await updateStatus.mutateAsync({
        assignmentId,
        status: newStatus,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleReviewRequest = async (
    id: string,
    status: "ASSIGNED" | "CANCELLED"
  ) => {
    try {
      await reviewRequest.mutateAsync({ id, status });
    } catch (error: any) {
      toast.error(error.message || "Failed to update request");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "bg-blue-100 text-blue-800";
      case "REQUESTED":
        return "bg-amber-100 text-amber-800";
      case "IN_TRANSIT":
        return "bg-purple-100 text-purple-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {deliveries.map((delivery: any) => (
        <Card key={delivery.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-500" />
                  <span className="font-bold text-lg">
                    Order #{delivery.order?.orderNumber || "N/A"}
                  </span>
                  <Badge className={getStatusBadgeColor(delivery.status)}>
                    {delivery.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      {delivery.order?.user?.firstName}{" "}
                      {delivery.order?.user?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{delivery.order?.user?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <MapPin className="h-4 w-4" />
                    <span>{delivery.deliveryAddress}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 justify-center min-w-[200px]">
                <div className="flex items-center justify-between text-sm font-medium mb-2">
                  <span className="text-gray-500">Delivery Fee:</span>
                  <div className="flex items-center gap-1 text-green-600 font-bold">
                    <DollarSign className="h-4 w-4" />
                    <span>{Number(delivery.deliveryFee).toFixed(2)}</span>
                  </div>
                </div>

                {delivery.status === "REQUESTED" && (
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    onClick={() => handleReviewRequest(delivery.id, "ASSIGNED")}
                    disabled={reviewRequest.isPending}
                  >
                    Accept Delivery Request
                  </Button>
                )}

                {delivery.status === "ASSIGNED" && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() =>
                      handleStatusUpdate(delivery.id, "IN_TRANSIT")
                    }
                    disabled={updateStatus.isPending}
                  >
                    <TruckIcon className="h-4 w-4 mr-2" />
                    Mark as Picked Up
                  </Button>
                )}

                {delivery.status === "IN_TRANSIT" && (
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleStatusUpdate(delivery.id, "COMPLETED")}
                    disabled={updateStatus.isPending}
                  >
                    Mark as Delivered
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
