-- Create ENUMS
CREATE TYPE public.organization_plan AS ENUM ('FREE', 'PRO', 'ENTERPRISE');
CREATE TYPE public.user_role AS ENUM ('ADMIN', 'EMPLOYEE');
CREATE TYPE public.user_status AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE public.theme_preference AS ENUM ('LIGHT', 'DARK', 'SYSTEM');
CREATE TYPE public.expense_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE public.payment_method AS ENUM ('CARD', 'CASH', 'TRANSFER', 'OTHER');
CREATE TYPE public.expense_source AS ENUM ('MANUAL', 'AI_EXTRACTED');
CREATE TYPE public.document_type AS ENUM ('TICKET', 'FACTURA');
CREATE TYPE public.entity_status AS ENUM ('ACTIVE', 'INACTIVE');

-- Organization table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  plan public.organization_plan NOT NULL DEFAULT 'FREE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'EMPLOYEE',
  department TEXT,
  region TEXT,
  status public.user_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User preferences
CREATE TABLE public.user_preferences (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  theme public.theme_preference NOT NULL DEFAULT 'SYSTEM',
  language TEXT NOT NULL DEFAULT 'es-ES',
  timezone TEXT NOT NULL DEFAULT 'Europe/Madrid',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Project codes
CREATE TABLE public.project_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  status public.entity_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, code)
);

-- Categories
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  budget_monthly NUMERIC(12,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, name)
);

-- Files
CREATE TABLE public.files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  storage_key TEXT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Expenses
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.users(id),
  project_code_id UUID REFERENCES public.project_codes(id),
  category_id UUID NOT NULL REFERENCES public.categories(id),
  vendor TEXT NOT NULL,
  expense_date DATE NOT NULL,
  amount_net NUMERIC(12,2) NOT NULL,
  tax_vat NUMERIC(12,2) DEFAULT 0,
  amount_gross NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  payment_method public.payment_method NOT NULL,
  status public.expense_status NOT NULL DEFAULT 'PENDING',
  approver_id UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  notes TEXT,
  receipt_file_id UUID REFERENCES public.files(id),
  source public.expense_source NOT NULL DEFAULT 'MANUAL',
  document_type public.document_type NOT NULL DEFAULT 'TICKET',
  is_vat_deductible BOOLEAN GENERATED ALWAYS AS (document_type = 'FACTURA' AND tax_vat > 0) STORED,
  hash_dedupe TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit log
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_user_id UUID NOT NULL REFERENCES public.users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID NOT NULL,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_files_checksum ON public.files(checksum_sha256);
CREATE INDEX idx_expenses_employee_date ON public.expenses(employee_id, expense_date DESC);
CREATE INDEX idx_expenses_status_date ON public.expenses(status, expense_date DESC);
CREATE INDEX idx_expenses_category_date ON public.expenses(category_id, expense_date);
CREATE INDEX idx_expenses_project_date ON public.expenses(project_code_id, expense_date);
CREATE INDEX idx_expenses_hash_dedupe ON public.expenses(hash_dedupe);
CREATE INDEX idx_audit_logs_actor_date ON public.audit_logs(actor_user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view users in their organization" ON public.users
  FOR SELECT USING (organization_id IN (
    SELECT organization_id FROM public.users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- RLS Policies for user preferences
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for expenses
CREATE POLICY "Employees can view their own expenses" ON public.expenses
  FOR SELECT USING (
    employee_id = auth.uid() OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
  );

CREATE POLICY "Employees can create their own expenses" ON public.expenses
  FOR INSERT WITH CHECK (employee_id = auth.uid());

CREATE POLICY "Employees can update their pending expenses" ON public.expenses
  FOR UPDATE USING (
    employee_id = auth.uid() AND status = 'PENDING' OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
  );

-- RLS Policies for files
CREATE POLICY "Users can view files in their organization" ON public.files
  FOR SELECT USING (organization_id IN (
    SELECT organization_id FROM public.users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can upload files to their organization" ON public.files
  FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM public.users WHERE id = auth.uid()) AND
    uploaded_by = auth.uid()
  );

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_codes_updated_at
  BEFORE UPDATE ON public.project_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data
INSERT INTO public.organizations (id, name, plan) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Empresa Demo', 'PRO');

-- Categories
INSERT INTO public.categories (organization_id, name) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Transporte'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Viajes'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Dietas'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Material'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Software'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Alojamiento'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Otros');

-- Project codes
INSERT INTO public.project_codes (organization_id, code, name) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'PRJ-001', 'Proyecto Alpha'),
  ('550e8400-e29b-41d4-a716-446655440000', 'PRJ-CLIENTE-A', 'Cliente A - Implementación'),
  ('550e8400-e29b-41d4-a716-446655440000', 'INT-OPS', 'Operaciones Internas');

-- Create storage bucket for receipts
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);

-- Storage policies for receipts bucket
CREATE POLICY "Users can view receipts in their organization" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'receipts' AND
    (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can upload receipts to their organization" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'receipts' AND
    (storage.foldername(name))[1] = (
      SELECT organization_id::text FROM public.users WHERE id = auth.uid()
    )
  );