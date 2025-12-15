import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  MapPin,
  Calendar,
  Eye,
  MoreHorizontal,
  User,
  CreditCard,
  Edit,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import PaymentStatusBadge from "./PaymentStatus";
import { Order } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateMerchantOrderStatus } from "@/hooks/useMerchant";
import { useToast } from "@/hooks/use-toast";

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onEditOrder?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, status: string) => void;
  isAdmin?: boolean;
  isMerchant?: boolean;
}

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

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onEditOrder,
  onUpdateStatus,
  isAdmin = false,
  isMerchant = true,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const updateStatusMutation = useUpdateMerchantOrderStatus();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const formatTotal = (total: number | string | null | undefined) => {
    const numTotal = Number(total);
    return isNaN(numTotal) ? "0.00" : numTotal.toFixed(2);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (isMerchant) {
      try {
        await updateStatusMutation.mutateAsync({
          orderId: order.id,
          status: newStatus,
        });
        toast({
          title: "Status Updated",
          description: `Order status updated to ${newStatus}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive",
        });
      }
    } else {
      onUpdateStatus?.(order.id, newStatus);
    }
  };

  console.log("orders in the Component: ", order);
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2 w-full mx-1">
            <div className="flex items-center justify-between gap-2">
              <PaymentStatusBadge
                status={order.paymentStatus as "PENDING" | "PAID" | "FAILED"}
              />
              {isMerchant && (
                <Select
                  value={order.status}
                  onValueChange={handleStatusUpdate}
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger
                    className={`h-6 w-24 border-0 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/merchant-dashboard/orders/${order.id}`)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Customer Info */}
        {order.user && (
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={order.user.avatar} />
              <AvatarFallback>
                {getInitials(order.user.firstName, order.user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">
                {order.user.firstName} {order.user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.user.email}
              </p>
            </div>
          </div>
        )}

        {/* Order Items */}
        {order.orderItems && order.orderItems.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>
                {order.orderItems.length} item
                {order.orderItems.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-1">
              {order.orderItems.slice(0, 2).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="truncate">
                    {item.product?.name || "Unknown Product"}
                  </span>
                  <span className="text-muted-foreground">
                    {item.quantity}x ${Number(item.price || 0).toFixed(2)}
                  </span>
                </div>
              ))}
              {order.orderItems.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{order.orderItems.length - 2} more item
                  {order.orderItems.length - 2 > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>No items</span>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Shipping Address</span>
            </div>
            <div className="text-sm bg-gray-50 p-3 rounded-lg">
              <p>{order.shippingAddress.address1}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">${formatTotal(order.total)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
