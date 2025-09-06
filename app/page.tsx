import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">University Permission Slip System</CardTitle>
            <CardDescription className="text-lg">
              Streamlined digital permission slip management for students, faculty, and administrators
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <h3 className="font-semibold">Students</h3>
                <p className="text-sm text-muted-foreground">Submit and track permission slip requests</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Faculty</h3>
                <p className="text-sm text-muted-foreground">Review and approve student requests</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Administrators</h3>
                <p className="text-sm text-muted-foreground">Manage system and generate reports</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
