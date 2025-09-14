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
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;

  const { data: user, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  await dbConnect();

  await User.create({
    supabaseId: user.user?.id,
    email: formData.get("email"),
    name: formData.get("name"),
    role: "student",
    section: formData.get("section"),
    department: formData.get("department"),
    student_id: formData.get("student_id"),
    semester: formData.get("semester"),
  });

  revalidatePath('/', 'layout')
  redirect('/')
  return { success: 'registration completed'}
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
