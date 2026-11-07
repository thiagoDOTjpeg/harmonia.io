import { Card, CardContent, CardHeader } from "@harmonia/ui/components/card";

export default function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <div className="h-9 bg-muted rounded w-48 animate-pulse"></div>
        <div className="h-5 bg-muted rounded w-72 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
              <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 animate-pulse mb-2"></div>
              <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted rounded w-40 animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded w-56 animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(2)].map((_, j) => (
                <div
                  key={j}
                  className="h-10 bg-muted rounded animate-pulse"
                ></div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48 animate-pulse mb-2"></div>
          <div className="h-4 bg-muted rounded w-56 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-muted rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-muted rounded w-40 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-5 bg-muted rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
