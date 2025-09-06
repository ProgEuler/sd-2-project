-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  permission_slip_id UUID REFERENCES public.permission_slips(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- System can create notifications for users
CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Create function to send notification
CREATE OR REPLACE FUNCTION public.create_notification(
  target_user_id UUID,
  notification_title TEXT,
  notification_message TEXT,
  notification_type TEXT DEFAULT 'info',
  slip_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, permission_slip_id)
  VALUES (target_user_id, notification_title, notification_message, notification_type, slip_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create function to notify on permission slip status change
CREATE OR REPLACE FUNCTION public.notify_permission_slip_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  student_name TEXT;
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
BEGIN
  -- Only trigger on status changes from pending
  IF OLD.status = 'pending' AND NEW.status != 'pending' THEN
    -- Get student name
    SELECT full_name INTO student_name
    FROM public.profiles
    WHERE id = NEW.student_id;
    
    -- Set notification details based on status
    IF NEW.status = 'approved' THEN
      notification_title := 'Permission Slip Approved';
      notification_message := 'Your permission slip for "' || NEW.title || '" has been approved by faculty.';
      notification_type := 'success';
    ELSIF NEW.status = 'rejected' THEN
      notification_title := 'Permission Slip Rejected';
      notification_message := 'Your permission slip for "' || NEW.title || '" has been rejected. Please check faculty comments for details.';
      notification_type := 'error';
    END IF;
    
    -- Create notification for student
    PERFORM public.create_notification(
      NEW.student_id,
      notification_title,
      notification_message,
      notification_type,
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for permission slip status changes
DROP TRIGGER IF EXISTS permission_slip_status_notification ON public.permission_slips;
CREATE TRIGGER permission_slip_status_notification
  AFTER UPDATE ON public.permission_slips
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_permission_slip_status_change();
