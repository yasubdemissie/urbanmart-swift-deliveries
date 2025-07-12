import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  Package,
  CheckCircle,
} from "lucide-react";
import { Order } from "@/lib/api";
// import { Order } from "@/types/order";

interface OrdersStatsProps {
  orders: Order[];
}

const OrdersStats: React.FC<OrdersStatsProps> = ({ orders }) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;
  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "PAID"
  ).length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Average Order",
      value: `$${averageOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toLocaleString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Delivered",
      value: deliveredOrders.toLocaleString(),
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Paid Orders",
      value: paidOrders.toLocaleString(),
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OrdersStats;
