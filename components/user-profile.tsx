"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Hash,
  Building2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "faculty" | "admin";
  student_id?: string;
  department?: string;
  created_at: string;
}

interface UserProfileProps {
  profile: UserProfile;
  showDashboardButton?: boolean;
}

export function UserProfile({
  profile,
  showDashboardButton = true,
}: UserProfileProps) {

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800";
      case "faculty":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCurrentSemester = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    if (month >= 1 && month <= 5) {
      return `Spring ${year}`;
    } else if (month >= 6 && month <= 8) {
      return `Summer ${year}`;
    } else {
      return `Fall ${year}`;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name}`}
            />
            <AvatarFallback className="text-2xl">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
        <CardDescription className="flex items-center justify-center gap-2">
          <Badge className={getRoleColor(profile.role)}>
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          {profile.student_id && (
            <div className="flex items-center space-x-3">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Student ID</p>
                <p className="text-sm text-muted-foreground">
                  {profile.student_id}
                </p>
              </div>
            </div>
          )}

          {profile.department && (
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">
                  {profile.department}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Current Semester</p>
              <p className="text-sm text-muted-foreground">
                {getCurrentSemester()}
              </p>
            </div>
          </div>
        </div>

        {showDashboardButton && (
          <div className="flex justify-center pt-4">
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href="/dashboard">
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
