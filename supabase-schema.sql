-- =====================================================
-- CLIMATE PLATFORM DATABASE SCHEMA
-- Supabase PostgreSQL Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ORGANIZATIONS TABLE
-- =====================================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  settings JSONB DEFAULT '{
    "approval_required": false,
    "roles_enabled": true,
    "notification_enabled": true
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. USERS TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'analyst', 'auditor', 'viewer')),
  customer_profile TEXT CHECK (customer_profile IN ('asset_manager', 'bank', 'insurance', 'corporate', 'consultant', 'other')),
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. COMPANIES TABLE
-- =====================================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  -- Basic Info
  company_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  
  -- Financial Data
  revenue NUMERIC,
  total_assets NUMERIC,
  equity NUMERIC,
  currency TEXT DEFAULT 'USD',
  
  -- Location
  facility_latitude NUMERIC,
  facility_longitude NUMERIC,
  physical_address TEXT,
  
  -- Status & Approval
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'pending_review', 'approved', 'rejected')),
  approval_status TEXT DEFAULT 'not_required' CHECK (approval_status IN ('not_required', 'pending', 'approved', 'rejected')),
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. ASSESSMENTS TABLE
-- =====================================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  -- Assessment Info
  company_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  assessment_type TEXT DEFAULT 'comprehensive' CHECK (assessment_type IN ('comprehensive', 'quick', 'detailed')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('draft', 'in_progress', 'completed')),
  
  -- Form Data (all 250+ fields)
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Calculation Results
  results JSONB NOT NULL DEFAULT '{
    "financialAnalysis": {},
    "pacta": {},
    "tcfd": {},
    "scope3": {},
    "forwardMetrics": {},
    "physicalRisk": {},
    "benchmarking": {}
  }'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error', 'approval_request', 'approval_response')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_user_profiles_org ON user_profiles(organization_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_companies_user ON companies(user_id);
CREATE INDEX idx_companies_org ON companies(organization_id);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_assessments_company ON assessments(company_id);
CREATE INDEX idx_assessments_org ON assessments(organization_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Companies Policies
CREATE POLICY "Users can view their own companies"
  ON companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view companies in their organization"
  ON companies FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own companies"
  ON companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies"
  ON companies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies"
  ON companies FOR DELETE
  USING (auth.uid() = user_id);

-- Assessments Policies
CREATE POLICY "Users can view their own assessments"
  ON assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view assessments in their organization"
  ON assessments FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own assessments"
  ON assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments"
  ON assessments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments"
  ON assessments FOR DELETE
  USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Organizations Policies
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- =====================================================
-- TRIGGERS for updated_at timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Create user profile on signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================
-- Uncomment below to add sample organization
-- INSERT INTO organizations (name, industry) VALUES ('Demo Organization', 'Technology');
