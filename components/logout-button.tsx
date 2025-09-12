"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import client from "@/app/api/client"
import useAuth from "@/hooks/useAuth"
import { toast } from "sonner"

export function LogoutButton() {
   const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await client.auth.signOut().then(() => {
      router.push("/auth/login")
      toast.success("Logged out successfully!")
    }).catch((error) => {
      toast.error(error.message)
    })
    router.push("/")
  }
  if(!user) return null;
  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  )
}
