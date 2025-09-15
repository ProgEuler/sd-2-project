'use server'

import { createClient } from '@/utils/supabase/server'
import { dbConnect } from '@/lib/mongodb'
import User from '@/models/User'
import PermissionRequest from '@/models/PermissionRequest'
import { revalidatePath } from 'next/cache'

export interface DashboardUser {
  name: string
  studentId: string
  email: string
  department: string
  section: string
  semester: string
  role: string
}

export interface PermissionRequestData {
  id: string
  requestType: string
  subject: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  facultyComments?: string
  studentName?: string
  studentId?: string
  email?: string
  department?: string
  section?: string
  semester?: string
}

export interface DashboardState {
  user?: DashboardUser
  requests?: PermissionRequestData[]
  error?: string
  success?: string
}

export async function fetchDashboardData(
  prevState: DashboardState
): Promise<DashboardState> {
  try {
    const supabase = await createClient()

    // Get authenticated user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('Auth error:', authError)
      return { error: authError.message }
    }

    if (!user) {
      return { error: 'No authenticated user found' }
    }

    // Connect to MongoDB
    await dbConnect()

    // Fetch user profile from MongoDB
    const mongoUser = await User.findOne({ supabaseId: user.id })

    if (!mongoUser) {
      return { error: 'User profile not found in database' }
    }

    // Fetch permission requests - all requests for faculty, user's own for students
    let requests
    if (mongoUser.role === 'faculty') {
      // Faculty sees all permission requests
      requests = await PermissionRequest.find({})
        .sort({ createdAt: -1 })
        .lean()
    } else {
      // Students see only their own requests
      requests = await PermissionRequest.find({ userId: user.id })
        .sort({ createdAt: -1 })
        .lean()
    }

    interface MongoPermissionRequest {
        _id: any; // or mongoose.Types.ObjectId
        requestType: string;
        subject: string;
        reason: string;
        status: 'pending' | 'approved' | 'rejected';
        submittedAt: Date;
        facultyComments?: string;
        studentName?: string;
        studentId?: string;
        email?: string;
        department?: string;
        section?: string;
        semester?: string;
      }

    // Map user data
    const dashboardUser: DashboardUser = {
      name: mongoUser.name,
      studentId: mongoUser.student_id,
      email: mongoUser.email,
      department: mongoUser.department,
      section: mongoUser.section,
      semester: mongoUser.semester,
      role: mongoUser.role,
    }

    // Map permission requests
    const permissionRequests: PermissionRequestData[] = (requests as any as MongoPermissionRequest[]).map(request => ({
      id: request._id.toString(),
      requestType: request.requestType,
      subject: request.subject,
      reason: request.reason,
      status: request.status,
      submittedAt: request.submittedAt.toISOString(),
      facultyComments: request.facultyComments,
      studentName: request.studentName,
      studentId: request.studentId,
      email: request.email,
      department: request.department,
      section: request.section,
      semester: request.semester,
    }))

    return {
      user: dashboardUser,
      requests: permissionRequests,
      success: 'Dashboard data loaded successfully'
    }

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to load dashboard data'
    }
  }
}

export async function submitPermissionRequest(
  prevState: DashboardState,
  formData: FormData
): Promise<DashboardState> {
  try {
    const supabase = await createClient()

    // Get authenticated user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      return { error: authError.message }
    }

    if (!user) {
      return { error: 'No authenticated user found' }
    }

    // Connect to MongoDB
    await dbConnect()

    // Fetch user profile
    const mongoUser = await User.findOne({ supabaseId: user.id })

    if (!mongoUser) {
      return { error: 'User profile not found' }
    }

    // Extract form data
    const requestType = formData.get('requestType') as string
    const subject = formData.get('subject') as string
    const reason = formData.get('reason') as string

    // Validate required fields
    if (!requestType || !subject || !reason) {
      return { error: 'All required fields must be filled' }
    }

    // Create permission request
    const permissionRequest = await PermissionRequest.create({
      userId: user.id,
      studentId: mongoUser.student_id,
      studentName: mongoUser.name,
      email: mongoUser.email,
      department: mongoUser.department,
      section: mongoUser.section,
      semester: mongoUser.semester,
      requestType,
      subject,
      reason,
      status: 'pending'
    })

    // Revalidate the dashboard page
    revalidatePath('/dashboard')

    // Return success with updated data
    const updatedState = await fetchDashboardData(prevState)
    return {
      ...updatedState,
      success: 'Permission request submitted successfully'
    }

  } catch (error) {
    console.error('Error submitting permission request:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to submit permission request'
    }
  }
}

export async function reviewPermissionRequest(
  prevState: DashboardState,
  formData: FormData
): Promise<DashboardState> {
  try {
    const supabase = await createClient()

    // Get authenticated user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      return { error: authError.message }
    }

    if (!user) {
      return { error: 'No authenticated user found' }
    }

    // Connect to MongoDB
    await dbConnect()

    // Fetch user profile to verify faculty role
    const mongoUser = await User.findOne({ supabaseId: user.id })

    if (!mongoUser) {
      return { error: 'User profile not found' }
    }

    if (mongoUser.role !== 'faculty') {
      return { error: 'Only faculty members can review permission requests' }
    }

    // Extract form data
    const requestId = formData.get('requestId') as string
    const action = formData.get('action') as 'approve' | 'reject'
    const comments = formData.get('comments') as string

    // Validate required fields
    if (!requestId || !action) {
      return { error: 'Request ID and action are required' }
    }

    // Update the permission request
    const updatedRequest = await PermissionRequest.findByIdAndUpdate(
      requestId,
      {
        status: action === 'approve' ? 'approved' : 'rejected',
        facultyComments: comments || undefined,
        reviewedAt: new Date(),
        reviewedBy: mongoUser.name,
        facultyId: user.id
      },
      { new: true }
    )

    if (!updatedRequest) {
      return { error: 'Permission request not found' }
    }

    // Revalidate the dashboard page
    revalidatePath('/dashboard')

    // Return success with updated data
    const updatedState = await fetchDashboardData(prevState)
    return {
      ...updatedState,
      success: `Permission request ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    }

  } catch (error) {
    console.error('Error reviewing permission request:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to review permission request'
    }
  }
}
