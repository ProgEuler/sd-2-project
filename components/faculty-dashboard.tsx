"use client"

import { useActionState, useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, Clock, CheckCircle, XCircle, Eye, Calendar, Phone, User, RefreshCwIcon, ThumbsUp, ThumbsDown } from "lucide-react"
import { fetchDashboardData, reviewPermissionRequest, DashboardState } from "@/app/dashboard/actions"
import { toast } from "sonner"

export function FacultyDashboard() {
  const [isClient, setIsClient] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [reviewComments, setReviewComments] = useState('')

  const [state, fetchAction] = useActionState(fetchDashboardData, {
    user: undefined,
    requests: undefined,
    error: undefined,
    success: undefined
  } as DashboardState)

  const [reviewState, reviewAction] = useActionState(reviewPermissionRequest, {
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
    if (state.success) {
      toast.success(state.success)
    }
  }, [state.error, state.success])

  // Handle review toast notifications
  useEffect(() => {
    if (reviewState.error) {
      toast.error(reviewState.error)
    }
    if (reviewState.success) {
      toast.success(reviewState.success)
      // Refresh data after successful review
      startTransition(() => {
        fetchAction()
      })
    }
  }, [reviewState.error, reviewState.success, fetchAction])

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Faculty Dashboard...</h2>
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
          <p className="text-muted-foreground">Fetching dashboard data...</p>
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

  const user = state.user
  const requests = state.requests || []

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Profile Available</h2>
          <p className="text-muted-foreground">Unable to load your profile data.</p>
        </div>
      </div>
    )
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

  const pendingCount = requests.filter((request) => request.status === "pending").length
  const approvedCount = requests.filter((request) => request.status === "approved").length
  const rejectedCount = requests.filter((request) => request.status === "rejected").length

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Faculty Review Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {user.name} - {user.department}
          </p>
        </div>
        <form action={fetchAction}>
          <Button type="submit" variant="outline" disabled={isPending}>
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </form>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
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
      </div>

      {/* Permission Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Requests from Students</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No requests found</h3>
              <p className="text-muted-foreground">Students haven't submitted any permission requests yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{request.subject}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Student Request
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(request.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{request.reason}</p>
                      <div className="text-sm">
                        <span className="font-medium">Type:</span> {request.requestType.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request)
                              setReviewComments('')
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Permission Request</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid gap-4">
                              <div>
                                <h3 className="font-semibold mb-2">Request Details</h3>
                                <div className="grid gap-2 text-sm">
                                  <div><strong>Subject:</strong> {request.subject}</div>
                                  <div><strong>Type:</strong> {request.requestType.replace('_', ' ')}</div>
                                  <div><strong>Reason:</strong> {request.reason}</div>
                                  <div><strong>Submitted:</strong> {new Date(request.submittedAt).toLocaleDateString()}</div>
                                  {request.studentName && (
                                    <div><strong>Student:</strong> {request.studentName} ({request.studentId})</div>
                                  )}
                                  {request.email && (
                                    <div><strong>Email:</strong> {request.email}</div>
                                  )}
                                  {request.department && (
                                    <div><strong>Department:</strong> {request.department}</div>
                                  )}
                                </div>
                              </div>

                              {request.status !== "pending" && (
                                <div className="p-4 bg-muted rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getStatusIcon(request.status)}
                                    <span className="font-medium">
                                      {request.status === "approved" ? "Approved" : "Rejected"}
                                    </span>
                                  </div>
                                  {request.facultyComments && (
                                    <p className="text-sm">{request.facultyComments}</p>
                                  )}
                                </div>
                              )}

                              {request.status === "pending" && (
                                <div className="space-y-4">
                                  <div className="flex gap-3">
                                    <form
                                      action={reviewAction}
                                      className="flex-1"
                                      onSubmit={() => {
                                        toast.success('Processing approval...')
                                      }}
                                    >
                                      <input type="hidden" name="requestId" value={request.id} />
                                      <input type="hidden" name="action" value="approve" />
                                      <input type="hidden" name="comments" value={reviewComments} />
                                      <Button type="submit" className="w-full" disabled={isPending}>
                                        <ThumbsUp className="h-4 w-4 mr-2" />
                                        Approve
                                      </Button>
                                    </form>

                                    <form
                                      action={reviewAction}
                                      className="flex-1"
                                      onSubmit={() => {
                                        toast.success('Processing rejection...')
                                      }}
                                    >
                                      <input type="hidden" name="requestId" value={request.id} />
                                      <input type="hidden" name="action" value="reject" />
                                      <input type="hidden" name="comments" value={reviewComments} />
                                      <Button type="submit" variant="destructive" className="w-full" disabled={isPending}>
                                        <ThumbsDown className="h-4 w-4 mr-2" />
                                        Reject
                                      </Button>
                                    </form>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
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
