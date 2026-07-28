import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Flame,
  Heart,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  TrendingUp,
  Truck,
} from "lucide-react";
import Header from "@/components/Custom/Header";
import Footer from "@/components/Custom/Footer";
import ProductCard from "@/components/Custom/ProductCard";
import { MerchantCard } from "@/components/Home/CardMerchant";
import Categories from "@/components/Home/categories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsAuthenticated } from "@/hooks/useAuth";
import {
  useFeaturedProducts,
  useProducts,
  useSaleProducts,
} from "@/hooks/useProducts";
import { useWishlist } from "@/hooks/useWishlist";
import { useOrders } from "@/hooks/useOrders";
import { useCart } from "@/context/cartContext";
import { useQuery } from "@tanstack/react-query";
import { apiClient, Product, User } from "@/lib/api";
import { toast } from "sonner";

const quickActions = [
  {
    icon: ShoppingBag,
    label: "Shop All",
    desc: "Browse catalog",
    path: "/shop",
    color: "bg-emerald-600",
  },
  {
    icon: Tag,
    label: "Hot Deals",
    desc: "Save big today",
    path: "/shop?onSale=true",
    color: "bg-orange-600",
  },
  {
    icon: Store,
    label: "Merchants",
    desc: "Local stores",
    path: "/merchants",
    color: "bg-teal-700",
  },
  {
    icon: Truck,
    label: "Track Order",
    desc: "Live updates",
    path: "/track",
    color: "bg-stone-800",
  },
];

function ProductRowSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-72 rounded-xl" />
      ))}
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Icon className="h-5 w-5 text-emerald-700" />
          <h2 className="font-display text-2xl font-semibold text-stone-900">
            {title}
          </h2>
        </div>
        <p className="text-sm text-stone-500">{subtitle}</p>
      </div>
      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          className="hidden shrink-0 gap-1 border-stone-300 sm:flex"
          onClick={onAction}
        >
          {actionLabel} <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useIsAuthenticated();
  const { dispatch } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: featuredProducts, isLoading: loadingFeatured } =
    useFeaturedProducts();
  const { data: saleProducts = [], isLoading: loadingSale } = useSaleProducts();
  const { data: topProductsData, isLoading: loadingTop } = useProducts({
    limit: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { data: wishlistItems, isLoading: loadingWishlist } = useWishlist();
  const { data: ordersData } = useOrders();

  const { data: merchants, isLoading: loadingMerchants } = useQuery({
    queryKey: ["merchants"],
    queryFn: () => apiClient.getMerchants(),
  });

  const topProducts = topProductsData?.products ?? [];
  const recentOrders = ordersData?.orders?.slice(0, 3) ?? [];
  const wishlistProducts =
    wishlistItems?.map((item) => item.product).filter(Boolean) ?? [];

  const handleAddToCart = (product: Product) => {
    dispatch({ type: "ADD_ITEM", product, quantity: 1 });
    toast.success(`${product.name} added to cart`);
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Header />

      <section className="border-b border-stone-200 bg-stone-900 text-white">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-300">
                {greeting()}
                {isAuthenticated && user?.firstName
                  ? `, ${user.firstName}`
                  : ""}
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {isAuthenticated
                  ? "Your shopping home"
                  : "Discover what's popular"}
              </h1>
              <p className="mt-2 max-w-lg text-sm text-stone-300 sm:text-base">
                Top merchants, trending items, deals, and your saved favorites —
                all in one place.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-md gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="border-stone-700 bg-stone-800 pl-10 text-white placeholder:text-stone-400 focus-visible:ring-emerald-500"
                />
              </div>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                Search
              </Button>
            </form>
          </div>

          {!isAuthenticated && (
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-stone-700 bg-stone-800/60 px-4 py-3">
              <Heart className="h-4 w-4 text-rose-400" />
              <p className="flex-1 text-sm text-stone-300">
                Sign in to save favorites, track orders, and get personalized
                picks.
              </p>
              <Button
                size="sm"
                className="bg-white text-stone-900 hover:bg-stone-100"
                onClick={() => navigate("/signin")}
              >
                Sign in
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="group flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-600/40 hover:shadow-md"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.color} text-white`}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-stone-900 group-hover:text-emerald-700">
                  {action.label}
                </div>
                <div className="text-xs text-stone-500">{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {isAuthenticated && recentOrders.length > 0 && (
        <section className="container mx-auto px-4 pb-8 sm:px-6 lg:px-8">
          <SectionHeader
            title="Recent Orders"
            subtitle="Pick up where you left off"
            icon={Package}
            actionLabel="View all"
            onAction={() => navigate("/orders")}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to="/orders"
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-4 transition-all hover:border-emerald-600/30 hover:shadow-md"
              >
                <div>
                  <p className="font-medium text-stone-900">
                    Order #{(order.orderNumber || order.id).slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm text-stone-500">
                    {order.orderItems?.length ?? 0} items · $
                    {Number(order.total ?? 0).toFixed(2)}
                  </p>
                </div>
                <Badge variant="secondary">{order.status}</Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader
          title="Top Merchants"
          subtitle="Shop from popular local stores"
          icon={Store}
          actionLabel="View all"
          onAction={() => navigate("/merchants")}
        />
        {loadingMerchants ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : merchants && merchants.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {merchants.slice(0, 4).map((merchant: User, index: number) => (
              <MerchantCard
                key={merchant.id}
                merchant={merchant}
                index={index}
              />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-stone-500">
            No merchants available yet.
          </p>
        )}
      </section>

      <section className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Top Items"
            subtitle="Hand-picked products customers love"
            icon={Sparkles}
            actionLabel="Shop all"
            onAction={() => navigate("/shop")}
          />
          {loadingFeatured ? (
            <ProductRowSkeleton />
          ) : (featuredProducts ?? []).length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {(featuredProducts ?? []).slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-stone-500">
              Featured products will appear here soon.
            </p>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader
          title="Trending Now"
          subtitle="Fresh arrivals and popular picks"
          icon={TrendingUp}
          actionLabel="See more"
          onAction={() => navigate("/shop")}
        />
        {loadingTop ? (
          <ProductRowSkeleton />
        ) : topProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {topProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-stone-500">
            No trending products yet — check the shop.
          </p>
        )}
      </section>

      <section className="bg-rose-50/70 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Your Favorites"
            subtitle={
              isAuthenticated
                ? "Items you've saved for later"
                : "Sign in to sync your wishlist across devices"
            }
            icon={Heart}
            actionLabel={isAuthenticated ? "Browse shop" : "Sign in"}
            onAction={() =>
              navigate(isAuthenticated ? "/shop" : "/signin")
            }
          />
          {!isAuthenticated ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-white/70 p-10 text-center">
              <Heart className="mx-auto mb-4 h-10 w-10 text-rose-300" />
              <p className="font-medium text-stone-700">
                Save items you love
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Create an account to build your favorites list.
              </p>
              <Button
                className="mt-4 bg-emerald-600 hover:bg-emerald-500"
                onClick={() => navigate("/signin")}
              >
                Sign in to save favorites
              </Button>
            </div>
          ) : loadingWishlist ? (
            <ProductRowSkeleton />
          ) : wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {wishlistProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product!.id}
                  product={product!}
                  onAddToCart={() => handleAddToCart(product!)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-white/70 p-10 text-center">
              <Heart className="mx-auto mb-4 h-10 w-10 text-rose-300" />
              <p className="font-medium text-stone-700">No favorites yet</p>
              <p className="mt-1 text-sm text-stone-500">
                Save items while browsing the shop
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => navigate("/shop")}
              >
                Start browsing
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader
          title="Deals & Offers"
          subtitle="Limited-time discounts worth grabbing"
          icon={Flame}
          actionLabel="All deals"
          onAction={() => navigate("/shop?onSale=true")}
        />
        {loadingSale ? (
          <ProductRowSkeleton />
        ) : saleProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {saleProducts.slice(0, 8).map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-stone-500">
            No active deals right now — check back soon!
          </p>
        )}
      </section>

      <Categories />
      <Footer />
    </div>
  );
};

export default Home;
