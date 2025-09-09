import { redirect } from "next/navigation"
import { UserProfile } from "@/components/user-profile"
import { getCurrentUserProfile } from "@/lib/actions/profile-actions"
import { requireAuth } from "@/lib/actions/auth-actions"

export default async function ProfilePage() {
  // Ensure user is authenticated
  await requireAuth()

  try {
    // Get user profile using server action
    const profileResult = await getCurrentUserProfile()
    
    if (!profileResult.success || !profileResult.data) {
      redirect("/auth/login")
    }

    const profile = profileResult.data

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
            <p className="text-muted-foreground">
              View and manage your account information
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold mb-4">Full Profile View</h2>
              <UserProfile profile={profile} />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Compact Profile View</h2>
              <UserProfile profile={profile} compact={true} />
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Profile Actions</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Profile information is automatically synced from your account</p>
                  <p>• Contact support to update your department or student ID</p>
                  <p>• Your role determines dashboard access and permissions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading profile:", error)
    
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Profile Loading Error
          </h1>
          <p className="text-gray-600 mb-6">
            Unable to load your profile. Please try again or contact support.
          </p>
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Error Details:</h3>
            <p className="text-sm text-gray-600">Error: {error?.toString()}</p>
          </div>
        </div>
      </div>
    )
  }
}