import { Link } from "react-router-dom";
import { Package, MapPin, Users, ArrowUpRight, ShieldCheck, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface MerchantStore {
  id?: string | number;
  name?: string | null;
  description?: string | null;
  logo?: string | null;
  banner?: string | null;
  address?: string | null;
  isVerified?: boolean;
  _count?: {
    products?: number;
    orders?: number;
    customers?: number;
  };
}

export interface Merchant {
  id: string | number;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  location?: string | null;
  isActive?: boolean;
  merchantStore?: MerchantStore | null;
}

interface MerchantCardProps {
  merchant: Merchant;
  className?: string;
}

// Deterministic per-merchant banner treatment, richer than a flat tint so
// stores without a real banner still feel distinct from one another.
const BANNER_TREATMENTS = [
  "from-indigo-500/20 via-indigo-400/5 to-background",
  "from-emerald-500/20 via-emerald-400/5 to-background",
  "from-rose-500/20 via-rose-400/5 to-background",
  "from-amber-500/20 via-amber-400/5 to-background",
  "from-cyan-500/20 via-cyan-400/5 to-background",
];

function bannerFor(id: string | number) {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return BANNER_TREATMENTS[hash % BANNER_TREATMENTS.length];
}

export function MerchantCard({ merchant, className }: MerchantCardProps) {
  const store = merchant.merchantStore;
  const storeName = store?.name || `${merchant.firstName || "Merchant"}'s Store`;
  const storeDesc = store?.description || "Quality products with fast, reliable delivery.";
  const logoUrl = store?.logo || merchant.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${merchant.id}`;
  const productCount = store?._count?.products ?? 0;
  const orderCount = store?._count?.orders ?? 0;
  const customerCount = store?._count?.customers ?? 0;
  const isVerified = store?.isVerified ?? false;
  const storeLocation = store?.address || merchant.location || "Location on request";
  const storeBanner = store?.banner;
  const isActive = merchant.isActive ?? true;
  const initials = `${merchant.firstName?.[0] ?? "M"}${merchant.lastName?.[0] ?? "S"}`.toUpperCase();

  return (
    <Link to={`/merchant/${merchant.id}`} className="block">
      <Card
        className={cn(
          "group relative overflow-hidden border border-border/60 bg-card p-0 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg",
          !isActive && "opacity-80 grayscale-[0.4]",
          className,
        )}
      >
        {/* Banner */}
        <div className="relative h-16 w-full overflow-hidden">
          {storeBanner ? (
            <img
              src={storeBanner}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div
              className={cn("absolute inset-0 bg-gradient-to-br", bannerFor(merchant.id))}
              aria-hidden="true"
            />
          )}

          {!isActive && (
            <Badge
              variant="secondary"
              className="absolute right-2.5 top-2.5 text-[10px] font-medium uppercase tracking-wider shadow-sm"
            >
              Closed
            </Badge>
          )}
        </div>

        {/* Body */}
        <CardContent className="relative px-4 pb-4 pt-0">
          {/* Avatar overlaps banner */}
          <div className="relative -mt-7 mb-2 flex items-end justify-between">
            <Avatar className="h-14 w-14 rounded-xl border-[3px] border-card bg-background shadow-md">
              <AvatarImage src={logoUrl} alt={storeName} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-muted text-sm font-semibold text-muted-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            {isVerified && (
              <Badge className="gap-1 border-0 bg-primary/10 text-[11px] text-primary shadow-none hover:bg-primary/10">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          {/* Identity */}
          <h3 className="line-clamp-1 text-base font-semibold leading-tight tracking-tight text-foreground">
            {storeName}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            by {merchant.firstName} {merchant.lastName}
          </p>

          <p className="mt-2 line-clamp-1 text-sm leading-relaxed text-muted-foreground">
            {storeDesc}
          </p>

          {/* Stats */}
          <div className="mt-3 grid grid-cols-3 gap-2 border-y border-border/60 py-2">
            <Stat icon={Package} value={productCount} label="Products" />
            <Stat icon={Users} value={customerCount} label="Customers" />
            <Stat icon={ShoppingBag} value={orderCount} label="Orders" />
          </div>

          {/* Location + CTA */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{storeLocation}</span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              tabIndex={-1}
              className="h-7 shrink-0 gap-1 rounded-full px-2.5 text-xs font-medium text-foreground pointer-events-none group-hover:bg-primary group-hover:text-primary-foreground"
            >
              Visit store
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-muted/60">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
      <span className="text-[9px] uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}