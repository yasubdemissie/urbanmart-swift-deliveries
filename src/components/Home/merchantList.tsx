import { useQuery } from "@tanstack/react-query";
import { apiClient, User } from "@/lib/api";
import { ArrowRight, Store } from "lucide-react";
import { Button } from "../ui/button";
import { MerchantListSkeleton } from "./loadingSkeleton";
import { MerchantCard } from "./CardMerchant";

export default function MerchantList() {
  const {
    data: merchants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["merchants"],
    queryFn: async () => {
      const response = await apiClient.getMerchants();
      return response;
    },
  });

  if (isLoading) return <MerchantListSkeleton count={5} />;

  if (error)
    return (
      <div className="text-destructive bg-destructive/10 mt-3 mx-6 rounded-xl p-6 border border-destructive/10">
        <p className="font-medium">Something went wrong: {error.message}</p>
      </div>
    );

  if (merchants?.length === 0)
    return (
      <div className="text-center text-muted-foreground py-12">
        <Store className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">No merchants found</p>
      </div>
    );

  return (
    <>
      <div className="flex flex-row items-center justify-between p-6">
        <h1 className="text-2xl font-bold">Merchants</h1>
        <Button variant="outline" className="rounded-full">
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {merchants?.slice(0, 5).map((merchant: User, index: number) => (
          <MerchantCard key={merchant.id} merchant={merchant} index={index} />
        ))}
      </div>
    </>
  );
}
