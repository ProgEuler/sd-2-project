"use client";

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import client from "@/app/api/client"
import { logout } from "@/app/auth/actions";

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      console.log("Logging out...")
      const { error } = await client.auth.signOut()

      if (error) {
        console.error("Logout error:", error)
        toast.error("Failed to logout: " + error.message)
        return
      }

      console.log("Logout successful")
      toast.success("Logged out successfully!")
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Logout failed:", error)
      toast.error("Failed to logout")
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="h-4w-4 mr-2" />
      Sign Out
    </Button>
  )
}
