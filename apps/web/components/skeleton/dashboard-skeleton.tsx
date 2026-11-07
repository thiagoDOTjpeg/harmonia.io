import { Card, CardContent, CardHeader } from "@harmonia/ui/components/card";

export default function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 bg-muted/60 rounded-lg w-56 animate-pulse" />
          <div className="h-4 bg-muted/40 rounded w-80 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-28 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-9 w-36 bg-harmonia-lime/20 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Integration Pipeline Banner skeleton */}
      <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-36 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-5 w-6 bg-muted/30 rounded animate-pulse" />
            <div className="h-10 w-36 bg-muted/50 rounded-lg animate-pulse" />
          </div>
          <div className="h-8 w-44 bg-muted/40 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* 4 KPIs grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/[0.08] bg-card p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted/50 rounded w-28 animate-pulse" />
              <div className="h-9 w-9 rounded-lg bg-muted/40 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-muted/60 rounded-md w-24 animate-pulse" />
              <div className="h-3 bg-muted/40 rounded w-36 animate-pulse" />
            </div>
            <div className="h-1.5 bg-muted/30 rounded-full w-full animate-pulse" />
          </div>
        ))}
      </div>

      {/* Recent Activity Card skeleton */}
      <Card className="border border-white/[0.08] bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
          <div className="space-y-1.5">
            <div className="h-5 bg-muted/60 rounded w-40 animate-pulse" />
            <div className="h-3.5 bg-muted/40 rounded w-56 animate-pulse" />
          </div>
          <div className="h-4 bg-muted/40 rounded w-28 animate-pulse" />
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-muted/10"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-lg bg-muted/50 animate-pulse shrink-0" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted/60 rounded w-48 sm:w-64 animate-pulse" />
                  <div className="h-3 bg-muted/40 rounded w-32 animate-pulse" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-24 bg-muted/40 rounded-full animate-pulse" />
                <div className="h-8 w-8 bg-muted/30 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
