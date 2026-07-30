import { Link } from "react-router-dom";
import {
  Store,
  Package,
  CheckCircle2,
  MapPin,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserType } from "@/lib/api";

interface MerchantCardProps {
  merchant: UserType;
  index: number;
}

export function MerchantCard({ merchant, index }: MerchantCardProps) {
  const storeName =
    merchant.merchantStore?.name ||
    `${merchant.firstName || "Merchant"}'s Store`;
  const storeDesc =
    merchant.merchantStore?.description ||
    "Quality products and fast, reliable delivery.";
  const logoUrl =
    merchant.merchantStore?.logo ||
    merchant.avatar ||
    `https://api.dicebear.com/7.x/shapes/svg?seed=${merchant.id}`;
  const productCount = merchant.merchantStore?._count?.products ?? 0;
  const orderCount = merchant.merchantStore?._count?.orders ?? 0;
  const customerCount = merchant.merchantStore?._count?.customers ?? 0;
  const isVerified = merchant.merchantStore?.isVerified ?? false;
  const storeLocation =
    merchant.merchantStore?.address ||
    merchant.location ||
    "Store details available on request";
  const storeBanner = merchant.merchantStore?.banner;
  const isActive = merchant.isActive ?? true;

  return (
    <div className="group overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <Link to={`/merchant/${merchant.id}`} className="block">
        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
          {storeBanner ? (
            <img
              src={storeBanner}
              alt={storeName}
              className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {isVerified ? (
                <Badge className="rounded-full border-0 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/15">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Verified
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="rounded-full bg-white/10 text-white hover:bg-white/10"
                >
                  Not verified
                </Badge>
              )}
              <Badge
                variant="secondary"
                className="rounded-full bg-white/10 text-white hover:bg-white/10"
              >
                {isActive ? "Open store" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="absolute -bottom-10 left-4">
            <div className="rounded-2xl border-4 border-background bg-background p-1 shadow-xl">
              <img
                src={logoUrl}
                alt={storeName}
                className="h-20 w-20 rounded-xl object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${merchant.id}`;
                }}
              />
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 pt-12">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-semibold tracking-tight text-foreground group-hover:text-primary">
                  {storeName}
                </h3>
                {isVerified ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {merchant.firstName} {merchant.lastName}
              </p>
            </div>
            <div className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              #{index + 1}
            </div>
          </div>

          <p className="line-clamp-2 min-h-[40px] text-sm leading-6 text-muted-foreground">
            {storeDesc}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-3 text-center">
              <Package className="mx-auto mb-1 h-4 w-4 text-primary" />
              <div className="text-sm font-semibold text-foreground">
                {productCount}
              </div>
              <div className="text-[11px] text-muted-foreground">Products</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-3 text-center">
              <Users className="mx-auto mb-1 h-4 w-4 text-primary" />
              <div className="text-sm font-semibold text-foreground">
                {customerCount}
              </div>
              <div className="text-[11px] text-muted-foreground">Customers</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-3 text-center">
              <Store className="mx-auto mb-1 h-4 w-4 text-primary" />
              <div className="text-sm font-semibold text-foreground">
                {orderCount}
              </div>
              <div className="text-[11px] text-muted-foreground">Orders</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{storeLocation}</span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button asChild className="w-full rounded-2xl gap-2 shadow-sm">
          <Link to={`/merchant/${merchant.id}`}>
            View store
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
