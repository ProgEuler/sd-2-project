"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, IdCard, Building, GraduationCap, Calendar, Edit, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import ProfileLoading from "./loading"

// Mock user data - replace with actual data fetching
interface UserProfile {
  name: string
  id: string
  section: string
  department: string
  semester: string
  email?: string
  role?: string
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUserProfile({
        name: "John Doe",
        id: "2021-1-60-123",
        section: "A",
        department: "Computer Science & Engineering",
        semester: "7th Semester",
        email: "john.doe@university.edu",
        role: "Student"
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
     return <ProfileLoading />
  }

  if (!userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Unable to load profile information.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
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
        </div>
      </div>
    </div>
  )
}
