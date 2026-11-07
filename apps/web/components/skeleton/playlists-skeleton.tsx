import { Card, CardHeader } from "@harmonia/ui/components/card";

export default function PlaylistsSkeleton() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 bg-muted/60 rounded-lg w-48 animate-pulse" />
          <div className="h-4 bg-muted/40 rounded w-72 animate-pulse" />
        </div>
        <div className="h-9 w-36 bg-harmonia-lime/20 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="card-sculpted border border-white/[0.08]">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="h-14 w-14 bg-muted/50 rounded-xl animate-pulse shrink-0" />
                  <div className="space-y-2.5">
                    <div className="h-5 bg-muted/60 rounded w-44 animate-pulse" />
                    <div className="h-3 bg-muted/40 rounded w-56 animate-pulse" />
                    <div className="flex items-center gap-2">
                      <div className="h-5 bg-muted/50 rounded-full w-20 animate-pulse" />
                      <div className="h-5 bg-muted/40 rounded-full w-16 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="h-8 w-8 bg-muted/40 rounded-lg animate-pulse shrink-0" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
