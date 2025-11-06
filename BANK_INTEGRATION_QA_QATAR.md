# Bank Integration Q&A Guide
## Qatar Bank Integration - Technical Due Diligence

**Target**: Qatar-based Financial Institution  
**Scope**: Climate Risk Platform Integration + AI System Integration  
**Regulatory Context**: Qatar Central Bank (QCB), Qatar Financial Centre Regulatory Authority (QFCRA)

---

# PART 1: Expected Questions from the Bank

## A. REGULATORY & COMPLIANCE 🇶🇦

### 1. Qatar Central Bank (QCB) Compliance
**Q: "Is your platform compliant with QCB guidelines on climate risk management?"**
- **Answer**: Yes, our platform aligns with:
  - QCB Climate Risk Management Guidelines (2023)
  - Basel Committee on Banking Supervision (BCBS) climate risk principles
  - Network for Greening the Financial System (NGFS) scenarios
  - ECB/IFRS S2 standards (which QCB references)
- **Evidence**: We can provide mapping document showing QCB requirement → our data field coverage

**Q: "Does the platform support Arabic language for reporting?"**
- **Current Status**: English + Turkish (TR/EN toggle)
- **Roadmap**: Arabic (AR) language pack can be added in 4-6 weeks
- **Commitment**: All reports, UI, and PDF exports will support Arabic RTL (right-to-left)

**Q: "How do you handle Sharia-compliant reporting requirements?"**
- **Answer**: 
  - Our platform is methodology-agnostic (can accommodate Islamic finance principles)
  - Can exclude interest-based calculations if needed
  - Support for Mudarabah/Musharakah financing structures
  - Can integrate with AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions) standards
- **Customization**: Requires 2-3 weeks for Sharia-specific reporting templates

---

### 2. Data Residency & Sovereignty
**Q: "Where will our data be stored? Can it remain in Qatar?"**
- **Options**:
  1. **SaaS (EU Frankfurt)**: Data in AWS eu-central-1 (GDPR-compliant, but outside Qatar)
  2. **PaaS (Qatar Cloud)**: Deploy in customer's cloud account
     - AWS Middle East (Bahrain) - me-south-1
     - Google Cloud Middle East (Doha) - planned 2025
     - Local Qatar data centers (if bank has private cloud)
  3. **On-Premise**: Full deployment in bank's data center (Doha)
- **Recommendation**: On-Premise or PaaS in Qatar cloud for data sovereignty

**Q: "What about Qatar's Personal Data Protection Law (PDPL 2021)?"**
- **Answer**: We comply with:
  - Consent management (explicit opt-in for data collection)
  - Right to access, rectification, deletion
  - Data minimization (only collect necessary fields)
  - Cross-border data transfer restrictions (if data stays in Qatar, no issue)
- **Documentation**: Can provide Data Processing Agreement (DPA) aligned with PDPL

**Q: "Does your platform comply with QFCRA Data Protection Regulations?"**
- **Answer**: Yes, if the bank operates in Qatar Financial Centre (QFC):
  - QFCRA Data Protection Regulations 2020 (similar to GDPR)
  - Information security standards (ISO 27001 certified)
  - Audit trail requirements (7-year retention, we provide)
- **Evidence**: ISO 27001, SOC 2 Type II certificates available

---

### 3. Financial Sector Regulations
**Q: "How does this help with QCB's Climate Risk Stress Testing requirements?"**
- **Answer**: QCB mandated climate stress testing (2024 guidelines):
  - **Physical Risk**: Our platform calculates flood, drought, heat, coastal risks for Qatar geography
  - **Transition Risk**: Carbon pricing scenarios (IEA Net Zero aligned)
  - **NGFS Scenarios**: We support 6 NGFS pathways (orderly, disorderly, hot house)
  - **Reporting**: Can generate QCB-compliant stress test reports
- **Qatar-Specific Data**: We have climate data for:
  - Doha (extreme heat risk: HIGH)
  - Al Wakrah (coastal vulnerability: MEDIUM-HIGH)
  - Mesaieed (industrial zone + coastal: HIGH)

**Q: "What about anti-money laundering (AML) / know your customer (KYC) integration?"**
- **Answer**: Our platform focuses on **climate/ESG risk**, not AML/KYC
- **Integration**: Can integrate with bank's existing AML systems via API
  - Fetch company data from KYC database
  - Enrich with climate risk scores
  - Push risk ratings back to AML system
- **Use Case**: Flag high-risk sectors (fossil fuels, carbon-intensive) for enhanced due diligence

---

## B. TECHNICAL INTEGRATION

### 4. Core Banking System Integration
**Q: "We use [Temenos T24 / Finacle / SAP / Oracle FLEXCUBE] - can you integrate?"**
- **Answer**: YES - API-first architecture
- **Integration Methods**:
  1. **REST API**: Pull company data from core banking → Climate Platform
  2. **Webhook**: Push climate risk scores back to core banking
  3. **Middleware**: Custom adapter layer (we can develop)
  4. **Batch ETL**: Nightly data sync via SFTP/SFCS
- **Timeline**: 
  - API integration: 2-3 weeks
  - Custom middleware: 4-6 weeks
- **Question for Bank**: What is your core banking system and version?

**Q: "How do you handle real-time credit decisioning?"**
- **Answer**: 
  - **Synchronous API**: <3 second response time for risk score calculation
  - **Async Processing**: Heavy calculations (full assessment) can run in background
  - **Caching**: Pre-calculate scores for known companies (instant lookup)
- **Architecture**: Microservices with Redis caching layer
- **SLA**: 99.9% uptime, <500ms API response for cached data

**Q: "What if our core banking system is on legacy mainframe (IBM z/OS, AS/400)?"**
- **Answer**: 
  - **Option 1**: Use middleware (IBM MQ, WebSphere) to bridge mainframe → REST API
  - **Option 2**: Batch file transfer (COBOL program exports data → SFTP → our system)
  - **Option 3**: Modernization layer (API wrapper around mainframe)
- **Experience**: We can work with banks still on legacy systems
- **Question for Bank**: Do you have a middleware/ESB layer (MuleSoft, IBM IIB, WSO2)?

---

### 5. AI System Integration
**Q: "We have our own AI/ML models for credit risk - how do you integrate?"**
- **Answer**: **Ensemble Approach** - combine your AI + our climate risk
- **Integration Architecture**:
  ```
  Bank's Credit AI Model
    ├─ Inputs: Financial data, transaction history
    ├─ Output: Default Probability (PD_base)
    ↓
  Climate Risk Platform
    ├─ Inputs: Sector, location, emissions
    ├─ Output: Climate Risk Adjustment (CRA)
    ↓
  Combined Model
    ├─ PD_climate = PD_base × (1 + CRA)
    ├─ Example: 5% PD → 6.5% PD (30% climate adjustment)
  ```
- **Technical Methods**:
  1. **Sequential**: Your AI runs first → output fed to our platform → final score
  2. **Parallel**: Both run independently → weighted average
  3. **Feature Enrichment**: We provide climate features as input to your AI model
- **Data Format**: JSON via REST API or CSV batch

**Q: "Our AI is a black-box model (proprietary vendor) - can you still integrate?"**
- **Answer**: YES - **Post-processing approach**
- **Method**:
  1. Your AI outputs PD score (e.g., 8%)
  2. Our platform calculates Climate Risk Score (CRS) separately (e.g., HIGH = 0.75)
  3. We apply adjustment factor:
     - LOW CRS (0-0.3): PD × 1.05 (5% increase)
     - MEDIUM CRS (0.3-0.6): PD × 1.20 (20% increase)
     - HIGH CRS (0.6-1.0): PD × 1.40 (40% increase)
  4. Final PD = 8% × 1.40 = 11.2%
- **No need to retrain** your existing AI model

**Q: "Can we use your data to train our own AI models?"**
- **Answer**: 
  - **YES (with Enterprise license)**: Raw data export allowed
  - **Data Provided**:
    - 200 input fields per assessment
    - 6 module outputs (PACTA, TCFD, Scope 3, Physical Risk, Forward, Benchmarking)
    - Historical assessments (if you process 500+ companies)
  - **Format**: CSV, JSON, Parquet (for ML pipelines)
  - **Use Case**: Train model to predict "Which companies will have high climate risk?"
- **License Requirement**: Must be specified in contract (data usage rights)

---

### 6. Data Security in Qatar Context
**Q: "We need to comply with Qatar's Cybersecurity Framework (2023) - are you aligned?"**
- **Answer**: YES - Qatar National Cybersecurity Framework (QNCF) aligned
- **Controls**:
  - **Access Control**: Role-based (RBAC), MFA mandatory
  - **Encryption**: AES-256 at rest, TLS 1.3 in transit
  - **Monitoring**: SIEM integration (Splunk, ELK, QRadar)
  - **Incident Response**: 24/7 SOC, <1 hour response time for critical incidents
  - **Penetration Testing**: Quarterly (can be done by Qatar-based firm)
- **Certification**: ISO 27001, SOC 2 Type II (recognized by QCB)

**Q: "Do you have experience with Qatar's Critical Infrastructure Protection regulations?"**
- **Answer**: 
  - **Banking = Critical Infrastructure** in Qatar
  - **Requirements**:
    - Air-gapped environment (On-Premise deployment supports this)
    - Disaster Recovery (DR) in Qatar (we can deploy in 2 Qatar data centers)
    - Business Continuity Plan (BCP) - RPO: 1 hour, RTO: 4 hours
  - **Deployment**: Recommend active-active setup (Doha + Al Khor data centers)

---

## C. DATA SOURCING & APIs

### 7. External Data Sources
**Q: "What external APIs do you use? Are they accessible from Qatar?"**
- **Current (Phase 1)** - ✅ NO EXTERNAL APIS (all internal logic):
  - Köppen climate classification (embedded algorithm)
  - ND-GAIN country scores (static database, updated quarterly)
  - Water stress mapping (regional data)
- **Future (Phase 2)** - 🔄 PLANNED:
  1. **Google Geocoding API**
     - Status: Accessible from Qatar ✅
     - Firewall: Requires outbound HTTPS (port 443) to googleapis.com
     - Alternative: Can use local geocoding library (if blocked)
  
  2. **World Bank Climate API**
     - Status: Accessible from Qatar ✅ (public API)
     - Firewall: Outbound HTTPS to worldbank.org
     - Data: Historical climate trends (1990-2023)
  
  3. **WRI Aqueduct Water Risk Atlas**
     - Status: Accessible from Qatar ✅
     - Firewall: Outbound HTTPS to wri.org
     - Data: Water stress scores by basin
  
  4. **Bloomberg ESG API**
     - Status: Requires Bloomberg Terminal subscription
     - Qatar Access: ✅ Available (many Qatar banks have Bloomberg)
     - Firewall: Bloomberg Terminal handles connectivity
  
  5. **OpenWeatherMap API**
     - Status: Accessible from Qatar ✅
     - Firewall: Outbound HTTPS to openweathermap.org
     - Alternative: Can use Qatar Meteorology Department data (if partnership exists)

**Q: "What if our bank's firewall blocks external APIs for security?"**
- **Answer**: **Air-Gapped Mode** (On-Premise deployment)
  - All calculations work without internet (Phase 1 - currently operational)
  - Phase 2 APIs are **optional enhancements**, not required
  - We can provide **data snapshots** (quarterly updates via USB/SFTP)
    - Köppen zones: Updated annually
    - ND-GAIN scores: Updated quarterly
    - Benchmarking data: Updated quarterly
  - **Recommended**: Allow whitelisted domains (googleapis.com, worldbank.org) for Phase 2 features

**Q: "Can you integrate with Qatar-specific data sources?"**
- **Answer**: YES - **Local Data Integration** (Custom Development)
- **Potential Qatar Sources**:
  1. **Qatar Meteorology Department (QMD)**
     - Weather data, climate forecasts
     - Timeline: 3-4 weeks for API integration
  
  2. **Ministry of Environment and Climate Change (MECC)**
     - GHG inventory data for Qatar
     - Timeline: 4-6 weeks (likely requires manual data entry, no API)
  
  3. **Qatar Exchange (QE)**
     - Public company ESG disclosures
     - Timeline: 2-3 weeks for web scraping or API
  
  4. **Qatar Central Bank (QCB) Data Portal**
     - Sector-specific risk data
     - Timeline: Depends on data availability and access permissions
  
  5. **Qatar Petroleum / QatarEnergy**
     - Energy sector emissions data
     - Timeline: Requires partnership/data sharing agreement

- **Custom Development Fee**: $10k-$30k per data source integration

---

### 8. Data Quality & Validation
**Q: "How do you ensure data accuracy for Qatar-specific assessments?"**
- **Answer**: 
  - **Qatar Climate Data** (Built-in):
    - Doha: Köppen classification "BWh" (Hot Desert)
    - Heat risk: 0.95 (EXTREME - 50°C+ summers)
    - Drought risk: 0.90 (VERY HIGH - annual rainfall <100mm)
    - Coastal risk: 0.70 (HIGH - sea level rise + storm surge)
  - **Data Sources**:
    - IPCC AR6 regional data (Middle East chapter)
    - World Bank climate projections for Qatar
    - Qatar National Climate Change Plan (2030)
  - **Validation**: We can benchmark against:
    - Qatar's 2nd National Communication to UNFCCC (2021)
    - Qatar's NDC (Nationally Determined Contribution) targets
  - **Local Expertise**: We can partner with Qatar University or HBKU (Hamad Bin Khalifa University) for validation

**Q: "What about data for Qatari companies (mostly unlisted, private)?"**
- **Challenge**: Qatar has many private companies + family-owned businesses (limited public ESG data)
- **Solution**: **Manual Data Entry** + **Proxy Estimates**
  1. **Manual Entry**:
     - Bank collects data from client (as part of loan application)
     - 200-field form (we provide)
     - Bank analyst enters data into our platform
  
  2. **Proxy Estimation** (for missing data):
     - Use sector averages (e.g., Qatar construction sector average carbon intensity)
     - Scale by company size (revenue-based scaling)
     - Example: "Unknown construction company, $50M revenue" → Estimate emissions from sector benchmark
  
  3. **Third-Party Data Providers** (for larger Qatar companies):
     - S&P Global Trucost (ESG data)
     - MSCI ESG Ratings
     - Refinitiv (formerly Thomson Reuters)
     - Cost: $20k-$50k/year for data subscriptions (bank would pay)

---

## D. OPERATIONAL & BUSINESS

### 9. Pricing & Licensing
**Q: "What is the pricing for a Qatar bank with [X] corporate clients?"**
- **Pricing Models** (refer to Slide 9 + 13):
  
  **Scenario 1: Regional Bank** (500-1,000 assessments/year)
  - **SaaS Tier 2**: $8,000/month ($96k/year)
  - Includes: 20 named users, 200 assessments/month
  
  **Scenario 2: National Bank** (1,000-5,000 assessments/year)
  - **PaaS**: $25 per assessment = $25k-$125k/year
  - OR **SaaS Tier 3**: $25k/month ($300k/year) unlimited
  
  **Scenario 3: Systemically Important Bank** (5,000+ assessments/year)
  - **On-Premise**: $250k one-time + $50k/year maintenance
  - Best for: Qatar Central Bank, Qatar Islamic Bank, Commercial Bank of Qatar

- **Qatar-Specific Discounts**:
  - Multi-year contract (3 years): -15%
  - Government-linked (if bank is state-owned): -10%
  - Regional deployment (if bank has Kuwait/UAE/Bahrain branches): Volume pricing

**Q: "Can we pay in Qatari Riyal (QAR) instead of USD?"**
- **Answer**: YES
  - Invoicing currency: QAR (at current exchange rate ~3.64 QAR/USD)
  - Example: $250k license = QAR 910,000
  - Payment terms: Net 30 days, bank transfer to Qatar bank account (if we establish local entity)
- **Tax**: 
  - Qatar Corporate Tax: 10% (standard rate)
  - VAT: None (Qatar has no VAT, unlike UAE/Saudi)

**Q: "Do we need to set up a local entity in Qatar to do business?"**
- **Answer**: 
  - **Short-term (pilot)**: No - cross-border services allowed
  - **Long-term (multi-year)**: Recommended
    - Set up Qatar branch or subsidiary (Qatar Free Zones - QFC, QSTP)
    - Benefits: Local support, easier data residency compliance, QAR invoicing
  - **Timeline**: 2-3 months for Qatar company registration
  - **Partner Option**: We can work with local Qatar IT integrator (reseller model)

---

### 10. Support & Maintenance
**Q: "What support do you provide? Do you have staff in Qatar?"**
- **Current Support**:
  - **24/7 Email/Chat**: support@climate-platform.com
  - **Business Hours Phone**: Turkey timezone (GMT+3, Qatar is GMT+3 - same timezone ✅)
  - **SLA**: 
    - Critical issues: 4-hour response
    - Major issues: 24-hour response
    - Minor issues: 48-hour response
- **Qatar Local Support** (Roadmap):
  - **Option 1**: Hire 1-2 support engineers in Doha (if we get 3+ Qatar bank clients)
  - **Option 2**: Partner with Qatar-based IT firm (e.g., Mannai IT, Ooredoo Business)
  - **Timeline**: 6-9 months after first Qatar deployment

**Q: "What if we need on-site support during go-live?"**
- **Answer**: YES - **On-site Professional Services**
  - We can send 2 engineers to Doha for 2-4 weeks (go-live + hypercare)
  - Cost: $15k-$25k (travel + accommodation + daily rate)
  - Includes:
    - Installation/configuration
    - Integration with core banking
    - User training (admin, analyst, manager)
    - Go-live support (parallel run)
    - Knowledge transfer

**Q: "Can you provide training in Arabic?"**
- **Answer**: 
  - **Documentation**: English (current), Arabic (can translate in 4-6 weeks)
  - **Training Sessions**: 
    - English trainers (current)
    - Arabic trainers (can hire Qatar-based trainer or use translator)
  - **Timeline**: 2-3 months to build Arabic training materials
  - **Cost**: +$10k for Arabic localization (one-time)

---

## E. PERFORMANCE & SCALABILITY

### 11. System Performance
**Q: "How many concurrent users can the system handle?"**
- **Architecture**: Horizontally scalable (Kubernetes-based)
- **Capacity** (per deployment tier):
  - **SaaS**: 500 concurrent users (shared infrastructure)
  - **PaaS**: Unlimited (bank controls scaling)
  - **On-Premise**: Depends on hardware (see Slide 9)
    - 100 concurrent users: 2× API servers (8 vCPU, 32GB RAM each)
    - 500 concurrent users: 5× API servers (scale horizontally)
- **Database**: PostgreSQL (supports 10,000+ connections with PgBouncer pooling)

**Q: "What is the typical response time for climate risk assessment?"**
- **Performance Benchmarks**:
  - **Simple calculation** (cached data): <500ms
  - **Full assessment** (6 modules): 2-3 seconds
  - **Batch processing** (100 companies): 3-5 minutes
- **Optimization**: 
  - **Pre-calculation**: Run assessments nightly for all active clients
  - **Caching**: Store results for 30 days (regulations allow monthly updates)
  - **CDN**: Static assets served from Bahrain/UAE edge locations (low latency to Qatar)

**Q: "Can the system handle [Qatar's extreme summer heat] data center requirements?"**
- **Answer**: YES - designed for Middle East climate
- **Considerations**:
  - **Cooling**: Standard data center (18-27°C, same as global standards)
  - **Power**: Redundant UPS (Qatar has stable power grid)
  - **On-Premise Hardware**: Dell/HP/Cisco - all available in Qatar market
- **Recommendation**: Use Qatar data center providers
  - Meeza (owned by QCB) - preferred for banks
  - Ooredoo Data Center
  - Vodafone Qatar Data Center
  - stc Qatar Data Center

---

## F. REGULATORY REPORTING

### 12. Compliance Outputs
**Q: "Can the platform generate reports for QCB submission?"**
- **Answer**: YES - customizable report templates
- **Current Reports**:
  - PACTA Climate Alignment Report (40+ pages PDF)
  - TCFD 4-Pillar Compliance Report
  - Financial Risk Analysis Report
  - Excel exports (raw data for QCB filing)
- **QCB-Specific Customization** (can add):
  - QCB Climate Risk Return (CRR) format
  - NGFS scenario results table (as specified by QCB)
  - Arabic-language executive summary
  - QAR currency reporting (instead of USD/EUR)
- **Timeline**: 3-4 weeks for QCB report template development
- **Cost**: Included in Enterprise license OR $15k one-time for custom report

**Q: "How often do we need to run assessments per QCB guidelines?"**
- **QCB Requirement** (as of 2024 draft guidelines):
  - **Annual**: Full climate risk assessment for all corporate clients
  - **Quarterly**: High-risk clients (carbon-intensive sectors)
  - **Ad-hoc**: New loan applications >QAR 10M (~$2.75M USD)
- **Our Recommendation**:
  - **Quarterly batch**: Run all clients every 3 months (automated)
  - **Real-time**: Integrate with loan origination system (on-demand)
  - **Annual review**: Deep-dive with management interviews (manual)

---

---

# PART 2: Questions YOU Should Ask the Bank

## A. INFRASTRUCTURE & TECHNICAL ENVIRONMENT

### 1. Core Banking & IT Landscape
**Q1.1: What is your core banking system?**
- [ ] Temenos T24 (which version? R21? R22?)
- [ ] Oracle FLEXCUBE (Universal Banking? Direct Banking?)
- [ ] Finacle (version 10.x? 11.x?)
- [ ] SAP Banking Services
- [ ] Custom/Legacy system (mainframe?)
- [ ] Other: _______________
- **Follow-up**: Do you have API access to core banking or only batch file export?

**Q1.2: What is your integration architecture?**
- [ ] ESB/Middleware platform (MuleSoft, IBM IIB, WSO2, Oracle SOA Suite)
- [ ] API Gateway (Apigee, Kong, AWS API Gateway, Azure API Management)
- [ ] Direct API integration (REST/SOAP endpoints on core banking)
- [ ] Batch file transfer only (SFTP, FTP, manual upload)
- **Follow-up**: Do you have an API management team? Can we get sandbox access?

**Q1.3: What database systems do you use?**
- [ ] Oracle Database (version?)
- [ ] Microsoft SQL Server (version?)
- [ ] IBM Db2 (z/OS mainframe?)
- [ ] PostgreSQL / MySQL (open-source)
- [ ] NoSQL (MongoDB, Cassandra)
- **Why we ask**: Understanding data export options (SQL views, stored procedures, ETL)

**Q1.4: What is your data center setup?**
- [ ] On-premise data center (location: Doha? Al Khor?)
- [ ] Cloud provider:
  - [ ] AWS (region: me-south-1 Bahrain?)
  - [ ] Azure (region: UAE?)
  - [ ] Google Cloud
  - [ ] Alibaba Cloud
- [ ] Hybrid (mix of on-prem + cloud)
- [ ] Managed hosting provider: _______________
- **Follow-up**: Do you have disaster recovery (DR) site? Where?

**Q1.5: What is your network security setup?**
- [ ] Firewall vendor: (Palo Alto, Fortinet, Cisco, Check Point)
- [ ] Outbound internet access: (restricted? whitelisting required?)
- [ ] DMZ architecture: (can we deploy in DMZ for API access?)
- [ ] VPN requirements: (do we need site-to-site VPN for integration?)
- **Critical**: Can you whitelist these domains for Phase 2 APIs?
  - googleapis.com (Google Geocoding)
  - worldbank.org (Climate API)
  - wri.org (Water Risk Atlas)
  - openweathermap.org (Weather API)

---

### 2. AI/ML Infrastructure
**Q2.1: What AI/ML platforms do you currently use?**
- [ ] Credit risk AI/ML model (vendor: FICO, Experian, Moody's, SAS, in-house?)
- [ ] Fraud detection AI (AML/KYC)
- [ ] Chatbot / Customer service AI
- [ ] Investment recommendation AI
- [ ] Other: _______________
- **Follow-up**: Is your AI model:
  - [ ] Cloud-based (vendor API)
  - [ ] On-premise (deployed in your data center)
  - [ ] Hybrid

**Q2.2: What is your AI/ML tech stack?**
- [ ] Python-based (TensorFlow, PyTorch, scikit-learn)
- [ ] R-based (statistical modeling)
- [ ] SAS Enterprise Miner
- [ ] IBM Watson
- [ ] Microsoft Azure ML
- [ ] AWS SageMaker
- [ ] Other: _______________
- **Why we ask**: To determine integration approach (REST API vs model retraining)

**Q2.3: How is your credit risk AI model structured?**
- [ ] Black-box (vendor proprietary, no access to internals)
- [ ] White-box (you have model code, can retrain)
- [ ] Hybrid (some features visible, some proprietary)
- **Follow-up**: What are the model inputs? (financial ratios, transaction data, external scores?)
- **Follow-up**: What are the model outputs? (PD, LGD, credit score, rating grade?)

**Q2.4: Can your AI model accept additional input features?**
- [ ] YES - we can retrain with new features (e.g., climate risk score as input)
- [ ] NO - model is locked (we must use post-processing adjustment)
- [ ] MAYBE - requires vendor approval (SLA: ___ weeks)
- **Why we ask**: To determine integration strategy (feature enrichment vs post-processing)

**Q2.5: Do you have a data science team?**
- [ ] YES - in-house team (how many data scientists? ___)
- [ ] NO - we use external consultants
- [ ] PARTIAL - we have analysts but not ML experts
- **Follow-up**: Are they familiar with climate risk modeling? (yes/no)
- **Follow-up**: Can they collaborate with us on integration? (yes/no)

---

### 3. Data Availability & Quality
**Q3.1: What data do you collect from corporate clients today?**
- [ ] Basic info (name, sector, revenue, employees)
- [ ] Financial statements (balance sheet, P&L, cash flow)
- [ ] Ownership structure (shareholders, group entities)
- [ ] Collateral details (real estate, equipment, inventory)
- [ ] Sector-specific data:
  - [ ] Energy sector (capacity, production, fuel mix)
  - [ ] Real estate (building size, energy rating)
  - [ ] Manufacturing (production volume, emissions)
- [ ] ESG data:
  - [ ] GHG emissions (Scope 1/2/3)
  - [ ] Environmental certifications (ISO 14001, etc.)
  - [ ] Sustainability reports
- **Gap Analysis**: Which of our 200 fields do you NOT currently collect? (we can help prioritize)

**Q3.2: How do you currently store client data?**
- [ ] Core banking database (structured)
- [ ] Document management system (PDFs, scans)
- [ ] CRM system (Salesforce, Microsoft Dynamics, SAP CRM)
- [ ] Excel spreadsheets (unstructured)
- [ ] Paper files (manual data entry required)
- **Follow-up**: Can we access this data via API or do we need manual entry?

**Q3.3: Do you have historical data for backtesting?**
- [ ] YES - how many years? (___ years)
- [ ] For how many companies? (___ companies)
- [ ] What fields are available? (financial only? ESG data too?)
- **Why we ask**: To validate our models against your historical default rates

**Q3.4: What external data sources do you subscribe to?**
- [ ] Credit bureaus (Qatar Credit Bureau - QCB, Emcredit)
- [ ] Bloomberg Terminal (ESG data available?)
- [ ] S&P Capital IQ / Global Ratings
- [ ] Moody's Analytics
- [ ] Dun & Bradstreet
- [ ] Others: _______________
- **Opportunity**: Can we leverage your existing subscriptions (save cost)?

---

## B. REGULATORY & COMPLIANCE (QATAR-SPECIFIC)

### 4. Qatar Central Bank (QCB) Requirements
**Q4.1: What is your timeline for QCB climate risk compliance?**
- [ ] Immediate (2024) - QCB already requesting reports
- [ ] Short-term (2025) - preparing for upcoming regulations
- [ ] Medium-term (2026+) - no urgent deadline
- **Follow-up**: Has QCB issued specific guidelines to your bank? (can we see them?)

**Q4.2: Are you classified as a Domestic Systemically Important Bank (D-SIB) in Qatar?**
- [ ] YES (stricter requirements, more frequent reporting)
- [ ] NO (standard requirements)
- **D-SIBs in Qatar** (as of 2024): Qatar National Bank (QNB), Commercial Bank of Qatar, Doha Bank, Qatar Islamic Bank
- **Why we ask**: D-SIBs may need more advanced features (portfolio-level aggregation, stress testing)

**Q4.3: Do you operate under QFCRA (Qatar Financial Centre) regulations or QCB?**
- [ ] QCB (Qatar Central Bank) - conventional banking license
- [ ] QFCRA (Qatar Financial Centre Regulatory Authority) - QFC entity
- [ ] Both (have entities under both regulators)
- **Difference**: QFCRA is UK-style regulation (GDPR-like), QCB is local (PDPL)
- **Impact**: May need different data handling approaches

**Q4.4: Do you have Islamic banking operations?**
- [ ] YES - full Islamic bank
- [ ] YES - Islamic window within conventional bank
- [ ] NO - conventional only
- **Follow-up**: Do you need Sharia-compliant reporting? (yes/no)
- **Follow-up**: Do you have a Sharia board that approves methodologies? (yes/no)

**Q4.5: What are your current ESG/climate risk reporting obligations?**
- [ ] QCB Climate Risk Return (CRR)
- [ ] Sustainability report (annual)
- [ ] TCFD disclosure (voluntary or mandatory?)
- [ ] GRI Standards reporting
- [ ] SASB reporting
- [ ] None yet
- **Follow-up**: Can we see a sample of your current reports? (to align our output)

---

### 5. Data Protection & Privacy (Qatar PDPL)
**Q5.1: Do you have a Data Protection Officer (DPO)?**
- [ ] YES (name: _______________, email: _______________)
- [ ] NO - legal/compliance handles
- **Why we ask**: We need to coordinate with DPO for Data Processing Agreement (DPA)

**Q5.2: What is your data classification policy?**
- [ ] Public / Internal / Confidential / Restricted (4-tier)
- [ ] Other classification: _______________
- **Follow-up**: How is customer climate/ESG data classified? (likely "Confidential")

**Q5.3: Do you transfer any data outside Qatar today?**
- [ ] YES - to parent company (if foreign bank)
- [ ] YES - to cloud providers (AWS Bahrain, Azure UAE)
- [ ] YES - to vendors (credit bureaus, core banking vendor)
- [ ] NO - all data stays in Qatar
- **Follow-up**: If yes, do you have QCB approval for cross-border transfer? (mechanism?)

**Q5.4: What is your data retention policy?**
- [ ] 7 years (standard banking regulation)
- [ ] 10 years
- [ ] Indefinite (never delete)
- **Why we ask**: Our audit trail retention must match (we default to 7 years)

---

## C. BUSINESS & OPERATIONAL

### 6. User Base & Rollout
**Q6.1: How many users will access the climate platform?**
- [ ] Credit analysts: ___ users
- [ ] Relationship managers: ___ users
- [ ] Risk managers: ___ users
- [ ] Compliance officers: ___ users
- [ ] Executives (view-only): ___ users
- **Total**: ___ named users
- **Why we ask**: For license sizing (SaaS tiers, PaaS pricing)

**Q6.2: How many corporate clients do you have?**
- [ ] SME (Small-Medium Enterprise): ___ clients
- [ ] Corporate (large companies): ___ clients
- [ ] Total: ___ clients
- **Follow-up**: How many clients per year need assessment?
  - [ ] All clients annually: ___ assessments/year
  - [ ] High-risk only: ___ assessments/year
  - [ ] New loans only: ___ assessments/year

**Q6.3: What is your typical loan application volume?**
- [ ] New corporate loans per month: ___ applications
- [ ] Average processing time: ___ days
- [ ] **Climate risk assessment** will be required at which stage?
  - [ ] Pre-screening (before credit committee)
  - [ ] Final due diligence (after credit approval in principle)
  - [ ] Post-approval (before disbursement)

**Q6.4: What is your preferred rollout approach?**
- [ ] **Pilot** (1-2 departments, 3-6 months) → Full rollout
- [ ] **Phased** (by client segment: SME first, then Corporate)
- [ ] **Big bang** (all users, all clients at once)
- **Recommendation**: Pilot with 10-20 clients, then phased rollout

**Q6.5: What is your target go-live date?**
- [ ] Q1 2025 (Jan-Mar)
- [ ] Q2 2025 (Apr-Jun)
- [ ] Q3 2025 (Jul-Sep)
- [ ] Q4 2025 (Oct-Dec)
- [ ] Later: ___________
- **Reverse calculation** (working backwards from go-live):
  - Week 0: Kick-off
  - Week 4: Requirements finalized
  - Week 8: Integration dev complete
  - Week 12: UAT complete
  - Week 14: Training complete
  - Week 16: **GO-LIVE**
  - → Need ~4 months lead time

---

### 7. Budget & Procurement
**Q7.1: What is your budget range for this project?**
- [ ] <$100k (limited budget - likely SaaS Tier 1-2)
- [ ] $100k-$500k (mid-range - SaaS Tier 3 or PaaS)
- [ ] $500k-$1M (enterprise - On-Premise option)
- [ ] >$1M (full customization possible)
- **Why we ask**: To recommend appropriate deployment model

**Q7.2: Is budget approved or do you need business case support?**
- [ ] Approved - we can proceed
- [ ] Need approval - require ROI analysis (we can provide, see Slide 13)
- [ ] Multi-year budget - Year 1 approved, Year 2-3 pending
- **Offer**: We can provide ROI calculator based on your client volume

**Q7.3: What is your procurement process?**
- [ ] Direct procurement (IT department authority)
- [ ] Tender/RFP required (competitive bidding)
- [ ] Central Bank approval required (for systemically important banks)
- [ ] Multi-stage: PoC → Pilot → Production (separate contracts)
- **Timeline**: How long does procurement take? (___ weeks)

**Q7.4: Do you have preferred vendors or partners in Qatar?**
- [ ] YES - IT integrator: _______________ (we can partner)
- [ ] YES - Cloud provider: _______________ (we can deploy there)
- [ ] NO - open to direct engagement
- **Opportunity**: Partnering with local Qatar firms (Mannai IT, Ooredoo Business, etc.) can expedite

**Q7.5: What are your payment terms?**
- [ ] Upfront (before deployment)
- [ ] Milestone-based (e.g., 30% contract, 40% UAT, 30% go-live)
- [ ] Subscription (monthly/annual billing)
- [ ] Performance-based (pay per assessment)
- **Standard**: We prefer 50% on contract signature, 50% on go-live

---

### 8. Training & Change Management
**Q8.1: What language(s) do your users need?**
- [ ] English only
- [ ] Arabic only
- [ ] Both English + Arabic (bilingual)
- **Follow-up**: For Arabic, do you need:
  - [ ] UI translation (all buttons, labels)
  - [ ] Report translation (PDF outputs in Arabic)
  - [ ] Training materials in Arabic
  - [ ] Arabic-speaking trainers

**Q8.2: What is your typical training approach?**
- [ ] On-site classroom training (preferred location: _____)
- [ ] Virtual training (Zoom, Teams)
- [ ] Self-paced e-learning (videos, documentation)
- [ ] Train-the-trainer (we train your super-users)
- **Recommendation**: Hybrid (2-day on-site + ongoing virtual support)

**Q8.3: Do you have a change management team?**
- [ ] YES - dedicated change management office
- [ ] NO - IT handles training
- [ ] PARTIAL - HR/L&D supports
- **Why we ask**: Change management is critical for user adoption (60% of failures are people issues)

**Q8.4: What is your user's technical proficiency?**
- [ ] HIGH - comfortable with complex software (Excel power users, Python scripts)
- [ ] MEDIUM - familiar with banking software (core banking, loan origination systems)
- [ ] LOW - basic users (need intuitive UI, lots of training)
- **Impact**: Determines training duration (1 day vs 3 days)

---

## D. TECHNICAL DEEP-DIVE

### 9. API & Integration Specifics
**Q9.1: What API protocols do you support?**
- [ ] REST (JSON)
- [ ] SOAP (XML)
- [ ] GraphQL
- [ ] gRPC
- [ ] Message Queue (Kafka, RabbitMQ, IBM MQ)
- **Our Preference**: REST with JSON (most modern, easiest to integrate)

**Q9.2: What authentication methods do you use for APIs?**
- [ ] API Key (simple, less secure)
- [ ] OAuth 2.0 (industry standard)
- [ ] JWT (JSON Web Token)
- [ ] Client Certificate (mutual TLS)
- [ ] SAML assertion
- **Our Support**: We support all of the above

**Q9.3: What is your API rate limiting policy?**
- [ ] No limit
- [ ] ___ requests per minute
- [ ] ___ requests per hour
- **Why we ask**: To ensure our integration doesn't hit limits during batch processing

**Q9.4: Do you have API sandbox/test environment?**
- [ ] YES - we can provide test credentials
- [ ] NO - must test in production (risky)
- [ ] PARTIAL - limited test data available
- **Critical**: We need sandbox for integration testing (4-6 weeks)

**Q9.5: What data format do you prefer for batch exports?**
- [ ] CSV (simple, Excel-compatible)
- [ ] JSON (structured, API-friendly)
- [ ] XML (legacy systems)
- [ ] Parquet (big data, ML pipelines)
- [ ] Database direct access (SQL query)
- **Our Support**: All formats supported

---

### 10. Monitoring & Operations
**Q10.1: What monitoring tools do you use?**
- [ ] Application Performance Monitoring (APM): (Dynatrace, New Relic, AppDynamics, Datadog)
- [ ] Log aggregation: (Splunk, ELK, Graylog)
- [ ] SIEM: (QRadar, ArcSight, Splunk)
- [ ] Custom dashboards: (Grafana, Kibana)
- **Integration**: We can push logs/metrics to your monitoring tools

**Q10.2: What is your incident management process?**
- [ ] ITIL-based (Incident → Problem → Change)
- [ ] Ticketing system: (ServiceNow, Jira Service Desk, BMC Remedy)
- [ ] On-call rotation: (PagerDuty, Opsgenie)
- **Follow-up**: How do you want to be alerted for platform issues?
  - [ ] Email
  - [ ] SMS
  - [ ] Slack/Teams webhook
  - [ ] SIEM integration

**Q10.3: What are your uptime requirements?**
- [ ] 99.9% (8.76 hours downtime per year) - standard
- [ ] 99.95% (4.38 hours downtime per year) - high availability
- [ ] 99.99% (52.56 minutes downtime per year) - mission-critical
- **Impact**: Determines architecture (single server vs active-active cluster)

**Q10.4: What is your backup strategy?**
- [ ] Daily full backup + incremental
- [ ] Continuous replication (real-time)
- [ ] Backup retention: ___ days
- [ ] Disaster recovery site: (yes/no, location: _____)
- **Our Requirement**: Minimum 7-year backup retention (regulatory audit trail)

---

### 11. Customization Needs
**Q11.1: Do you need custom risk scoring formulas?**
- [ ] NO - standard formulas are fine (ECB P-S-A, TCFD, PACTA)
- [ ] YES - we have our own climate risk methodology
- [ ] MAYBE - need to review your formulas first
- **Follow-up**: If yes, can you provide specification document? (formula details)

**Q11.2: Do you need custom report templates?**
- [ ] NO - standard reports are sufficient
- [ ] YES - need QCB-specific format
- [ ] YES - need branded reports (bank logo, colors)
- [ ] YES - need Arabic-language reports
- **Customization Fee**: $10k-$25k per custom report template

**Q11.3: Do you need integration with other systems beyond core banking?**
- [ ] Loan Origination System (LOS): _______________
- [ ] Customer Relationship Management (CRM): _______________
- [ ] Document Management System (DMS): _______________
- [ ] Business Intelligence (BI) / Data Warehouse: _______________
- [ ] Risk Management System: _______________
- **Integration Approach**: Case-by-case (REST API or batch file)

**Q11.4: Do you need custom data fields beyond our 200 standard fields?**
- [ ] NO - 200 fields cover our needs
- [ ] YES - need ___ additional fields (specify: _______________)
- **Examples**: Bank-specific fields (internal rating scale, relationship manager notes, Islamic finance terms)

---

## E. RISK & GOVERNANCE

### 12. Risk Assessment
**Q12.1: What is your vendor risk management process?**
- [ ] Vendor due diligence questionnaire (we can complete)
- [ ] Financial health check (request for financials)
- [ ] Security audit (penetration testing, ISO 27001 review)
- [ ] Operational resilience assessment
- [ ] Exit strategy (source code escrow, data portability)
- **Timeline**: How long does vendor approval take? (___ weeks)

**Q12.2: Do you require third-party security certifications?**
- [ ] ISO 27001 (we have ✅)
- [ ] SOC 2 Type II (we have ✅)
- [ ] PCI DSS (only if we handle payment data - we don't)
- [ ] Qatar-specific: Meeza security standards (if hosting at Meeza DC)
- **Follow-up**: Do you accept international certifications or need Qatar-local audit?

**Q12.3: Do you require penetration testing?**
- [ ] YES - by your internal team
- [ ] YES - by Qatar-based third party (can you recommend firm?)
- [ ] NO - ISO 27001 is sufficient
- **Our Status**: We do quarterly penetration testing (by international firm)
- **Offer**: We can arrange Qatar-based pen test if required ($15k-$25k cost)

**Q12.4: What is your business continuity requirement (RPO/RTO)?**
- [ ] RPO (Recovery Point Objective): ___ hours (how much data loss acceptable?)
- [ ] RTO (Recovery Time Objective): ___ hours (how long to recover?)
- **Standard**: RPO 1 hour, RTO 4 hours (for On-Premise deployment)
- **Follow-up**: Do you need active-active or active-passive DR? (cost difference)

**Q12.5: What is your exit strategy / vendor lock-in concern?**
- [ ] Source code escrow (we can provide)
- [ ] Data export in open format (CSV, JSON - we support)
- [ ] Documentation for self-maintenance (we provide)
- [ ] Knowledge transfer (included in on-site services)
- **Offer**: We can arrange 3-party escrow agreement (releases code if we go bankrupt)

---

## F. STRATEGIC ALIGNMENT

### 13. Strategic Objectives
**Q13.1: What is your primary goal for climate risk assessment?**
- [ ] Regulatory compliance (QCB mandate)
- [ ] Risk mitigation (reduce NPL from climate-affected sectors)
- [ ] Competitive advantage (green lending, ESG products)
- [ ] Reputational (sustainability leadership in Qatar)
- [ ] All of the above
- **Why we ask**: To align our KPIs with your strategic objectives

**Q13.2: Are you planning to launch green finance products?**
- [ ] Green loans (sustainability-linked loans)
- [ ] Green bonds (for corporate clients)
- [ ] ESG investment funds
- [ ] Carbon offset financing
- [ ] Electric vehicle financing
- [ ] Solar panel financing (residential/commercial)
- **Opportunity**: Our platform can help with green product eligibility assessment

**Q13.3: Do you have sustainability targets (as a bank)?**
- [ ] Net-zero by 20__ (year?)
- [ ] Financed emissions reduction target: __% by 2030
- [ ] Green finance portfolio target: QAR ___ billion
- [ ] Renewable energy loans: __% of total loan book
- **Integration**: Our platform can track progress toward these targets (portfolio aggregation feature)

**Q13.4: How does climate risk fit into your overall risk framework?**
- [ ] New risk type (standalone climate risk team)
- [ ] Part of credit risk (climate adjusts PD/LGD)
- [ ] Part of operational risk (physical risks to branches)
- [ ] Part of strategic risk (transition risks to sectors)
- [ ] All of the above (holistic ERM framework)
- **Why we ask**: To understand where our platform fits in your org chart

**Q13.5: What is your vision for this platform in 3-5 years?**
- [ ] All corporate clients assessed annually (full coverage)
- [ ] Real-time integration with loan origination (automated)
- [ ] AI-powered predictions (default probability with climate risk)
- [ ] Portfolio stress testing (NGFS scenarios across entire book)
- [ ] Public disclosure (TCFD report for bank's own climate risk)
- **Roadmap Alignment**: We can prioritize features based on your vision

---

---

# PART 3: Integration Readiness Checklist

## Pre-Engagement Checklist (Before Contract)

### Technical
- [ ] Core banking system identified (name + version)
- [ ] API access confirmed (sandbox credentials available)
- [ ] Network security reviewed (firewall rules documented)
- [ ] Data center/cloud environment confirmed (location + specs)
- [ ] Integration architecture defined (ESB/API Gateway/Direct)

### Regulatory
- [ ] QCB compliance requirements documented (specific guidelines obtained)
- [ ] PDPL data protection plan (DPO assigned, DPA drafted)
- [ ] QFCRA requirements (if applicable)
- [ ] Islamic banking requirements (if applicable, Sharia board consulted)

### Business
- [ ] Budget approved (procurement process started)
- [ ] User count estimated (license sizing)
- [ ] Client count estimated (assessment volume)
- [ ] Go-live date targeted (project timeline)
- [ ] Success criteria defined (KPIs, acceptance criteria)

### Operational
- [ ] Project sponsor identified (executive level, budget authority)
- [ ] Technical lead assigned (bank-side integration lead)
- [ ] Data team liaison (for data mapping workshop)
- [ ] Change management plan (training, communication)

---

## Post-Contract Checklist (Before Go-Live)

### Week 1-2: Foundation
- [ ] Kick-off meeting completed (both teams aligned)
- [ ] NDA + DPA signed (legal review done)
- [ ] Environment provisioned (SaaS tenant OR PaaS deployed OR On-Premise hardware)
- [ ] SSO configured (SAML/LDAP tested)
- [ ] Test user accounts created (5-10 users)

### Week 3-4: Integration
- [ ] Data mapping workshop completed (200 fields mapped to core banking)
- [ ] API integration developed (core banking → climate platform)
- [ ] Webhook configured (climate platform → core banking)
- [ ] Test assessments run (5-10 sample clients)
- [ ] Performance testing (load test with 100 concurrent users)

### Week 5-6: Testing
- [ ] UAT plan executed (10 real client assessments)
- [ ] Report review (QCB format validated)
- [ ] Security audit completed (pen test, vulnerability scan)
- [ ] Disaster recovery tested (backup/restore validated)

### Week 7-8: Training
- [ ] Admin training (user management, system config)
- [ ] Analyst training (form completion, assessment workflow)
- [ ] Manager training (review/approval, report generation)
- [ ] Arabic materials (if required)

### Week 9-10: Go-Live Prep
- [ ] Data migration (50-100 historical assessments)
- [ ] Parallel run (new assessments in both old + new system)
- [ ] Cutover plan (date, rollback plan)
- [ ] Monitoring setup (alerts, dashboards)
- [ ] Support plan (on-call, escalation)

### Week 11-12: Hypercare
- [ ] Go-live! (switch to production)
- [ ] Daily check-ins (first 2 weeks)
- [ ] Bug fixes (SLA: 24-hour response)
- [ ] Performance tuning (based on usage patterns)
- [ ] Lessons learned (post-mortem, continuous improvement)

---

---

# PART 4: Qatar-Specific Considerations

## A. Regulatory Landscape (As of 2024)

### Qatar Central Bank (QCB)
**Key Regulations**:
1. **Climate Risk Management Guidelines** (Draft 2023, Expected Final 2024)
   - Requires all banks to assess climate risk for corporate clients
   - Annual stress testing under NGFS scenarios
   - Board-level oversight of climate risk
   
2. **Basel III Implementation** (Qatar version)
   - Capital requirements may include climate risk adjustments (future)
   - Pillar 2 (ICAAP) should address climate risk
   
3. **Financial Stability Report**
   - QCB tracks climate risk at system level
   - Banks required to submit data (our platform can help)

**Our Compliance Statement**: 
> "Our platform is designed to support QCB climate risk guidelines, with flexibility to adapt as final regulations are published."

---

### Qatar Financial Centre Regulatory Authority (QFCRA)
**If bank operates in QFC**:
- QFCRA Corporate Governance Code (requires ESG oversight)
- QFCRA Data Protection Regulations 2020 (GDPR-equivalent)
- QFC Conduct of Business Rules (client suitability includes ESG preferences)

**Our Position**: 
> "We support both QCB and QFCRA regulatory frameworks."

---

### Environmental Regulations
**Ministry of Environment and Climate Change (MECC)**:
- Qatar National Vision 2030 (sustainability pillar)
- Qatar National Climate Change Action Plan
- GHG inventory reporting (for high-emitting sectors)

**Relevance**: Banks financing carbon-intensive projects may need MECC data
**Our Support**: Can integrate MECC emissions data (if available via API or manual entry)

---

## B. Qatar Market Context

### Key Sectors in Qatar Economy
**High Carbon-Intensive** (High Climate Risk):
1. **Oil & Gas** (70% of Qatar GDP)
   - QatarEnergy (formerly Qatar Petroleum)
   - Transition risk: EXTREME (stranded assets if oil demand falls)
   - Physical risk: MEDIUM (coastal facilities + extreme heat)

2. **Petrochemicals**
   - Qatar Petrochemical Company (QAPCO), Industries Qatar
   - Transition risk: HIGH
   - Physical risk: HIGH (water stress for cooling)

3. **Construction & Real Estate**
   - World Cup 2022 infrastructure boom (cooling down)
   - Physical risk: EXTREME (heat, sea level rise)

4. **Aviation**
   - Qatar Airways, Hamad International Airport
   - Transition risk: HIGH (carbon pricing on flights)

5. **Heavy Industry**
   - Steel (Qatar Steel), Aluminum (Qatalum)
   - Transition risk: HIGH, Physical risk: HIGH

**Lower Risk Sectors**:
6. **Finance & Insurance** (your clients' industry)
7. **Telecommunications** (Ooredoo, Vodafone Qatar)
8. **Logistics** (Mwani Qatar - ports)
9. **Healthcare & Education** (low emissions)

**Portfolio Implication**: Qatar banks' loan books are heavily exposed to carbon-intensive sectors
**Our Value**: Help banks quantify and manage this concentration risk

---

### Qatar Climate Profile
**Physical Risks**:
- **Extreme Heat**: 🔴 CRITICAL
  - Summer highs: 45-50°C (regularly)
  - Projected: +3-5°C by 2050 under RCP 8.5
  - Impact: Outdoor work restrictions, cooling energy demand surge
  
- **Water Stress**: 🔴 CRITICAL
  - Qatar = most water-scarce country globally (per capita)
  - 99% dependent on desalination (energy-intensive)
  - Impact: Industrial cooling constraints, food security
  
- **Sea Level Rise**: 🟠 HIGH
  - Doha, Lusail (new city), Al Wakrah = coastal
  - Projected: 0.5-1.0m by 2100
  - Impact: Real estate devaluation, infrastructure damage
  
- **Dust Storms**: 🟡 MEDIUM
  - Increasing frequency (climate change + desertification)
  - Impact: Solar panel efficiency, aviation delays

**Transition Risks**:
- **Oil Demand Peak**: 🔴 CRITICAL
  - Qatar economy = 70% oil & gas dependent
  - IEA Net Zero: Oil demand -75% by 2050
  - Impact: Fiscal crisis, loan defaults in energy sector
  
- **Carbon Pricing**: 🟠 HIGH
  - No carbon tax in Qatar yet (unlike UAE/Saudi plans)
  - But export markets (EU, US) have carbon border taxes (CBAM)
  - Impact: Qatar LNG exports less competitive

**Our Data Coverage**: All above risks are quantified in our platform

---

## C. Cultural & Business Practices

### Language
- **Business Language**: English (widely used in Qatar banking)
- **Official Language**: Arabic (government, legal documents)
- **Recommendation**: Start with English, add Arabic in Phase 2 (6 months)

### Working Week
- **Qatar Working Days**: Sunday-Thursday (Friday-Saturday weekend)
- **Banking Hours**: 7:30 AM - 2:30 PM (shorter than Western banks)
- **Ramadan**: Working hours reduced (6 hours/day)
- **Impact**: Training schedules, support hours must align

### Decision-Making
- **Hierarchical**: Decisions often require C-level approval (CEO, CRO, CTO)
- **Relationship-Driven**: Personal trust is critical (face-to-face meetings preferred)
- **Timeline**: Procurement can be slower (3-6 months typical)
- **Advice**: Invest in relationship-building (multiple visits to Doha)

### Data Sensitivity
- **State-Owned Banks**: Very cautious about data leaving Qatar (prefer On-Premise)
- **Private Banks**: More flexible (SaaS acceptable if data in Middle East region)
- **Islamic Banks**: Sharia compliance is non-negotiable (need clear fatwa-friendly methodology)

---

## D. Competitive Landscape

### Who Else is in Qatar Climate Risk Market?
**International Vendors**:
1. **Moody's Climate Solutions** (formerly Four Twenty Seven)
   - Strong brand, expensive ($500k+ per year)
   - Limited Qatar-specific data
   
2. **S&P Trucost** (Climate Risk Analytics)
   - Good for large corporates, weak on SMEs
   
3. **MSCI ESG Manager** (Physical Risk tool)
   - Portfolio-level focus (asset managers, not banks)
   
4. **Jupiter Intelligence** (Physical risk modeling)
   - Very expensive ($1M+ projects), overkill for most banks

**Regional Vendors**:
5. **Local Qatar IT Firms** (no climate risk specialists)
   - Could partner with us (reseller model)
   
6. **Big 4 Consulting** (PwC, Deloitte, KPMG, EY)
   - Offer climate risk advisory (manual, not software)
   - Price: $200k+ for consulting engagement
   - We can complement them (they advise, we provide platform)

**Your Competitive Advantage**:
- ✅ **Qatar-specific data** (we can customize)
- ✅ **Mid-market pricing** ($100k-$300k, vs $500k+ competitors)
- ✅ **Fast deployment** (16 weeks On-Premise, vs 6-12 months for Big 4)
- ✅ **Full-stack solution** (not just physical risk, but TCFD/PACTA/Scope 3 too)
- ✅ **AI integration** (most competitors don't offer this)

---

---

# SUMMARY: Key Takeaways

## Top 10 Questions to Ask the Bank (Prioritized)

1. ✅ **What is your core banking system and can we get API access?** (Technical feasibility)
2. ✅ **Do you have an existing AI/ML credit model and can it accept new features?** (AI integration approach)
3. ✅ **What is your QCB climate risk compliance timeline?** (Urgency, sales cycle)
4. ✅ **What is your data center setup - on-premise or cloud?** (Deployment model)
5. ✅ **How many corporate clients need assessment annually?** (License sizing, revenue estimate)
6. ✅ **What is your budget range and procurement process?** (Deal qualification)
7. ✅ **Do you need Arabic language support and Sharia-compliant reporting?** (Customization scope)
8. ✅ **What external data sources do you already subscribe to?** (Cost-saving opportunity)
9. ✅ **What is your target go-live date?** (Project planning)
10. ✅ **Are you a D-SIB or planning green finance products?** (Upsell potential)

## Top 10 Questions to Expect from the Bank (Prioritized)

1. ✅ **Is your platform QCB-compliant and can you provide Arabic reports?** (Regulatory + localization)
2. ✅ **Where will our data be stored - can it stay in Qatar?** (Data sovereignty)
3. ✅ **How do you integrate with our core banking and existing AI?** (Technical integration)
4. ✅ **What external APIs do you use - are they accessible from Qatar?** (Firewall concerns)
5. ✅ **How much does it cost for [X] assessments per year?** (Pricing)
6. ✅ **Can you provide on-site support during go-live?** (Professional services)
7. ✅ **How do you ensure calculation accuracy?** (Trust, validation)
8. ✅ **What if we need custom formulas or Sharia-compliant methodology?** (Customization)
9. ✅ **How long does implementation take?** (Timeline expectations)
10. ✅ **What certifications do you have (ISO 27001, SOC 2)?** (Security compliance)

---

**Good luck with your Qatar bank integration! 🇶🇦**
