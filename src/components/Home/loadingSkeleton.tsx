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
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i} className="group">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <Skeleton className="w-32 h-32 rounded-full" />
                    <div className="absolute -bottom-2 -right-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col w-full space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 flex-1" />
                      <Skeleton className="h-4 w-12 ml-auto" />
                    </div>
                    <Skeleton className="h-4 w-3/4" />

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Skeleton key={j} className="h-3 w-3" />
                      ))}
                      <Skeleton className="h-3 w-8 ml-1" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  {/* Button */}
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Table Body */}
        <div className="space-y-2">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 p-4 border rounded-lg"
            >
              <Skeleton className="h-12 w-12 rounded-full" />

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-3 w-3" />
                    ))}
                    <Skeleton className="h-3 w-8 ml-1" />
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
