import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
   return <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid gap-6 md:grid-cols-2">
            {/* Main Profile Card Skeleton */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div>
                      <Skeleton className="h-8 w-48 mb-2" />
                      <Skeleton className="h-5 w-64" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-28" />
                </div>
              </CardHeader>
            </Card>

            {/* Student ID Card Skeleton */}
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>

            {/* Section Card Skeleton */}
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-20 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>

            {/* Department Card Skeleton */}
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>

            {/* Semester Card Skeleton */}
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </div>
}
