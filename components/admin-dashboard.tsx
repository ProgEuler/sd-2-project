"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, FileText, Clock, Eye, Edit, Trash2, Download, Search, TrendingUp } from "lucide-react"
import { BulkPDFButton } from "@/components/pdf-download-button"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  department?: string
  student_id?: string
  created_at: string
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
  profiles?: {
    full_name: string
    student_id: string
    email: string
  }
}

interface AdminDashboardProps {
  profile: Profile
}

export function AdminDashboard({ profile }: AdminDashboardProps) {
  const [users, setUsers] = useState<Profile[]>([])
  const [permissionSlips, setPermissionSlips] = useState<PermissionSlip[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([])
  const [filteredSlips, setFilteredSlips] = useState<PermissionSlip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [slipSearchTerm, setSlipSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [isEditingUser, setIsEditingUser] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, userSearchTerm, roleFilter])

  useEffect(() => {
    filterSlips()
  }, [permissionSlips, slipSearchTerm, statusFilter])

  const fetchData = async () => {
    const supabase = createClient()

    // Fetch all users
    const { data: usersData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

    // Fetch all permission slips with student info
    const { data: slipsData } = await supabase
      .from("permission_slips")
      .select(`
        *,
        profiles:student_id (
          full_name,
          student_id,
          email
        )
      `)
      .order("created_at", { ascending: false })

    if (usersData) setUsers(usersData)
    if (slipsData) setPermissionSlips(slipsData)
    setIsLoading(false)
  }

  const filterUsers = () => {
    let filtered = users

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    if (userSearchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.full_name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          (user.student_id && user.student_id.toLowerCase().includes(userSearchTerm.toLowerCase())),
      )
    }

    setFilteredUsers(filtered)
  }

  const filterSlips = () => {
    let filtered = permissionSlips

    if (statusFilter !== "all") {
      filtered = filtered.filter((slip) => slip.status === statusFilter)
    }

    if (slipSearchTerm) {
      filtered = filtered.filter(
        (slip) =>
          slip.title.toLowerCase().includes(slipSearchTerm.toLowerCase()) ||
          slip.profiles?.full_name.toLowerCase().includes(slipSearchTerm.toLowerCase()),
      )
    }

    setFilteredSlips(filtered)
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

    if (!error) {
      await fetchData()
      setSelectedUser(null)
      setIsEditingUser(false)
    }
  }

  const deleteUser = async (userId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("profiles").delete().eq("id", userId)

    if (!error) {
      await fetchData()
      setSelectedUser(null)
    }
  }

  const exportData = () => {
    const csvContent = [
      ["Student Name", "Student ID", "Event Title", "Event Date", "Status", "Submitted Date"].join(","),
      ...permissionSlips.map((slip) =>
        [
          slip.profiles?.full_name || "",
          slip.profiles?.student_id || "",
          slip.title,
          slip.event_date,
          slip.status,
          new Date(slip.created_at).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "permission_slips_report.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "faculty":
        return "bg-blue-100 text-blue-800"
      case "student":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  // Calculate statistics
  const totalUsers = users.length
  const studentCount = users.filter((u) => u.role === "student").length
  const facultyCount = users.filter((u) => u.role === "faculty").length
  const adminCount = users.filter((u) => u.role === "admin").length
  const totalSlips = permissionSlips.length
  const pendingSlips = permissionSlips.filter((s) => s.status === "pending").length
  const approvedSlips = permissionSlips.filter((s) => s.status === "approved").length
  const rejectedSlips = permissionSlips.filter((s) => s.status === "rejected").length

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Management Panel</h1>
        <p className="text-muted-foreground">Welcome, {profile.full_name} - System Administrator</p>
      </div>

      {/* Overview Statistics */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {studentCount} students, {facultyCount} faculty, {adminCount} admins
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSlips}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingSlips}</div>
            <p className="text-xs text-muted-foreground">Awaiting faculty review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalSlips > 0 ? Math.round((approvedSlips / (approvedSlips + rejectedSlips)) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {approvedSlips} approved, {rejectedSlips} rejected
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="requests">Request Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and roles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* User Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="userSearch">Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="userSearch"
                      placeholder="Search by name, email, or student ID..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Label htmlFor="roleFilter">Role Filter</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="student">Students</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="admin">Administrators</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Users Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>ID/Department</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.student_id || user.department || "-"}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setIsEditingUser(false)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>User Details</DialogTitle>
                                </DialogHeader>
                                {selectedUser && (
                                  <div className="space-y-4">
                                    <div className="grid gap-2">
                                      <Label>Full Name</Label>
                                      <Input value={selectedUser.full_name} disabled />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Email</Label>
                                      <Input value={selectedUser.email} disabled />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Role</Label>
                                      {isEditingUser ? (
                                        <Select
                                          value={selectedUser.role}
                                          onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="faculty">Faculty</SelectItem>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <Input value={selectedUser.role} disabled />
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      {isEditingUser ? (
                                        <>
                                          <Button
                                            onClick={() => updateUserRole(selectedUser.id, selectedUser.role)}
                                            className="flex-1"
                                          >
                                            Save Changes
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() => setIsEditingUser(false)}
                                            className="flex-1"
                                          >
                                            Cancel
                                          </Button>
                                        </>
                                      ) : (
                                        <>
                                          <Button onClick={() => setIsEditingUser(true)} className="flex-1">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Role
                                          </Button>
                                          <Button
                                            variant="destructive"
                                            onClick={() => deleteUser(selectedUser.id)}
                                            className="flex-1"
                                          >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Request Overview Tab */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Permission Slip Overview</CardTitle>
                  <CardDescription>System-wide view of all permission slip requests</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Request Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="slipSearch">Search Requests</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="slipSearch"
                      placeholder="Search by title or student name..."
                      value={slipSearchTerm}
                      onChange={(e) => setSlipSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Label htmlFor="statusFilter">Status Filter</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Requests Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Title</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Event Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSlips.map((slip) => (
                      <TableRow key={slip.id}>
                        <TableCell className="font-medium">{slip.title}</TableCell>
                        <TableCell>
                          {slip.profiles?.full_name} ({slip.profiles?.student_id})
                        </TableCell>
                        <TableCell>{new Date(slip.event_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(slip.status)}>
                            {slip.status.charAt(0).toUpperCase() + slip.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(slip.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Analytics & Reports</CardTitle>
                    <CardDescription>System usage statistics and data export</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <BulkPDFButton
                      permissionSlips={permissionSlips.map((slip) => ({
                        ...slip,
                        student: {
                          full_name: slip.profiles?.full_name || "",
                          student_id: slip.profiles?.student_id || "",
                          email: slip.profiles?.email || "",
                        },
                      }))}
                    />
                    <Button onClick={exportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-4">Request Status Distribution</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Pending</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{
                                width: `${totalSlips > 0 ? (pendingSlips / totalSlips) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{pendingSlips}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Approved</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${totalSlips > 0 ? (approvedSlips / totalSlips) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{approvedSlips}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Rejected</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{
                                width: `${totalSlips > 0 ? (rejectedSlips / totalSlips) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{rejectedSlips}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">User Role Distribution</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Students</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${totalUsers > 0 ? (studentCount / totalUsers) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{studentCount}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Faculty</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${totalUsers > 0 ? (facultyCount / totalUsers) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{facultyCount}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Administrators</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{
                                width: `${totalUsers > 0 ? (adminCount / totalUsers) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{adminCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
