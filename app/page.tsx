import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  User,
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

export default async function Homepage() {
 const supabase = await createClient()
 const { data, error } = await supabase.auth.getUser()

 if(data.user && !error) redirect('/profile')
   else redirect('/auth/login')
}
