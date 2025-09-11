import { FacultyDashboard } from "@/components/faculty-dashboard";
import { StudentDashboard } from "@/components/student-dashboard";

const profile = {
  id: "1",
  full_name: "Dr. John Doe",
  role: "faculty",
  department: "Computer Science",
  email: "john@gmail.com",
};

const studentProfile = {
  id: "2",
  full_name: "Jane Smith",
  role: "student",
  student_id: "S123456",
  department: "Computer Science",
  email: "jane@gmail.com",
  created_at: "2023-10-01T10:00:00Z",
};

export default async function HomePage() {
  const key = "student";

  let dashboard: React.ReactNode;

  switch (key) {
    case "student":
      dashboard = <StudentDashboard profile={studentProfile} />;
      break;

    case "faculty":
      dashboard = <FacultyDashboard profile={profile} />;
      break;

    default:
      dashboard = <div>No dashboard available</div>;
  }

  return <>{dashboard}</>;
}
