import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-3 py-8 sm:px-4 md:px-6 lg:px-8">
        <Skeleton className="h-8 w-20" />
        <div className="mt-6 grid gap-10 lg:grid-cols-[300px_1fr]">
          <div className="space-y-5">
            <Skeleton className="h-36 w-full rounded-3xl" />
            <div className="-mt-14 flex flex-col items-center">
              <Skeleton className="h-28 w-28 rounded-full border-4 border-background" />
              <Skeleton className="mt-4 h-7 w-40" />
              <Skeleton className="mt-2 h-4 w-28" />
            </div>
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
          <div>
            <Skeleton className="h-6 w-32" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
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
  const heroImage =
    store?.banner ||
    store?.logo ||
    merchant?.avatar ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${merchant?.id ?? id}`;
  const storeLogo =
    store?.logo ||
    merchant?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${merchant?.id ?? id}`;

  if (isLoading) return <MerchantPageSkeleton />;

  if (error || !merchant || !store) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto flex w-full max-w-2xl flex-col items-center px-3 py-24 text-center sm:px-4 md:px-6">
          <Store className="h-8 w-8 text-muted-foreground" />
          <h1 className="mt-4 font-serif text-2xl text-foreground">
            Merchant not found
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            This store profile is unavailable or has been removed.
          </p>
          <Button className="mt-6" onClick={() => navigate("/merchants")}>
            Back to merchants
          </Button>
        </main>
      </div>
    );
  }

  const stats = [
    { label: "Products", value: store._count?.products ?? products.length },
    { label: "Orders", value: store._count?.orders ?? 0 },
    { label: "Customers", value: store._count?.customers ?? 0 },
  ];

  const contactItems = [
    store.address && { icon: MapPin, label: store.address, href: undefined },
    store.phone && {
      icon: Phone,
      label: store.phone,
      href: `tel:${store.phone}`,
    },
    store.email && {
      icon: Mail,
      label: store.email,
      href: `mailto:${store.email}`,
    },
    store.website && {
      icon: Globe,
      label: "Visit website",
      href: store.website,
    },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; href?: string }[];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-3 py-8 sm:px-4 md:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          {/* Products */}
          <section>
            <div className="flex items-baseline justify-between border-b border-border/70 pb-4">
              <h2 className="font-serif text-xl text-foreground">
                Store products
              </h2>
              <span className="text-sm text-muted-foreground">
                {products.length} items
              </span>
            </div>

            {products.length > 0 ? (
              <div
                className="mt-6 grid gap-x-6 gap-y-10"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(235px, 1fr))",
                }}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center px-6 py-20 text-center">
                <Package className="h-8 w-8 text-muted-foreground" />
                <p className="mt-4 text-sm font-medium text-foreground">
                  No active products yet
                </p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  This store is live, but doesn't have any active products to
                  display right now.
                </p>
                <Button className="mt-6" onClick={() => navigate("/merchants")}>
                  Explore other merchants
                </Button>
              </div>
            )}
          </section>

          {/* Sidebar: store identity, sticky on scroll, compact */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)]">
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                <img
                  src={heroImage}
                  alt={storeName}
                  className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                      <Store className="h-3.5 w-3.5" />
                      Merchant profile
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold backdrop-blur-sm ${
                        store.isActive
                          ? "bg-emerald-500/20 text-emerald-100"
                          : "bg-slate-500/20 text-slate-100"
                      }`}
                    >
                      {store.isActive ? "Open now" : "Inactive"}
                    </span>
                    {store.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-semibold text-blue-100 backdrop-blur-sm">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                  <div className="rounded-full border-4 border-card bg-card p-1.5 shadow-2xl shadow-slate-900/20">
                    <div className="h-28 w-28 overflow-hidden rounded-full bg-muted">
                      <img
                        src={storeLogo}
                        alt={storeName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-16">
                <div className="text-center">
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
                    Merchant details
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {storeName}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    by {merchantName}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 text-center shadow-sm dark:border-blue-950/40 dark:from-blue-950/30 dark:to-indigo-950/30"
                    >
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {stat.value}
                      </div>
                      <div className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-sm leading-6 text-muted-foreground">
                  {store.description ||
                    "This merchant has not added a description yet."}
                </p>

                {contactItems.length > 0 && (
                  <div className="mt-5 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Contact
                    </p>
                    <div className="space-y-2">
                      {contactItems.map((item) => {
                        const content = (
                          <>
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                              <item.icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1 truncate text-sm text-slate-700 dark:text-slate-200">
                              {item.label}
                            </span>
                          </>
                        );

                        return item.href ? (
                          <a
                            key={item.label}
                            href={item.href}
                            target={
                              item.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/60 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-blue-900/60 dark:hover:bg-blue-950/20"
                          >
                            {content}
                          </a>
                        ) : (
                          <div
                            key={item.label}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70"
                          >
                            {content}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
