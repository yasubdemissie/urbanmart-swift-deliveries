import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeliveryOrg, useSendHiringRequest } from "@/hooks/useDeliveryOrg";
import { Plus, Mail } from "lucide-react";

export const TeamTab = ({ org }: { org: DeliveryOrg }) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const sendInvite = useSendHiringRequest();

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    sendInvite.mutate(
      { email: inviteEmail, message: inviteMessage },
      {
        onSuccess: () => {
          setIsOpen(false);
          setInviteEmail("");
          setInviteMessage("");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Team Members</h2>
        {org.isOwner && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Delivery Person</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Input
                    id="message"
                    placeholder="Join our delivery team!"
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={sendInvite.isPending} className="w-full">
                  {sendInvite.isPending ? "Sending..." : "Send Invitation"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {org.members?.map((member: any) => (
          <Card key={member.id}>
            <CardContent className="p-6 flex items-center gap-4">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{member.firstName} {member.lastName}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
                 {member.phone && <p className="text-sm text-gray-500">{member.phone}</p>}
                {member.id === org.ownerId && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mt-1 inline-block">
                    Owner
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {org.isOwner && org.hiringRequests && org.hiringRequests?.length > 0 && (
         <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Pending Invitations</h3>
             <div className="space-y-2">
                 {org.hiringRequests?.map((req: any) => (
                     <div key={req.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                         <div>
                             <p className="font-medium">{req.receiver.firstName} {req.receiver.lastName}</p>
                             <p className="text-sm text-gray-500">{req.receiver.email}</p>
                         </div>
                         <div className="text-sm text-yellow-600 font-medium">Pending</div>
                     </div>
                 ))}
             </div>
         </div>
      )}
    </div>
  );
};
