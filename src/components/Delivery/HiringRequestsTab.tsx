import React, { useState } from "react";
import {
  useAllOrganizations,
  useApplyToOrganization,
  useHiringRequests,
  useRespondToHiringRequest,
  HiringRequest,
} from "@/hooks/useDeliveryOrg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Check, X, Building2, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export const HiringRequestsTab = () => {
  const { data: orgs, isLoading: orgsLoading } = useAllOrganizations();
  const { data: requests, isLoading: requestsLoading } = useHiringRequests();
  const applyMutation = useApplyToOrganization();
  const respondMutation = useRespondToHiringRequest();

  const [applyMessage, setApplyMessage] = useState<Record<string, string>>({});

  const handleApply = (orgId: string) => {
    applyMutation.mutate(
      { organizationId: orgId, message: applyMessage[orgId] || "" },
      {
        onSuccess: () => {
          setApplyMessage((prev) => ({ ...prev, [orgId]: "" }));
        },
      }
    );
  };

  const handleRespond = (id: string, status: "ACCEPTED" | "REJECTED") => {
    respondMutation.mutate({ id, status });
  };

  if (orgsLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const pendingInvitations =
    requests?.filter(
      (r) => r.status === "PENDING" && r.type === "INVITATION"
    ) || [];
  const myApplications =
    requests?.filter((r) => r.type === "APPLICATION") || [];

  return (
    <div className="space-y-8">
      {/* Received Invitations */}
      {pendingInvitations.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Received Invitations
          </h3>
          <div className="grid gap-4">
            {pendingInvitations.map((req) => (
              <Card key={req.id}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={req.organization.logo || ""} />
                      <AvatarFallback>
                        <Building2 />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {req.organization.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Invited by {req.organization.owner.firstName}{" "}
                        {req.organization.owner.lastName}
                      </p>
                      {req.message && (
                        <p className="text-sm mt-1 italic text-gray-600">
                          "{req.message}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleRespond(req.id, "ACCEPTED")}
                      disabled={respondMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRespond(req.id, "REJECTED")}
                      disabled={respondMutation.isPending}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* My Applications */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Send className="h-5 w-5 text-purple-600" />
          My Applications
        </h3>
        {myApplications.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="p-8 text-center text-gray-500">
              You haven't applied to any organizations yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {myApplications.map((req) => (
              <Card key={req.id}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={req.organization.logo || ""} />
                      <AvatarFallback>
                        <Building2 />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {req.organization.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Sent on {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      req.status === "PENDING"
                        ? "secondary"
                        : req.status === "ACCEPTED"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {req.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Available Organizations to Join */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-gray-600" />
          Join an Organization
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orgs?.map((org: any) => {
            const hasApplied = myApplications.some(
              (a) => a.organizationId === org.id && a.status === "PENDING"
            );
            const isMember = false; // Need to check if user is already a member of ANY org

            return (
              <Card
                key={org.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardHeader className="bg-gray-50/50 pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                      <AvatarImage src={org.logo || ""} />
                      <AvatarFallback>
                        <Building2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{org.name}</CardTitle>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {org.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Write a short message..."
                      value={applyMessage[org.id] || ""}
                      onChange={(e) =>
                        setApplyMessage((prev) => ({
                          ...prev,
                          [org.id]: e.target.value,
                        }))
                      }
                      className="text-sm h-9"
                      disabled={hasApplied}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleApply(org.id)}
                      disabled={hasApplied || applyMutation.isPending}
                      className="h-9 whitespace-nowrap"
                    >
                      {hasApplied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};
