"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Clock, CheckCircle, XCircle, Eye, Search, Filter, Calendar, MapPin, Phone, User } from "lucide-react"
import { PDFDownloadButton, BulkPDFButton } from "@/components/pdf-download-button"
import { PermissionSlipSkeleton } from "@/components/permission-slip-skeleton"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  department: string
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
  faculty_reviewer_id?: string
  reviewed_at?: string
  created_at: string
  student_id: string
  profiles?: {
    full_name: string
    student_id: string
    email: string
  }
}

interface FacultyDashboardProps {
  profile: Profile
}

export function FacultyDashboard({ profile }: FacultyDashboardProps) {
  const [permissionSlips, setPermissionSlips] = useState<PermissionSlip[]>(
   [
  {
    "id": "ps-001",
    "title": "Field Trip to History Museum",
    "description": "An educational visit to the local history museum as part of the Ancient Civilizations course.",
    "event_date": "2024-11-10T09:00:00Z",
    "event_location": "City History Museum",
    "emergency_contact_name": "Sarah Connor",
    "emergency_contact_phone": "555-123-4567",
    "status": "pending",
    "created_at": "2024-10-25T14:00:00Z",
    "student_id": "STU001",
    "profiles": {
      "full_name": "Alice Smith",
      "student_id": "STU001",
      "email": "alice.smith@example.com"
    }
  },
  {
    "id": "ps-002",
    "title": "Robotics Club Competition",
    "description": "Participation in the regional robotics competition at the university campus.",
    "event_date": "2024-12-05T08:30:00Z",
    "event_location": "University Engineering Hall",
    "emergency_contact_name": "John Doe",
    "emergency_contact_phone": "555-987-6543",
    "status": "approved",
    "faculty_comments": "Excited to see what they build!",
    "faculty_reviewer_id": "FAC003",
    "reviewed_at": "2024-10-28T10:15:00Z",
    "created_at": "2024-10-26T11:30:00Z",
    "student_id": "STU002",
    "profiles": {
      "full_name": "Bob Johnson",
      "student_id": "STU002",
      "email": "bob.johnson@example.com"
    }
  },
  {
    "id": "ps-003",
    "title": "Outdoor Photography Workshop",
    "description": "An all-day outdoor photography workshop in the national park.",
    "event_date": "2025-01-15T07:00:00Z",
    "event_location": "Pine Ridge National Park",
    "emergency_contact_name": "Jane Brown",
    "emergency_contact_phone": "555-111-2222",
    "status": "rejected",
    "faculty_comments": "Workshop overlaps with mandatory class. Please reschedule.",
    "faculty_reviewer_id": "FAC001",
    "reviewed_at": "2024-11-01T16:00:00Z",
    "created_at": "2024-10-27T09:00:00Z",
    "student_id": "STU003",
    "profiles": {
      "full_name": "Charlie Brown",
      "student_id": "STU003",
      "email": "charlie.brown@example.com"
    }
  },
  {
    "id": "ps-004",
    "title": "Debate Team Tournament",
    "description": "Travel to an inter-university debate tournament in a neighboring state.",
    "event_date": "2024-11-20T06:00:00Z",
    "event_location": "State University Campus",
    "emergency_contact_name": "Clark Kent",
    "emergency_contact_phone": "555-333-4444",
    "status": "pending",
    "created_at": "2024-10-29T10:45:00Z",
    "student_id": "STU004",
    "profiles": {
      "full_name": "Diana Prince",
      "student_id": "STU004",
      "email": "diana.prince@example.com"
    }
  },
  {
    "id": "ps-005",
    "title": "Volunteer Day at Animal Shelter",
    "description": "Volunteering at the local animal shelter as part of a community service initiative.",
    "event_date": "2024-11-12T13:00:00Z",
    "event_location": "Happy Tails Animal Shelter",
    "emergency_contact_name": "Bruce Wayne",
    "emergency_contact_phone": "555-555-6666",
    "status": "approved",
    "faculty_comments": "Great initiative! Ensure all safety protocols are followed.",
    "faculty_reviewer_id": "FAC002",
    "reviewed_at": "2024-10-31T09:00:00Z",
    "created_at": "2024-10-30T15:10:00Z",
    "student_id": "STU005",
    "profiles": {
      "full_name": "Eve Adams",
      "student_id": "STU005",
      "email": "eve.adams@example.com"
    }
  }
]
  )
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSlip, setSelectedSlip] = useState<PermissionSlip | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)

//   const fetchPermissionSlips = async () => {
//     const supabase = createClient()
//     const { data, error } = await supabase
//       .from("permission_slips")
//       .select(`
//         *,
//         profiles:student_id (
//           full_name,
//           student_id,
//           email
//         )
//       `)
//       .order("created_at", { ascending: false })

//     if (!error && data) {
//       setPermissionSlips(data)
//     }
//     setIsLoading(false)
//   }


  const handleReview = async (slipId: string, status: "approved" | "rejected") => {
    setIsReviewing(true)
   //  const supabase = createClient()

   //  try {
   //    const { error } = await supabase
   //      .from("permission_slips")
   //      .update({
   //        status,
   //        faculty_reviewer_id: profile.id,
   //        faculty_comments: reviewComments || null,
   //        reviewed_at: new Date().toISOString(),
   //      })
   //      .eq("id", slipId)

   //    if (error) throw error

   //    if (selectedSlip?.profiles?.email) {
   //      console.log(`[Email Notification] Sending ${status} notification to ${selectedSlip.profiles.email}`)
   //      console.log(`Subject: Permission Slip ${status === "approved" ? "Approved" : "Rejected"}`)
   //      console.log(`Message: Your permission slip for "${selectedSlip.title}" has been ${status}.`)
   //    }

   //    // Refresh the list
   //    await fetchPermissionSlips()
   //    setSelectedSlip(null)
   //    setReviewComments("")
   //  } catch (error) {
   //    console.error("Error reviewing permission slip:", error)
   //  } finally {
   //    setIsReviewing(false)
   //  }
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

  const pendingCount = permissionSlips.filter((slip) => slip.status === "pending").length
  const approvedCount = permissionSlips.filter((slip) => slip.status === "approved").length
  const rejectedCount = permissionSlips.filter((slip) => slip.status === "rejected").length

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Faculty Review Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {profile.full_name} - {profile.department}
        </p>
      </div>

      {/* Statistics Cards */}
      {/* <div className="grid gap-6 md:grid-cols-4 mb-8">
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
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div> */}

      {/* Permission Slips List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permission Slip Requests</CardTitle>
            </div>
              <BulkPDFButton
                permissionSlips={permissionSlips.map((slip) => ({
                  ...slip,
                  student: {
                    full_name: slip.profiles?.full_name || "",
                    student_id: slip.profiles?.student_id || "",
                    email: slip.profiles?.email || "",
                  },
                  faculty_reviewer: {
                    full_name: profile.full_name,
                    department: profile.department,
                  },
                }))}
              />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <PermissionSlipSkeleton variant="faculty" showStats={false} count={5} />
          ) : permissionSlips.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No requests found</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {permissionSlips.map((slip) => (
                <div key={slip.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{slip.title}</h3>
                        <Badge className={getStatusColor(slip.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(slip.status)}
                            {slip.status.charAt(0).toUpperCase() + slip.status.slice(1)}
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {slip.profiles?.full_name} (ID: {slip.profiles?.student_id})
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(slip.event_date).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{slip.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <PDFDownloadButton
                        permissionSlip={{
                          ...slip,
                          student: {
                            full_name: slip.profiles?.full_name || "",
                            student_id: slip.profiles?.student_id || "",
                            email: slip.profiles?.email || "",
                          },
                          faculty_reviewer: {
                            full_name: profile.full_name,
                            department: profile.department,
                          },
                        }}
                      />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSlip(slip)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Permission Slip Request</DialogTitle>
                          </DialogHeader>
                          {selectedSlip && (
                            <div className="space-y-8">
                              <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                  <h3 className="font-semibold mb-2">Reason of exception</h3>
                                  <div className="grid gap-2 text-sm">
                                    <div>
                                       {selectedSlip.title}
                                    </div>
                                    <div>
                                      <strong>Description:</strong> {selectedSlip.description}
                                    </div>
                                    <div>
                                      <strong>Date:</strong> {new Date(selectedSlip.event_date).toLocaleDateString()}
                                    </div>

                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold mb-2">Student Information</h3>
                                  <div className="grid gap-2 text-sm">
                                    <div>
                                      <strong>Name:</strong> {selectedSlip.profiles?.full_name}
                                    </div>
                                    <div>
                                      <strong>Student ID:</strong> {selectedSlip.profiles?.student_id}
                                    </div>
                                    <div>
                                      <strong>Email:</strong> {selectedSlip.profiles?.email}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold mb-2">Emergency Contact</h3>
                                  <div className="grid gap-2 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-4 w-4" />
                                      <strong>Phone:</strong> {selectedSlip.emergency_contact_phone}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                {selectedSlip.status === "pending" && (
                                  <div className="flex gap-4">
                                    <Button
                                      onClick={() => handleReview(selectedSlip.id, "approved")}
                                      disabled={isReviewing}
                                      className="flex-1"
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => handleReview(selectedSlip.id, "rejected")}
                                      disabled={isReviewing}
                                      variant="destructive"
                                      className="flex-1"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                )}

                                {selectedSlip.status !== "pending" && (
                                  <div className="p-4 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      {getStatusIcon(selectedSlip.status)}
                                      <span className="font-medium">
                                        {selectedSlip.status === "approved" ? "Approved" : "Rejected"}
                                      </span>
                                      {selectedSlip.reviewed_at && (
                                        <span className="text-sm text-muted-foreground">
                                          on {new Date(selectedSlip.reviewed_at).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                    {selectedSlip.faculty_comments && (
                                      <p className="text-sm">{selectedSlip.faculty_comments}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
