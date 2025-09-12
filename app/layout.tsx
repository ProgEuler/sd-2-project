import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";
import { Suspense } from "react";
import { AuthProvider } from "@/lib/context/auth-provider";
import { ProfileProvider } from "@/lib/context/profile-provider";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: "Permission Slip",
  description: "Created by Team Geist (Saruf, Jakaria, Ontor and Nur)",
};

async function HeaderContent() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-semibold">University Portal</div>
        <div className="flex items-center gap-3">
          <LogoutButton />
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
        <AuthProvider>
          <ProfileProvider>
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
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
