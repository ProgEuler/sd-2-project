"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PermissionSlipFormProps {
   onSuccess: () => void
}

export function PermissionSlipForm({ onSuccess }: PermissionSlipFormProps) {
   const [formData, setFormData] = useState({
      reasonOfException: "",
      description: "",
      dueAmount: "",
      emergencyContactPhone: "",
   })
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setError(null)

      console.log("Form data submitted:", formData)

      // try {
      //    // Create permission slip via API
      //    const response = await fetch('/api/permission-slips', {
      //       method: 'POST',
      //       headers: {
      //          'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({
      //          title: formData.reasonOfException,
      //          description: formData.description,
      //          event_date: new Date().toISOString(), // You might want to add a date field
      //          event_location: "University Campus", // You might want to add a location field
      //          emergency_contact_name: "Emergency Contact", // You might want to add this field
      //          emergency_contact_phone: formData.emergencyContactPhone,
      //       }),
      //    })

      //    if (!response.ok) {
      //       const errorData = await response.json()
      //       throw new Error(errorData.error || 'Failed to submit permission slip')
      //    }

      //    // Reset form
      //    setFormData({
      //       reasonOfException: "",
      //       description: "",
      //       dueAmount: "",
      //       emergencyContactPhone: "",
      //    })

      //    onSuccess()
      // } catch (error: unknown) {
      //    setError(error instanceof Error ? error.message : "An error occurred")
      // } finally {
      //    setIsLoading(false)
      // }
   }

   return (
      <form onSubmit={handleSubmit} className="space-y-8">
         <div className="grid gap-4">
            <div className="grid gap-2">
               <Label htmlFor="reasonOfException">Reason of exception</Label>
               <Input
                  id="reasonOfException"
                  type="text"
                  placeholder="e.g. Financial Hardship"
                  required
                  value={formData.reasonOfException}
                  onChange={(e) => setFormData({ ...formData, reasonOfException: e.target.value })}
               />
            </div>

            <div className="grid gap-2">
               <Label htmlFor="description">description</Label>
               <Textarea
                  id="description"
                  placeholder="Describe the reason of your delay..."
                  required
                  value={formData.description}
                  className="min-h-[120px]"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="grid gap-2">
                  <Label htmlFor="dueAmount">Due amount</Label>
                  <Input
                     id="dueAmount"
                     type="number"
                     placeholder="10000"
                     required
                     value={formData.dueAmount}
                     onChange={(e) =>
                        setFormData({
                           ...formData,
                           dueAmount: (e.target.value),
                        })
                     }
                  />
               </div>
               <div className="grid gap-2">
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                  <Input
                     id="emergencyContactPhone"
                     type="tel"
                     placeholder="(+880) 123-4567"
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
