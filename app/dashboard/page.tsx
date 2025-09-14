import { FacultyDashboard } from "@/components/faculty-dashboard";
import { StudentDashboard } from "@/components/student-dashboard";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
   const supabase = await createClient()
   const { data, error } = await supabase.auth.getUser()
   if (data.user) {
  // Basic user info
  console.log('User ID:', data.user.id)
  console.log('Email:', data.user.email)

  // Name might be in user_metadata (if stored during signup)
  console.log('Name from metadata:', data.user.user_metadata?.role)
} else {
  console.log('No user found')
}
//   if (loading) {
//     return (
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <h2 className="text-xl font-semibold mb-2">Loading Dashboard...</h2>
//             <p className="text-muted-foreground">Please wait while we load your profile.</p>
//           </div>
//         </div>
//     );
//   }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error Loading Profile</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
    );
  }

//   if (!profile) {
//     return (
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <h2 className="text-xl font-semibold mb-2">No Profile Available</h2>
//             <p className="text-muted-foreground">Unable to load your profile data.</p>
//           </div>
//         </div>
//     );
//   }

//   return (
//     <>
//       {profile.role === "student" && <StudentDashboard />}
//       {profile.role === "faculty" && <FacultyDashboard />}
//       {profile.role !== "student" && profile.role !== "faculty" && (
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <h2 className="text-xl font-semibold mb-2">Unknown Role</h2>
//             <p className="text-muted-foreground">Your account role is not recognized.</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
}
