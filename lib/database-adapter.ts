/**
 * Database Adapter
 * Provides a unified interface that can work with either Supabase or MongoDB
 */

import { createClient } from '@/lib/supabase/server'
import { ProfileService } from '@/lib/mongodb/services/profile-service'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'student' | 'faculty' | 'admin'
  student_id?: string
  department?: string
  created_at: string
}

export class DatabaseAdapter {
  private static useSupabase = !process.env.MONGODB_URI

  static async getProfile(supabaseUserId: string): Promise<Profile | null> {
    if (this.useSupabase) {
      return this.getProfileFromSupabase(supabaseUserId)
    } else {
      return this.getProfileFromMongoDB(supabaseUserId)
    }
  }

  static async createProfile(supabaseUserId: string, profileData: Omit<Profile, 'id' | 'created_at'>): Promise<Profile> {
    if (this.useSupabase) {
      return this.createProfileInSupabase(supabaseUserId, profileData)
    } else {
      return this.createProfileInMongoDB(supabaseUserId, profileData)
    }
  }

  private static async getProfileFromSupabase(supabaseUserId: string): Promise<Profile | null> {
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUserId)
      .single()

    if (!profile) return null

    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      student_id: profile.student_id,
      department: profile.department,
      created_at: profile.created_at,
    }
  }

  private static async getProfileFromMongoDB(supabaseUserId: string): Promise<Profile | null> {
    try {
      const profile = await ProfileService.getProfileBySupabaseId(supabaseUserId)
      
      if (!profile) return null

      return {
        id: profile.supabase_user_id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        student_id: profile.student_id,
        department: profile.department,
        created_at: profile.created_at.toISOString(),
      }
    } catch (error) {
      console.error('MongoDB error, falling back to Supabase:', error)
      this.useSupabase = true
      return this.getProfileFromSupabase(supabaseUserId)
    }
  }

  private static async createProfileInSupabase(supabaseUserId: string, profileData: Omit<Profile, 'id' | 'created_at'>): Promise<Profile> {
    const supabase = await createClient()
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        id: supabaseUserId,
        email: profileData.email,
        full_name: profileData.full_name,
        role: profileData.role,
        student_id: profileData.student_id,
        department: profileData.department,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      student_id: profile.student_id,
      department: profile.department,
      created_at: profile.created_at,
    }
  }

  private static async createProfileInMongoDB(supabaseUserId: string, profileData: Omit<Profile, 'id' | 'created_at'>): Promise<Profile> {
    try {
      const profile = await ProfileService.upsertProfile({
        supabase_user_id: supabaseUserId,
        email: profileData.email,
        full_name: profileData.full_name,
        role: profileData.role,
        student_id: profileData.student_id,
        department: profileData.department,
      })

      return {
        id: profile.supabase_user_id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        student_id: profile.student_id,
        department: profile.department,
        created_at: profile.created_at.toISOString(),
      }
    } catch (error) {
      console.error('MongoDB error, falling back to Supabase:', error)
      this.useSupabase = true
      return this.createProfileInSupabase(supabaseUserId, profileData)
    }
  }
}