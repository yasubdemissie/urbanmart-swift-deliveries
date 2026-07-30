import { useQuery } from "@tanstack/react-query";
import { apiClient, User } from "@/lib/api";
import { ArrowRight, Store } from "lucide-react";
import { Button } from "../ui/button";
import { MerchantListSkeleton } from "./loadingSkeleton";
import { MerchantCard } from "./CardMerchant";
import { useNavigate } from "react-router-dom";

interface MerchantListProps {
  isHomePage?: boolean;
  limit?: number;
  searchQuery?: string;
}

export default function MerchantList({
  isHomePage = false,
  limit,
  searchQuery = "",
}: MerchantListProps) {
  const navigate = useNavigate();

  const {
    data: merchants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["merchants", searchQuery],
    queryFn: async () => {
      const response = await apiClient.getMerchants(searchQuery);
      return response;
    },
  });

  if (isLoading) return <MerchantListSkeleton count={limit || 6} />;

  if (error)
    return (
      <div className="text-destructive bg-destructive/10 mt-3 mx-6 rounded-xl p-6 border border-destructive/10 w-full">
        <p className="font-medium">Something went wrong: {(error as Error).message}</p>
      </div>
    );

  if (!merchants || merchants.length === 0)
    return (
      <div className="text-center text-muted-foreground py-12 w-full">
        <Store className="h-16 w-16 mx-auto mb-4 opacity-50 text-primary" />
        <p className="text-xl font-semibold text-foreground mb-1">No merchants found</p>
        <p className="text-sm text-muted-foreground">
          {searchQuery ? `No merchants match "${searchQuery}"` : "Check back later for new stores!"}
        </p>
      </div>
    );

  const displayedMerchants = limit ? merchants.slice(0, limit) : merchants;

  return (
    <div className="w-full">
      {isHomePage && (
        <div className="flex flex-row items-center justify-between py-6 px-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Top Merchants</h2>
            <p className="text-sm text-muted-foreground">Discover verified stores and local sellers</p>
          </div>
          <Button
            variant="outline"
            className="rounded-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300"
            onClick={() => navigate("/merchants")}
          >
            View All Merchants <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedMerchants.map((merchant: User, index: number) => (
          <MerchantCard key={merchant.id} merchant={merchant} index={index} />
        ))}
      </div>
    </div>
  );
}
