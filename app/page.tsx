import { redirect } from "next/navigation"
import LoginPage from "./auth/login/page"

export default async function HomePage() {
  return redirect("/dashboard")
}
