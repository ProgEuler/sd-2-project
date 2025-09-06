"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { subscribeToNotifications, type Notification } from "@/lib/notifications"

interface NotificationToastProps {
  userId: string
}

export function NotificationToast({ userId }: NotificationToastProps) {
  useEffect(() => {
    const unsubscribe = subscribeToNotifications(userId, (notification: Notification) => {
      // Show toast notification
      const icon = getToastIcon(notification.type)

      toast(notification.title, {
        description: notification.message,
        icon,
        duration: 5000,
        action:
          notification.type === "success" || notification.type === "error"
            ? {
                label: "View",
                onClick: () => {
                  // Could navigate to the specific permission slip
                  console.log("Navigate to permission slip:", notification.permission_slip_id)
                },
              }
            : undefined,
      })
    })

    return unsubscribe
  }, [userId])

  return null // This component doesn't render anything
}

function getToastIcon(type: string) {
  switch (type) {
    case "success":
      return "✅"
    case "error":
      return "❌"
    case "warning":
      return "⚠️"
    default:
      return "ℹ️"
  }
}
