import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface MerchantListSkeletonProps {
  count?: number;
  variant?: "grid" | "table";
}

export function MerchantListSkeleton({
  count = 8,
  variant = "grid",
}: MerchantListSkeletonProps) {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="overflow-hidden rounded-3xl border-border/70">
            <CardContent className="p-0">
              <div className="relative h-32 overflow-hidden bg-muted">
                <Skeleton className="h-full w-full rounded-none" />
                <div className="absolute left-4 top-4 flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="absolute -bottom-10 left-4">
                  <Skeleton className="h-20 w-20 rounded-2xl border-4 border-background" />
                </div>
              </div>

              <div className="px-4 pb-4 pt-12">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-10 rounded-full" />
                </div>

                <Skeleton className="mt-4 h-10 w-full" />

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {Array.from({ length: 3 }).map((_, metricIndex) => (
                    <Skeleton key={metricIndex} className="h-24 rounded-2xl" />
                  ))}
                </div>

                <Skeleton className="mt-4 h-4 w-3/4" />
              </div>

              <div className="px-4 pb-4">
                <Skeleton className="h-11 w-full rounded-2xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="space-y-2">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 rounded-lg border p-4">
              <Skeleton className="h-12 w-12 rounded-full" />

              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, ratingIndex) => (
                      <Skeleton key={ratingIndex} className="h-3 w-3" />
                    ))}
                    <Skeleton className="ml-1 h-3 w-8" />
                  </div>

                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
