import { Link } from "react-router-dom";
import { Store, Star, UserRound, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MerchantStore {
  name?: string;
  description?: string;
}

interface Merchant {
  id: string;
  firstName: string;
  lastName: string;
  merchantStore?: MerchantStore;
}

interface MerchantCardProps {
  merchant: Merchant;
  index: number;
}

export function MerchantCard({ merchant, index }: MerchantCardProps) {
  return (
    <div className="group flex flex-col items-center gap-5 py-4 rounded-2xl bg-card border border-border hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
      <Link
        to={`/merchant/${merchant.id}`}
        className="flex flex-col items-center gap-5 w-full"
      >
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-muted to-muted/50 overflow-hidden ring-4 ring-background shadow-2xl group-hover:ring-primary/30 group-hover:ring-8 transition-all duration-500">
            <img
              src={
                index % 2 === 0
                  ? `https://img.freepik.com/premium-photo/handsome-confident-businessman-wearing-suit-standing-isolated-black-wall_171337-93356.jpg?w=360`
                  : `https://static.vecteezy.com/system/resources/thumbnails/016/201/669/small_2x/stylish-handsome-man-wearing-a-classic-suit-with-bow-tie-photo.jpg`
              }
              alt={merchant.firstName}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2.5 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <Store className="h-4 w-4" />
          </div>
        </div>

        <div className="flex flex-col w-full px-5 gap-3.5">
          <div className="flex flex-row items-center justify-between w-full gap-3">
            <h3 className="text-xl font-bold text-foreground truncate group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/70 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 flex-1 font-sans tracking-tight leading-tight">
              {merchant.firstName} {merchant.lastName}
            </h3>
            <Badge
              variant="secondary"
              className={`${
                index % 2 === 0
                  ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50"
                  : "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-50"
              } text-xs font-semibold shrink-0 group-hover:scale-105 transition-transform duration-300`}
            >
              {index % 2 === 0 ? "Technology" : "Fashion"}
            </Badge>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg border border-border/30 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-300">
            <Store className="w-3.5 h-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors duration-300" />
            <p className="text-sm text-muted-foreground font-semibold font-sans tracking-wide group-hover:text-foreground transition-colors duration-300">
              {merchant.merchantStore?.name || "No store name"}
            </p>
          </div>

          <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed font-sans">
            {merchant.merchantStore?.description ||
              "Premium quality products and exceptional service for all your needs. We pride ourselves on customer satisfaction."}
          </p>

          <div className="flex flex-row items-center justify-between w-full pt-2 border-t border-border/50">
            <span className="text-sm flex items-center gap-2 text-muted-foreground font-sans group-hover:text-foreground transition-colors duration-300">
              <UserRound className="w-4 h-4" />
              <span className="font-medium">234</span>
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 transition-all duration-300 ${
                      star <= 4
                        ? "fill-amber-400 text-amber-400"
                        : star === 5
                        ? "fill-amber-200 text-amber-200"
                        : "fill-muted text-muted"
                    } group-hover:scale-110`}
                    style={{
                      transitionDelay: `${star * 30}ms`,
                    }}
                  />
                ))}
              </div>
              <span className="text-base font-bold text-foreground bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-800/50">
                4.5
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-row items-center justify-between w-full px-5 gap-3">
        <Button
          className="flex-1 gap-2 hover:bg-accent/80 transition-all duration-300 bg-transparent"
          variant="outline"
          size="sm"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="font-medium">Follow</span>
        </Button>
        <Button
          className="flex-1 gap-2 shadow-md hover:shadow-lg transition-all duration-300"
          variant="default"
          size="sm"
        >
          <Store className="h-4 w-4" />
          <span className="font-medium">View Store</span>
        </Button>
      </div>
    </div>
  );
}
