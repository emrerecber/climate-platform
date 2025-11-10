# 🏦 Climate Risk Assessment Platform - IT Technical Documentation

**Version**: 2.0  
**Last Updated**: 2025-01-10  
**Compliance**: ECB Banking Supervision, IFRS S2, TCFD, PACTA  
**Target Audience**: IT Teams, DevOps, Backend Developers, System Integrators

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Data Flow](#data-flow)
4. [Calculation Modules](#calculation-modules)
5. [API Specifications](#api-specifications)
6. [Database Schema](#database-schema)
7. [Deployment Guide](#deployment-guide)
8. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
9. [Security & Compliance](#security--compliance)

---

# 1. System Overview

## 1.1 Purpose

Climate Risk Assessment Platform iklim değişikliğinin finansal kurumların kredi portföyleri üzerindeki etkilerini hesaplamak ve raporlamak için geliştirilmiş bir web uygulamasıdır.

## 1.2 Key Features

- **Multi-Assessment Support**: PACTA, TCFD, ECB/IFRS S2 compliance
- **12-Step Form**: Comprehensive data collection (250+ fields)
- **6 Calculation Modules**: Transition Risk, Physical Risk, PACTA, TCFD, Scope 3, PCAF
- **Risk Reporting**: PDF/Excel export with visual dashboards
- **Multi-language**: Turkish & English support

## 1.3 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18.2.0 |
| **State Management** | React Context API | - |
| **Styling** | CSS Modules | - |
| **Charts** | Recharts | 2.5.0 |
| **PDF Export** | jsPDF, html2canvas | 2.5.1 |
| **Backend (Mock)** | localStorage | - |
| **Deployment** | Netlify (Frontend) | - |
| **Version Control** | Git/GitHub | - |

## 1.4 System Components

```
┌─────────────────────────────────────────────────────────┐
│                   User Interface                         │
│  (Dashboard, Forms, Reports, Settings)                   │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│              Application Layer                           │
│  - Authentication                                        │
│  - Form Validation                                       │
│  - Data Processing                                       │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│          Calculation Engine (Core)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Master Calculator (ECB/IFRS S2)                 │   │
│  │  ├─ Transition Risk Calculator (TRS)            │   │
│  │  ├─ Physical Risk Calculator (PRS)              │   │
│  │  ├─ PACTA Calculator                            │   │
│  │  ├─ TCFD Calculator                             │   │
│  │  ├─ PCAF Calculator (Financed Emissions)        │   │
│  │  ├─ Scope 3 Calculator                          │   │
│  │  ├─ CBAM Calculator                             │   │
│  │  └─ Financial Impact Calculator                 │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│              Data Layer                                  │
│  - Mock API (localStorage)                              │
│  - Future: REST API / PostgreSQL                        │
└─────────────────────────────────────────────────────────┘
```

---

# 2. Architecture

## 2.1 High-Level Architecture

```
┌──────────────┐
│    Client    │ (Browser - React SPA)
│   (Netlify)  │
└──────┬───────┘
       │ HTTPS
       ▼
┌──────────────────────────────────────────────┐
│        Frontend Application                   │
│  ┌────────────────────────────────────────┐  │
│  │  Components                            │  │
│  │  - AppWithAuth                         │  │
│  │  - Dashboard                           │  │
│  │  - FinancialDataForm (12 steps)       │  │
│  │  - ComprehensiveReport                 │  │
│  │  - OrganizationSettings                │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │  Services                              │  │
│  │  - api.js (Mock API wrapper)          │  │
│  │  - mockApi.js (localStorage backend)  │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │  Utils (Calculation Engines)           │  │
│  │  - masterCalculatorECB.js             │  │
│  │  - transitionRiskCalculatorECB.js     │  │
│  │  - physicalRiskCalculatorECB.js       │  │
│  │  - pactaCalculator.js                 │  │
│  │  - tcfdCalculator.js                  │  │
│  │  - pcafCalculator.js                  │  │
│  │  - cbamCalculator.js                  │  │
│  │  - scope3Calculator.js                │  │
│  │  - financialImpactCalculator.js       │  │
│  └────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│   Data Storage (Current: localStorage)       │
│   Future: PostgreSQL / MongoDB                │
│  ┌────────────────────────────────────────┐  │
│  │  Collections/Tables:                   │  │
│  │  - mock_users                          │  │
│  │  - mock_companies                      │  │
│  │  - mock_organizations                  │  │
│  │  - mock_workspaces                     │  │
│  │  - mock_assessments (future)           │  │
│  └────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

## 2.2 Calculation Flow Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    DATA INPUT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FinancialDataForm (12 Steps)                        │  │
│  │  - Step 1-2: Company & Location (7 mandatory)       │  │
│  │  - Step 3-7: Financial Data                         │  │
│  │  - Step 8: Credit Risk                              │  │
│  │  - Step 9: Emissions & CBAM                         │  │
│  │  - Step 10: Physical Risk                           │  │
│  │  - Step 11: PACTA Sector Data                       │  │
│  │  - Step 12: TCFD & ESG                              │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼ Form Submission (handleFinancialFormSubmit)
┌────────────────────────────────────────────────────────────┐
│               ORCHESTRATION LAYER (App.js)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. Financial Analysis                               │  │
│  │     → financialAnalysis.js                           │  │
│  │  2. PACTA Calculation (if sector provided)           │  │
│  │     → pactaCalculator.js                             │  │
│  │  3. TCFD Calculation (if governance data)            │  │
│  │     → tcfdCalculator.js                              │  │
│  │  4. Scope 3 Calculation                              │  │
│  │     → scope3Calculator.js                            │  │
│  │  5. Forward Metrics                                  │  │
│  │     → forwardMetricsCalculator.js                    │  │
│  │  6. Physical Risk Assessment                         │  │
│  │     → physicalRiskCalculator.js                      │  │
│  │  7. Benchmarking                                     │  │
│  │     → benchmarkingCalculator.js                      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼ Parallel Processing
┌────────────────────────────────────────────────────────────┐
│                CALCULATION ENGINE LAYER                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Master Calculator (masterCalculatorECB.js)          │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Step 1: Calculate TRS (Transition Risk)       │  │  │
│  │  │    Input:  emissions, finance, pacta, scenario │  │  │
│  │  │    Output: TRS, TRS_adj (7-factor model)       │  │  │
│  │  │    Module: transitionRiskCalculatorECB.js      │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Step 2: Calculate PRS (Physical Risk)         │  │  │
│  │  │    Input:  location, hazards, adaptive_capacity│  │  │
│  │  │    Output: PRS (P-S-A formula)                 │  │  │
│  │  │    Module: physicalRiskCalculatorECB.js        │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Step 3: Calculate RI* (Combined Risk Index)   │  │  │
│  │  │    Formula: RI = wT*TRS_adj + wP*PRS           │  │  │
│  │  │    RI* = RI * (1 + amplifiers)                 │  │  │
│  │  │    Amplifiers: water_dep, stranding, coastal   │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Step 4: Financial Impact (PD/LGD/ECL/RWA)     │  │  │
│  │  │    Input:  RI*, TRS, PRS, finance              │  │  │
│  │  │    Output: PD_adj, LGD_adj, ECL, RWA           │  │  │
│  │  │    Module: financialImpactCalculator.js        │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Step 5: PCAF Financed Emissions               │  │  │
│  │  │    Input:  emissions, finance (EAD, EVIC)      │  │  │
│  │  │    Output: financed_s1, s2, s3, attribution    │  │  │
│  │  │    Module: pcafCalculator.js                   │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Step 6: Governance Score                      │  │  │
│  │  │    Formula: 0.4*board + 0.3*mgmt + 0.3*incentive│ │  │
│  │  │    Output: governance_score (0-1)              │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼ Results Compilation
┌────────────────────────────────────────────────────────────┐
│                   OUTPUT LAYER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Comprehensive Report Object                         │  │
│  │  {                                                   │  │
│  │    metadata: { timestamp, version, compliance },    │  │
│  │    scores: { TRS, PRS, RI, RI_star, class },       │  │
│  │    transition_risk: { factors, TRS_adj },           │  │
│  │    physical_risk: { PRS, hazards, adaptive },       │  │
│  │    combined_risk: { RI_star, amplifiers },          │  │
│  │    financial: { PD_adj, LGD_adj, ECL, RWA },       │  │
│  │    emissions_reporting: { scope1/2/3, PCAF },       │  │
│  │    governance: { score, classification },           │  │
│  │    pacta: { alignment_scores, scenario },           │  │
│  │    tcfd: { governance, strategy, risk_mgmt },       │  │
│  │    notes: { assumptions, data_quality_flags }       │  │
│  │  }                                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│             PRESENTATION LAYER                              │
│  - ComprehensiveReport.js (React Component)                 │
│  - PDF Export (jsPDF)                                       │
│  - Excel Export                                             │
│  - Dashboard Visualizations (Recharts)                      │
└─────────────────────────────────────────────────────────────┘
```

---

# 3. Data Flow

## 3.1 End-to-End Data Flow

### Phase 1: Data Collection

```
User Input (12-Step Form)
│
├─ Step 1-2: Company Info + Location (MANDATORY)
│   ├─ entityName, entityType, currency (required)
│   ├─ facilityLatitude, facilityLongitude (required)
│   └─ physicalAddress, city (required)
│
├─ Step 3: Income & PCAF Metrics
│   ├─ annualRevenue, operatingIncome, ebitdaAmount
│   ├─ exposureAtDefault (EAD)
│   ├─ probabilityOfDefaultBase, lossGivenDefaultBase
│   └─ equityMarketValue
│
├─ Step 4-7: Financial Data
│   ├─ Expenses, Assets, Liabilities
│   └─ Investment Portfolio
│
├─ Step 8: Credit Risk
│   ├─ creditScore, collateralValue, collateralType
│   └─ repaymentStatus, loanMaturityYears
│
├─ Step 9: Emissions & CBAM
│   ├─ scope2LocationEmissions, scope2MarketEmissions
│   ├─ Scope 3 (15 categories: cat1-cat15)
│   ├─ cbamCoverage, cbamEmbeddedEmissions
│   └─ exportValue, euExports
│
├─ Step 10: Physical Risk
│   ├─ physicalRiskProbability (heat, drought, flood, coastal, precip)
│   ├─ adaptiveCapacity (infrastructure, financial, governance, technology)
│   └─ risk tags (water_dep, stranding, coastal_vuln, supply_chain)
│
├─ Step 11: PACTA Sector Data
│   ├─ Enerji: coalCapacityMW, gasCapacityMW, renewableCapacityMW
│   ├─ Otomotiv: iceProduction, bevProduction, evCapacity
│   ├─ Çelik: bofProductionShare, eafProductionShare, steelCarbonIntensity
│   ├─ Çimento: clinkerRatio, alternativeFuelsShare
│   ├─ Havacılık: safUsage, fleetSize
│   └─ Gayrimenkul: energyEfficiencyRating, buildingEmissionsIntensity
│
└─ Step 12: TCFD & ESG
    ├─ Governance: hasClimateExpertOnBoard, hasClimateRiskCommittee
    ├─ Strategy: materialClimateRisks, scenariosUsed
    ├─ Risk Management: riskAssessmentFrequency, integrationWithERM
    ├─ Metrics: scope1Emissions, netZeroYear, emissionReductionTarget
    └─ ESG: isoCertifications, carbonFootprintCalculated
```

### Phase 2: Data Transformation

```javascript
// Form data structure sent to calculators
const formDataStructure = {
  company: {
    name: string,
    sector: string,
    country: string,
    employees: number
  },
  emissions: {
    scope1_tco2: number,
    scope2_tco2: number,
    scope2_location_tco2: number,
    scope2_market_tco2: number,
    scope3: {
      cat1_purchasedGoods: number,
      cat2_capitalGoods: number,
      // ... cat3-cat15
    }
  },
  finance: {
    revenue_usd: number,
    ebitda_usd: number,
    ead_usd: number,              // Exposure at Default
    equity_market_value_usd: number,
    total_debt_usd: number,
    pd_base: number (0-1),        // Probability of Default
    lgd_base: number (0-1),       // Loss Given Default
    rw_base: number (0-1),        // Risk Weight
    loan_tenor_years: number,
    collateral_value_usd: number,
    collateral_vulnerability: number (0-1)
  },
  physical: {
    latitude: number,
    longitude: number,
    probability: {
      heat: number (0-1),
      drought: number (0-1),
      flood: number (0-1),
      coastal: number (0-1),
      precip: number (0-1)
    },
    adaptive_capacity: {
      infrastructure: number (0-1),
      financial: number (0-1),
      governance: number (0-1),
      technology: number (0-1)
    }
  },
  pacta: {
    sector: string,
    mix_pct: {
      // Energy sector example
      coal: number,
      gas: number,
      renewables: number,
      // Or Automotive
      ice: number,
      bev_phev_fcev: number
    },
    target_2030: object,
    phaseout_dates: object
  },
  scenario: {
    carbon_price_usd_t: number,      // default: 75
    energy_price_delta: number,       // default: 0.10 (10% increase)
    sector_output_delta: number,      // default: -0.05 (-5%)
    scenario_name: string             // orderly_1.5C, disorderly_2C, hothouse_3C
  },
  governance: {
    board_oversight: number (0-1),
    management_role: number (0-1),
    incentives: number (0-1),
    rnd_score: number (0-1)
  },
  tags: {
    water_dep: number (0-1),
    stranding: number (0-1),
    coastal_vuln: number (0-1),
    supply_chain: number (0-1)
  },
  cbam: {
    coverage: string,               // none, partial, full
    embedded_emissions_tco2: number,
    eu_price_eur_t: number,         // default: 85
    origin_price_eur_t: number,     // default: 20
    export_volume_units: number,
    export_value_usd: number
  }
};
```

### Phase 3: Calculation Execution Order

```
1. masterCalculatorECB.calculateClimateRisk(formData)
   │
   ├─ 1.1. calculateTRS(formData)
   │   │   Input: emissions, finance, pacta, scenario, governance
   │   │   Process:
   │   │   ├─ f1: Emission Intensity (scope1/revenue)
   │   │   ├─ f2: Indirect Emissions (scope2+3/total)
   │   │   ├─ f3: Transformation CapEx (required_capex/EBITDA)
   │   │   ├─ f4: Revenue Shock (carbon_price, energy_price, demand)
   │   │   ├─ f5: Compliance Cost (CBAM + regulations)
   │   │   ├─ f6: Technology Gap (PACTA alignment delta)
   │   │   └─ f7: Governance Factor (board + mgmt + incentives)
   │   │   Output: TRS, TRS_adj, factors breakdown
   │
   ├─ 1.2. assessPhysicalRisk(formData)
   │   │   Input: physical.probability, physical.adaptive_capacity, tags
   │   │   Process:
   │   │   ├─ P: Hazard Probability (weighted average of 5 hazards)
   │   │   ├─ S: Sensitivity (sector-specific, asset vulnerability)
   │   │   ├─ A: Adaptive Capacity (4 components weighted)
   │   │   └─ PRS = P * S * (1 - A)
   │   │   Output: PRS, hazard_breakdown, adaptive_capacity_breakdown
   │
   ├─ 1.3. calculateRI_Star(TRS_adj, PRS, tags, sector)
   │   │   Process:
   │   │   ├─ RI = wT * TRS_adj + wP * PRS
   │   │   │   wT (transition weight): 0.40-0.75 (sector-dependent)
   │   │   │   wP (physical weight): 0.25-0.60 (sector-dependent)
   │   │   ├─ amplifier_sum = Σ(alpha_i * tag_i)
   │   │   │   alpha_water = 0.15
   │   │   │   alpha_stranding = 0.25
   │   │   │   alpha_coastal = 0.18
   │   │   │   alpha_supply = 0.10
   │   │   └─ RI* = RI * (1 + amplifier_sum)
   │   │   Output: RI, RI_star, weights, amplifiers
   │
   ├─ 1.4. calculateFinancialImpact(formData, TRS_adj, PRS, RI_star)
   │   │   Input: finance.pd_base, finance.lgd_base, RI_star
   │   │   Process:
   │   │   ├─ PD_adj = PD_base * (1 + beta_T*TRS + beta_P*PRS)
   │   │   │   beta_T = 1.5, beta_P = 1.2
   │   │   ├─ LGD_adj = LGD_base * (1 + gamma*collateral_vuln*PRS)
   │   │   │   gamma = 0.3
   │   │   ├─ ECL = EAD * PD_adj * LGD_adj
   │   │   └─ RWA = EAD * RW_adj * 12.5
   │   │   │   RW_adj = RW_base * (1 + delta*RI*)
   │   │   │   delta = 0.5
   │   │   Output: PD_adj, LGD_adj, ECL, RWA, climate_addon
   │
   ├─ 1.5. calculatePCAF(formData)
   │   │   Input: emissions, finance.ead_usd, finance.equity_market_value
   │   │   Process:
   │   │   ├─ EVIC = equity_market_value + total_debt
   │   │   ├─ Attribution = outstanding_amount / EVIC
   │   │   ├─ Financed_S1 = Borrower_S1 * Attribution
   │   │   ├─ Financed_S2 = Borrower_S2 * Attribution
   │   │   ├─ Financed_S3 = Borrower_S3 * Attribution
   │   │   └─ PCF = Financed_Total / (Outstanding / 1M)
   │   │   Output: financed_emissions, attribution, PCF, data_quality_score
   │
   ├─ 1.6. calculateGovernanceScore(formData.governance)
   │   │   Formula: 0.4*board + 0.3*mgmt + 0.3*incentives
   │   │   Output: governance_score (0-1), classification (Strong/Adequate/Weak)
   │
   └─ 1.7. calculateIntensityMetrics(emissions, finance, company)
       │   Process:
       │   ├─ revenue_intensity = total_emissions / (revenue_usd / 1M)
       │   ├─ employee_intensity = total_emissions / employees
       │   └─ scope1_intensity = scope1 / (revenue_usd / 1M)
       │   Output: intensity metrics

2. calculatePACTA(formData) [Parallel, if sector data exists]
   │   Input: pacta.sector, pacta.mix_pct, pacta.target_2030
   │   Process:
   │   ├─ Compare current mix vs IEA NZE2050 targets
   │   ├─ Calculate alignment scores for NZE, SDS, STEPS scenarios
   │   ├─ Technology gap analysis (e.g., coal % vs target)
   │   └─ 2030/2050 trajectory analysis
   │   Output: alignment_score, scenario_fit, gap_analysis, recommendations

3. calculateTCFD(formData) [Parallel, if governance data exists]
   │   Input: governance, strategy, risk_management, metrics
   │   Process:
   │   ├─ Governance Score (0-100)
   │   ├─ Strategy Resilience (scenario analysis)
   │   ├─ Risk Management Score (process maturity)
   │   └─ Metrics & Targets Score (SBTi, net-zero commitment)
   │   Output: tcfd_scores (4 pillars), overall_compliance_score, recommendations

4. calculateScope3(formData) [Parallel]
   │   Input: emissions.scope3 (15 categories)
   │   Process:
   │   ├─ Sum all 15 categories
   │   ├─ Calculate category contributions (%)
   │   └─ Identify top 3 hotspots
   │   Output: scope3_total, category_breakdown, hotspots

5. calculateForwardMetrics(formData) [Parallel]
   │   Process:
   │   ├─ Implied Temperature Rise (ITR) based on emission targets
   │   ├─ Carbon budget alignment
   │   └─ Net-zero trajectory analysis
   │   Output: ITR, budget_alignment, trajectory

6. calculateBenchmarking(formData, sector) [Parallel]
   │   Process:
   │   ├─ Compare metrics vs sector peers
   │   │   (carbon intensity, renewable share, EV share, etc.)
   │   └─ Percentile ranking
   │   Output: peer_comparison, percentile_ranking
```

### Phase 4: Output Compilation

```javascript
// Final output structure from masterCalculatorECB
const outputSchema = {
  metadata: {
    ECB_IFRS_S2_COMPATIBLE: true,
    calculation_timestamp: "2025-01-10T12:00:00Z",
    version: "2.0",
    company_name: "Example Corp",
    sector: "Enerji",
    country: "Turkey"
  },
  scores: {
    TRS: 0.65,                    // Transition Risk Score (0-1)
    TRS_adj: 0.72,                // After governance adjustment
    PRS: 0.45,                    // Physical Risk Score (0-1)
    RI: 0.60,                     // Combined Risk Index
    RI_star: 0.68,                // After amplifiers
    class: "High",                // Low/Medium/High
    governance_score: 0.55,
    governance_class: "Adequate"
  },
  transition_risk: {
    TRS: 0.65,
    TRS_adj: 0.72,
    dominant_factor: "f3_transformation_capex",
    factors: {
      f1_emission_intensity: { value: 0.75, weight: 0.25 },
      f2_indirect_emissions: { value: 0.60, weight: 0.15 },
      f3_transformation_capex: { value: 0.85, weight: 0.20 },
      f4_revenue_shock: { value: 0.50, weight: 0.15 },
      f5_compliance_cost: { value: 0.55, weight: 0.10 },
      f6_technology_gap: { value: 0.70, weight: 0.10 },
      f7_governance: { value: 0.45, weight: 0.05 }
    }
  },
  physical_risk: {
    PRS: 0.45,
    hazard_probability: 0.55,
    sensitivity: 0.70,
    adaptive_capacity: 0.50,
    hazard_breakdown: {
      heat: { probability: 0.60, weighted: 0.15 },
      drought: { probability: 0.50, weighted: 0.125 },
      flood: { probability: 0.55, weighted: 0.165 },
      coastal: { probability: 0.40, weighted: 0.08 },
      precip: { probability: 0.50, weighted: 0.05 }
    }
  },
  combined_risk: {
    RI: 0.60,
    RI_star: 0.68,
    weights: { wT: 0.60, wP: 0.40 },
    amplifiers: {
      water_dep: 0.05,
      stranding: 0.10,
      coastal_vuln: 0.03,
      supply_chain: 0.02,
      total_uplift: 0.20
    }
  },
  financial: {
    PD_base: 0.03,
    PD_adj: 0.048,              // 3% → 4.8% (60% increase)
    LGD_base: 0.40,
    LGD_adj: 0.43,              // 40% → 43%
    EAD_usd: 10000000,
    ECL_usd: 206400,            // Expected Credit Loss
    ECL_base_usd: 120000,
    ECL_climate_addon_usd: 86400,
    RW_base: 0.75,
    RW_adj: 1.01,               // 75% → 101%
    RWA_usd: 12625000,          // Risk-Weighted Assets
    capital_requirement_usd: 1010000  // 8% of RWA
  },
  emissions_reporting: {
    scope1: 50000,
    scope2_location: 30000,
    scope2_market: 28000,
    scope3_total: 120000,
    intensity_metrics: {
      revenue_intensity_tco2_per_m_usd: "412.50",
      employee_intensity_tco2_per_employee: "165.00",
      scope1_intensity: "104.17"
    },
    financed: {
      attribution: 0.15,
      financed_s1: 7500,
      financed_s2: 4200,
      financed_s3: 18000,
      financed_total: 29700,
      portfolio_carbon_footprint: {
        pcf_tco2_per_usd_m: 2.97
      },
      data_quality_score: 2      // 1-5 scale (1=best)
    }
  },
  governance: {
    governance_score: 0.55,
    components: {
      board_oversight: 0.60,
      management_role: 0.50,
      incentives: 0.50
    },
    weights: {
      board: 0.4,
      management: 0.3,
      incentives: 0.3
    },
    classification: "Adequate"
  },
  notes: {
    assumptions: [
      "EBITDA assumed as 15% of revenue",
      "Carbon price assumed at $75/tCO2e (NGFS Orderly 2030)",
      "Risk classification: Low <0.30, Medium 0.30-0.60, High >0.60"
    ],
    data_quality_flags: [
      "Missing Scope 3 emissions data",
      "Missing physical hazard probability data - using defaults"
    ],
    data_quality_score: 2
  }
};
```

---

# 4. Calculation Modules

## 4.1 Module Registry

| Module | File | Purpose | Input | Output | ECB/IFRS S2 |
|--------|------|---------|-------|--------|-------------|
| **Master Calculator** | `masterCalculatorECB.js` | Orchestrates all calculations | formData | Complete output schema | ✅ Yes |
| **Transition Risk** | `transitionRiskCalculatorECB.js` | 7-factor TRS model | emissions, finance, pacta, scenario | TRS, TRS_adj, factors | ✅ Yes |
| **Physical Risk** | `physicalRiskCalculatorECB.js` | P-S-A formula | location, hazards, adaptive_capacity | PRS, hazard breakdown | ✅ Yes |
| **PACTA** | `pactaCalculator.js` | Paris Agreement alignment | sector data, technology mix | alignment scores, gap analysis | ✅ Yes |
| **TCFD** | `tcfdCalculator.js` | TCFD 4-pillar assessment | governance, strategy, risk, metrics | TCFD scores, compliance | ✅ Yes |
| **PCAF** | `pcafCalculator.js` | Financed emissions | emissions, EAD, EVIC | financed emissions, attribution | ✅ Yes |
| **Scope 3** | `scope3Calculator.js` | 15-category Scope 3 | scope3 categories | total, breakdown, hotspots | ✅ Yes |
| **CBAM** | `cbamCalculator.js` | Carbon border adjustment | export data, embedded emissions | CBAM cost | ✅ Yes |
| **Financial Impact** | `financialImpactCalculator.js` | PD/LGD/ECL/RWA adjustment | RI*, TRS, PRS, finance | PD_adj, LGD_adj, ECL, RWA | ✅ Yes |

## 4.2 Detailed Module Specifications

### 4.2.1 Transition Risk Calculator (TRS)

**File**: `src/utils/transitionRiskCalculatorECB.js`

**Purpose**: Calculate 7-factor Transition Risk Score with PACTA technology gap adjustment

**Input Schema**:
```javascript
{
  emissions: {
    scope1_tco2: number,
    scope2_tco2: number,
    scope3: object
  },
  finance: {
    revenue_usd: number,
    ebitda_usd: number,
    ead_usd: number
  },
  pacta: {
    mix_pct: object,
    target_2030: object
  },
  scenario: {
    carbon_price_usd_t: number,
    energy_price_delta: number,
    sector_output_delta: number
  },
  governance: {
    board_oversight: number (0-1),
    management_role: number (0-1),
    incentives: number (0-1)
  },
  cbam: {
    embedded_emissions_tco2: number,
    eu_price_eur_t: number
  }
}
```

**Processing Logic**:

1. **Factor 1: Emission Intensity** (Weight: 0.25)
   ```
   intensity = scope1_tco2 / (revenue_usd / 1M)
   f1 = normalize(intensity, best_intensity, worst_intensity)
   
   Sector benchmarks:
   - Enerji: best=50, worst=800 tCO2/M USD
   - Çelik: best=400, worst=2000
   - Otomotiv: best=30, worst=200
   ```

2. **Factor 2: Indirect Emissions** (Weight: 0.15)
   ```
   indirect_emissions = scope2_tco2 + scope3_total
   total_emissions = scope1 + scope2 + scope3
   indirect_share = indirect_emissions / total_emissions
   f2 = normalize(indirect_share, 0.30, 0.85)
   ```

3. **Factor 3: Transformation CapEx** (Weight: 0.20)
   ```
   capex_ratio = required_capex_usd / ebitda_usd
   
   if capex_ratio >= 2.0: f3 = 0.85
   elif capex_ratio <= 0.5: f3 = 0.15
   else: f3 = 0.15 + (capex_ratio - 0.5) * 0.47
   ```

4. **Factor 4: Revenue Shock** (Weight: 0.15)
   ```
   carbon_cost = scope1_tco2 * carbon_price_usd_t
   energy_cost_increase = (revenue_usd * 0.10) * energy_price_delta
   demand_impact = |sector_output_delta| * revenue_usd
   revenue_at_risk = carbon_cost + energy_cost_increase + demand_impact
   net_impact = revenue_at_risk * (1 - pass_through_rate)
   f4 = clamp(net_impact / revenue_usd)
   
   Pass-through rates (sector-specific):
   - Enerji: 0.30
   - Gayrimenkul: 0.50
   - Finans: 0.60
   ```

5. **Factor 5: Compliance Cost** (Weight: 0.10)
   ```
   total_compliance = compliance_cost_usd + cbam_cost_usd
   f5 = clamp(total_compliance / ebitda_usd)
   ```

6. **Factor 6: Technology Gap (PACTA)** (Weight: 0.10)
   ```
   gap_score = Σ |current_mix_pct - target_mix_pct| / n_technologies
   f6 = clamp(gap_score)
   
   Example (Enerji sector):
   Current: {coal: 40%, gas: 30%, renewables: 30%}
   Target NZE2050: {coal: 0%, gas: 20%, renewables: 70%}
   gap = (|40-0| + |30-20| + |30-70|) / 3 = 30%
   f6 = 0.30
   ```

7. **Factor 7: Governance** (Weight: 0.05)
   ```
   governance_score = 0.4*board + 0.3*mgmt + 0.3*incentives
   f7 = 1 - governance_score  // Inverted (better governance = lower risk)
   ```

**Output Formula**:
```
TRS = Σ(f_i * weight_i) for i=1 to 7

TRS_adj = TRS * (2 - governance_score)
```

**Output Schema**:
```javascript
{
  TRS: number (0-1),
  TRS_adj: number (0-1),
  factors: {
    f1_emission_intensity: {
      factor: "f1_emission_intensity",
      value: number (0-1),
      weight: 0.25,
      intensity_tco2_per_m_usd: string,
      benchmark_best: number,
      benchmark_worst: number
    },
    // ... f2-f7
  },
  governance_adjustment: {
    governance_score: number,
    adjustment_multiplier: number
  }
}
```

**Key Dependencies**:
- PACTA Calculator (for f6 technology gap)
- Sector parameters (SECTOR_PARAMS constant)
- CBAM Calculator (for f5)

---

### 4.2.2 Physical Risk Calculator (PRS)

**File**: `src/utils/physicalRiskCalculatorECB.js`

**Purpose**: Calculate Physical Risk Score using P-S-A (Probability-Sensitivity-Adaptive Capacity) formula

**Input Schema**:
```javascript
{
  physical: {
    latitude: number,
    longitude: number,
    probability: {
      heat: number (0-1),
      drought: number (0-1),
      flood: number (0-1),
      coastal: number (0-1),
      precip: number (0-1)
    },
    adaptive_capacity: {
      infrastructure: number (0-1),
      financial: number (0-1),
      governance: number (0-1),
      technology: number (0-1)
    }
  },
  company: {
    sector: string
  },
  finance: {
    total_assets_usd: number
  }
}
```

**Processing Logic**:

1. **Hazard Probability (P)** - Weighted average of 5 hazards
   ```
   Weights:
   - flood: 0.30
   - heat: 0.25
   - drought: 0.25
   - precip: 0.15
   - coastal: 0.05
   
   P = Σ(hazard_i * weight_i)
   ```

2. **Sensitivity (S)** - Sector and asset vulnerability
   ```
   Sector sensitivity factors:
   - Tarım: 0.85 (high)
   - Gayrimenkul: 0.75
   - Enerji (hydro): 0.70
   - İmalat: 0.60
   - Finans: 0.30 (low)
   
   Asset vulnerability (based on physical.tags):
   - waterfront assets: +0.15
   - flood-zone assets: +0.20
   
   S = sector_sensitivity * (1 + asset_vulnerability)
   ```

3. **Adaptive Capacity (A)** - Weighted average
   ```
   Weights:
   - infrastructure: 0.35
   - financial: 0.30
   - governance: 0.20
   - technology: 0.15
   
   A = Σ(component_i * weight_i)
   ```

**Output Formula**:
```
PRS = P * S * (1 - A)
```

**Output Schema**:
```javascript
{
  PRS: number (0-1),
  hazard_probability: number (0-1),
  sensitivity: number (0-1),
  adaptive_capacity: number (0-1),
  hazard_breakdown: {
    heat: { probability: number, weight: number, weighted: number },
    drought: { ... },
    flood: { ... },
    coastal: { ... },
    precip: { ... }
  },
  adaptive_capacity_breakdown: {
    infrastructure: number,
    financial: number,
    governance: number,
    technology: number
  },
  classification: string  // Low/Medium/High
}
```

**External Data Sources** (Future Enhancement):
- Climate projection APIs (Copernicus, NASA, NOAA)
- Hazard maps (FloodMap, FEMA)
- Real-time weather data

---

### 4.2.3 PCAF Calculator

**File**: `src/utils/pcafCalculator.js`

**Purpose**: Calculate financed emissions following PCAF methodology

**Input Schema**:
```javascript
{
  emissions: {
    scope1_tco2: number,
    scope2_tco2: number,
    scope2_market_tco2: number,
    scope3: object
  },
  finance: {
    ead_usd: number,              // Outstanding amount
    equity_market_value_usd: number,
    total_debt_usd: number
  }
}
```

**Processing Logic**:

1. **Calculate Attribution Factor**
   ```
   EVIC = equity_market_value_usd + total_debt_usd
   Attribution = outstanding_amount_usd / EVIC
   Attribution = min(1.0, Attribution)  // Cap at 100%
   ```

2. **Calculate Financed Emissions**
   ```
   Financed_S1 = Borrower_S1 * Attribution
   Financed_S2 = Borrower_S2 * Attribution
   Financed_S3 = Borrower_S3 * Attribution
   Financed_Total = Financed_S1 + Financed_S2 + Financed_S3
   ```

3. **Calculate Portfolio Carbon Footprint (PCF)**
   ```
   PCF = Financed_Total / (Outstanding_Amount / 1M)
   Unit: tCO2e per USD million
   ```

4. **Data Quality Score** (1-5 scale, 1=best)
   ```
   Start with score = 1
   If missing Scope 1: +1
   If missing Scope 2: +0.5
   If missing Scope 3: +1
   If missing equity value: +0.5
   If missing revenue: +0.5
   
   Final score = min(5, round(score))
   ```

**Output Schema**:
```javascript
{
  attribution: {
    attribution: number (0-1),
    EVIC_usd: number,
    outstanding_amount_usd: number,
    equity_market_value_usd: number,
    total_debt_usd: number
  },
  financed_emissions: {
    financed_s1: number,
    financed_s2: number,
    financed_s3: number,
    financed_total: number
  },
  portfolio_carbon_footprint: {
    pcf_tco2_per_usd_m: number
  },
  borrower_emissions: {
    scope1: number,
    scope2: number,
    scope3: number,
    total: number
  },
  data_quality_score: number (1-5)
}
```

---

### 4.2.4 PACTA Calculator

**File**: `src/utils/pactaCalculator.js`

**Purpose**: Assess Paris Agreement alignment for 6 sectors

**Supported Sectors**:
1. Energy (Enerji)
2. Automotive (Otomotiv)
3. Steel (Çelik)
4. Cement (Çimento)
5. Aviation (Havacılık)
6. Real Estate (Gayrimenkul)

**Benchmarks** (IEA Net Zero by 2050):

| Sector | Key Metric | 2030 Target | 2050 Target |
|--------|-----------|-------------|-------------|
| Energy | Renewable Share | 60% | 90% |
| Automotive | EV Share | 60% | 100% |
| Steel | Carbon Intensity | 1.3 tCO2/ton | 0.2 tCO2/ton |
| Cement | Carbon Intensity | 0.50 tCO2/ton | 0.10 tCO2/ton |
| Aviation | SAF Usage | 10% | 65% |
| Real Estate | Emissions Intensity | 25 kgCO2/m²/yr | 0 kgCO2/m²/yr |

**Processing Logic** (Energy sector example):

1. **Calculate Current State**
   ```
   renewable_capacity = wind + solar + hydro + biomass + geothermal
   total_capacity = all technologies
   current_renewable_share = renewable_capacity / total_capacity * 100
   ```

2. **Calculate Gap**
   ```
   gap_2030 = |current_renewable_share - target_2030|
   gap_score = gap_2030 / target_2030
   ```

3. **Alignment Score**
   ```
   if gap_score < 0.10: alignment = 0.95  // Within 10%
   elif gap_score < 0.25: alignment = 0.75
   elif gap_score < 0.50: alignment = 0.50
   else: alignment = 0.25
   ```

4. **Scenario Fit**
   ```
   Calculate alignment for 3 scenarios:
   - NZE2050 (1.5°C pathway)
   - SDS (1.8°C pathway)
   - STEPS (2.5°C pathway)
   
   Best fit = scenario with highest alignment score
   ```

**Output Schema**:
```javascript
{
  sector: string,
  current_state: {
    renewable_share: number,
    // or other sector-specific metrics
  },
  alignment_scores: {
    NZE2050: number (0-1),
    SDS: number (0-1),
    STEPS: number (0-1)
  },
  best_scenario: {
    name: string,
    score: number,
    temperature: string
  },
  gap_analysis: {
    technology_gaps: array,
    required_changes: array
  },
  recommendations: array,
  trajectory: {
    2030_projection: number,
    2050_projection: number,
    on_track: boolean
  }
}
```

---

### 4.2.5 TCFD Calculator

**File**: `src/utils/tcfdCalculator.js`

**Purpose**: Assess TCFD (Task Force on Climate-related Financial Disclosures) compliance

**Four Pillars**:

1. **Governance** (35% weight)
   - Board oversight
   - Management responsibility
   - Climate expertise
   - KPIs in executive compensation

2. **Strategy** (30% weight)
   - Scenario analysis (1.5°C, 2°C, 3°C)
   - Material risks identification
   - Climate opportunities
   - Strategy resilience

3. **Risk Management** (20% weight)
   - Risk identification process
   - Risk assessment methodology
   - ERM integration
   - Materiality threshold

4. **Metrics & Targets** (15% weight)
   - Scope 1/2/3 disclosure
   - Emission targets
   - Net-zero commitment
   - SBTi validation

**Scoring Logic**:

```javascript
// Governance Score (0-100)
governance_score = (
  hasClimateExpertOnBoard * 25 +
  hasClimateRiskCommittee * 25 +
  hasCSO * 20 +
  climateKPIsInComp * 15 +
  climateRiskInERM * 15
)

// Strategy Score (0-100)
strategy_score = (
  scenariosUsed.length / 3 * 40 +    // Max 3 scenarios
  materialRisks.length / 5 * 30 +     // At least 5 risks
  materialOpportunities.length / 3 * 30
)

// Risk Management Score (0-100)
risk_mgmt_score = (
  hasRiskIdentificationProcess * 30 +
  riskAssessmentFrequency_score * 30 +
  ermIntegration_score * 40
)

// Metrics Score (0-100)
metrics_score = (
  scope1_disclosed * 20 +
  scope2_disclosed * 20 +
  scope3_disclosed * 20 +
  hasEmissionTarget * 20 +
  hasNetZeroCommitment * 10 +
  sbtiValidated * 10
)

// Overall TCFD Score
tcfd_score = (
  governance_score * 0.35 +
  strategy_score * 0.30 +
  risk_mgmt_score * 0.20 +
  metrics_score * 0.15
)
```

**Output Schema**:
```javascript
{
  overall_score: number (0-100),
  pillar_scores: {
    governance: number (0-100),
    strategy: number (0-100),
    risk_management: number (0-100),
    metrics_targets: number (0-100)
  },
  compliance_level: string,  // Full/Partial/Minimal
  gaps: array,
  recommendations: array,
  disclosure_quality: string  // High/Medium/Low
}
```

---

## 4.3 Calculation Performance

| Module | Avg Execution Time | Complexity | Cacheable |
|--------|-------------------|------------|-----------|
| Master Calculator | 50-100ms | O(n) | ✅ Yes |
| Transition Risk (TRS) | 10-15ms | O(1) | ✅ Yes |
| Physical Risk (PRS) | 8-12ms | O(1) | ✅ Yes |
| PACTA | 15-20ms | O(n) | ✅ Yes |
| TCFD | 12-18ms | O(n) | ✅ Yes |
| PCAF | 5-8ms | O(1) | ✅ Yes |
| Scope 3 | 3-5ms | O(1) | ✅ Yes |
| CBAM | 3-5ms | O(1) | ✅ Yes |
| Financial Impact | 5-8ms | O(1) | ✅ Yes |

**Total processing time for full assessment**: ~100-150ms (client-side)

---

# 5. API Specifications

## 5.1 Current Implementation (Mock API)

**Storage**: localStorage (browser-based)

**Collections**:
```javascript
STORAGE_KEYS = {
  USERS: 'mock_users',
  COMPANIES: 'mock_companies',
  ORGANIZATIONS: 'mock_organizations',
  WORKSPACES: 'mock_workspaces',
  CURRENT_USER: 'mock_current_user'
}
```

**API Methods** (src/services/mockApi.js):

### Authentication API

```javascript
// Login
mockAuthAPI.login(email, password)
// Returns: { success: true, user: {...} }

// Register
mockAuthAPI.register(userData)
// Returns: { success: true, user: {...} }

// Logout
mockAuthAPI.logout()
// Returns: { success: true }
```

### Company API

```javascript
// Get all companies
mockCompanyAPI.getAll()
// Returns: { success: true, data: [...] }

// Get company by ID
mockCompanyAPI.getById(id)
// Returns: { success: true, data: {...} }

// Create company
mockCompanyAPI.create(companyData)
// Returns: { success: true, data: {...} }

// Update company
mockCompanyAPI.update(id, companyData)
// Returns: { success: true, data: {...} }

// Delete company
mockCompanyAPI.delete(id)
// Returns: { success: true }

// Get pending companies
mockCompanyAPI.getPending()
// Returns: { success: true, data: [...] }
```

### Organization API

```javascript
// Get organization
mockOrganizationAPI.get()
// Returns: { success: true, data: {...} }

// Create organization
mockOrganizationAPI.create(orgData)
// Returns: { success: true, organization: {...} }

// Update organization
mockOrganizationAPI.update(orgData)
// Returns: { success: true, organization: {...} }

// Delete organization
mockOrganizationAPI.delete(orgId)
// Returns: { success: true }

// Get stats
mockOrganizationAPI.getStats()
// Returns: { success: true, stats: {...} }
```

### Workspace API

```javascript
// Get all workspaces
mockWorkspaceAPI.getAll()
// Returns: { success: true, data: [...] }

// Create workspace
mockWorkspaceAPI.create(workspaceData)
// Returns: { success: true, workspace: {...} }

// Update workspace
mockWorkspaceAPI.update(id, workspaceData)
// Returns: { success: true, workspace: {...} }

// Delete workspace
mockWorkspaceAPI.delete(id)
// Returns: { success: true }

// Add member
mockWorkspaceAPI.addMember(workspaceId, userId, role)
// Returns: { success: true, workspace: {...} }

// Remove member
mockWorkspaceAPI.removeMember(workspaceId, userId)
// Returns: { success: true, workspace: {...} }
```

## 5.2 Future REST API Design

### Base URL
```
Production: https://api.climate-risk-platform.com/v1
Staging: https://staging-api.climate-risk-platform.com/v1
```

### Authentication

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "analyst"
  }
}
```

### Assessment Endpoints

```http
POST /assessments
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "company": {...},
  "emissions": {...},
  "finance": {...},
  "physical": {...},
  "pacta": {...},
  "governance": {...}
}

Response: 201 Created
{
  "id": "uuid",
  "status": "completed",
  "results": {
    "metadata": {...},
    "scores": {...},
    "transition_risk": {...},
    "physical_risk": {...},
    ...
  },
  "created_at": "2025-01-10T12:00:00Z"
}
```

```http
GET /assessments/{id}
Authorization: Bearer {access_token}

Response: 200 OK
{
  "id": "uuid",
  "status": "completed",
  "results": {...},
  "created_at": "2025-01-10T12:00:00Z",
  "updated_at": "2025-01-10T12:00:00Z"
}
```

```http
GET /assessments
Authorization: Bearer {access_token}
Query Parameters:
  - page: int (default: 1)
  - limit: int (default: 20)
  - status: string (pending/completed/failed)
  - company_id: uuid
  - date_from: ISO 8601 date
  - date_to: ISO 8601 date

Response: 200 OK
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Portfolio Endpoints

```http
POST /portfolio/analyze
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "portfolio_id": "uuid",
  "companies": [
    {"id": "uuid1", "exposure": 1000000},
    {"id": "uuid2", "exposure": 2000000}
  ]
}

Response: 200 OK
{
  "portfolio_summary": {
    "total_exposure": 3000000,
    "avg_risk_score": 0.65,
    "high_risk_count": 1,
    "total_financed_emissions": 50000
  },
  "company_results": [...]
}
```

### Export Endpoints

```http
POST /reports/export
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "assessment_id": "uuid",
  "format": "pdf",  // pdf, excel, json
  "language": "en"  // en, tr
}

Response: 200 OK
{
  "download_url": "https://cdn.../report-uuid.pdf",
  "expires_at": "2025-01-11T12:00:00Z"
}
```

---

# 6. Database Schema

## 6.1 Current (localStorage Mock)

**Data Structure**:
```javascript
// mock_users
[
  {
    id: "1",
    email: "admin@climate.com",
    password: "admin123",  // Plain text (mock only!)
    role: "admin",
    organizationId: "1"
  }
]

// mock_companies
[
  {
    id: "1",
    name: "Example Corp",
    sector: "Enerji",
    status: "active",
    data: {...},  // Full form data
    createdAt: "2025-01-10T12:00:00Z",
    updatedAt: "2025-01-10T12:00:00Z"
  }
]

// mock_organizations
[
  {
    id: "1",
    name: "Climate Bank",
    industry: "Banking",
    workspaces: ["ws1", "ws2"],
    settings: {...}
  }
]

// mock_workspaces
[
  {
    id: "ws1",
    name: "Corporate Lending",
    organizationId: "1",
    members: [
      {userId: "1", role: "admin"},
      {userId: "2", role: "analyst"}
    ]
  }
]
```

## 6.2 Future PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workspace members (many-to-many)
CREATE TABLE workspace_members (
  workspace_id UUID REFERENCES workspaces(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR(50) NOT NULL,
  PRIMARY KEY (workspace_id, user_id)
);

-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sector VARCHAR(100),
  country VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  organization_id UUID REFERENCES organizations(id),
  workspace_id UUID REFERENCES workspaces(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  assessment_type VARCHAR(50),  -- financial, pacta, tcfd, ecb_ifrs_s2
  status VARCHAR(50) DEFAULT 'pending',  -- pending, processing, completed, failed
  input_data JSONB NOT NULL,
  results JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Emissions data table
CREATE TABLE emissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  year INT NOT NULL,
  scope1 DECIMAL(15,2),
  scope2_location DECIMAL(15,2),
  scope2_market DECIMAL(15,2),
  scope3_categories JSONB,
  data_quality_score INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Financial data table
CREATE TABLE financial_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  year INT NOT NULL,
  revenue_usd DECIMAL(15,2),
  ebitda_usd DECIMAL(15,2),
  total_assets_usd DECIMAL(15,2),
  total_debt_usd DECIMAL(15,2),
  equity_market_value_usd DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Risk scores table
CREATE TABLE risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id),
  trs DECIMAL(5,4),
  trs_adj DECIMAL(5,4),
  prs DECIMAL(5,4),
  ri DECIMAL(5,4),
  ri_star DECIMAL(5,4),
  risk_class VARCHAR(20),
  pd_base DECIMAL(5,4),
  pd_adj DECIMAL(5,4),
  lgd_base DECIMAL(5,4),
  lgd_adj DECIMAL(5,4),
  ecl_usd DECIMAL(15,2),
  rwa_usd DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log table
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_companies_organization ON companies(organization_id);
CREATE INDEX idx_assessments_company ON assessments(company_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_emissions_company_year ON emissions(company_id, year);
CREATE INDEX idx_financial_company_year ON financial_data(company_id, year);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);
```

---

# 7. Deployment Guide

## 7.1 Current Deployment (Netlify)

**Repository**: https://github.com/emrerecber/climate-platform

**Build Settings**:
```yaml
# netlify.toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Environment Variables**:
```
REACT_APP_API_MODE=mock
REACT_APP_VERSION=2.0
```

**Deployment Steps**:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update feature X"
   git push origin main
   ```

2. **Auto-deploy** (Netlify watches `main` branch):
   - Build triggered automatically
   - Deploy preview generated
   - Production deploy after tests pass

3. **Manual deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=build
   ```

**Live URL**: https://climatedati.netlify.app

## 7.2 Future Production Deployment

### 7.2.1 Frontend (Netlify/Vercel)

**Recommended**: Netlify or Vercel

**Build Command**:
```bash
npm run build
```

**Environment Variables**:
```
REACT_APP_API_URL=https://api.climate-risk-platform.com/v1
REACT_APP_API_MODE=production
REACT_APP_VERSION=2.0
REACT_APP_SENTRY_DSN=https://...
REACT_APP_ANALYTICS_ID=GA-...
```

### 7.2.2 Backend (Node.js + Express)

**Tech Stack**:
- Node.js 18+
- Express.js
- PostgreSQL 14+
- Redis (caching)

**Deployment Options**:
1. **Render.com** (recommended for MVP)
2. **AWS Elastic Beanstalk**
3. **Google Cloud Run**
4. **Azure App Service**

**Docker Configuration**:

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/climate_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
      - redis

  db:
    image: postgres:14-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=climate_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=climate_db

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

**Environment Variables** (.env):
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/climate_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=https://climatedati.netlify.app
SENTRY_DSN=https://...
```

### 7.2.3 Database (PostgreSQL)

**Managed Services**:
1. **AWS RDS PostgreSQL**
2. **Google Cloud SQL**
3. **Azure Database for PostgreSQL**
4. **Render.com Managed PostgreSQL**

**Configuration**:
- Instance type: 2 vCPU, 8GB RAM (minimum)
- Storage: 100GB SSD
- Backup: Daily automated backups (7-day retention)
- High Availability: Multi-AZ deployment

**Migration Scripts**:
```bash
# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

### 7.2.4 CI/CD Pipeline (GitHub Actions)

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - run: docker build -t climate-api:latest ./backend
      - run: docker push climate-api:latest
      - name: Deploy to Render
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

# 8. Monitoring & Troubleshooting

## 8.1 Logging

**Frontend Logging**:
```javascript
// src/utils/logger.js
export const logger = {
  info: (message, data) => {
    console.log(`[INFO] ${message}`, data);
    // Send to logging service (e.g., Sentry, LogRocket)
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to error tracking
  },
  performance: (metric, duration) => {
    console.log(`[PERF] ${metric}: ${duration}ms`);
    // Send to analytics
  }
};
```

**Backend Logging** (Future):
```javascript
// Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 8.2 Error Handling

**Common Errors**:

| Error | Cause | Solution |
|-------|-------|----------|
| `organizationAPI.create is not a function` | Mock API method missing | Check mockApi.js exports |
| `Cannot read properties of null` | Missing null checks | Add `data?.field` checks |
| `V.create is not a function` | React version mismatch | Use React 18 (not 19) |
| Calculation returns `NaN` | Division by zero or missing data | Add validation checks |
| Form submission fails | Missing mandatory fields | Check Step 1-2 fields |

**Error Boundaries**:
```javascript
// src/components/ErrorBoundary.js
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logger.error('React Error Boundary', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## 8.3 Performance Monitoring

**Key Metrics**:
- Form submission time: <200ms
- Calculation execution: <150ms
- Report generation: <3 seconds
- PDF export: <5 seconds

**Monitoring Tools**:
1. **Sentry** - Error tracking
2. **LogRocket** - Session replay
3. **Google Analytics** - Usage analytics
4. **New Relic** - Backend APM (future)

**Performance Optimization**:
```javascript
// Memoize expensive calculations
const memoizedTRS = useMemo(() => 
  calculateTRS(formData), 
  [formData.emissions, formData.finance]
);

// Debounce form validation
const debouncedValidate = debounce(validateForm, 300);
```

## 8.4 Health Checks

**Frontend Health**:
```javascript
// Check if app is running
GET /
Response: 200 OK

// Check localStorage availability
const isHealthy = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch {
    return false;
  }
};
```

**Backend Health** (Future):
```javascript
// GET /health
{
  "status": "healthy",
  "timestamp": "2025-01-10T12:00:00Z",
  "version": "2.0",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

---

# 9. Security & Compliance

## 9.1 Authentication & Authorization

**Current** (Mock):
- Basic email/password (plain text - NOT FOR PRODUCTION)
- Role-based access: admin, analyst, viewer

**Future** (Production):
- JWT-based authentication
- Password hashing (bcrypt)
- Role-based access control (RBAC)
- Multi-factor authentication (MFA)
- OAuth2/SAML integration

**Authorization Levels**:

| Role | Permissions |
|------|-------------|
| Admin | All access + user management |
| Analyst | Create/edit assessments, view reports |
| Viewer | View reports only |

## 9.2 Data Security

**Encryption**:
- ✅ HTTPS (TLS 1.3) for all traffic
- ✅ Encrypted localStorage (future enhancement)
- ✅ Encrypted database connections
- ✅ Encrypted backups

**Data Retention**:
- Assessments: 7 years (regulatory requirement)
- Audit logs: 3 years
- User activity: 1 year

**GDPR Compliance**:
- ✅ Data minimization
- ✅ Right to access
- ✅ Right to deletion
- ✅ Data portability
- ✅ Consent management

## 9.3 Regulatory Compliance

**Standards**:
- ✅ ECB Banking Supervision Guidelines
- ✅ IFRS S2 (Climate-related Disclosures)
- ✅ TCFD (Task Force on Climate-related Financial Disclosures)
- ✅ PCAF (Partnership for Carbon Accounting Financials)
- ✅ GHG Protocol (Scope 1/2/3)
- ✅ PACTA (Paris Agreement Capital Transition Assessment)

**Audit Trail**:
- All assessment calculations logged
- User actions tracked
- Data changes versioned
- Calculation methodology documented

## 9.4 Input Validation

**Form Validation Rules**:
```javascript
// Mandatory fields (Step 1-2)
entityName: required, min: 2, max: 255
entityType: required, enum: [individual, corporate, partnership, llc]
currency: required, enum: [TRY, USD, EUR, GBP, QAR]
facilityLatitude: required, number, min: -90, max: 90
facilityLongitude: required, number, min: -180, max: 180
physicalAddress: required, min: 10, max: 500
city: required, min: 2, max: 100

// Numeric fields
scope1Emissions: number, min: 0
revenue: number, min: 0
probabilityOfDefault: number, min: 0, max: 1
creditScore: number, min: 300, max: 900

// Date fields
establishmentDate: date, max: today
```

**SQL Injection Protection** (Future):
- Parameterized queries
- ORM usage (Prisma/TypeORM)
- Input sanitization

**XSS Protection**:
- React auto-escaping
- Content Security Policy (CSP)
- DOMPurify for user HTML

---

# 10. Appendix

## 10.1 Calculation Formulas Reference

### Transition Risk Score (TRS)
```
TRS = Σ(f_i * w_i) for i=1 to 7

Weights:
w1 = 0.25  (Emission Intensity)
w2 = 0.15  (Indirect Emissions)
w3 = 0.20  (Transformation CapEx)
w4 = 0.15  (Revenue Shock)
w5 = 0.10  (Compliance Cost)
w6 = 0.10  (Technology Gap)
w7 = 0.05  (Governance)

TRS_adj = TRS * (2 - governance_score)
```

### Physical Risk Score (PRS)
```
P = Σ(hazard_i * weight_i)
S = sector_sensitivity * (1 + asset_vulnerability)
A = Σ(adaptive_component_i * weight_i)

PRS = P * S * (1 - A)
```

### Combined Risk Index (RI*)
```
RI = wT * TRS_adj + wP * PRS

amplifier_sum = Σ(alpha_i * tag_i)
RI* = RI * (1 + amplifier_sum)

Classification:
- Low: RI* < 0.30
- Medium: 0.30 ≤ RI* < 0.60
- High: RI* ≥ 0.60
```

### Financial Impact
```
PD_adj = PD_base * (1 + 1.5*TRS + 1.2*PRS)
LGD_adj = LGD_base * (1 + 0.3*collateral_vuln*PRS)
ECL = EAD * PD_adj * LGD_adj
RWA = EAD * RW_adj * 12.5
Capital = RWA * 0.08  (Basel III minimum)
```

### PCAF Financed Emissions
```
EVIC = Equity Market Value + Total Debt
Attribution = Outstanding Amount / EVIC
Financed_S1 = Borrower_S1 * Attribution
Financed_S2 = Borrower_S2 * Attribution
Financed_S3 = Borrower_S3 * Attribution
PCF = Financed_Total / (Outstanding / 1M)
```

## 10.2 Glossary

| Term | Definition |
|------|------------|
| **TRS** | Transition Risk Score - measures climate transition risks (0-1 scale) |
| **PRS** | Physical Risk Score - measures physical climate hazards (0-1 scale) |
| **RI*** | Combined Risk Index with amplifiers |
| **PACTA** | Paris Agreement Capital Transition Assessment |
| **TCFD** | Task Force on Climate-related Financial Disclosures |
| **PCAF** | Partnership for Carbon Accounting Financials |
| **ECB** | European Central Bank |
| **IFRS S2** | International Financial Reporting Standard on Climate Disclosures |
| **PD** | Probability of Default - likelihood of loan default |
| **LGD** | Loss Given Default - loss severity if default occurs |
| **EAD** | Exposure at Default - loan amount at default |
| **ECL** | Expected Credit Loss - anticipated loss amount |
| **RWA** | Risk-Weighted Assets - assets weighted by risk |
| **EVIC** | Enterprise Value Including Cash - company valuation |
| **CBAM** | Carbon Border Adjustment Mechanism (EU) |
| **SAF** | Sustainable Aviation Fuel |
| **EAF** | Electric Arc Furnace (steel) |
| **BOF** | Basic Oxygen Furnace (steel) |
| **NZE** | Net Zero Emissions scenario (IEA) |
| **SDS** | Sustainable Development Scenario (IEA) |
| **STEPS** | Stated Policies Scenario (IEA) |

## 10.3 Support & Contact

**IT Support**: it@climatedati.com  
**Documentation**: https://docs.climatedati.com  
**GitHub**: https://github.com/emrerecber/climate-platform  
**Status Page**: https://status.climatedati.com

---

**End of IT Technical Documentation**

**Version**: 2.0  
**Last Updated**: 2025-01-10  
**Next Review**: 2025-04-10
