import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentDashboard } from "@/components/student-dashboard"
import { FacultyDashboard } from "@/components/faculty-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile to determine role
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Render appropriate dashboard based on role
  switch (profile.role) {
    case "student":
      return <StudentDashboard profile={profile} />
    case "faculty":
      return <FacultyDashboard profile={profile} />
    case "admin":
      return <AdminDashboard profile={profile} />
    default:
      redirect("/auth/login")
  }
}
