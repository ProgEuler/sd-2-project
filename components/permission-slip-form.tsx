"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createNotification } from "@/lib/notifications"

interface PermissionSlipFormProps {
  onSuccess: () => void
}

export function PermissionSlipForm({ onSuccess }: PermissionSlipFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventLocation: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data: insertedSlip, error } = await supabase
        .from("permission_slips")
        .insert({
          student_id: user.id,
          title: formData.title,
          description: formData.description,
          event_date: formData.eventDate,
          event_location: formData.eventLocation,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_phone: formData.emergencyContactPhone,
        })
        .select()
        .single()

      if (error) throw error

      await createNotification(
        user.id,
        "Permission Slip Submitted",
        `Your permission slip for "${formData.title}" has been submitted and is awaiting faculty review.`,
        "info",
        insertedSlip.id,
      )

      // Reset form
      setFormData({
        title: "",
        description: "",
        eventDate: "",
        eventLocation: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
      })

      onSuccess()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Field trip to Science Museum"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the event, activities, and educational purpose..."
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="eventDate">Event Date</Label>
            <Input
              id="eventDate"
              type="date"
              required
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="eventLocation">Location</Label>
            <Input
              id="eventLocation"
              type="text"
              placeholder="Science Museum, Downtown"
              required
              value={formData.eventLocation}
              onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
            <Input
              id="emergencyContactName"
              type="text"
              placeholder="Parent/Guardian Name"
              required
              value={formData.emergencyContactName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emergencyContactName: e.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
            <Input
              id="emergencyContactPhone"
              type="tel"
              placeholder="(555) 123-4567"
              required
              value={formData.emergencyContactPhone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emergencyContactPhone: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  )
}
