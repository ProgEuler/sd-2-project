import { redirect } from "next/navigation";
import { StudentDashboard } from "@/components/student-dashboard";
import { FacultyDashboard } from "@/components/faculty-dashboard";
import { AdminDashboardMongo } from "@/components/admin-dashboard";
import { getCurrentUserProfile } from "@/lib/actions/profile-actions";
import { requireAuth } from "@/lib/actions/auth-actions";

export default async function DashboardPage() {
  // Ensure user is authenticated
  await requireAuth();

  try {
    // Get user profile using server action
    const profileResult = await getCurrentUserProfile();

    if (!profileResult.success || !profileResult.data) {
      redirect("/auth/login");
    }

    const profile = profileResult.data;

    // Render appropriate dashboard based on role
    switch (profile.role) {
      case "student":
        return <StudentDashboard profile={profile} />;
      case "faculty":
        return <FacultyDashboard profile={profile} />;
      case "admin":
        return <AdminDashboardMongo profile={profile} />;
      default:
        redirect("/auth/login");
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);

    // Show error page
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Dashboard Loading Error
          </h1>
          <p className="text-gray-600 mb-6">
            Unable to load your dashboard. Please try again or contact support.
          </p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">
            Troubleshooting
          </h2>
          <div className="space-y-4 text-yellow-700">
            <p><strong>1. Check your internet connection</strong></p>
            <p><strong>2. Try refreshing the page</strong></p>
            <p><strong>3. Clear your browser cache</strong></p>
            <p><strong>4. Contact support if the issue persists</strong></p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Error Details:</h3>
          <p className="text-sm text-gray-600">Error: {error?.toString()}</p>
        </div>
      </div>
    );
  }
}
