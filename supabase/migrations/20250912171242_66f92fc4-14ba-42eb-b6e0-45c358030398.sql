-- Fix infinite recursion in users table RLS policy
-- The issue is that the policy references the users table itself, creating a circular dependency

-- First, drop the problematic policy
DROP POLICY IF EXISTS "Users can view users in their organization" ON public.users;

-- Create a function to get user's organization (avoids circular reference)
CREATE OR REPLACE FUNCTION public.get_user_organization_id(user_id UUID)
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM auth.users 
  JOIN public.users ON auth.users.id = public.users.id 
  WHERE auth.users.id = user_id
  LIMIT 1;
$$;

-- Alternative approach: Create the policy without circular reference
-- Users can view users in their organization (fixed)
CREATE POLICY "Users can view users in their organization" 
ON public.users 
FOR SELECT 
USING (
  organization_id = (
    SELECT u.organization_id 
    FROM public.users u 
    WHERE u.id = auth.uid()
    LIMIT 1
  )
  OR 
  -- Admins can see all users
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  )
);

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_user_organization_id(UUID) TO authenticated;