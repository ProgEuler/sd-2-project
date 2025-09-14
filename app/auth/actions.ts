'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { UserProfile } from '@/types/profile'
import { dbConnect } from '@/lib/mongodb'
import User from '@/models/User'

type LoginState = {
  error?: string
  success?: string
}

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

//   console.log('Login action received:', { email, password, formDataKeys: Array.from(formData.keys()) })

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const supabase = await createClient()

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  // Validate required fields
  if (!email || !password || !name) {
    return { error: 'Email, password, and full name are required' }
  }

  const { data: user, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  try {
    await dbConnect();

    await User.create({
      supabaseId: user.user?.id,
      email: formData.get("email"),
      name: formData.get("fullName"),
      role: "student",
      section: formData.get("section"),
      department: formData.get("department"),
      student_id: formData.get("studentId"),
      semester: formData.get("semester"),
    });
  } catch (dbError: any) {
    console.error('Database error:', dbError)
    return { error: `Database error: ${dbError.message}` }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/auth/login')
}
