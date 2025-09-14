"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, IdCard, Building, GraduationCap, Calendar, Edit, FileText, RefreshCw } from "lucide-react"
import { useActionState, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import ProfileLoading from "./loading"
import { fetchUserProfile, ProfileState } from "./action"

export default function ProfilePage() {
  const [isClient, setIsClient] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [state, action] = useActionState(fetchUserProfile, {
    profile: undefined,
    error: undefined,
    success: undefined
  } as ProfileState)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch profile data on component mount (only on client)
  useEffect(() => {
    if (isClient && !state.profile && !state.error && !isPending) {
      // Trigger the action on mount wrapped in startTransition
      startTransition(() => {
        action()
      })
    }
  }, [isClient, action, state.profile, state.error, isPending, startTransition])

  // Don't render anything until we're on the client
  if (!isClient) {
    return <ProfileLoading />
  }

  // Show loading state
  if (isPending || (!state.profile && !state.error)) {
    return <ProfileLoading />
  }

  // Show error state
  if (state.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-500 mb-4">Error: {state.error}</p>
            <form action={action}>
              <Button type="submit" variant="outline" disabled={isPending}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {isPending ? 'Loading...' : 'Try Again'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show no profile state
  if (!state.profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Unable to load profile information.</p>
            <form action={action}>
              <Button type="submit" variant="outline" disabled={isPending}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {isPending ? 'Loading...' : 'Refresh'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userProfile = state.profile
  console.log(userProfile)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Main Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {userProfile.role} • {userProfile.email}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Student ID Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <IdCard className="h-5 w-5 text-blue-600" />
                Student ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono font-semibold text-gray-900">
                {userProfile.id}
              </div>
            </CardContent>
          </Card>

          {/* Section Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-green-600" />
                Section
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  Section {userProfile.section}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Department Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-gray-900">
                {userProfile.department}
              </div>
              <p className="text-sm text-gray-600 mt-1">Academic Department</p>
            </CardContent>
          </Card>

          {/* Semester Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                Current Semester
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-gray-900">
                {userProfile.semester}
              </div>
              <p className="text-sm text-gray-600 mt-1">Academic Progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href={'/dashboard'}>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Get permission slip
            </Button>
          </Link>
          <form action={action}>
            <Button type="submit" variant="outline" size="lg" disabled={isPending}>
              <RefreshCw className={`h-4 w-4 mr-2`} />
              Refresh
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
