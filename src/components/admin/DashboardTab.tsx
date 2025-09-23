import {
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  FileText,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { AdminDashboard } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface DashboardTabProps {
  stats: AdminDashboard | undefined;
  statsLoading: boolean;
}

const DashboardTab = ({ stats, statsLoading }: DashboardTabProps) => {
  const navigate = useNavigate();

  const dashboardStats = [
    {
      title: "Total Revenue",
      value: stats
        ? `$${stats.stats?.totalRevenue.toLocaleString("en-US")}`
        : "$0",
      change: "+12%",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      onClick: () => navigate("/admin/transactions"),
    },
    {
      title: "Total Orders",
      value: stats ? stats.stats?.totalOrders.toLocaleString("en-US") : "0",
      change: "+5%",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      onClick: () => navigate("/admin/orders"),
    },
    {
      title: "Total Users",
      value: stats
        ? Object.values(stats.stats?.users || {})
            .reduce((a, b) => a + b, 0)
            .toLocaleString("en-US")
        : "0",
      change: "+8%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Total Products",
      value: stats ? stats.stats?.totalProducts.toLocaleString("en-US") : "0",
      change: "+3%",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      onClick: () => navigate("/admin/products"),
    },
  ];

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${stat.bgColor}`}
            onClick={stat.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-emerald-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentReports?.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{report.title}</p>
                    <p className="text-xs text-gray-600">
                      {report.reporter?.firstName} {report.reporter?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        report.status === "RESOLVED"
                          ? "default"
                          : report.status === "IN_PROGRESS"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {report.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/admin/reports")}
            >
              View All Reports
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentTransactions?.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {transaction.merchant?.firstName}{" "}
                      {transaction.merchant?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        transaction.status === "COMPLETED"
                          ? "default"
                          : transaction.status === "PENDING"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {transaction.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/admin/transactions")}
            >
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardTab;
