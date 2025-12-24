import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header, { profileImages } from "@/components/Custom/Header";
import { useDeliveryOrders, useDeliveryStats } from "@/hooks/useDelivery";
import {
  Package,
  TruckIcon,
  CheckCircle,
  Clock,
  ArrowLeftIcon,
} from "lucide-react";
import { AssignedDeliveriesTab } from "@/components/Delivery/AssignedDeliveriesTab";
import { HiringRequestsTab } from "@/components/Delivery/HiringRequestsTab";
import { useDeliveryOrg } from "@/hooks/useDeliveryOrg";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { Image } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const DeliveryDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDeliveryStats();
  const { user, isAuthenticated, isLoading } = useIsAuthenticated();
  const { data: org, isLoading: orgLoading } = useDeliveryOrg();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm sticky top-0 z-10">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-600">
              Welcome back, {user?.firstName}
            </p>
          </div>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Avatar>
              <AvatarImage
                src={
                  user?.avatar ||
                  profileImages[
                    Math.floor(Math.random() * profileImages.length)
                  ]
                }
                alt="Profile"
              />
              <AvatarFallback>
                {user?.firstName.charAt(0).toUpperCase() +
                  user?.lastName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Delivery Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your delivery assignments
            </p>
          </div>

          {org && !orgLoading && (
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border shadow-sm self-start md:self-auto">
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                <AvatarImage src={org.logo || ""} />
                <AvatarFallback className="bg-primary/5 text-primary">
                  <Building2 className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900 leading-none">
                    {org.name}
                  </p>
                  {org.isOwner && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-4 px-1 bg-blue-50 text-blue-700 border-blue-100 uppercase tracking-wider"
                    >
                      Owner
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <TruckIcon className="h-3 w-3" />
                  Delivery Partner
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Deliveries
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {statsLoading ? "..." : stats?.total || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {statsLoading ? "..." : stats?.pending || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    In Transit
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {statsLoading ? "..." : stats?.inTransit || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TruckIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {statsLoading ? "..." : stats?.completed || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="assigned" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="assigned">Assigned Deliveries</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="hiring">Hiring Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="assigned">
            <AssignedDeliveriesTab />
          </TabsContent>

          <TabsContent value="completed">
            <AssignedDeliveriesTab statusFilter="COMPLETED" />
          </TabsContent>

          <TabsContent value="hiring">
            <HiringRequestsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
