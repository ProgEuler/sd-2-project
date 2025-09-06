"use client"

import { useState, useEffect } from "react"
import { Bell, Check, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  subscribeToNotifications,
  type Notification,
} from "@/lib/notifications"

interface NotificationsDropdownProps {
  userId: string
}

export function NotificationsDropdown({ userId }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()

    // Subscribe to real-time notifications
    const unsubscribe = subscribeToNotifications(userId, (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev])
    })

    return unsubscribe
  }, [userId])

  const fetchNotifications = async () => {
    setIsLoading(true)
    const data = await getNotifications(userId)
    setNotifications(data)
    setIsLoading(false)
  }

  const handleMarkAsRead = async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId)
    if (success) {
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    }
  }

  const handleMarkAllAsRead = async () => {
    const success = await markAllNotificationsAsRead(userId)
    if (success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const recentNotifications = notifications.slice(0, 10)

  const getNotificationIcon = (type: string) => {
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

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-auto p-1">
              <CheckCheck className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Loading notifications...</div>
        ) : recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
        ) : (
          <ScrollArea className="h-96">
            {recentNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? "bg-muted/50" : ""}`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${getNotificationColor(notification.type)}`}>
                        {notification.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleDateString()} at{" "}
                        {new Date(notification.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(notification.id)
                      }}
                      className="h-auto p-1 ml-2"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}

        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-muted-foreground">
              Showing 10 of {notifications.length} notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
