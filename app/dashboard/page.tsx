import { FacultyDashboard } from "@/components/faculty-dashboard";
import { StudentDashboard } from "@/components/student-dashboard";
import useProfile from "@/hooks/useProfile";

export default function DashboardPage() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Loading Dashboard...</h2>
            <p className="text-muted-foreground">Please wait while we load your profile.</p>
          </div>
        </div>
    );
  }

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

  if (!profile) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No Profile Available</h2>
            <p className="text-muted-foreground">Unable to load your profile data.</p>
          </div>
        </div>
    );
  }

  return (
    <>
      {profile.role === "student" && <StudentDashboard />}
      {profile.role === "faculty" && <FacultyDashboard />}
      {profile.role !== "student" && profile.role !== "faculty" && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Unknown Role</h2>
            <p className="text-muted-foreground">Your account role is not recognized.</p>
          </div>
        </div>
      )}
    </>
  );
}
