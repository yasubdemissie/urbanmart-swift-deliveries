import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Custom/Header";
import { useDeliveryOrg, useCreateOrganization } from "@/hooks/useDeliveryOrg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OverviewTab } from "@/components/DeliveryOrg/OverviewTab";
import { TeamTab } from "@/components/DeliveryOrg/TeamTab";
import { RequestsTab } from "@/components/DeliveryOrg/RequestsTab";
import { AssignmentsTab } from "@/components/DeliveryOrg/AssignmentsTab";
import { AcceptedTab } from "@/components/DeliveryOrg/AcceptedTab";

const DeliveryOrgDashboard = () => {
  const { data: org, isLoading, error } = useDeliveryOrg();

  console.log("Delivery organization:", org);
  const createOrg = useCreateOrganization();
  const [newOrgData, setNewOrgData] = useState({ name: "", description: "" });

  if (isLoading) return <div className="p-8 text-center">Loading organization data...</div>;

  // If no org, show Create Org form
  if (!org) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Create Delivery Organization</CardTitle>
              <CardDescription>
                Start your own delivery organization to hire drivers and manage fleets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createOrg.mutate(newOrgData);
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    value={newOrgData.name}
                    onChange={(e) => setNewOrgData({ ...newOrgData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newOrgData.description}
                    onChange={(e) => setNewOrgData({ ...newOrgData, description: e.target.value })}
                  />
                </div>
                <Button type="submit" disabled={createOrg.isPending} className="w-full">
                  {createOrg.isPending ? "Creating..." : "Create Organization"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{org.name}</h1>
            <p className="text-gray-600">{org.description}</p>
          </div>
          {org.isOwner && (
            <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Owner
            </div>
          )}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {org.isOwner && <TabsTrigger value="requests">Delivery Requests</TabsTrigger>}
            {org.isOwner && <TabsTrigger value="accepted">Accepted</TabsTrigger>}
            <TabsTrigger value="team">Team ({org?.members?.length})</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab org={org} />
          </TabsContent>
          <TabsContent value="requests">
             <RequestsTab />
          </TabsContent>
          <TabsContent value="accepted">
             <AcceptedTab org={org} />
          </TabsContent>
          <TabsContent value="team">
             <TeamTab org={org} />
          </TabsContent>
          <TabsContent value="assignments">
             <AssignmentsTab org={org} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeliveryOrgDashboard;
