"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function DebugInfo() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUserAndProfile()
  }, [])

  const checkUserAndProfile = async () => {
    const supabase = createClient()
    setLoading(true)
    
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        setError(`User error: ${userError.message}`)
        return
      }
      
      setUser(userData.user)
      
      if (userData.user) {
        // Try to get profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single()
        
        if (profileError) {
          setError(`Profile error: ${profileError.message}`)
        } else {
          setProfile(profileData)
        }
      }
    } catch (err) {
      setError(`Unexpected error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async () => {
    if (!user) return
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'Unknown User',
        role: user.user_metadata?.role || 'student',
        student_id: user.user_metadata?.student_id || null,
        department: user.user_metadata?.department || null,
      })
      .select()
      .single()
    
    if (error) {
      setError(`Profile creation error: ${error.message}`)
    } else {
      setProfile(data)
      setError(null)
    }
  }

  if (loading) {
    return <div>Loading debug info...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-semibold text-red-800">Error:</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          <div>
            <h3 className="font-semibold mb-2">User Data:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Profile Data:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
          
          {user && !profile && (
            <Button onClick={createProfile}>
              Create Profile Manually
            </Button>
          )}
          
          <Button onClick={checkUserAndProfile} variant="outline">
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}