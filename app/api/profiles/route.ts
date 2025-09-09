import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ProfileService } from '@/lib/mongodb/services/profile-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const userProfile = await ProfileService.getProfileBySupabaseId(user.id)
    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { profiles, stats } = await ProfileService.getProfilesWithStats()
    
    // Convert MongoDB documents to plain objects
    const plainProfiles = profiles.map(profile => ({
      id: profile.supabase_user_id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      student_id: profile.student_id,
      department: profile.department,
      created_at: profile.created_at.toISOString(),
    }))

    return NextResponse.json({ profiles: plainProfiles, stats })
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const profile = await ProfileService.createProfile({
      supabase_user_id: user.id,
      email: body.email,
      full_name: body.full_name,
      role: body.role,
      student_id: body.student_id,
      department: body.department,
    })

    // Convert to plain object
    const plainProfile = {
      id: profile.supabase_user_id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      student_id: profile.student_id,
      department: profile.department,
      created_at: profile.created_at.toISOString(),
    }

    return NextResponse.json(plainProfile)
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}