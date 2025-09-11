"use client"

import { useState, useEffect, useTransition } from "react"
// import { getPermissionSlips } from "@/lib/actions/permission-slip-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { PDFDownloadButton } from "@/components/pdf-download-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PermissionSlipSkeleton } from "@/components/permission-slip-skeleton"
import { PermissionSlipForm } from "./permission-slip-form"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  student_id?: string
  department?: string
  created_at: string
}

interface PermissionSlip {
  id: string
  title: string
  description: string
  event_date: string
  event_location: string
  emergency_contact_name: string
  emergency_contact_phone: string
  status: "pending" | "approved" | "rejected"
  faculty_comments?: string
  created_at: string
  student_id: string
}

const permissionSlips: PermissionSlip[] = [
  {
    id: "ps1",
    title: "Field Trip to Science Museum",
    description: "A trip to the National Science Museum to explore interactive exhibits.",
    event_date: "2025-10-15",
    event_location: "National Science Museum, City Center",
    emergency_contact_name: "Mary Smith",
    emergency_contact_phone: "+1-555-123-4567",
    status: "pending",
    created_at: "2025-09-01T10:00:00Z",
    student_id: "S123456",
  },
  {
    id: "ps2",
    title: "Sports Tournament",
    description: "Regional inter-school football tournament.",
    event_date: "2025-11-02",
    event_location: "Greenfield Stadium",
    emergency_contact_name: "Robert Johnson",
    emergency_contact_phone: "+1-555-987-6543",
    status: "approved",
    faculty_comments: "Approved. Ensure proper safety gear is used.",
    created_at: "2025-09-05T14:30:00Z",
    student_id: "S654321",
  },
  {
    id: "ps3",
    title: "Community Service Project",
    description: "Volunteering at the local food bank.",
    event_date: "2025-09-20",
    event_location: "Downtown Food Bank",
    emergency_contact_name: "Emily Davis",
    emergency_contact_phone: "+1-555-222-3344",
    status: "rejected",
    faculty_comments: "Rejected due to conflict with midterm exams.",
    created_at: "2025-09-07T09:15:00Z",
    student_id: "S789012",
  },
];


interface StudentDashboardProps {
  profile: Profile
}

export function StudentDashboard({ profile }: StudentDashboardProps) {
//   const [permissionSlips, setPermissionSlips] = useState<PermissionSlip[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

//   const fetchPermissionSlips = async () => {
//     try {
//       setError(null)
//       // const result = await getPermissionSlips()
//       if (result.success && result.data) {
//         setPermissionSlips(result.data)
//       } else {
//         setError(result.error || "Failed to fetch permission slips")
//         console.error("Error fetching permission slips:", result.error)
//       }
//     } catch (error) {
//       setError("An unexpected error occurred")
//       console.error("Error fetching permission slips:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }


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
   //  startTransition(() => {
   //    fetchPermissionSlips()
   //  })
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile.full_name} {profile.student_id && `(ID: ${profile.student_id})`}
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
              <DialogTitle>Permission Slip Request</DialogTitle>
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
        <CardContent>
          {isLoading ? (
            <PermissionSlipSkeleton variant="student" showStats={false} />
          ) : error ? (
            <div className="text-center py-8">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-red-600">Error Loading Requests</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              {/* <Button onClick={() => fetchPermissionSlips()} variant="outline">
                Try Again
              </Button> */}
            </div>
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
                            student_id: profile.student_id || "",
                            email: profile.email,
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Submitted:</span> {new Date(slip.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
