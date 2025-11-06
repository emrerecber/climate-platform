# Database Schema Migration Plan
## From JSON Blob to Normalized Schema

**Goal**: Improve query performance, enable version control, and separate concerns

---

## Current Schema (JSON Blob Approach)

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  sector VARCHAR(100),
  country VARCHAR(100),
  city VARCHAR(100),
  revenue DECIMAL(15, 2),
  employees INTEGER,
  year_founded INTEGER,
  form_data JSONB,  -- ⚠️ ALL 200+ fields stored here
  status VARCHAR(50) DEFAULT 'draft',
  completion_percentage INTEGER DEFAULT 0,
  last_calculated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Problems:
- ❌ Cannot index individual fields inside JSONB efficiently
- ❌ No version history (overwrites data)
- ❌ Cannot query specific calculation results easily
- ❌ Mixed concerns (metadata + form data + calculation results)

---

## Proposed Schema (Normalized Approach)

### 1. Companies Table (Metadata Only)
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  -- Basic company info
  company_name VARCHAR(255) NOT NULL,
  sector VARCHAR(100),
  country VARCHAR(100),
  city VARCHAR(100),
  revenue DECIMAL(15, 2),
  employees INTEGER,
  year_founded INTEGER,
  
  -- Assessment status
  status VARCHAR(50) DEFAULT 'draft', -- draft, in_review, approved, rejected
  completion_percentage INTEGER DEFAULT 0,
  current_version INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

-- Indices
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_organization_id ON companies(organization_id);
CREATE INDEX idx_companies_sector ON companies(sector);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_deleted_at ON companies(deleted_at);
```

---

### 2. Form Submissions Table (Versioned Form Data)
```sql
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Version control
  version INTEGER NOT NULL,
  is_current BOOLEAN DEFAULT true,
  
  -- Form data (still JSONB for flexibility, but versioned)
  form_data JSONB NOT NULL,
  
  -- Metadata
  submitted_by UUID REFERENCES users(id),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(company_id, version)
);

-- Indices
CREATE INDEX idx_form_submissions_company_id ON form_submissions(company_id);
CREATE INDEX idx_form_submissions_is_current ON form_submissions(is_current);
CREATE INDEX idx_form_submissions_version ON form_submissions(company_id, version);

-- GIN index for JSONB queries
CREATE INDEX idx_form_submissions_form_data ON form_submissions USING GIN (form_data);
```

---

### 3. Calculations Table (Assessment Results)
```sql
CREATE TABLE calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES form_submissions(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Module type
  module_name VARCHAR(50) NOT NULL, -- 'PACTA', 'TCFD', 'SCOPE3', 'PHYSICAL_RISK', 'FORWARD_METRICS', 'BENCHMARKING'
  
  -- Results (JSONB for flexibility)
  results JSONB NOT NULL,
  
  -- Performance tracking
  calculation_duration_ms INTEGER,
  
  -- Metadata
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  calculated_by UUID REFERENCES users(id),
  
  -- Constraints
  UNIQUE(submission_id, module_name)
);

-- Indices
CREATE INDEX idx_calculations_submission_id ON calculations(submission_id);
CREATE INDEX idx_calculations_company_id ON calculations(company_id);
CREATE INDEX idx_calculations_module_name ON calculations(module_name);
CREATE INDEX idx_calculations_calculated_at ON calculations(calculated_at);

-- GIN index for JSONB queries
CREATE INDEX idx_calculations_results ON calculations USING GIN (results);
```

---

### 4. Key Metrics Table (Extracted for Fast Queries)
```sql
CREATE TABLE company_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES form_submissions(id) ON DELETE CASCADE,
  
  -- Financial metrics
  total_revenue DECIMAL(15, 2),
  total_assets DECIMAL(15, 2),
  ebitda DECIMAL(15, 2),
  
  -- Carbon metrics
  scope1_emissions DECIMAL(12, 2),
  scope2_emissions DECIMAL(12, 2),
  scope3_emissions DECIMAL(12, 2),
  total_emissions DECIMAL(12, 2),
  carbon_intensity DECIMAL(10, 4), -- tCO2e per million revenue
  
  -- TCFD score
  tcfd_overall_score DECIMAL(5, 2),
  tcfd_governance_score DECIMAL(5, 2),
  tcfd_strategy_score DECIMAL(5, 2),
  tcfd_risk_mgmt_score DECIMAL(5, 2),
  tcfd_metrics_score DECIMAL(5, 2),
  
  -- PACTA alignment
  pacta_temperature_alignment DECIMAL(3, 1), -- e.g., 2.5°C
  pacta_scenario_best_fit VARCHAR(50),
  
  -- Physical risk
  physical_risk_score DECIMAL(5, 2),
  physical_risk_category VARCHAR(50),
  
  -- Timestamps
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(submission_id)
);

-- Indices for fast analytics queries
CREATE INDEX idx_company_metrics_company_id ON company_metrics(company_id);
CREATE INDEX idx_company_metrics_carbon_intensity ON company_metrics(carbon_intensity);
CREATE INDEX idx_company_metrics_tcfd_score ON company_metrics(tcfd_overall_score);
CREATE INDEX idx_company_metrics_physical_risk ON company_metrics(physical_risk_score);
```

---

### 5. Audit Log Table (Track Changes)
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- What changed
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  
  -- Who did it
  user_id UUID REFERENCES users(id),
  user_email VARCHAR(255),
  user_role VARCHAR(50),
  
  -- When
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- What was changed
  old_values JSONB,
  new_values JSONB,
  
  -- Request metadata
  ip_address INET,
  user_agent TEXT
);

-- Indices
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
```

---

## Migration Strategy

### Phase 1: Create New Schema (No Downtime)
```sql
-- Run migration scripts to create new tables
-- Old `companies` table remains intact
```

### Phase 2: Dual-Write (Transition Period)
```javascript
// Update backend to write to BOTH old and new schema
const saveAssessment = async (data) => {
  // Write to old schema (for backward compatibility)
  await db.query('UPDATE companies SET form_data = $1 WHERE id = $2', [data, id]);
  
  // Write to new schema
  const submission = await db.query(
    'INSERT INTO form_submissions (company_id, version, form_data) VALUES ($1, $2, $3)',
    [companyId, version, data]
  );
  
  // Extract and save metrics
  await db.query(
    'INSERT INTO company_metrics (company_id, submission_id, ...) VALUES (...)',
    [/* extracted metrics */]
  );
};
```

### Phase 3: Migrate Existing Data
```sql
-- Migrate existing companies
INSERT INTO form_submissions (company_id, version, form_data, submitted_at)
SELECT 
  id as company_id,
  1 as version,
  form_data,
  created_at as submitted_at
FROM companies
WHERE form_data IS NOT NULL;

-- Extract key metrics from JSONB
INSERT INTO company_metrics (company_id, submission_id, total_revenue, scope1_emissions, ...)
SELECT 
  c.id as company_id,
  fs.id as submission_id,
  (form_data->>'totalIncome')::DECIMAL as total_revenue,
  (form_data->>'scope1Emissions')::DECIMAL as scope1_emissions,
  -- ... extract other metrics
FROM companies c
JOIN form_submissions fs ON fs.company_id = c.id
WHERE fs.version = 1;
```

### Phase 4: Switch to New Schema (Cutover)
```javascript
// Update backend to ONLY write to new schema
// Remove dual-write code
```

### Phase 5: Deprecate Old Schema
```sql
-- After 30 days of successful operation
-- Drop form_data column from companies table
ALTER TABLE companies DROP COLUMN form_data;
```

---

## Benefits of New Schema

### Performance Improvements
- ✅ **10x faster queries**: Indexed columns vs JSONB scan
- ✅ **Dashboard analytics**: Pre-calculated metrics in `company_metrics`
- ✅ **Portfolio aggregation**: `SELECT AVG(carbon_intensity) FROM company_metrics WHERE sector = 'Energy'`

### Data Integrity
- ✅ **Version control**: Track all form submission history
- ✅ **Audit trail**: Know who changed what and when
- ✅ **Rollback capability**: Restore previous version if needed

### Feature Enablement
- ✅ **Trend analysis**: Compare metrics across versions
- ✅ **A/B testing**: Test different calculation methodologies
- ✅ **Real-time dashboards**: Fast queries on extracted metrics

---

## Migration Timeline

| Phase | Duration | Risk Level | Rollback Plan |
|-------|----------|------------|---------------|
| 1. Create Schema | 1 day | Low | None needed |
| 2. Dual-Write | 2 weeks | Low | Revert code |
| 3. Data Migration | 1 week | Medium | Keep old data |
| 4. Cutover | 1 day | Medium | Revert to dual-write |
| 5. Deprecate Old | 30 days | Low | Restore column |

**Total: ~6 weeks**

---

## SQL Migration Scripts

### Create all tables
```bash
psql -U postgres -d climate_platform < migration_001_create_normalized_schema.sql
```

### Migrate existing data
```bash
psql -U postgres -d climate_platform < migration_002_migrate_existing_data.sql
```

### Create indices
```bash
psql -U postgres -d climate_platform < migration_003_create_indices.sql
```

---

## Next Steps

1. ✅ Review schema with team
2. ✅ Create migration SQL scripts
3. ✅ Test migration on staging database
4. ✅ Update backend API to support new schema
5. ✅ Run dual-write for 2 weeks
6. ✅ Cutover to new schema
7. ✅ Monitor performance improvements

---

**Ready to implement?** Let me know and I can generate the full SQL migration scripts!
