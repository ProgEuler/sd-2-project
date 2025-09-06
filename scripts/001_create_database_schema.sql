-- Create user profiles table with role-based access
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
  student_id TEXT, -- Only for students
  department TEXT, -- For faculty and admin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create permission slips table
CREATE TABLE IF NOT EXISTS public.permission_slips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_location TEXT NOT NULL,
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  faculty_reviewer_id UUID REFERENCES public.profiles(id),
  faculty_comments TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permission_slips ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Faculty and admin can view all profiles
CREATE POLICY "Faculty and admin can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

-- Permission slips policies
-- Students can view their own permission slips
CREATE POLICY "Students can view their own permission slips" ON public.permission_slips
  FOR SELECT USING (student_id = auth.uid());

-- Students can create their own permission slips
CREATE POLICY "Students can create permission slips" ON public.permission_slips
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Students can update their own pending permission slips
CREATE POLICY "Students can update their own pending slips" ON public.permission_slips
  FOR UPDATE USING (
    student_id = auth.uid() AND status = 'pending'
  );

-- Faculty can view all permission slips
CREATE POLICY "Faculty can view all permission slips" ON public.permission_slips
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

-- Faculty can update permission slips for review
CREATE POLICY "Faculty can review permission slips" ON public.permission_slips
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

-- Admin can do everything
CREATE POLICY "Admin can manage all permission slips" ON public.permission_slips
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
