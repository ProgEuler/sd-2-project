import { PermissionSlipSkeleton } from "./permission-slip-skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";


export function AdminDashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-2 mb-8">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <PermissionSlipSkeleton variant="admin" showStats={false} count={5} />
      </div>
    </div>
  )
}