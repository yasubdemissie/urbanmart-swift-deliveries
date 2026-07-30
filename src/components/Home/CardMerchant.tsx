import { Link, useNavigate } from "react-router-dom";
import { Store, Star, Package, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserType } from "@/lib/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface MerchantCardProps {
  merchant: UserType;
  index: number;
}

export function MerchantCard({ merchant, index }: MerchantCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);

  const storeName = merchant.merchantStore?.name || `${merchant.firstName || 'Merchant'}'s Store`;
  const storeDesc = merchant.merchantStore?.description || "Quality products and fast, reliable delivery.";
  const logoUrl = merchant.merchantStore?.logo || merchant.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${merchant.id}`;
  const productCount = (merchant.merchantStore as any)?._count?.products ?? 0;
  const isVerified = merchant.merchantStore?.isVerified ?? true;

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    toast({
      title: !isFollowing ? `Following ${storeName}` : `Unfollowed ${storeName}`,
      description: !isFollowing ? "You will receive updates from this merchant." : undefined,
    });
  };

  return (
    <div className="group flex flex-col items-center gap-4 py-5 px-1 rounded-2xl bg-card border border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link
        to={`/merchant/${merchant.id}`}
        className="flex flex-col items-center gap-4 w-full"
      >
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-1 ring-4 ring-background shadow-md group-hover:ring-primary/30 transition-all duration-300 overflow-hidden">
            <img
              src={logoUrl}
              alt={storeName}
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${merchant.id}`;
              }}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Store className="h-4 w-4" />
          </div>
        </div>

        <div className="flex flex-col w-full px-5 gap-3 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 justify-center">
              <h3 className="text-lg font-bold text-foreground truncate max-w-[200px] group-hover:text-primary transition-colors">
                {storeName}
              </h3>
              {isVerified && (
                <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" title="Verified Merchant" />
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              by {merchant.firstName} {merchant.lastName}
            </p>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[32px]">
            {storeDesc}
          </p>

          <div className="flex items-center justify-between w-full pt-3 border-t border-border/40 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <Package className="w-3.5 h-3.5 text-primary" />
              <span>{productCount} Products</span>
            </span>
            <div className="flex items-center gap-1 font-semibold text-foreground bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded border border-amber-200/50">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>4.8</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-row items-center justify-between w-full px-5 gap-2.5 pt-1">
        <Button
          onClick={handleFollowToggle}
          className={`flex-1 text-xs gap-1.5 transition-all duration-300 ${
            isFollowing 
              ? "bg-muted text-muted-foreground hover:bg-muted/80" 
              : "hover:bg-primary/10 hover:text-primary"
          }`}
          variant={isFollowing ? "secondary" : "outline"}
          size="sm"
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
        <Button
          onClick={() => navigate(`/merchant/${merchant.id}`)}
          className="flex-1 text-xs gap-1.5 shadow-sm"
          variant="default"
          size="sm"
        >
          <Store className="h-3.5 w-3.5" />
          <span>View Store</span>
        </Button>
      </div>
    </div>
  );
}
