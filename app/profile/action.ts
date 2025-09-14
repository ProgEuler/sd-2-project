'use server'

import { createClient } from '@/utils/supabase/server'

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

export async function fetchUserProfile(
  prevState: ProfileState
): Promise<ProfileState> {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('Auth error:', authError)
      return { error: authError.message }
    }

    if (!user) {
      return { error: 'No authenticated user found' }
    }

    // Option 1: Get data from user metadata (if stored during signup)
    const profileFromMetadata = {
      name: user.user_metadata?.full_name || user.user_metadata?.name || 'N/A',
      id: user.user_metadata?.student_id || user.id,
      section: user.user_metadata?.section || 'N/A',
      department: user.user_metadata?.department || 'N/A',
      semester: user.user_metadata?.semester || 'N/A',
      email: user.email || 'N/A',
      role: 'student'
    }
    return {
      profile: profileFromMetadata,
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
  const userId = formData.get('userId') as string

  try {
    const supabase = await createClient()

    // If you want to fetch a specific user's profile
    if (userId) {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        return { error: 'Profile not found' }
      }

      return {
        profile: profileData,
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
