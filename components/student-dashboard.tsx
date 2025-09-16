"use client"

import { useActionState, useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileTextIcon, PlusIcon, RefreshCwIcon, UserIcon, Clock, CheckCircle, XCircle } from "lucide-react"
import { fetchDashboardData, submitPermissionRequest, DashboardState } from "@/app/dashboard/actions"
import { toast } from "sonner"
import { PDFDownloadButton } from "@/components/pdf-download-button"

export function StudentDashboard() {
  const [isClient, setIsClient] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [formData, setFormData] = useState({
    requestType: "",
    subject: "",
    reason: "",
  })

  const [state, fetchAction] = useActionState(fetchDashboardData, {
    user: undefined,
    requests: undefined,
    error: undefined,
    success: undefined
  } as DashboardState)

  const [requestState, submitAction, isPending_SubmitResponse] = useActionState(submitPermissionRequest, {
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

  // Handle toast notifications
  useEffect(() => {
    if (state.error) {
      toast.error(state.error)
    }
  }, [state.error])

  useEffect(() => {
    if (requestState.error) {
      toast.error(requestState.error)
    }
    if (requestState.success && requestState.success.includes('Permission request submitted successfully')) {
      toast.success('Permission request submitted successfully!')
      setShowRequestForm(false)
      setFormData({
        requestType: "",
        subject: "",
        reason: "",
      })
    }
  }, [requestState])

  // Don't render anything until we're on the client
  if (!isClient) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Loading Dashboard...</h2>
        <p className="text-muted-foreground">Please wait while we load your profile.</p>
      </div>
    </div>
  }

  // Show loading state
  if (isPending || (!state.user && !state.error)) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <RefreshCwIcon className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        <p className="text-muted-foreground">Fetching your dashboard data...</p>
      </div>
    </div>
  }

  // Show error state
  if (state.error) {
    return <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <p className="text-red-500 mb-4">Error: {state.error}</p>
          <form action={fetchAction}>
            <Button type="submit" variant="outline" loading={isPending}>
              {isPending ? 'Loading...' : 'Try Again'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  }

  const user = requestState.user || state.user
  const requests = requestState.requests || state.requests || []

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">No Profile Available</h2>
        <p className="text-muted-foreground">Unable to load your profile data.</p>
      </div>
    </div>
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
        return <FileTextIcon className="h-4 w-4" />
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

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name} {user.studentId && `(ID: ${user.studentId})`}
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setShowRequestForm(true)} disabled={isPending}>
            New Request
          </Button>
          <form action={fetchAction}>
            <Button type="submit" variant="outline" loading={isPending}>
              Refresh
            </Button>
          </form>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter((req) => req.status === "pending").length}
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
              {requests.filter((req) => req.status === "approved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permission Request Form */}
      {showRequestForm && (
        <Card className="mb-8">
          <CardContent>
            <form action={submitAction}>
              <div className="grid grid-4 gap-4">
               <div className="flex gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="requestType">Request Type</Label>
                  <Select
                    name="requestType"
                    value={formData.requestType}
                    onValueChange={(value) => setFormData({ ...formData, requestType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leave">Leave Application</SelectItem>
                      <SelectItem value="exam_absence">Exam Absence</SelectItem>
                      <SelectItem value="medical">Medical Leave</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="family_emergency">Family Emergency</SelectItem>
                      <SelectItem value="official_work">Official Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2 w-full">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Brief subject of your request"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

               </div>

                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Detailed reason for your request"
                    required
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" loading={isPending_SubmitResponse}>
                    {isPending_SubmitResponse ? 'Submitting...' : 'Submit Request'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRequestForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Permission Requests List */}
      <Card>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <FileTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
              <p className="text-muted-foreground mb-4">Submit your first permission request to get started.</p>
              <Button onClick={() => setShowRequestForm(true)} disabled={isPending}>
                Create Request
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{request.subject}</h3>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(request.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      </Badge>
                      {request.status === "approved" && (
                        <PDFDownloadButton request={request} user={user} />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {request.requestType.replace('_', ' ')}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> {new Date(request.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  {request.facultyComments && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700">Faculty Comments:</p>
                      <p className="text-sm text-gray-600">{request.facultyComments}</p>
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
