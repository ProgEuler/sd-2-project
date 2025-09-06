import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"
import { LogoutButton } from "@/components/logout-button"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { NotificationToast } from "@/components/notification-toast"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

async function HeaderContent() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold">University Portal</h1>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <NotificationsDropdown userId={user.id} />
              <NotificationToast userId={user.id} />
            </>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body>
        <div className="min-h-screen bg-background">
          <Suspense
            fallback={
              <header className="border-b">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                  <h1 className="text-lg font-semibold">University Portal</h1>
                  <div>Loading...</div>
                </div>
              </header>
            }
          >
            <HeaderContent />
          </Suspense>
          <main>{children}</main>
        </div>
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
