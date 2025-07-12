import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          text: "Pending",
        };
      case "CONFIRMED":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          text: "Confirmed",
        };
      case "SHIPPED":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          text: "Shipped",
        };
      case "DELIVERED":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          text: "Delivered",
        };
      case "CANCELLED":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          text: "Cancelled",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          text: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={cn(config.color, "font-medium", className)}
    >
      {config.text}
    </Badge>
  );
};

export default StatusBadge;
