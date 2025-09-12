"use client";

import client from "@/app/api/client";
import { createContext, useEffect, useState, ReactNode } from "react";

// Define the shape of your AuthContext
export interface AuthContextType {
  user: any; // Replace `any` with your actual user type (e.g., Supabase's User)
  loading: boolean;
}

// Create the context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null); // replace `any` with proper user type
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the initial session
    client.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: authListener } = client.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
