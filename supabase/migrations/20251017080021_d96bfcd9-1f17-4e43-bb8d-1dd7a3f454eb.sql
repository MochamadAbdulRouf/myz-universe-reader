-- Drop the overly permissive policy that exposes all emails
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Allow users to view their own full profile (including email)
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Allow admins to view all profiles (including all emails)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));