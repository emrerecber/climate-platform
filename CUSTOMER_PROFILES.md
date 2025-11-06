# 🎯 CUSTOMER PROFILES & ROLE MAPPING

**Date:** October 31, 2025  
**Version:** 3.0 - Customer-Centric Design

---

## 📊 TARGET CUSTOMER SEGMENTS

### **1. BANKS (Bankalar) - Primary Segment**

**Profile:**
- Financial institutions providing credit/loans
- Subject to regulatory requirements (TCFD, SFDR, EU Taxonomy)
- Need to assess climate risk of borrowers
- Portfolio size: €500M - €50B

**Use Cases:**
- Corporate credit risk assessment
- Project finance climate due diligence
- Portfolio-level climate risk reporting
- Regulatory compliance (TCFD, Article 29a)

**Key Features Needed:**
- ✅ Borrower climate risk scoring
- ✅ Portfolio aggregation
- ✅ Regulatory report templates
- ✅ Physical & transition risk analysis
- ✅ Scenario analysis (IEA, NGFS)
- ✅ Approval workflows (Credit committee)

**Team Structure:**
```
Credit Risk Department
├── Chief Risk Officer (Admin)
├── Risk Managers (Manager) - 2-5 people
├── Credit Analysts (Analyst) - 10-50 people
└── Board Members (Viewer) - 5-10 people

Sustainability Department
├── Sustainability Director (Manager)
└── ESG Analysts (Analyst) - 2-10 people
```

**Typical Workflow:**
1. Analyst receives loan application
2. Fills climate assessment form
3. System calculates risk scores
4. Manager reviews assessment
5. Approves/Rejects
6. Report sent to credit committee
7. Quarterly portfolio reports

---

### **2. ASSET MANAGERS (Varlık Yöneticileri)**

**Profile:**
- Manage investment portfolios (equity, bonds, funds)
- Need ESG/climate data for investment decisions
- Portfolio size: €100M - €500B
- Subject to SFDR regulations

**Use Cases:**
- Portfolio company climate assessment
- ESG scoring & benchmarking
- Impact measurement
- SFDR Article 8/9 compliance
- Investor reporting

**Key Features Needed:**
- ✅ Portfolio-level metrics
- ✅ Peer benchmarking
- ✅ Forward-looking metrics (temperature alignment)
- ✅ Impact tracking
- ✅ Investor report templates (TCFD, SFDR)
- ✅ Integration with portfolio systems

**Team Structure:**
```
ESG Investment Team
├── Head of ESG (Admin)
├── ESG Portfolio Managers (Manager) - 5-10 people
├── ESG Analysts (Analyst) - 10-30 people
└── Fund Managers (Viewer) - 20-100 people
```

**Typical Workflow:**
1. Analyst researches portfolio company
2. Collects climate/ESG data
3. Fills assessment form
4. System scores company
5. Compares to peers
6. Manager reviews scores
7. Feeds into investment decision
8. Quarterly investor reports

---

### **3. CORPORATES (Kurumsal Şirketler)**

**Profile:**
- Large companies needing climate disclosure
- Manufacturing, energy, transport sectors
- Revenue: €50M - €10B
- Subject to CSRD, TCFD requirements

**Use Cases:**
- Own operations climate assessment
- Supply chain climate risk
- TCFD/CSRD reporting
- Decarbonization pathway planning
- Stakeholder reporting

**Key Features Needed:**
- ✅ Scope 1, 2, 3 emissions tracking
- ✅ TCFD framework assessment
- ✅ Decarbonization roadmap
- ✅ Physical risk to assets
- ✅ CSRD report templates
- ✅ Science-based targets tracking

**Team Structure:**
```
Sustainability Department
├── Chief Sustainability Officer (Admin)
├── Sustainability Managers (Manager) - 2-5 people
├── Sustainability Analysts (Analyst) - 3-10 people
└── Executive Team (Viewer) - 5-15 people

Operations/Finance (Collaborators)
└── Department Heads (Viewer)
```

**Typical Workflow:**
1. Analyst collects operational data
2. Fills climate assessment
3. System calculates emissions & risks
4. Manager reviews & validates
5. CSO approves
6. Generate TCFD/CSRD report
7. Board presentation
8. Annual disclosure

---

### **4. CONSULTANTS (Danışmanlar)**

**Profile:**
- Provide climate advisory services
- Work with multiple clients
- Need white-label solutions
- Typical: 5-50 employees

**Use Cases:**
- Client climate assessments
- Multiple client management
- Branded reports for clients
- Best practice recommendations

**Key Features Needed:**
- ✅ Multi-client workspace separation
- ✅ White-label branding
- ✅ Template libraries
- ✅ Client collaboration features
- ✅ Export to client systems
- ✅ Billing/usage tracking

**Team Structure:**
```
Consulting Firm
├── Partner (Admin)
├── Senior Consultants (Manager) - 2-5 people
│   └── Client A Workspace
│   └── Client B Workspace
└── Junior Consultants (Analyst) - 5-20 people

Clients (External)
└── Client Users (Viewer) - Read-only access
```

**Typical Workflow:**
1. Win new client
2. Create client workspace
3. Invite client users (viewer role)
4. Analyst conducts assessment
5. Manager reviews
6. Generate branded report
7. Present to client
8. Export data to client

---

## 🎭 ROLE MAPPING BY CUSTOMER TYPE

### **Role Distribution by Customer Type:**

| Customer Type | Admin | Manager | Analyst | Viewer | Auditor |
|--------------|-------|---------|---------|--------|---------|
| **Bank** | 1-2 (CRO) | 3-8 (Risk Mgr) | 10-50 (Credit) | 5-15 (Board) | 1-2 (Internal Audit) |
| **Asset Mgr** | 1-2 (Head ESG) | 5-10 (PM) | 10-30 (ESG) | 20-100 (FM) | 1-2 (Compliance) |
| **Corporate** | 1-2 (CSO) | 2-5 (Sust Mgr) | 3-10 (Sust) | 10-30 (Exec) | 1-2 (Audit) |
| **Consultant** | 1-3 (Partner) | 2-5 (Senior) | 5-20 (Junior) | N/A | N/A |

---

## 📋 CUSTOMER PROFILE TEMPLATES

### **Profile Template: Bank**
```javascript
{
  profileType: "bank",
  organizationName: "ABC Bank",
  industry: "Financial Services",
  
  defaultSettings: {
    requireApproval: true,
    approvalLevels: 2,  // Analyst → Manager → CRO
    allowSelfApprove: false,
    defaultVisibility: "workspace",
    
    features: {
      portfolioAggregation: true,
      regulatoryReports: true,
      creditRiskIntegration: true,
      scenarioAnalysis: ["IEA NZE", "NGFS Orderly"],
      
      enabledReports: [
        "TCFD",
        "Article 29a",
        "CRR3 Pillar 3",
        "Portfolio Heat Map",
        "Credit Risk Dashboard"
      ]
    },
    
    workspaceTemplates: [
      {
        name: "Corporate Credit",
        defaultRole: "analyst",
        features: ["approval_workflow", "credit_scoring"]
      },
      {
        name: "Project Finance",
        defaultRole: "analyst",
        features: ["physical_risk", "scenario_analysis"]
      }
    ]
  },
  
  customFields: {
    loanAmount: { required: true, type: "number" },
    loanCurrency: { required: true, type: "select" },
    creditRating: { required: true, type: "select" },
    loanMaturity: { required: true, type: "date" },
    collateralType: { required: false, type: "text" }
  },
  
  integrations: {
    corebanking: null,  // Future: SAP, Oracle
    riskSystem: null,    // Future: Moody's, S&P
    dataProviders: []    // Future: Bloomberg, Refinitiv
  }
}
```

---

### **Profile Template: Asset Manager**
```javascript
{
  profileType: "asset_manager",
  organizationName: "XYZ Asset Management",
  industry: "Investment Management",
  
  defaultSettings: {
    requireApproval: false,  // More flexible
    approvalLevels: 1,
    allowSelfApprove: true,
    defaultVisibility: "organization",
    
    features: {
      portfolioAggregation: true,
      benchmarking: true,
      peerComparison: true,
      temperatureAlignment: true,
      impactMetrics: true,
      
      enabledReports: [
        "TCFD",
        "SFDR Article 8",
        "SFDR Article 9",
        "Portfolio Carbon Footprint",
        "Impact Report",
        "Investor Presentation"
      ]
    },
    
    workspaceTemplates: [
      {
        name: "Public Equities",
        defaultRole: "analyst",
        features: ["benchmarking", "peer_analysis"]
      },
      {
        name: "Private Equity",
        defaultRole: "manager",
        features: ["engagement", "impact_tracking"]
      },
      {
        name: "Green Bonds",
        defaultRole: "analyst",
        features: ["taxonomy_alignment", "impact_metrics"]
      }
    ]
  },
  
  customFields: {
    assetClass: { required: true, type: "select" },
    portfolioWeight: { required: true, type: "number" },
    investmentDate: { required: true, type: "date" },
    exitDate: { required: false, type: "date" },
    investmentThesis: { required: false, type: "text" }
  }
}
```

---

### **Profile Template: Corporate**
```javascript
{
  profileType: "corporate",
  organizationName: "ACME Manufacturing",
  industry: "Manufacturing",
  
  defaultSettings: {
    requireApproval: true,
    approvalLevels: 1,  // Analyst → CSO
    allowSelfApprove: false,
    defaultVisibility: "organization",
    
    features: {
      emissionsTracking: true,
      decarbonizationRoadmap: true,
      physicalRiskAssets: true,
      supplychainRisk: false,  // Premium feature
      
      enabledReports: [
        "TCFD",
        "CSRD",
        "CDP Response",
        "GRI Standards",
        "Board Report"
      ]
    },
    
    workspaceTemplates: [
      {
        name: "Own Operations",
        defaultRole: "analyst",
        features: ["emissions_tracking", "energy_data"]
      }
    ]
  },
  
  customFields: {
    facility: { required: true, type: "select" },
    reportingYear: { required: true, type: "number" },
    auditStatus: { required: false, type: "select" },
    externalVerification: { required: false, type: "boolean" }
  }
}
```

---

### **Profile Template: Consultant**
```javascript
{
  profileType: "consultant",
  organizationName: "Green Advisory LLP",
  industry: "Professional Services",
  
  defaultSettings: {
    requireApproval: true,
    approvalLevels: 1,  // Junior → Senior
    allowSelfApprove: false,
    defaultVisibility: "workspace",  // Client isolation
    
    features: {
      multiClientManagement: true,
      whiteLabeling: true,
      clientCollaboration: true,
      templateLibrary: true,
      
      enabledReports: [
        "Custom Branded Reports",
        "Client Presentation",
        "Recommendation Report",
        "Best Practice Guide"
      ]
    },
    
    workspaceTemplates: [
      {
        name: "Client Template",
        defaultRole: "analyst",
        features: ["branded_reports", "client_sharing"]
      }
    ],
    
    billing: {
      trackUsage: true,
      billingMode: "per_assessment",
      clientChargebacks: true
    }
  },
  
  customFields: {
    clientName: { required: true, type: "text" },
    projectId: { required: true, type: "text" },
    billingCode: { required: true, type: "text" },
    deliveryDate: { required: true, type: "date" }
  }
}
```

---

## 🎯 FEATURE MATRIX BY CUSTOMER TYPE

| Feature | Bank | Asset Mgr | Corporate | Consultant |
|---------|------|-----------|-----------|------------|
| **Core** |
| Climate Assessment Form | ✅ | ✅ | ✅ | ✅ |
| PACTA Analysis | ✅ | ✅ | ✅ | ✅ |
| TCFD Scoring | ✅ | ✅ | ✅ | ✅ |
| Physical Risk | ✅ | ✅ | ✅ | ✅ |
| **Collaboration** |
| Multi-user | ✅ | ✅ | ✅ | ✅ |
| Workspaces | ✅ | ✅ | ⚪ | ✅ |
| Approval Workflow | ✅ | ⚪ | ✅ | ✅ |
| Comments/Notes | ✅ | ✅ | ✅ | ✅ |
| **Analysis** |
| Portfolio Aggregation | ✅ | ✅ | ⚪ | ⚪ |
| Peer Benchmarking | ⚪ | ✅ | ⚪ | ✅ |
| Scenario Analysis | ✅ | ✅ | ✅ | ⚪ |
| Temperature Alignment | ✅ | ✅ | ✅ | ⚪ |
| **Reporting** |
| TCFD Report | ✅ | ✅ | ✅ | ✅ |
| SFDR Report | ⚪ | ✅ | ⚪ | ⚪ |
| Article 29a | ✅ | ⚪ | ⚪ | ⚪ |
| CSRD Report | ⚪ | ⚪ | ✅ | ⚪ |
| Custom Branding | ⚪ | ⚪ | ⚪ | ✅ |
| **Integration** |
| API Access | 💰 | 💰 | 💰 | 💰 |
| Excel Import | ✅ | ✅ | ✅ | ✅ |
| Excel Export | ✅ | ✅ | ✅ | ✅ |
| PDF Export | ✅ | ✅ | ✅ | ✅ |

**Legend:**
- ✅ Included
- ⚪ Optional/Limited
- 💰 Premium feature

---

## 📈 PRICING TIERS (FUTURE)

### **Tier 1: Professional (€199/month)**
- Up to 5 users
- 1 workspace
- 100 assessments/year
- Basic reports
- **Target:** Small corporates, boutique consultants

### **Tier 2: Business (€499/month)**
- Up to 20 users
- 5 workspaces
- 500 assessments/year
- All reports + portfolio
- **Target:** Mid-size banks, asset managers

### **Tier 3: Enterprise (€1,999/month)**
- Unlimited users
- Unlimited workspaces
- Unlimited assessments
- White-label + API
- Dedicated support
- **Target:** Large banks, major asset managers

### **Tier 4: Consultant (€799/month)**
- Up to 10 users
- Unlimited client workspaces
- 1,000 assessments/year
- White-label reports
- Client user seats (5 free)
- **Target:** Consulting firms

---

## 🚀 IMPLEMENTATION PRIORITY

### **Phase 3A: Foundation (Week 1)**
1. ✅ Add role system (5 roles)
2. ✅ Organization model
3. ✅ Workspace model
4. ✅ Basic permissions

### **Phase 3B: Customer Profiles (Week 2)**
5. ✅ Profile templates (4 types)
6. ✅ Profile-specific settings
7. ✅ Custom field system
8. ✅ Feature toggles

### **Phase 3C: Advanced Features (Week 3-4)**
9. ✅ Approval workflows
10. ✅ Portfolio aggregation
11. ✅ White-label branding
12. ✅ Client workspace isolation

---

**Ready to implement! Starting with Phase 3A...** 🚀
