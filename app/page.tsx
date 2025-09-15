import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { dbConnect } from "@/lib/mongodb"
import User from "@/models/User"

export default async function Homepage() {
 const supabase = await createClient()
 const { data, error } = await supabase.auth.getUser()

 if(data.user && !error) {
   try {
     await dbConnect()
     const mongoUser = await User.findOne({ supabaseId: data.user.id })

     if (mongoUser && mongoUser.role === 'faculty') {
       redirect('/dashboard')
     } else {
       redirect('/profile')
     }
   } catch (dbError) {
   //   console.error('Database error:', dbError)
     redirect('/profile')
   }
 }
 else redirect('/auth/login')
}
