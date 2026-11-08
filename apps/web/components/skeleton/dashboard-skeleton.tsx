import { Card, CardContent, CardHeader } from "@harmonia/ui/components/card";

export default function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Edge Telemetry Ribbon Skeleton */}
      <div className="rounded-xl border border-border/80 bg-card p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="h-4 w-28 bg-muted/60 rounded animate-pulse" />
            <div className="h-7 w-28 bg-muted/40 rounded-md animate-pulse" />
            <div className="h-7 w-28 bg-muted/40 rounded-md animate-pulse" />
            <div className="h-7 w-28 bg-muted/40 rounded-md animate-pulse" />
          </div>
          <div className="h-7 w-24 bg-muted/40 rounded-md animate-pulse" />
        </div>
      </div>

      {/* 4 KPIs Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/[0.08] bg-card p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 bg-muted/50 rounded w-24 animate-pulse" />
              <div className="h-7 w-7 rounded-md bg-muted/40 animate-pulse" />
            </div>
            <div className="h-8 bg-muted/60 rounded-md w-20 animate-pulse" />
            <div className="h-1 bg-muted/30 rounded-full w-full animate-pulse" />
          </div>
        ))}
      </div>

      {/* Cloudflare Table Skeleton */}
      <Card className="border border-white/[0.08] bg-card">
        <CardHeader className="p-4 sm:p-5 border-b border-border/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="h-5 bg-muted/60 rounded w-44 animate-pulse" />
              <div className="h-3.5 bg-muted/40 rounded w-72 animate-pulse" />
            </div>
            <div className="h-8 w-36 bg-harmonia-lime/20 rounded-lg animate-pulse" />
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="h-8 w-64 bg-muted/50 rounded-md animate-pulse" />
            <div className="h-8 w-48 bg-muted/40 rounded-lg animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/10"
            >
              <div className="flex items-center gap-4">
                <div className="h-3 w-16 bg-muted/50 rounded animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 bg-muted/60 rounded w-48 animate-pulse" />
                  <div className="h-3 bg-muted/40 rounded w-28 animate-pulse" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-12 bg-muted/50 rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted/40 rounded animate-pulse" />
                <div className="h-7 w-20 bg-muted/40 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
