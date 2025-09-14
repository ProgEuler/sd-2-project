'use server'

import { createClient } from '@/utils/supabase/server'
import { dbConnect } from '@/lib/mongodb'
import User from '@/models/User'

export interface UserProfile {
  name: string
  id: string
  section: string
  department: string
  semester: string
  email: string
  role: string
}

export interface ProfileState {
  profile?: UserProfile
  error?: string
  success?: string
}

export interface UpdateProfileData {
  name?: string
  section?: string
  department?: string
  semester?: string
  student_id?: string
}

export async function fetchUserProfile(
  prevState: ProfileState
): Promise<ProfileState> {
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

    // Connect to MongoDB and fetch user profile
    await dbConnect()
    
    const mongoUser = await User.findOne({ supabaseId: user.id })

    if (!mongoUser) {
      return { error: 'User profile not found in database' }
    }

    // Map MongoDB user data to UserProfile interface
    const userProfile: UserProfile = {
      name: mongoUser.name || 'N/A',
      id: mongoUser.student_id || mongoUser.supabaseId,
      section: mongoUser.section || 'N/A',
      department: mongoUser.department || 'N/A',
      semester: mongoUser.semester || 'N/A',
      email: mongoUser.email || user.email || 'N/A',
      role: mongoUser.role || 'student'
    }

    return {
      profile: userProfile,
      success: 'Profile loaded successfully'
    }

  } catch (error) {
    console.error('Unexpected error in fetchUserProfile:', error)
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

// Alternative action that takes FormData (if you need to pass parameters)
export async function fetchUserProfileWithParams(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const studentId = formData.get('studentId') as string

  try {
    await dbConnect()

    // If you want to fetch a specific user's profile by student ID
    if (studentId) {
      const mongoUser = await User.findOne({ student_id: studentId })

      if (!mongoUser) {
        return { error: 'User profile not found' }
      }

      const userProfile: UserProfile = {
        name: mongoUser.name || 'N/A',
        id: mongoUser.student_id || mongoUser.supabaseId,
        section: mongoUser.section || 'N/A',
        department: mongoUser.department || 'N/A',
        semester: mongoUser.semester || 'N/A',
        email: mongoUser.email || 'N/A',
        role: mongoUser.role || 'student'
      }

      return {
        profile: userProfile,
        success: 'Profile loaded successfully'
      }
    }

    // Otherwise fetch current user (same as above)
    return fetchUserProfile(prevState)

  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to fetch profile'
    }
  }
}

// Function to update user profile in MongoDB
export async function updateUserProfile(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
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

    // Get update data from form
    const updateData: any = {}
    
    const name = formData.get('name') as string
    const section = formData.get('section') as string
    const department = formData.get('department') as string
    const semester = formData.get('semester') as string
    const studentId = formData.get('studentId') as string

    // Only include fields that were provided
    if (name) updateData.name = name
    if (section) updateData.section = section
    if (department) updateData.department = department
    if (semester) updateData.semester = semester
    if (studentId) updateData.student_id = studentId

    // Update the user in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { supabaseId: user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return { error: 'User profile not found in database' }
    }

    // Return updated profile
    const userProfile: UserProfile = {
      name: updatedUser.name || 'N/A',
      id: updatedUser.student_id || updatedUser.supabaseId,
      section: updatedUser.section || 'N/A',
      department: updatedUser.department || 'N/A',
      semester: updatedUser.semester || 'N/A',
      email: updatedUser.email || user.email || 'N/A',
      role: updatedUser.role || 'student'
    }

    return {
      profile: userProfile,
      success: 'Profile updated successfully'
    }

  } catch (error) {
    console.error('Error updating profile:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update profile'
    }
  }
}
