import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";
// import { LogoutButton } from "@/components/logout-button";
// import { NotificationsDropdown } from "@/components/notifications-dropdown";
// import { NotificationToast } from "@/components/notification-toast";
import { Suspense } from "react";
// import { getPermissionSlips } from "@/actions/permission-slip-actions";
// import { getCurrentUser } from "@/lib/actions/auth-actions";

export const metadata: Metadata = {
  title: "Permission Slip",
  description: "Created by Team Geist(saruf, Jakaria, Ontor and Nur)",
};

async function HeaderContent() {
//   const user = await getCurrentUser();

//   console.log("Current user in layout:", user);

//   if (user.data) {
//     try {
//       const profileResult = await getCurrentUserProfile();
//       if (profileResult.success && profileResult.data) {
//         profile = profileResult.data;
//       }
//     } catch (error) {
//       console.error("Error loading profile in header:", error);
//     }
//   }

//  const permissionSlips = await getPermissionSlips();
//  console.log("Permission slips in layout:", permissionSlips);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-semibold">
          University Portal
        </div>
        <div className="flex items-center gap-3">
          {/* {userResult.success && userResult.data && (
            <>
              <NotificationsDropdown userId={userResult.data.id} />
              <NotificationToast userId={userResult.data.id} />
            </>
          )} */}
          {/* <LogoutButton /> */}
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
    >
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
  );
}
