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

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onEditOrder?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, status: string) => void;
  isAdmin?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onEditOrder,
  onUpdateStatus,
  isAdmin = false,
}) => {
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

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">
                Order #{order.id.slice(-8)}
              </h3>
              <StatusBadge status={order.status} />
            </div>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails?.(order.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditOrder?.(order.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
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
        {order.items && order.items.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-1">
              {order.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="truncate">
                    {item.product?.name || "Unknown Product"}
                  </span>
                  <span className="text-muted-foreground">
                    {item.quantity}x ${Number(item.price || 0).toFixed(2)}
                  </span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{order.items.length - 2} more item
                  {order.items.length - 2 > 1 ? "s" : ""}
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
