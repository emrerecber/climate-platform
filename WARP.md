# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Climate Risk Analysis Platform** - A comprehensive TCFD-compliant climate risk assessment SaaS platform for financial institutions. The platform analyzes transition risks, physical risks, and PACTA alignment for banking portfolios using NGFS scenarios.

**Version:** 2.0  
**Tech Stack:** React 19 + Node.js/Express (backend ready)  
**Target Users:** Banks, insurance companies, investment funds, corporations  
**Language Support:** Turkish (primary), English

## Development Commands

### Frontend (React)
```powershell
# Install dependencies
npm install --legacy-peer-deps

# Development server (http://localhost:3000)
npm start

# Production build
npm run build

# Run tests
npm test

# Test production build locally
npm run build
npx serve -s build
```

### Backend (Ready but not deployed)
```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Production server
npm start

# Database operations
npm run db:migrate    # Run migrations
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:studio     # Open Prisma Studio GUI

# Code quality
npm run lint
npm test
```

### Deployment
```powershell
# Netlify deployment (configured via netlify.toml)
# Build command: npm install --legacy-peer-deps && npm run build
# Publish directory: build
# Node version: 18
```

## Architecture Overview

### Core Calculation Engines (3 Engines)

1. **RiskCalculators.js** - Basic risk calculation
   - `TransitionRiskCalculator` - 7-factor weighted scoring for transition risks
   - `PhysicalRiskCalculator` - PCRS methodology for physical risks
   - `ClimateRiskCalculator` - Combined asset-level risk analysis

2. **enhancedRiskCalculator.js** - NGFS methodology
   - EBITDA Bridge calculation with carbon pricing
   - PD/LGD adjustments for credit risk
   - 3 climate scenarios: orderly_2030, disorderly_2030, hothouse_2030
   - PACTA technology alignment scoring
   - Financial stress mapping to ECL (Expected Credit Loss)

3. **financialAnalysis.js** - Financial health assessment
   - 100-point financial health scoring system
   - Liquidity, debt, profitability, savings analysis
   - Portfolio analytics
   - A-F grading system

### Data Flow

```
User Input (10-step form) 
  → DataManager (LocalStorage) 
  → Risk Calculation Engines 
  → Analysis Results 
  → PDF Reports / Dashboard
```

### Project Structure

```
climate-platform/
├── src/
│   ├── components/          # UI Components
│   │   ├── FinancialDataForm.js      # Main 10-step assessment form
│   │   ├── FinancialReport.js        # Report visualization
│   │   ├── EnhancedRiskAnalysis.js   # NGFS risk analysis view
│   │   ├── RiskReport.js             # Risk report generation
│   │   ├── PACTADataForm.js          # PACTA alignment input
│   │   ├── Layout.js                 # Page layout wrapper
│   │   └── pages/                    # Route-based page components
│   ├── services/            # Business logic
│   │   ├── DataManager.js            # Data persistence & export
│   │   ├── RiskCalculators.js        # Basic risk calculations
│   │   └── WeatherService.js         # Weather/climate APIs
│   ├── utils/               # Helper functions
│   │   ├── enhancedRiskCalculator.js # NGFS advanced calculations
│   │   ├── financialAnalysis.js      # Financial metrics
│   │   └── exportUtils.js            # PDF/Excel export
│   ├── i18n.js              # Multi-language configuration (TR/EN)
│   └── App.js               # Main application & routing
├── backend/                 # Backend API (ready, not deployed)
│   ├── src/                 # TypeScript source
│   ├── prisma/              # Database schema
│   └── netlify/             # Serverless functions
├── public/                  # Static assets
└── build/                   # Production build output
```

## Key Technical Concepts

### 10-Step Assessment Form
The platform collects 89+ data fields across 10 steps:
1. Entity/Company Information
2. Geographic Location
3. Income Data
4. Expense Data
5. Asset Data
6. Liability Data
7. Investment & Goals
8. Credit Risk Information
9. Export & CBAM Data
10. ESG & Environmental Data

### Risk Calculation Methodology

**Transition Risk Score (TRS)**
- Weighted scoring across 7 factors: direct emissions (18%), indirect emissions (10%), investment cost (25%), revenue impact (23%), restriction cost (12%), governance (6%), innovation R&D (8%)
- Formula: `TRS = Σ(factor × weight)`
- Categories: Low (≤12), Medium (12-17), High (>17)

**Physical Climate Risk Score (PCRS)**
- Hazard exposure: flood (30%), heatwave (25%), drought (25%), storm (20%)
- Formula: `PCRS = (WeightedHazard × 0.5) + (Sensitivity × 0.3) - (AdaptiveCapacity × 0.2)`
- Categories: Low (<2.75), Medium (2.75-4.25), High (≥4.25)

**EBITDA Bridge (NGFS)**
- Carbon cost = Scope1 emissions × carbon price (scenario-specific)
- Electricity cost = Energy consumption × energy price delta
- Demand impact = Revenue × sector delta × (1 - pass-through rate)
- Total shock normalizes to TRS (0-1 scale)

**PD/LGD Adjustments**
- `PD_new = PD_base × (1 + η_PD × RI_adjusted × maturityMultiplier)`
- `LGD_new = min(0.95, LGD_base + λ_LGD × PRS × collateralVulnerability)`
- `ECL = EAD × PD_new × LGD_new`

### Data Management

**LocalStorage Structure:**
- `climateRiskAssets` - Asset portfolio
- `financialData` - Income/expense/assets/liabilities
- `geographicData` - Location and climate zone data
- `creditRiskData` - Credit scores, PD/LGD, collateral
- `exportCbamData` - Export destinations, CBAM coverage
- `esgData` - ESG certifications, environmental assessments
- `currentCompany` - Active company context

**DataManager Service:**
- Handles all LocalStorage operations
- Company-scoped data isolation
- Data completeness calculation
- Export to JSON/Excel/PDF
- Real-time update broadcasting

### NGFS Scenarios (v5)

1. **Orderly 2030** - Early, smooth transition
   - Carbon price: 150 QAR/tCO2e
   - Energy delta: +30 QAR/MWh
   - GDP growth: +2%

2. **Disorderly 2030** - Late, abrupt transition
   - Carbon price: 300 QAR/tCO2e
   - Energy delta: +70 QAR/MWh
   - GDP growth: -1%

3. **Hothouse 2030** - No transition, high physical risks
   - Carbon price: 50 QAR/tCO2e
   - Energy delta: +100 QAR/MWh
   - GDP growth: -3%

### PACTA Alignment

Applicable to energy and automotive sectors:
- **Energy:** Renewable capacity vs 70% benchmark (2030, 1.5°C scenario)
- **Automotive:** EV production vs 50% benchmark (2030)
- Gap calculation: `(benchmark - actual) / benchmark`
- Influences risk index via technology gap multiplier (θ = 0.3)

## Multi-Language Support (i18n)

**Configuration:** `src/i18n.js`  
**Framework:** react-i18next with browser language detection  
**Default Language:** Turkish (tr)  
**Fallback:** Turkish

**Usage:**
```javascript
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();

// Use translations
<h2>{t('geographicLocationInfo')}</h2>

// Change language
i18n.changeLanguage('en');
```

**Translation Coverage:** 110+ terms across all UI components

## Backend Architecture (Ready for Deployment)

**Tech Stack:**
- Node.js + Express.js + TypeScript
- Prisma ORM + PostgreSQL
- JWT authentication
- Serverless functions (Netlify)

**Database Schema Highlights:**
- `users` - User authentication & roles
- `organizations` - Multi-tenant support
- `assessments` - Climate risk assessments
- `reports` - Generated PDF/Excel reports
- `scenarios` - NGFS scenario parameters
- `benchmarks` - PACTA sector benchmarks

**API Endpoints (Planned):**
- `/api/auth/*` - Authentication
- `/api/companies/*` - Company CRUD
- `/api/assessments/*` - Assessment lifecycle
- `/api/reports/*` - Report generation

## Development Guidelines

### Adding New Risk Factors

1. Update the appropriate calculator in `services/RiskCalculators.js` or `utils/enhancedRiskCalculator.js`
2. Add new weight/coefficient to the `weights` or `params` object
3. Update calculation formulas
4. Add translation keys to `i18n.js`
5. Update form in `FinancialDataForm.js` if new input needed
6. Test with realistic data scenarios

### Adding New Sectors

1. Add sector to NGFS scenario data in `enhancedRiskCalculator.js` (`sector_deltas`)
2. Define pass-through rate in `getPassThroughRate()` method
3. Update PACTA benchmarks if applicable
4. Add sector-specific sensitivity tags in `getSensitivityTags()`
5. Update translations in `i18n.js`

### Working with Forms

- The 10-step form is managed in `FinancialDataForm.js`
- State is managed via React hooks with real-time LocalStorage sync
- Each step validates required fields before allowing progression
- Dynamic arrays use `handleArrayChange()` and `addArrayItem()` patterns
- All form data automatically saves to DataManager on change

### Report Generation

- Financial reports: `FinancialReport.js`
- Risk reports: `RiskReport.js` 
- Enhanced analysis: `EnhancedRiskAnalysis.js`
- PDF export uses jsPDF + html2canvas
- Charts use Chart.js and Recharts

### Testing Calculations

When testing risk calculations, use realistic data:
```javascript
const testData = {
  entityName: "Test Energy Co",
  sector: "Enerji",
  annualRevenue: 500,           // Million TRY
  scope1Emissions: 50000,        // tCO2e/year
  totalEnergyConsumption: 200,   // GWh/year
  floodRisk: "high",
  creditAmount: 100000000,       // TRY
  creditScore: 750,
  probabilityOfDefault: 2.5,     // %
  lossGivenDefault: 45           // %
};
```

### Environment Variables

Required for production:
```powershell
# Backend (.env)
DATABASE_URL="postgresql://..."
JWT_SECRET="secure-key"
NODE_ENV="production"
PORT=3001

# Optional external APIs
TCMB_API_KEY=""
NGFS_API_KEY=""
WEATHER_API_KEY=""
```

## Compliance & Standards

### TCFD (Task Force on Climate-related Financial Disclosures)
- Governance metrics tracking
- Strategy scenario analysis (3 NGFS scenarios)
- Risk management integration
- Metrics & targets disclosure
- All reports are TCFD-compliant by design

### BRSA (Banking Regulation and Supervision Agency - Turkey)
- Credit risk integration with climate factors
- Stress testing scenarios
- Portfolio-level aggregation ready

### EU Taxonomy & CBAM
- Export/CBAM data collection (Step 9)
- Carbon content tracking
- HS code classification
- EU destination identification

## Known Limitations & Future Work

### Current MVP Gaps:
- No backend persistence (LocalStorage only)
- No user authentication
- No multi-user/tenant support
- Manual NGFS scenario updates
- No real-time market data integration

### Roadmap (See PRODUCTION_ROADMAP.md):
- **Phase 1** (4-6 weeks): Backend infrastructure, auth, API
- **Phase 2** (6-8 weeks): External data integrations (TCMB, NGFS, weather)
- **Phase 3** (8-10 weeks): Enterprise features (multi-tenant, RBAC, audit logs)
- **Phase 4** (6-8 weeks): Regulatory compliance modules (SFDR, EU Taxonomy)

## Resources & Documentation

- **Full Documentation:** `CLIMATE_PLATFORM_DOCUMENTATION.md` (comprehensive 1665-line technical documentation)
- **Deployment Guide:** `DEPLOY.md`
- **Production Roadmap:** `PRODUCTION_ROADMAP.md`
- **TCFD Framework:** https://www.fsb-tcfd.org/
- **NGFS Scenarios:** https://www.ngfs.net/ngfs-scenarios-portal/
- **PACTA Methodology:** https://www.transitionmonitor.com/

## Troubleshooting

### Build Failures
- Ensure `--legacy-peer-deps` flag is used with npm install
- Node version must be 18+
- Clear node_modules and package-lock.json, reinstall if peer dependency conflicts

### Calculation Issues
- Verify all numeric inputs are properly parsed with `parseFloat()`
- Check for null/undefined values before calculations
- Ensure sector names match exactly (case-sensitive) in scenario data
- NGFS calculations require: `annualRevenue`, `scope1Emissions`, `totalEnergyConsumption`

### Language Switching
- Use `i18n.changeLanguage('en')` or `i18n.changeLanguage('tr')`
- Missing translations fall back to Turkish
- Add new keys to both `tr` and `en` objects in `i18n.js`

### LocalStorage Limits
- Browser limit: ~5-10MB
- Use data completeness score to monitor storage
- Export data regularly using DataManager.exportAllData()
- Consider backend migration for production scale

## Contributing Notes

When making changes to this codebase:

1. **Risk calculations** are the core business logic - handle with care and validate thoroughly
2. **Maintain i18n** - Always add Turkish and English translations for new UI text
3. **Preserve TCFD compliance** - Ensure changes don't break regulatory reporting
4. **Test with realistic data** - Use banking/corporate financial scenarios
5. **Document formulas** - Climate finance formulas should include source references
6. **Follow existing patterns** - DataManager for persistence, standard calculator interfaces
7. **Consider backend migration** - Structure code to facilitate future API integration

## Contact & Support

**Project Type:** SaaS Climate Risk Platform  
**Industry:** FinTech / Climate Finance  
**Regulatory Compliance:** TCFD, BRSA (Turkey), EU Taxonomy ready  
**Market:** Turkish financial institutions (primary), international expansion planned
