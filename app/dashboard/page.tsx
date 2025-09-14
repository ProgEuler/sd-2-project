"use client"

import { useActionState, useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCwIcon } from "lucide-react"
import { fetchDashboardData, DashboardState } from "./actions"
import { StudentDashboard } from "@/components/student-dashboard"
import { FacultyDashboard } from "@/components/faculty-dashboard"

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [state, fetchAction] = useActionState(fetchDashboardData, {
    user: undefined,
    requests: undefined,
    error: undefined,
    success: undefined
  } as DashboardState)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch dashboard data on component mount
  useEffect(() => {
    if (isClient && !state.user && !state.error && !isPending) {
      startTransition(() => {
        fetchAction()
      })
    }
  }, [isClient, fetchAction, state.user, state.error, isPending])

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we load your profile.</p>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isPending || (!state.user && !state.error)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCwIcon className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Fetching your dashboard data...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-500 mb-4">Error: {state.error}</p>
            <form action={fetchAction}>
              <Button type="submit" variant="outline" disabled={isPending}>
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                {isPending ? 'Loading...' : 'Try Again'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show no profile state
  if (!state.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Unable to load user profile.</p>
            <form action={fetchAction}>
              <Button type="submit" variant="outline" disabled={isPending}>
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = state.user

  // Render appropriate dashboard based on user role
  if (user.role === "student") {
   console.log(user)
    return <StudentDashboard />
  }
  if (user.role === "faculty") {
    return <FacultyDashboard />
  }

  // Unknown role fallback
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Unknown Role</h2>
          <p className="text-gray-600 mb-4">Your account role '{user.role}' is not recognized.</p>
          <p className="text-sm text-gray-500 mb-4">Please contact support for assistance.</p>
          <form action={fetchAction}>
            <Button type="submit" variant="outline" disabled={isPending}>
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
