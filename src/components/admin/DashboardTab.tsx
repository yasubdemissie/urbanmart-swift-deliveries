import { DollarSign, Package, Users, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const dashboardStats = [
    {
      title: "Total Sales",
      value: stats ? `$${stats.totalSales.toLocaleString("en-US")}` : "$0",
      change: "+12%",
      icon: DollarSign,
    },
    {
      title: "Products",
      value: stats ? stats.totalProducts.toLocaleString("en-US") : "0",
      change: "+5%",
      icon: Package,
    },
    {
      title: "Customers",
      value: stats ? stats.totalCustomers.toLocaleString("en-US") : "0",
      change: "+8%",
      icon: Users,
    },
    {
      title: "Orders",
      value: stats ? stats.totalOrders.toLocaleString("en-US") : "0",
      change: "+15%",
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600">
                    {stat.change} from last month
                  </p>
                </div>
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
          ) : stats?.recentOrders?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {order.customerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total}</p>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "PROCESSING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">No recent orders</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
