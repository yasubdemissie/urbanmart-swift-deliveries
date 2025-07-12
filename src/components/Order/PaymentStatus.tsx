import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PaymentStatusBadgeProps {
  status: "PENDING" | "PAID" | "FAILED";
  className?: string;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  className,
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: "bg-orange-100 text-orange-800 border-orange-200",
          text: "Payment Pending",
        };
      case "PAID":
        return {
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          text: "Paid",
        };
      case "FAILED":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          text: "Payment Failed",
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
      className={cn(config.color, "font-medium text-xs", className)}
    >
      {config.text}
    </Badge>
  );
};

export default PaymentStatusBadge;
