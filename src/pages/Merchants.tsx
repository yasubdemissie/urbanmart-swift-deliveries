import { useState } from "react";
import Header from "@/components/Custom/Header";
import MerchantList from "@/components/Home/merchantList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShieldCheck, ArrowUpDown, X } from "lucide-react";

type MerchantSort = "newest" | "oldest" | "name";

export default function Merchants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<MerchantSort>("newest");

  const hasActiveFilters =
    searchQuery.trim().length > 0 || verifiedOnly || sortBy !== "newest";

  const activeButtonClass =
    "rounded-full border-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700";
  const inactiveButtonClass =
    "rounded-full border-blue-200 bg-white px-4 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900/40 dark:bg-slate-950 dark:text-blue-300 dark:hover:bg-blue-950/40";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_38%,#f8fafc_100%)] text-foreground flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 md:px-8 md:py-6">
            <div className="grid gap-3 rounded-3xl border border-border/70 bg-card/90 p-3 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search merchants"
                  className="h-11 rounded-2xl border-border/70 bg-background pl-11 pr-4 text-sm shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-product-accent/40"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={!verifiedOnly ? "default" : "outline"}
                  className={
                    !verifiedOnly ? activeButtonClass : inactiveButtonClass
                  }
                  onClick={() => setVerifiedOnly(false)}
                >
                  All
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={verifiedOnly ? "default" : "outline"}
                  className={
                    verifiedOnly ? activeButtonClass : inactiveButtonClass
                  }
                  onClick={() => setVerifiedOnly(true)}
                >
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                  Verified
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={sortBy === "newest" ? "default" : "outline"}
                  className={
                    sortBy === "newest"
                      ? activeButtonClass
                      : inactiveButtonClass
                  }
                  onClick={() => setSortBy("newest")}
                >
                  <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
                  Newest
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={sortBy === "name" ? "default" : "outline"}
                  className={
                    sortBy === "name" ? activeButtonClass : inactiveButtonClass
                  }
                  onClick={() => setSortBy("name")}
                >
                  A-Z
                </Button>
                {hasActiveFilters ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="rounded-full px-3 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40"
                    onClick={() => {
                      setSearchQuery("");
                      setVerifiedOnly(false);
                      setSortBy("newest");
                    }}
                  >
                    <X className="mr-1.5 h-3.5 w-3.5" />
                    Reset
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8 md:py-10">
          <MerchantList
            searchQuery={searchQuery}
            verifiedOnly={verifiedOnly}
            sortBy={sortBy}
          />
        </section>
      </main>
    </div>
  );
}
