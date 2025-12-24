import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDeliveryOrganizations, useRequestDelivery } from "@/hooks/useMerchant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeliveryRequestDialogProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DeliveryRequestDialog = ({
  orderId,
  isOpen,
  onClose,
}: DeliveryRequestDialogProps) => {
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [deliveryFee, setDeliveryFee] = useState<string>("50");
  const [instructions, setInstructions] = useState<string>("");

  const { data: organizations, isLoading: isLoadingOrgs, error: orgsError } = useDeliveryOrganizations();
  const requestDelivery = useRequestDelivery();

  const handleRequest = async () => {
    if (!selectedOrg) {
      toast.error("Please select a delivery organization");
      return;
    }

    try {
      await requestDelivery.mutateAsync({
        orderId,
        data: {
          organizationId: selectedOrg,
          deliveryFee: Number(deliveryFee),
          instructions,
        },
      });
      toast.success("Delivery requested successfully");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to request delivery");
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Delivery</DialogTitle>
          <DialogDescription>
            Choose a delivery organization to handle this order.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="organization">Delivery Organization</Label>
            {isLoadingOrgs ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading organizations...
              </div>
            ) : (
              <Select onValueChange={setSelectedOrg} value={selectedOrg}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations?.map((org: any) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fee">Delivery Fee (ETB)</Label>
            <Input
              id="fee"
              type="number"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              placeholder="Enter delivery fee"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any specific delivery instructions..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={requestDelivery.isPending}>
            Cancel
          </Button>
          <Button onClick={handleRequest} disabled={requestDelivery.isPending || !selectedOrg}>
            {requestDelivery.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
