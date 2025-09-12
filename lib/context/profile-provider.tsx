"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import useAuth from "@/hooks/useAuth";

// Profile types
export interface FacultyProfile {
  id: string;
  full_name: string;
  role: "faculty";
  department: string;
  email: string;
}

export interface StudentProfile {
  id: string;
  full_name: string;
  role: "student";
  student_id: string;
  department: string;
  email: string;
  created_at: string;
}

export type Profile = FacultyProfile | StudentProfile | null;

export interface ProfileContextType {
  profile: Profile;
  loading: boolean;
  error: string | null;
  refreshProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get profile data from user metadata or make API call
      const userMetadata = user.user_metadata;

      if (userMetadata) {
        const profileData: Profile = {
          id: user.id,
          full_name: userMetadata.full_name || user.email?.split('@')[0] || 'Unknown User',
          role: userMetadata.role || 'student',
          email: user.email || '',
          ...(userMetadata.role === 'student'
            ? {
                student_id: userMetadata.student_id || 'N/A',
                department: userMetadata.department || 'Unknown',
                created_at: user.created_at || new Date().toISOString()
              }
            : {
                department: userMetadata.department || 'Unknown'
              }
          )
        } as Profile;

        console.log("Profile loaded:", profileData);
        setProfile(profileData);
      } else {
        // Fallback profile if no metadata
        const fallbackProfile: StudentProfile = {
          id: user.id,
          full_name: user.email?.split('@')[0] || 'Unknown User',
          role: 'student',
          student_id: 'N/A',
          department: 'Unknown',
          email: user.email || '',
          created_at: user.created_at || new Date().toISOString()
        };

        console.log("Using fallback profile:", fallbackProfile);
        setProfile(fallbackProfile);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile, loading, error, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  return context;
};
