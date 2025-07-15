import { DollarSign, Package, Users, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface DashboardTabProps {
  stats:
    | {
        totalSales: number;
        totalOrders: number;
        totalCustomers: number;
        totalProducts: number;
        recentOrders: Array<{
          id: string;
          total: number;
          status: string;
          customerName?: string;
        }>;
      }
    | undefined;
  statsLoading: boolean;
}

const DashboardTab = ({ stats, statsLoading }: DashboardTabProps) => {
  const navigate = useNavigate();
  const dashboardStats = [
    {
      title: "Total Sales",
      value: stats ? `$${stats.totalSales.toLocaleString("en-US")}` : "$0",
      change: "+12%",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      onClick: undefined,
    },
    {
      title: "Products",
      value: stats ? stats.totalProducts.toLocaleString("en-US") : "0",
      change: "+5%",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      onClick: undefined,
    },
    {
      title: "Customers",
      value: stats ? stats.totalCustomers.toLocaleString("en-US") : "0",
      change: "+8%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      onClick: undefined,
    },
    {
      title: "Orders",
      value: stats ? stats.totalOrders.toLocaleString("en-US") : "0",
      change: "+15%",
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      onClick: () => navigate("/admin?tab=orders"),
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "default";
      case "SHIPPED":
        return "secondary";
      case "PROCESSING":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "PROCESSING":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card
            key={index}
            className={`border-0 shadow-sm hover:shadow-md transition-shadow ${
              stat.onClick ? "cursor-pointer" : ""
            }`}
            onClick={stat.onClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="space-y-1">
                    {statsLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <p className="text-3xl font-bold tracking-tight">
                        {stat.value}
                      </p>
                    )}
                    <p className="text-sm text-emerald-600 font-medium">
                      {stat.change} from last month
                    </p>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : +stats?.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">#{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerName || "Unknown Customer"}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-semibold">
                      $
                      {(() => {
                        const total = Number(order.total);
                        return isNaN(total) ? "0.00" : total.toFixed(2);
                      })()}
                    </p>
                    <Badge
                      variant={getStatusVariant(order.status)}
                      className={getStatusColor(order.status)}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent orders</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
