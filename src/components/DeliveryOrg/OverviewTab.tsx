import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Clock, TrendingUp } from "lucide-react";
import { DeliveryOrg } from "@/hooks/useDeliveryOrg";

export const OverviewTab = ({ org }: { org: DeliveryOrg }) => {
  const activeAssignments = org.assignments?.filter(
    (a: any) => a.status === "ASSIGNED" || a.status === "IN_TRANSIT"
  ).length;

  const completedAssignments = org.assignments?.filter(
      (a: any) => a.status === "COMPLETED"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{org?.members?.length}</div>
          <p className="text-xs text-muted-foreground">Active delivery staff</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAssignments}</div>
          <p className="text-xs text-muted-foreground">Currently in progress</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedAssignments}</div>
          <p className="text-xs text-muted-foreground">Total deliveries completed</p>
        </CardContent>
      </Card>
    </div>
  );
};
