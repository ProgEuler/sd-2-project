import { createClient } from "@/lib/supabase/client"

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  permission_slip_id?: string
  created_at: string
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }

  return data || []
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

  if (error) {
    console.error("Error marking notification as read:", error)
    return false
  }

  return true
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false)

  if (error) {
    console.error("Error marking all notifications as read:", error)
    return false
  }

  return true
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error" = "info",
  permissionSlipId?: string,
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    permission_slip_id: permissionSlipId,
  })

  if (error) {
    console.error("Error creating notification:", error)
    return false
  }

  return true
}

export function subscribeToNotifications(userId: string, onNotification: (notification: Notification) => void) {
  const supabase = createClient()

  const subscription = supabase
    .channel("notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNotification(payload.new as Notification)
      },
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}
