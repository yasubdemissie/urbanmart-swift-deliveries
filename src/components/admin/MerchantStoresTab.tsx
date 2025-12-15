import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, CheckCircle, XCircle, MapPin, Phone, Mail } from "lucide-react";
import {
  useAdminMerchantStores,
  useVerifyMerchantStore,
} from "@/hooks/useAdmin";
import { MerchantStore } from "@/lib/api";

const MerchantStoresTab = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isVerified, setIsVerified] = useState<string>("all");

  const { data: storesData, isLoading } = useAdminMerchantStores({
    page,
    limit: 10,
    search: search || undefined,
    isVerified: isVerified === "all" ? undefined : isVerified === "true",
  });

  const verifyStoreMutation = useVerifyMerchantStore();

  const handleVerifyStore = (storeId: string, verified: boolean) => {
    verifyStoreMutation.mutate({
      storeId,
      isVerified: verified,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select value={isVerified} onValueChange={setIsVerified}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            <SelectItem value="true">Verified</SelectItem>
            <SelectItem value="false">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {storesData?.stores?.map((store) => (
          <Card key={store.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge variant={store.isVerified ? "default" : "secondary"}>
                    {store.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{store.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Owner</p>
                  <p className="font-medium">
                    {store.merchant?.firstName} {store.merchant?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-sm">
                    {new Date(store.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {!store.isVerified ? (
                  <Button
                    size="sm"
                    onClick={() => handleVerifyStore(store.id, true)}
                    disabled={verifyStoreMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Store
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVerifyStore(store.id, false)}
                    disabled={verifyStoreMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Unverify Store
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {storesData?.pagination && (
        <div className="flex justify-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {page} of {storesData.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === storesData.pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantStoresTab;
