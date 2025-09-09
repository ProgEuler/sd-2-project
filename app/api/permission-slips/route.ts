import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ProfileService } from '@/lib/mongodb/services/profile-service'
import { PermissionSlipService } from '@/lib/mongodb/services/permission-slip-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userProfile = await ProfileService.getProfileBySupabaseId(user.id)
    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    let permissionSlips
    if (userProfile.role === 'student') {
      // Students can only see their own slips
      const slips = await PermissionSlipService.getPermissionSlipsByStudent(user.id)
      permissionSlips = slips.map(slip => ({
        _id: slip._id.toString(),
        title: slip.title,
        description: slip.description,
        event_date: slip.event_date.toISOString(),
        event_location: slip.event_location,
        status: slip.status,
        faculty_comments: slip.faculty_comments,
        created_at: slip.created_at.toISOString(),
      }))
    } else {
      // Faculty and admin can see all slips with student info
      permissionSlips = await PermissionSlipService.getAllPermissionSlipsWithStudentInfo()
      permissionSlips = permissionSlips.map(slip => ({
        _id: slip._id.toString(),
        title: slip.title,
        description: slip.description,
        event_date: slip.event_date.toISOString(),
        event_location: slip.event_location,
        status: slip.status,
        faculty_comments: slip.faculty_comments,
        created_at: slip.created_at.toISOString(),
        student_profile: slip.student_profile,
      }))
    }

    return NextResponse.json(permissionSlips)
  } catch (error) {
    console.error('Error fetching permission slips:', error)
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

    const userProfile = await ProfileService.getProfileBySupabaseId(user.id)
    if (!userProfile || userProfile.role !== 'student') {
      return NextResponse.json({ error: 'Only students can create permission slips' }, { status: 403 })
    }

    const body = await request.json()
    const permissionSlip = await PermissionSlipService.createPermissionSlip({
      student_id: user.id,
      title: body.title,
      description: body.description,
      event_date: new Date(body.event_date),
      event_location: body.event_location,
      emergency_contact_name: body.emergency_contact_name,
      emergency_contact_phone: body.emergency_contact_phone,
    })

    // Convert to plain object
    const plainSlip = {
      _id: permissionSlip._id.toString(),
      title: permissionSlip.title,
      description: permissionSlip.description,
      event_date: permissionSlip.event_date.toISOString(),
      event_location: permissionSlip.event_location,
      status: permissionSlip.status,
      created_at: permissionSlip.created_at.toISOString(),
    }

    return NextResponse.json(plainSlip)
  } catch (error) {
    console.error('Error creating permission slip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}