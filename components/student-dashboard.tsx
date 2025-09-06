"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { PermissionSlipForm } from "@/components/permission-slip-form"
import { PDFDownloadButton } from "@/components/pdf-download-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  student_id: string
}

interface PermissionSlip {
  id: string
  title: string
  description: string
  event_date: string
  event_location: string
  status: "pending" | "approved" | "rejected"
  faculty_comments?: string
  created_at: string
}

interface StudentDashboardProps {
  profile: Profile
}

export function StudentDashboard({ profile }: StudentDashboardProps) {
  const [permissionSlips, setPermissionSlips] = useState<PermissionSlip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchPermissionSlips()
  }, [])

  const fetchPermissionSlips = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("permission_slips")
      .select("*")
      .eq("student_id", profile.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setPermissionSlips(data)
    }
    setIsLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    fetchPermissionSlips()
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile.full_name} (ID: {profile.student_id})
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Permission Slip Request</DialogTitle>
            </DialogHeader>
            <PermissionSlipForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissionSlips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {permissionSlips.filter((slip) => slip.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {permissionSlips.filter((slip) => slip.status === "approved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Permission Slip Requests</CardTitle>
          <CardDescription>Track the status of your submitted requests</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : permissionSlips.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
              <p className="text-muted-foreground mb-4">Submit your first permission slip request to get started.</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Request
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {permissionSlips.map((slip) => (
                <div key={slip.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{slip.title}</h3>
                      <p className="text-sm text-muted-foreground">{slip.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(slip.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(slip.status)}
                          {slip.status.charAt(0).toUpperCase() + slip.status.slice(1)}
                        </div>
                      </Badge>
                      <PDFDownloadButton
                        permissionSlip={{
                          ...slip,
                          student: {
                            full_name: profile.full_name,
                            student_id: profile.student_id,
                            email: profile.email,
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Event Date:</span> {new Date(slip.event_date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {slip.event_location}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> {new Date(slip.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {slip.faculty_comments && (
                    <div className="mt-3 p-3 bg-muted rounded">
                      <span className="font-medium text-sm">Faculty Comments:</span>
                      <p className="text-sm mt-1">{slip.faculty_comments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
