-- Add missing RLS policies

-- RLS Policies for organizations
CREATE POLICY "Users can view their organization" ON public.organizations
  FOR SELECT USING (id IN (
    SELECT organization_id FROM public.users WHERE id = auth.uid()
  ));

-- RLS Policies for project_codes
CREATE POLICY "Users can view project codes in their organization" ON public.project_codes
  FOR SELECT USING (organization_id IN (
    SELECT organization_id FROM public.users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can manage project codes" ON public.project_codes
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN');

-- RLS Policies for categories
CREATE POLICY "Users can view categories in their organization" ON public.categories
  FOR SELECT USING (organization_id IN (
    SELECT organization_id FROM public.users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN');

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN');