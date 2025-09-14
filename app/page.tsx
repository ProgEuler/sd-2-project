import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Shield,
  Clock,
  CheckCircle,
  Building,
  Users
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { dbConnect } from "@/lib/mongodb"
import User from "@/models/User"

export default async function Homepage() {
 const supabase = await createClient()
 const { data, error } = await supabase.auth.getUser()

 if(data.user && !error) {
   try {
     // Connect to MongoDB and fetch user profile
     await dbConnect()
     const mongoUser = await User.findOne({ supabaseId: data.user.id })

     if (mongoUser && mongoUser.role === 'faculty') {
       // Redirect faculty users directly to dashboard
       redirect('/dashboard')
     } else {
       // Redirect students to profile page
       redirect('/profile')
     }
   } catch (dbError) {
     console.error('Database error:', dbError)
     // Fallback to profile if there's an error
     redirect('/profile')
   }
 }
 else redirect('/auth/login')
}
