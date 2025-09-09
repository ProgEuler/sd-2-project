import { ObjectId } from 'mongodb'

export interface Profile {
  _id?: ObjectId
  supabase_user_id: string // Link to Supabase auth user
  email: string
  full_name: string
  role: 'student' | 'faculty' | 'admin'
  student_id?: string
  department?: string
  created_at: Date
  updated_at: Date
}

export interface PermissionSlip {
  _id?: ObjectId
  student_id: string // Supabase user ID
  reason_of_exception: string
  description: string
  due_amount: number
  emergency_contact_phone: string
  status: 'pending' | 'approved' | 'rejected'
  faculty_reviewer_id?: string // Supabase user ID
  faculty_comments?: string
  reviewed_at?: Date
  created_at: Date
  updated_at: Date
}

export interface Notification {
  _id?: ObjectId
  user_id: string // Supabase user ID
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: Date
}

// Collection names
export const COLLECTIONS = {
  PROFILES: 'profiles',
  PERMISSION_SLIPS: 'permission_slips',
  NOTIFICATIONS: 'notifications',
} as const