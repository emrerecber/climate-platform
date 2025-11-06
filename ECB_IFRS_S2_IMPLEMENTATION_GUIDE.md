# ECB/IFRS S2 UYUMLU İKLİM RİSK ANALİZ SİSTEMİ
## TAM UYGULAMA KILAVUZU

**Versiyon:** 2.0 ECB-Aligned  
**Tarih:** 3 Kasım 2025  
**Durum:** ✅ Core Modules Implemented  
**Uyumluluk:** ECB Climate Risk Guidelines, IFRS S2, NGFS Scenarios, PACTA Methodology, PCAF Standard

---

## 📋 İÇİNDEKİLER

1. [Sistem Genel Bakış](#sistem-genel-bakış)
2. [Hesaplama Metodolojileri](#hesaplama-metodolojileri)
3. [Form Alanları ve Veri Modeli](#form-alanları-ve-veri-modeli)
4. [Modül Detayları](#modül-detayları)
5. [Çıktı Şeması](#çıktı-şeması)
6. [Entegrasyon Planı](#entegrasyon-planı)
7. [Test Senaryoları](#test-senaryoları)

---

## 1. SİSTEM GENEL BAKIŞ

### 1.1 Temel Özellikler

**✅ TAMAMLANAN MODÜLLER:**
- **TRS Calculator (7-Factor)** - `transitionRiskCalculatorECB.js`
- **PRS Calculator (P-S-A Formula)** - `physicalRiskCalculatorECB.js`
- **Financial Impact (PD/LGD/ECL/RWA)** - `financialImpactCalculator.js`
- **PCAF Financed Emissions** - `pcafCalculator.js`
- **CBAM Calculator** - `cbamCalculator.js`
- **Master Calculator** - `masterCalculatorECB.js`

**🎯 TEMEL PRENSİPLER:**
- Para birimi: **USD** (QAR → USD / 3.64)
- Karbon fiyatı: **USD/tCO₂e**
- Tüm skorlar: **0-1 aralığında**
- Sınıflandırma: **Low <0.30, Medium 0.30-0.60, High >0.60**
- ECB/IFRS S2 uyumlu çıktı şeması

---

## 2. HESAPLAMA METODOLOJİLERİ

### 2.1 GEÇİŞ RİSKİ (TRS) - 7 FAKTÖR MODELİ

**Formül:**
```
TRS = Σ(wi × fi)  where i = 1...7
TRS_adj = TRS × (1 + θ × PACTA_Gap)
```

**7 Faktör:**

#### **F1: Emisyon Yoğunluğu (w1=0.15)**
```javascript
intensity = scope1_tco2 / (revenue_usd / 1M)
f1 = normalize(intensity, best_intensity, worst_intensity)
```
- **Sektör Benchmark'ları:**
  - Enerji: 50-800 tCO₂/M USD
  - Otomotiv: 30-200 tCO₂/M USD
  - Çelik: 400-2000 tCO₂/M USD

#### **F2: Dolaylı Emisyonlar (w2=0.15)**
```javascript
indirect_share = (scope2 + scope3) / (scope1 + scope2 + scope3)
f2 = normalize(indirect_share, 0.30, 0.85)
```

#### **F3: Dönüşüm CapEx (w3=0.15)**
```javascript
capex_ratio = required_capex_usd / ebitda_usd
if (capex_ratio >= 2.0) f3 = 0.85  // High risk
if (capex_ratio <= 0.5) f3 = 0.15  // Low risk
```

#### **F4: Gelir Şoku (w4=0.20)**
```javascript
carbon_cost = scope1 × carbon_price
energy_cost_increase = revenue × 0.10 × energy_price_delta
demand_impact = revenue × |sector_output_delta|
revenue_at_risk = carbon_cost + energy_cost_increase + demand_impact
net_impact = revenue_at_risk × (1 - pass_through_rate)
f4 = net_impact / revenue
```

#### **F5: Uyumluluk Maliyeti (w5=0.15)**
```javascript
total_compliance = compliance_cost_usd + cbam_cost_usd
f5 = total_compliance / ebitda_usd
```

#### **F6: Yönetişim Açığı (w6=0.10)**
```javascript
gov_score = 0.4×board + 0.3×management + 0.3×incentives
f6 = 1 - gov_score  // Inverse: lower gov = higher risk
```

#### **F7: Ar-Ge/İnovasyon Açığı (w7=0.10)**
```javascript
f7 = 1 - rnd_score
```

**PACTA Düzeltmesi:**
```javascript
Gap = Σ|mix_actual_i - mix_target_i| / 100  // Clamp 0-1

θ (Sektör katsayıları):
- Enerji/Oil&Gas: 0.40
- Çimento: 0.35
- Otomotiv: 0.30
- Gayrimenkul: 0.20
- Default: 0.25

TRS_adj = clamp(TRS × (1 + θ × Gap), 0, 1)
```

**PACTA Target Mix (2030):**
- **Enerji:** Coal=0%, Gas=20%, Oil=0%, Renewables=70%, H2=5%, Nuclear=5%
- **Otomotiv:** ICE=20%, BEV/PHEV/FCEV=80%
- **Çelik:** BF-BOF=30%, EAF=50%, H2-DRI=20%

---

### 2.2 FİZİKSEL RİSK (PRS) - P-S-A FORMÜLÜ

**Formül:**
```
PCRS_h = 0.5×P + 0.3×S - 0.2×A

P = Probability (tehlike olasılığı, 0-1)
S = Sensitivity (sektörel hassasiyet, 0-1)
A = Adaptive Capacity (uyum kapasitesi, 0-1)
```

**Adaptive Capacity (A):**
```
A = 0.35×infrastructure + 0.25×financial + 0.20×governance + 0.20×technology
```

**Su Stresi Çarpanı (β):**
- Kuraklık ve sıcak dalgası için:
```javascript
PCRS_h_adjusted = PCRS_h × (1 + β)

β (Sektör bazlı):
- Enerji: 0.15
- Tarım: 0.20
- Çelik: 0.13
- Default: 0.08
```

**PRS (Toplam):**
- **Konservatif Yaklaşım:** `PRS = max(PCRS_h)` (dominant hazard)
- **Alternatif:** Ağırlıklı ortalama

**5 Tehlike:**
1. Heat (Sıcak Dalgası)
2. Drought (Kuraklık)
3. Flood (Sel)
4. Coastal (Kıyı/Deniz Seviyesi)
5. Precip (Aşırı Yağış)

---

### 2.3 BİRLEŞİK RİSK ENDEKSİ (RI*)

**Formül:**
```javascript
// Base RI
RI = wT × TRS_adj + wP × PRS

// Sektör Ağırlıkları:
wT (Transition)  wP (Physical)
Enerji:     0.70         0.30
Oil&Gas:    0.75         0.25
Çimento:    0.70         0.30
Gayrimenkul: 0.40        0.60
Default:    0.60         0.40

// Amplifiers
amplifier_sum = α_water×tag.water_dep + 
                α_stranding×tag.stranding + 
                α_coastal×tag.coastal_vuln + 
                α_supply×tag.supply_chain

α_water = 0.15
α_stranding = 0.25
α_coastal = 0.18
α_supply = 0.10

// Final RI*
RI* = clamp(RI × (1 + amplifier_sum), 0, 1)
```

---

### 2.4 FİNANSAL ETKİ (PD/LGD/ECL/RWA)

#### **PD (Probability of Default) - Üstel Model:**
```javascript
PD_stressed = PD_base × exp(β1 × RI* × 100)
β1 = 0.045  // Calibrated parameter
```

**Alternatif Lineer:**
```javascript
PD_lin = PD_base × (1 + η × RI*)
η = 4.5
```

#### **LGD (Loss Given Default):**
```javascript
LGD_new = min(0.95, LGD_base + λ_P × PRS × CollateralVuln + λ_market)

λ_P = 0.50
λ_market (Senaryo bazlı):
- Orderly: 0.00
- Disorderly: 0.05
- Hot-House: 0.10
```

#### **ECL (Expected Credit Loss) - Senaryo Ağırlıklı:**
```javascript
// Ağırlıklar:
w_orderly = 0.40
w_disorderly = 0.35
w_hothouse = 0.25

ECL_weighted = Σ(w_scn × PD_scn × LGD_scn × EAD)
```

#### **RWA (Risk-Weighted Assets):**
```javascript
Maturity_Factor = 1 + 0.05 × (tenor_years - 1)
RWA_climate = EAD × rw_base × (1 + β_climate × RI* × Maturity_Factor)
β_climate = 0.30
```

---

### 2.5 PCAF FİNANCED EMİSYONLAR

**Attribution Factor:**
```javascript
EVIC = equity_market_value + total_debt
Attribution = outstanding_amount / EVIC
```

**Financed Emissions:**
```javascript
Financed_S1 = Borrower_S1 × Attribution
Financed_S2 = Borrower_S2 × Attribution
Financed_S3 = Borrower_S3 × Attribution
```

**Portfolio Carbon Footprint:**
```javascript
PCF = Financed_Total / (Outstanding_Amount / 1M)  // tCO₂e per USD million
```

**Weighted Average Carbon Intensity (WACI):**
```javascript
WACI = Σ(Weight_i × CarbonIntensity_i)
where:
Weight_i = InvestmentValue_i / TotalPortfolioValue
CarbonIntensity_i = (S1_i + S2_i) / (Revenue_i / 1M)
```

---

### 2.6 CBAM (Carbon Border Adjustment Mechanism)

**Formül:**
```javascript
CBAM_Cost = Embedded_Emissions × (EU_Price - Origin_Price) × Export_Volume

Default Prices:
- EU_Price: $85/tCO₂
- Origin_Price: $20/tCO₂ (Turkey assumed)

Materiality:
- Low: <2% of export value
- Medium: 2-5%
- High: >5%
```

---

## 3. FORM ALANLARI VE VERİ MODELİ

### 3.1 Gerekli Form Alanları

```javascript
{
  // Company Info
  "company": {
    "name": "",
    "sector": "",  // Enerji, Otomotiv, Çimento, etc.
    "country": "",
    "employees": 0
  },
  
  // Finance
  "finance": {
    "revenue_usd": 0,
    "ebitda_usd": 0,  // Optional, default = revenue * 0.15
    "total_debt_usd": 0,
    "equity_market_value_usd": 0,
    "ead_usd": 0,  // Exposure at Default
    "pd_base": 0.03,  // Default 3%
    "lgd_base": 0.40,  // Default 40%
    "rw_base": 0.75,  // Risk weight
    "tenor_years": 8,
    "collateral_vulnerability": 0.5,  // 0-1
    "required_capex_usd": 0,  // For net-zero transition
    "compliance_cost_usd": 0
  },
  
  // Emissions
  "emissions": {
    "scope1_tco2": 0,
    "scope2_location_tco2": 0,  // Location-based
    "scope2_market_tco2": 0,  // Market-based (preferred)
    "scope3": {
      "cat1": 0,  // Purchased goods
      "cat2": 0,  // Capital goods
      "cat3": 0,  // Fuel/energy related
      "cat4": 0,  // Upstream transport
      "cat5": 0,  // Waste
      "cat6": 0,  // Business travel
      "cat7": 0,  // Employee commuting
      "cat8": 0,  // Upstream leased assets
      "cat9": 0,  // Downstream transport
      "cat10": 0, // Processing of sold products
      "cat11": 0, // Use of sold products
      "cat12": 0, // End of life
      "cat13": 0, // Downstream leased
      "cat14": 0, // Franchises
      "cat15": 0  // Investments
    }
  },
  
  // Energy Use
  "energy_use": {
    "electricity_mwh": 0,
    "gas_mwh": 0,
    "fuel_mwh": 0
  },
  
  // Scenario Parameters (NGFS)
  "scenario": {
    "carbon_price_usd_t": 75,  // Default Orderly 2030
    "energy_price_delta": 0.10,  // 10% increase
    "sector_output_delta": -0.05  // -5% demand shock
  },
  
  // PACTA Technology Mix
  "pacta": {
    "capacity_mw_total": 0,
    "mix_pct": {
      "coal": 0,
      "gas": 0,
      "oil": 0,
      "renewables": 0,
      "hydrogen": 0,
      "nuclear": 0,
      "ice": 0,  // For automotive
      "bev_phev_fcev": 0  // For automotive
    },
    "production_gwh": 0,
    "phaseout_years": {
      "coal": 2030,
      "ice": 2035
    }
  },
  
  // CBAM
  "cbam": {
    "embedded_emissions_tco2": 0,  // Per unit
    "eu_price": 85,
    "origin_price": 20,
    "export_volume_units": 0,
    "export_value_usd": 0
  },
  
  // Physical Risk
  "physical": {
    "probability": {
      "heat": 0.5,  // 0-1 scale
      "drought": 0.5,
      "flood": 0.5,
      "coastal": 0.5,
      "precip": 0.5
    },
    "adaptive_capacity": {
      "infrastructure": 0.5,  // 0-1
      "financial": 0.5,
      "governance": 0.5,
      "technology": 0.5
    }
  },
  
  // Governance
  "governance": {
    "board_oversight": 0.5,  // 0-1
    "management_role": 0.5,
    "incentives": 0.5,
    "rnd_score": 0.5,
    "targets_netzero_year": null
  },
  
  // Risk Tags (Amplifiers)
  "tags": {
    "water_dep": 0,  // 0-1: Water dependency
    "stranding": 0,  // 0-1: Stranded asset risk
    "coastal_vuln": 0,  // 0-1: Coastal vulnerability
    "supply_chain": 0  // 0-1: Supply chain exposure
  }
}
```

---

## 4. MODÜL DETAYLARI

### 4.1 Dosya Yapısı

```
src/utils/
├── transitionRiskCalculatorECB.js  ✅ (7-factor TRS)
├── physicalRiskCalculatorECB.js    ✅ (P-S-A formula)
├── financialImpactCalculator.js    ✅ (PD/LGD/ECL/RWA)
├── pcafCalculator.js               ✅ (Financed emissions)
├── cbamCalculator.js               ✅ (CBAM cost)
└── masterCalculatorECB.js          ✅ (Integration)
```

### 4.2 Kullanım Örneği

```javascript
import { calculateClimateRisk } from './utils/masterCalculatorECB.js';

const formData = {
  company: { sector: 'Enerji', country: 'Turkey', employees: 500 },
  finance: { revenue_usd: 100000000, ebitda_usd: 15000000 },
  emissions: { scope1_tco2: 50000, scope2_market_tco2: 10000 },
  // ... other fields
};

const result = calculateClimateRisk(formData);

console.log(result.scores);  // TRS, PRS, RI, RI*, class
console.log(result.financial);  // ECL, RWA
console.log(result.emissions_reporting.financed);  // PCAF
```

---

## 5. ÇIKTI ŞEMASI (ECB/IFRS S2 Format)

```javascript
{
  "metadata": {
    "ECB_IFRS_S2_COMPATIBLE": true,
    "calculation_timestamp": "2025-11-03T...",
    "version": "2.0",
    "company_name": "",
    "sector": "",
    "country": ""
  },
  "scores": {
    "TRS": 0.45,
    "TRS_adj": 0.52,
    "PRS": 0.38,
    "RI": 0.46,
    "RI_star": 0.51,
    "class": "Medium",
    "governance_score": 0.65,
    "governance_class": "Adequate"
  },
  "transition_risk": {
    "TRS": 0.45,
    "TRS_adj": 0.52,
    "factors": { /* f1-f7 detayları */ },
    "pacta_adjustment": { /* PACTA gap analizi */ },
    "cbam_cost_usd": "65000"
  },
  "physical_risk": {
    "PRS": 0.38,
    "PRS_class": "Medium",
    "dominant_hazard": "flood",
    "hazard_breakdown": [ /* 5 tehlike */ ],
    "adaptive_capacity": { /* A detayları */ }
  },
  "combined_risk": {
    "RI": 0.46,
    "RI_star": 0.51,
    "weights": { "wT": 0.60, "wP": 0.40 },
    "amplifiers": { /* tag uplift */ }
  },
  "financial": {
    "PD_base": "0.0300",
    "orderly": { "PD": 0.0345, "LGD": 0.42, "ECL_usd": 145000 },
    "disorderly": { "PD": 0.0398, "LGD": 0.44, "ECL_usd": 176000 },
    "hothouse": { "PD": 0.0465, "LGD": 0.47, "ECL_usd": 220000 },
    "ECL_baseline_usd": "120000",
    "ECL_weighted_usd": "172000",
    "ECL_increase_pct": "+43.3%",
    "RWA_base_usd": "7500000",
    "RWA_climate_usd": "8650000",
    "RWA_increase_pct": "+15.3%"
  },
  "emissions_reporting": {
    "scope1": 50000,
    "scope2_location": 12000,
    "scope2_market": 10000,
    "scope3_total": 80000,
    "intensity_metrics": {
      "revenue_intensity_tco2_per_m_usd": "1400.00",
      "employee_intensity_tco2_per_employee": "280.00"
    },
    "financed": {
      "attribution": { "attribution": 0.15, "EVIC_usd": 200000000 },
      "financed_emissions": { "financed_s1": 7500, "financed_s2": 1500, "financed_total": 9000 },
      "portfolio_carbon_footprint": { "pcf_tco2_per_usd_m": "0.30" }
    }
  },
  "governance": {
    "governance_score": 0.65,
    "components": { "board_oversight": 0.7, "management_role": 0.6, "incentives": 0.6 },
    "classification": "Adequate"
  },
  "notes": {
    "assumptions": [
      "EBITDA assumed as 15% of revenue",
      "Scenario weights: Orderly 40%, Disorderly 35%, Hot-House 25%"
    ],
    "data_quality_flags": [
      "Missing Scope 3 emissions data",
      "Missing adaptive capacity data - using defaults"
    ],
    "data_quality_score": 3  // PCAF 1-5 scale
  }
}
```

---

## 6. ENTEGRASYON PLANI

### 6.1 Backend Entegrasyonu

1. **Company Model Güncelleme:**
```javascript
// backend/src/models/Company.js
{
  formData: {
    type: DataTypes.JSON,
    defaultValue: {
      company: {},
      finance: {},
      emissions: { scope3: {} },
      energy_use: {},
      scenario: {},
      pacta: { mix_pct: {} },
      cbam: {},
      physical: { probability: {}, adaptive_capacity: {} },
      governance: {},
      tags: {}
    }
  },
  climateRiskResult: {
    type: DataTypes.JSON,
    defaultValue: null
  }
}
```

2. **API Endpoint Güncelleme:**
```javascript
// backend/src/controllers/companyController.js
import { calculateClimateRisk } from '../../src/utils/masterCalculatorECB.js';

// POST /api/v1/companies/:id/calculate
exports.calculateRisk = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    const result = calculateClimateRisk(company.formData);
    
    company.climateRiskResult = result;
    await company.save();
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### 6.2 Frontend Form Genişletme

**Yeni Form Adımları:**
- **Step 11:** PACTA Technology Mix
- **Step 12:** Governance & Targets
- **Step 13:** Physical Risk Probabilities
- **Step 14:** CBAM (if applicable)
- **Step 15:** Risk Tags

---

## 7. TEST SENARYOLARI

### 7.1 Test Case 1: High-Risk Energy Company

```javascript
{
  company: { sector: 'Enerji', country: 'Turkey' },
  finance: { revenue_usd: 500000000, ebitda_usd: 75000000 },
  emissions: { scope1_tco2: 250000, scope2_market_tco2: 50000 },
  pacta: {
    mix_pct: { coal: 60, gas: 30, renewables: 10 }  // Highly misaligned
  },
  scenario: { carbon_price_usd_t: 150 }
}
// Expected: TRS_adj > 0.70, Class = "High"
```

### 7.2 Test Case 2: Low-Risk Real Estate

```javascript
{
  company: { sector: 'Gayrimenkul', country: 'Sweden' },
  finance: { revenue_usd: 50000000, ebitda_usd: 10000000 },
  emissions: { scope1_tco2: 1000, scope2_market_tco2: 5000 },
  physical: {
    probability: { flood: 0.2, heat: 0.3 },
    adaptive_capacity: { infrastructure: 0.8, financial: 0.9 }
  }
}
// Expected: PRS < 0.30, Class = "Low"
```

---

## 8. SONRAKİ ADIMLAR

### 8.1 Kısa Vadeli (1-2 Hafta)
- ✅ Core calculation modules
- ⏳ Backend model updates
- ⏳ Form component extensions
- ⏳ API integration

### 8.2 Orta Vadeli (2-4 Hafta)
- Frontend dashboard visualization
- PDF report generation (ECB format)
- Scenario comparison charts
- Data validation rules

### 8.3 Uzun Vadeli (1-2 Ay)
- Multi-asset portfolio aggregation
- Time-series tracking
- Benchmark comparison
- AI-powered recommendations

---

## 9. KAYNAKLAR

- **ECB Guide:** Climate-related and environmental risks (2020)
- **IFRS S2:** Climate-related Disclosures (2023)
- **NGFS:** Scenarios Portal v5
- **PACTA:** 2° Investing Initiative
- **PCAF:** Global GHG Accounting Standard (2022)
- **CBAM:** EU Regulation 2023/956

---

**Dokümantasyon Sonu** ✅  
**Sistem Durumu:** Ready for Integration  
**Compliance:** ECB/IFRS S2/NGFS/PACTA/PCAF Compatible
