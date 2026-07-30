import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Globe,
  Mail,
  MapPin,
  Package,
  Phone,
  Store,
  ShieldCheck,
  Users,
  ShoppingBag,
} from "lucide-react";
import { apiClient, MerchantStore, Product, User } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/Custom/ProductCard";
import Header from "@/components/Custom/Header";

type MerchantDetails = User & {
  merchantStore?: MerchantStore & {
    products?: Product[];
  };
};

function MerchantPageSkeleton() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_30%,#f8fafc_100%)]">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm">
          <Skeleton className="h-56 w-full rounded-none" />
          <div className="px-5 pb-5 pt-16 md:px-8 md:pb-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-5 w-56" />
                <div className="flex flex-wrap gap-2 pt-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-12 w-full max-w-[220px] rounded-2xl" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-sm">
              <Skeleton className="h-6 w-44" />
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 rounded-2xl" />
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-sm">
              <Skeleton className="h-6 w-36" />
              <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-96 rounded-3xl" />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-sm">
              <Skeleton className="h-6 w-40" />
              <div className="mt-4 space-y-3">
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function MerchantPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: merchant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["merchant", id],
    queryFn: async () => {
      if (!id) throw new Error("Missing merchant id");
      const response = await apiClient.getPublicMerchant(id);
      return response.data as MerchantDetails;
    },
    enabled: Boolean(id),
  });

  const store = merchant?.merchantStore;
  const products = useMemo(() => store?.products ?? [], [store?.products]);
  const merchantName =
    `${merchant?.firstName ?? "Merchant"} ${merchant?.lastName ?? ""}`.trim();
  const storeName =
    store?.name || `${merchant?.firstName ?? "Merchant"}'s Store`;
  const bannerUrl =
    store?.banner ||
    store?.logo ||
    merchant?.avatar ||
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1400&q=80";
  const logoUrl =
    store?.logo ||
    merchant?.avatar ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${merchant?.id ?? id}`;

  if (isLoading) return <MerchantPageSkeleton />;

  if (error || !merchant || !store) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_30%,#f8fafc_100%)]">
        <Header />
        <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-20 text-center md:px-8">
          <Store className="h-14 w-14 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            Merchant not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The store profile you opened is unavailable or has been removed.
          </p>
          <Button
            className="mt-6 rounded-2xl"
            onClick={() => navigate("/merchants")}
          >
            Back to merchants
          </Button>
        </main>
      </div>
    );
  }

  const stats = [
    {
      label: "Products",
      value: store._count?.products ?? products.length,
      icon: Package,
    },
    {
      label: "Orders",
      value: store._count?.orders ?? 0,
      icon: ShoppingBag,
    },
    {
      label: "Customers",
      value: store._count?.customers ?? 0,
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_30%,#f8fafc_100%)]">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <Button
          variant="ghost"
          className="mb-4 rounded-full px-3 text-muted-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm">
          <div className="relative h-56 overflow-hidden bg-slate-900 md:h-72">
            <img
              src={bannerUrl}
              alt={storeName}
              className="absolute inset-0 h-full w-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 md:left-8 md:right-8">
              <Badge className="rounded-full border-0 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/15">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                {store.isVerified ? "Verified store" : "Store profile"}
              </Badge>
              <Badge className="rounded-full border-0 bg-white/10 text-white hover:bg-white/10">
                {store.isActive ? "Open now" : "Currently inactive"}
              </Badge>
            </div>

            <div className="absolute -bottom-10 left-4 md:left-8">
              <div className="rounded-[1.5rem] border-4 border-background bg-background p-1 shadow-2xl">
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="h-24 w-24 rounded-[1.15rem] object-cover md:h-28 md:w-28"
                />
              </div>
            </div>
          </div>

          <div className="px-4 pb-5 pt-16 md:px-8 md:pb-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{merchantName}</span>
                  {store.isVerified ? <span>• Verified merchant</span> : null}
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {storeName}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                  {store.description ||
                    "This merchant has not added a description yet."}
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 rounded-3xl border border-border/70 bg-background/80 p-4 shadow-sm lg:max-w-xs">
                {store.address ? (
                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{store.address}</span>
                  </div>
                ) : null}
                {store.phone ? (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0 text-primary" />
                    <span>{store.phone}</span>
                  </div>
                ) : null}
                {store.email ? (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                    <span>{store.email}</span>
                  </div>
                ) : null}
                {store.website ? (
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-primary transition-colors hover:text-primary/80"
                  >
                    <Globe className="h-4 w-4 shrink-0" />
                    Visit website
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Store products
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse what this merchant currently sells.
              </p>
            </div>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {products.length} items
            </Badge>
          </div>

          {products.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-border/70 px-6 py-16 text-center text-muted-foreground">
              <Package className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-base font-medium text-foreground">
                No active products yet
              </p>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                This store is live, but it does not have any active products to
                display right now.
              </p>
              <Button
                className="mt-6 rounded-2xl"
                onClick={() => navigate("/merchants")}
              >
                Explore other merchants
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
