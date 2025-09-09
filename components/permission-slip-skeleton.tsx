import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface PermissionSlipSkeletonProps {
  count?: number
  showStats?: boolean
  variant?: "student" | "faculty" | "admin"
}

export function PermissionSlipSkeleton({ 
  count = 3, 
  showStats = true, 
  variant = "student" 
}: PermissionSlipSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      {showStats && (
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {[...Array(variant === "admin" ? 4 : 3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
                {variant === "admin" && <Skeleton className="h-3 w-20 mt-1" />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Permission Slips List Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            {variant === "faculty" && <Skeleton className="h-10 w-32" />}
          </div>
        </CardHeader>
        <CardContent>
          {/* Search/Filter Skeleton for Faculty/Admin */}
          {(variant === "faculty" || variant === "admin") && (
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-48" />
            </div>
          )}

          {/* List Items Skeleton */}
          <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 space-y-2">
                    {variant === "faculty" ? (
                      <>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-8" />
                    {variant === "faculty" && <Skeleton className="h-8 w-20" />}
                  </div>
                </div>
                
                {variant !== "admin" && (
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Individual skeleton components for specific use cases
export function StudentDashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <PermissionSlipSkeleton variant="student" />
    </div>
  )
}

export function FacultyDashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-2 mb-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <PermissionSlipSkeleton variant="faculty" count={5} />
    </div>
  )
}

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