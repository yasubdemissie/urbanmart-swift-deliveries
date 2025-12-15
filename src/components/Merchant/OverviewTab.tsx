import { useState, useEffect } from "react";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Activity,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  apiClient,
  MerchantDashboard as MerchantDashboardType,
} from "@/lib/api";
import { useNavigate } from "react-router-dom";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend?: string;
  gradient: string;
}) => (
  <Card className="group relative overflow-hidden animate-fade-in">
    <div
      className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
    />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        {trend && (
          <div className="flex items-center text-xs text-success">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            {trend}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export const OverviewTab = () => {
  const [dashboardData, setDashboardData] =
    useState<MerchantDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await apiClient.getMerchantDashboard();
        if (data.success && data.data) {
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Store Setup Required
        </h3>
        <p className="text-gray-600">
          Please set up your merchant store to access the dashboard.
        </p>
      </div>
    );
  }

  const { store, stats, recentOrders, lowStockProducts } = dashboardData;

  const getStatusVariant = (status: string) =>
    ({
      DELIVERED: "bg-green-500/10 text-green-500",
      SHIPPED: "bg-blue-500/10 text-blue-500",
      PENDING: "bg-yellow-500/10 text-yellow-500",
      CANCELLED: "bg-red-500/10 text-red-500",
      CONFIRMED: "bg-purple-500/10 text-purple-500",
    }[status] || "bg-gray-500/10 text-gray-500");

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-300/20 hover:bg-slate-300/30 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl mt-2 font-semibold md:font-bold">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card className="bg-green-300/5 hover:bg-green-300/10 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm md:text-2xl mt-2 font-semibold md:font-bold">
              ETB {Number(stats.totalRevenue).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-300/5 hover:bg-blue-300/10 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm md:text-2xl mt-2 font-semibold md:font-bold">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card className="bg-red-300/5 hover:bg-red-300/10 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm md:text-2xl mt-2 font-semibold md:font-bold text-orange-600">
              {stats.lowStockCount}
            </div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="bg-slate-200/10 hover:bg-slate-200/20 transition-colors duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Recent Orders</CardTitle>
            <div className="p-2 rounded-full bg-blue-300/10">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <div
                  onClick={() =>
                    navigate(`/merchant-dashboard/orders/${order.id}`)
                  }
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-300/20 hover:bg-slate-300/30 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-purple-500/10">
                      <Activity className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        #{order.orderNumber.toString().padStart(6, "0")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.user?.firstName} {order.user?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      ETB {Number(order.total).toFixed(2)}
                    </p>
                    <Badge
                      className={`text-xs ${getStatusVariant(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() =>
                (window.location.href = "/merchant-dashboard/orders")
              }
            >
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card className="bg-slate-200/10 hover:bg-slate-200/20 transition-colors duration-200">
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Current: {product.stockQuantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">Low Stock</Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() =>
                (window.location.href = "/merchant-dashboard/products")
              }
            >
              Manage Products
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
