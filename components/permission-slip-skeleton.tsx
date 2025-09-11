import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface PermissionSlipSkeletonProps {
  count?: number
  showStats?: boolean
  variant?: "student" | "faculty"
}

export function PermissionSlipSkeleton({
  count = 3,
  variant = "student"
}: PermissionSlipSkeletonProps) {
  return (
    <div className="space-y-6">

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

                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
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
