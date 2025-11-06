# PACTA VE TCFD ANALİZ FORMÜL RAPORU
## İklim Risk Analizi Platformu - Metodoloji Geliştirme

**Hazırlayan:** AI Analiz Raporu  
**Tarih:** 31 Ekim 2024  
**Versiyon:** 1.0  
**Amaç:** PACTA ve TCFD analizleri için form veri yeterliliği ve formül adaptasyonu

---

## 📋 YÖNETİCİ ÖZETİ

### Mevcut Durum Değerlendirmesi

#### ✅ FİNANSAL ANALİZ - TAM ÇALIŞIR DURUMDA
**Sonuç:** Formüller doğru ve eksiksiz çalışıyor.

**Mevcut Formüller:**
```javascript
// Likidite Oranları
liquidityRatio = (cashAndEquivalents + bankDeposits) / totalLiabilities

// Kaldıraç Oranları  
debtToAssetRatio = totalLiabilities / totalAssets
debtToEquityRatio = totalLiabilities / netWorth

// Karlılık Oranları
profitMargin = (income - expenses) / income
returnOnAssets = (income - expenses) / totalAssets
returnOnEquity = (income - expenses) / netWorth

// Mali Sağlık Skoru (100 üzerinden)
- Likidite: 25 puan
- Borç Yönetimi: 25 puan
- Karlılık: 25 puan  
- Tasarruf: 25 puan
```

**Değerlendirme:** ✅ **DOĞRU** - Standart finansal analiz metriklerine uygun.

---

#### ⚠️ PACTA ANALİZİ - KISMÎ ÇALIŞIR DURUMDA

**Mevcut Durum:**
- **Temel mantık var** ama **sınırlı sektör desteği**
- Sadece **Enerji** ve **Otomotiv** sektörleri için gap hesaplama mevcut
- **Form verileri YETERSIZ** - PACTA için gerekli alanlar eksik

**Mevcut Kod (enhancedRiskCalculator.js):**
```javascript
calculatePACTAAlignment(formData) {
  if (!this.isPACTASector(formData.sector)) {
    return { applicable: false };
  }

  let gap = 0;
  
  if (formData.sector === 'Enerji') {
    const totalCapacity = parseFloat(formData.totalInstalledCapacity) || 1;
    const renewableCapacity = this.calculateRenewableCapacity(formData);
    const actualRenewableShare = renewableCapacity / totalCapacity;
    const benchmarkShare = 0.7; // 70% renewable by 2030
    
    gap = Math.max(0, (benchmarkShare - actualRenewableShare) / benchmarkShare);
  }
  
  // Otomotiv için benzer mantık
}
```

**Problem:** Form'da şu alanlar **YOK**:
- `totalInstalledCapacity` ❌
- `windCapacity`, `solarCapacity`, `hydroCapacity` ❌
- `annualTotalProduction`, `bevProduction`, `phevProduction` ❌

---

#### ❌ TCFD ANALİZİ - FORMÜLLER YOK

**Mevcut Durum:**
- TCFD **sadece dokümantasyonda bahsedilmiş**
- **Hiçbir TCFD-spesifik formül yok**
- Sadece genel risk hesaplamaları yapılıyor

**Eksikler:**
- Governance metrikleri hesaplanmıyor
- Strategy senaryoları sadece NGFS ile sınırlı
- Risk yönetimi entegrasyonu yok
- TCFD disclosure metrikleri hesaplanmıyor

---

## 🔍 DETAYLI ANALİZ

### BÖLÜM 1: MEVCUT FORM VERİSİ ANALİZİ

#### 1.1 Finansal Analiz için Veri Yeterliliği
**Durum:** ✅ **TAM YETERLİ**

**Mevcut Form Alanları (finansialAnalysis.js için):**
- ✅ cashAndEquivalents
- ✅ bankDeposits
- ✅ investments
- ✅ realEstate, equipment, inventory
- ✅ shortTermLoans, longTermLoans
- ✅ monthlyIncome, annualRevenue
- ✅ monthlyExpenses, operatingExpenses
- ✅ stocks, bonds, mutualFunds, cryptoCurrency

**Sonuç:** Tüm standart finansal oranlar hesaplanabilir. **Ek alan gerekmez.**

---

#### 1.2 PACTA Analizi için Veri Yeterliliği
**Durum:** ❌ **YETERSIZ**

##### PACTA Gereksinimleri (Sektörel)

**1. ENERJI SEKTÖRÜ**
```
Gerekli Veriler:
├── Kurulu Güç Kapasitesi
│   ├── Toplam Kapasite (MW) ❌
│   ├── Kömür Kapasitesi ❌
│   ├── Doğalgaz Kapasitesi ❌
│   ├── Rüzgar Kapasitesi ❌
│   ├── Güneş Kapasitesi ❌
│   ├── Hidroelektrik Kapasitesi ❌
│   ├── Biyokütle Kapasitesi ❌
│   └── Jeotermal Kapasitesi ❌
│
├── Üretim Verileri
│   ├── Yıllık Toplam Üretim (GWh) ❌
│   ├── Yenilenebilir Üretim (GWh) ❌
│   └── Fosil Yakıt Üretimi (GWh) ❌
│
└── Forward-looking Planlar
    ├── 2030 Yenilenebilir Hedefi (%) ❌
    ├── Kömür Santral Kapatma Tarihleri ❌
    └── Yeni Yenilenebilir Yatırımlar (MW) ❌
```

**2. OTOMOTİV SEKTÖRÜ**
```
Gerekli Veriler:
├── Üretim Kapasitesi
│   ├── Yıllık Toplam Üretim (adet) ❌
│   ├── ICE (İçten Yanmalı) Üretimi ❌
│   ├── Hibrit Üretimi ❌
│   ├── BEV (Bataryalı Elektrikli) ❌
│   ├── PHEV (Şarj Edilebilir Hibrit) ❌
│   └── FCEV (Hidrojen Yakıt Hücreli) ❌
│
├── Satış Verileri
│   ├── Yıllık Toplam Satış ❌
│   ├── EV Satış Payı (%) ❌
│   └── Bölgesel Satış Dağılımı ❌
│
└── Teknoloji Geçiş Planı
    ├── 2030 EV Üretim Hedefi (%) ❌
    ├── R&D Yatırımları (€) ❌
    └── Batarya Kapasitesi (kWh) ❌
```

**3. ÇELİK/SANAYİ SEKTÖRÜ**
```
Gerekli Veriler:
├── Üretim Teknolojisi Mix
│   ├── Yüksek Fırın (BF-BOF) Kapasitesi ❌
│   ├── Elektrik Ark Ocağı (EAF) Kapasitesi ❌
│   ├── DRI (Direct Reduced Iron) Kapasitesi ❌
│   └── Hidrojen Bazlı Teknoloji ❌
│
├── Emisyon Verileri
│   ├── Ton Çelik Başına CO2 (tCO2/ton) ❌
│   ├── Toplam Scope 1 Emisyonlar (tCO2) ✅ (var ama detay yok)
│   └── Karbon Yakalama Kapasitesi ❌
│
└── Dekarbonizasyon Yol Haritası
    ├── 2030 Emisyon Azaltma Hedefi (%) ❌
    ├── Scrap Kullanım Oranı (%) ❌
    └── Yeşil Hidrojen Kullanımı (ton/yıl) ❌
```

**4. ÇİMENTO SEKTÖRÜ**
```
Gerekli Veriler:
├── Klinker Üretimi
│   ├── Yıllık Klinker (ton) ❌
│   ├── Alternatif Yakıt Oranı (%) ❌
│   └── Klinker/Çimento Oranı ❌
│
├── Emisyon Yoğunluğu
│   ├── Ton Klinker Başına CO2 ❌
│   └── CCUS Kapasitesi (tCO2/yıl) ❌
│
└── Teknoloji Yenileme
    ├── Yeni Nesil Fırın Teknolojisi ❌
    └── Alternatif Bağlayıcılar (%) ❌
```

**5. HAVACILIK SEKTÖRÜ**
```
Gerekli Veriler:
├── Filo Yapısı
│   ├── Toplam Uçak Sayısı ❌
│   ├── Yaş Ortalaması ❌
│   ├── Yakıt Verimliliği (L/100km) ❌
│   └── Yeni Nesil Uçak Oranı (%) ❌
│
├── Emisyonlar
│   ├── Yıllık Jet Yakıt Tüketimi (ton) ❌
│   ├── Scope 1 Emisyonlar (tCO2) ❌
│   └── RTK Başına CO2 (gCO2/RTK) ❌
│
└── SAF (Sürdürülebilir Havacılık Yakıtı)
    ├── SAF Kullanım Oranı (%) ❌
    ├── SAF Satın Alma Anlaşmaları ❌
    └── 2030 SAF Hedefi (%) ❌
```

**6. GAYRİMENKUL SEKTÖRÜ**
```
Gerekli Veriler:
├── Portföy Kompozisyonu
│   ├── Toplam Alan (m²) ❌
│   ├── Ofis/Konut/Retail Dağılımı ❌
│   ├── Ortalama Bina Yaşı ❌
│   └── LEED/BREEAM Sertifikalı Alan (m²) ❌
│
├── Enerji Performansı
│   ├── kWh/m²/yıl ❌
│   ├── EPC (Energy Performance Certificate) Dağılımı ❌
│   └── Yenilenebilir Enerji Kullanımı (%) ❌
│
└── Renovasyon Planları
    ├── Deep Renovation Pipeline (m²) ❌
    ├── 2030 Net-Zero Ready Hedefi (%) ❌
    └── Elektrik Şarj İstasyonu Sayısı ❌
```

---

#### 1.3 TCFD Analizi için Veri Yeterliliği
**Durum:** ⚠️ **KISMEN YETERLİ**

**TCFD'nin 4 Ana Bileşeni:**

##### 1. GOVERNANCE (Yönetişim)
```
Gerekli Veriler:
├── Yönetim Kurulu İklim Risk Gözetimi
│   ├── İklim uzmanı YK üyesi var mı? ❌
│   ├── YK iklim toplantı sıklığı ❌
│   └── İklim riski KPI'ları ❌
│
├── Yönetim Rolü ve Sorumlulukları
│   ├── İklim sorumlusu C-level pozisyonu ❌
│   ├── İklim riskinden sorumlu birim ❌
│   └── Teşvik yapısında iklim metrikleri ❌
│
└── Risk Entegrasyonu
    ├── ERM'ye iklim riski entegrasyonu ❌
    └── İklim risk politikası var mı? ❌
```

**Form Durumu:** ❌ Bu alanların hiçbiri yok.

##### 2. STRATEGY (Strateji)
```
Gerekli Veriler:
├── Senaryo Analizi
│   ├── 1.5°C, 2°C, 3°C+ senaryoları ✅ (NGFS ile kısmen var)
│   ├── 2030, 2050 horizonları ✅ (var)
│   └── Finansal etki analizi ✅ (EBITDA Bridge var)
│
├── Risk ve Fırsatlar
│   ├── Kısa/Orta/Uzun vadeli riskler ⚠️ (kısmen)
│   ├── Geçiş riskleri ✅ (var)
│   ├── Fiziksel riskler ✅ (var)
│   └── İklim fırsatları ❌ (yok)
│
└── İş Etkisi
    ├── Gelir üzerindeki etki ✅ (EBITDA Bridge'de var)
    ├── Operasyonel etki ✅ (var)
    └── Varlık değer kaybı riski ⚠️ (kısmen)
```

**Form Durumu:** ⚠️ **%60 yeterli** - NGFS senaryoları mevcut ama fırsat analizi yok.

##### 3. RISK MANAGEMENT (Risk Yönetimi)
```
Gerekli Veriler:
├── Risk Tanımlama Süreci
│   ├── İklim risk değerlendirme metodolojisi ✅ (TRS, PRS var)
│   ├── Risk önceliklendirme ✅ (risk kategorileri var)
│   └── Periyodik risk tarama ❌
│
├── Risk Ölçümü ve Yönetimi
│   ├── Materiality threshold ❌
│   ├── Risk iştahı ❌
│   └── Limit yapısı ❌
│
└── ERM Entegrasyonu
    ├── Kurumsal risk yönetimine entegrasyon ❌
    └── Risk raporlama ⚠️ (rapor var ama entegrasyon yok)
```

**Form Durumu:** ⚠️ **%40 yeterli** - Hesaplamalar var ama süreç eksik.

##### 4. METRICS & TARGETS (Metrikler ve Hedefler)
```
Gerekli Veriler:
├── GHG Emisyonlar
│   ├── Scope 1 ✅ (var - scope1Emissions)
│   ├── Scope 2 ❌ (yok)
│   ├── Scope 3 ❌ (yok)
│   └── Emisyon yoğunluğu (tCO2/€ ciro) ⚠️ (hesaplanabilir)
│
├── İklim Risk Maruziyeti
│   ├── High-risk sektörlere maruziyet ✅ (hesaplanıyor)
│   ├── Karbon yoğun varlıklar ⚠️ (kısmen)
│   └── Stranded asset riski ⚠️ (kısmen)
│
├── İklim Fırsatları
│   ├── Yeşil gelir oranı ❌
│   ├── Taxonomy uyumlu aktiviteler ❌
│   └── Düşük karbon yatırımlar ❌
│
└── Hedefler
    ├── Net-zero hedefi var mı? ❌
    ├── Kısa/orta/uzun vadeli hedefler ❌
    └── SBTi commitment ❌
```

**Form Durumu:** ⚠️ **%50 yeterli** - Scope 1 var ama Scope 2/3 ve hedefler yok.

---

### BÖLÜM 2: PACTA METODOLOJİSİ ARAŞTIRMASI

#### 2.1 PACTA Nedir?

**PACTA (Paris Agreement Capital Transition Assessment):**
- 2° Investing Initiative tarafından geliştirildi
- Paris Anlaşması hedeflerine uyumu ölçer
- Forward-looking, sektör bazlı, teknoloji karması analizi
- **Amaç:** 5-year production plans'ı Paris scenarios ile karşılaştırma

**Temel Prensip:**
```
Alignment Gap = (Paris Benchmark Production - Actual/Planned Production) / Paris Benchmark

Eğer Gap > 0  → Undershoot (hedefin altında)
Eğer Gap < 0  → Overshoot (hedefin üstünde - iyi)
Eğer Gap = 0  → Aligned (hizalı)
```

---

#### 2.2 PACTA Sektörel Metodolojileri

##### **SEKTÖR 1: POWER (ENERJİ)**

**PACTA Power Metodolojisi:**
```
1. Technology Mix Analysis
   ├── Fossil Fuels: Coal, Gas, Oil
   ├── Renewables: Wind, Solar, Hydro
   └── Nuclear & Other

2. Alignment Metric: Renewable Capacity (%)
   Formula: Renewable_Share = (Wind + Solar + Hydro) / Total_Capacity
   
3. Paris Benchmark (IEA NZE 2050):
   ├── 2025: 45% renewable
   ├── 2030: 70% renewable
   └── 2050: 90% renewable

4. Technology-specific Trajectories:
   ├── Coal: -7% CAGR (phaseout by 2040)
   ├── Gas: -2% CAGR (peaking 2030)
   ├── Wind: +15% CAGR
   ├── Solar: +20% CAGR
   └── Hydro: +2% CAGR
```

**Formül (PACTA Power):**
```javascript
calculatePowerAlignment(portfolio, scenario = 'NZE2050') {
  // Step 1: Aggregate portfolio capacity
  const totalCapacity = portfolio.reduce((sum, asset) => 
    sum + asset.installedCapacityMW, 0
  );
  
  const renewableCapacity = portfolio
    .filter(a => ['wind', 'solar', 'hydro', 'biomass'].includes(a.technology))
    .reduce((sum, asset) => sum + asset.installedCapacityMW, 0);
  
  const fossilCapacity = totalCapacity - renewableCapacity;
  
  // Step 2: Current renewable share
  const currentRenewableShare = renewableCapacity / totalCapacity;
  
  // Step 3: Forward-looking adjustment (5-year pipeline)
  const plannedRetirements = portfolio
    .filter(a => a.retirementYear <= 2030)
    .reduce((sum, asset) => sum + asset.installedCapacityMW, 0);
  
  const plannedAdditions = portfolio
    .filter(a => a.technology.includes('renewable'))
    .reduce((sum, asset) => sum + (asset.plannedCapacityMW || 0), 0);
  
  const forecastCapacity = totalCapacity - plannedRetirements + plannedAdditions;
  const forecastRenewableCapacity = renewableCapacity - 
    (plannedRetirements * 0.8) + plannedAdditions;
  
  const forecastRenewableShare = forecastRenewableCapacity / forecastCapacity;
  
  // Step 4: Benchmark comparison
  const benchmarks = {
    'NZE2050': { 2025: 0.45, 2030: 0.70, 2050: 0.90 },
    'SDS': { 2025: 0.42, 2030: 0.65, 2050: 0.85 },
    'STEPS': { 2025: 0.35, 2030: 0.48, 2050: 0.60 }
  };
  
  const benchmark2030 = benchmarks[scenario][2030];
  
  // Step 5: Calculate alignment gap
  const alignmentGap = (benchmark2030 - forecastRenewableShare) / benchmark2030;
  
  // Step 6: Transition risk score (0-1, higher = more risk)
  const transitionRiskScore = Math.max(0, alignmentGap * 1.5); // Penalize underperformance
  
  return {
    currentRenewableShare: currentRenewableShare * 100,
    forecastRenewableShare: forecastRenewableShare * 100,
    benchmark: benchmark2030 * 100,
    alignmentGap: alignmentGap * 100,
    alignmentStatus: alignmentGap > 0.15 ? 'Not Aligned' : 
                     alignmentGap > 0.05 ? 'Partially Aligned' : 'Aligned',
    transitionRiskScore,
    recommendations: this.generatePowerRecommendations(alignmentGap, portfolio)
  };
}

generatePowerRecommendations(gap, portfolio) {
  const recommendations = [];
  
  if (gap > 0.2) {
    recommendations.push({
      priority: 'High',
      action: 'Accelerate renewable capacity additions',
      target: 'Increase renewable CapEx by 50% annually'
    });
  }
  
  const coalAssets = portfolio.filter(a => a.technology === 'coal');
  if (coalAssets.length > 0) {
    recommendations.push({
      priority: 'Critical',
      action: 'Phase out coal assets by 2030',
      target: `Retire ${coalAssets.length} coal plants (${coalAssets.reduce((s,a) => s + a.installedCapacityMW, 0)} MW)`
    });
  }
  
  return recommendations;
}
```

---

##### **SEKTÖR 2: AUTOMOTIVE (OTOMOTİV)**

**PACTA Automotive Metodolojisi:**
```
1. Vehicle Production Mix
   ├── ICE (Internal Combustion Engine)
   ├── Hybrid (HEV)
   ├── PHEV (Plug-in Hybrid)
   ├── BEV (Battery Electric)
   └── FCEV (Fuel Cell Electric)

2. Alignment Metric: EV Sales Share (%)
   Formula: EV_Share = (BEV + PHEV + FCEV) / Total_Sales
   
3. Paris Benchmark (IEA NZE 2050):
   ├── 2025: 20% EV
   ├── 2030: 60% EV
   └── 2050: 100% EV

4. Regional Adjustments:
   ├── Europe: Faster (2035 ICE ban)
   ├── China: Faster (NEV mandate)
   ├── US: Moderate
   └── Other: Slower
```

**Formül (PACTA Automotive):**
```javascript
calculateAutomotiveAlignment(company, scenario = 'NZE2050') {
  // Step 1: Current production mix
  const totalProduction = company.annualProduction; // units
  const iceProduction = company.iceProduction || 0;
  const bevProduction = company.bevProduction || 0;
  const phevProduction = company.phevProduction || 0;
  const fcevProduction = company.fcevProduction || 0;
  
  const evProduction = bevProduction + phevProduction + fcevProduction;
  const currentEVShare = evProduction / totalProduction;
  
  // Step 2: Forward-looking projections (5-year)
  const productionGrowthRate = company.projectedGrowthRate || 0.03; // 3% default
  const futureProduction = totalProduction * Math.pow(1 + productionGrowthRate, 5);
  
  const evGrowthRate = company.evGrowthRate || 0.25; // 25% default
  const futureEVProduction = evProduction * Math.pow(1 + evGrowthRate, 5);
  
  const forecastEVShare = Math.min(1, futureEVProduction / futureProduction);
  
  // Step 3: Technology-specific trajectories
  const techTrajectories = {
    'NZE2050': {
      bev: 0.50, // 50% BEV by 2030
      phev: 0.10, // 10% PHEV (transition technology)
      fcev: 0.02  // 2% FCEV (niche)
    }
  };
  
  const benchmark2030 = techTrajectories[scenario];
  const totalBenchmark = benchmark2030.bev + benchmark2030.phev + benchmark2030.fcev;
  
  // Step 4: Alignment calculation
  const alignmentGap = (totalBenchmark - forecastEVShare) / totalBenchmark;
  
  // Step 5: Stranded asset risk (ICE plants)
  const iceCapacityUtilization = iceProduction / (company.iceCapacity || iceProduction);
  const strandedAssetRisk = iceCapacityUtilization * alignmentGap;
  
  return {
    currentEVShare: currentEVShare * 100,
    forecastEVShare: forecastEVShare * 100,
    benchmark: totalBenchmark * 100,
    alignmentGap: alignmentGap * 100,
    alignmentStatus: alignmentGap > 0.2 ? 'Not Aligned' : 
                     alignmentGap > 0.1 ? 'Partially Aligned' : 'Aligned',
    strandedAssetRisk: strandedAssetRisk * 100,
    recommendations: this.generateAutomotiveRecommendations(
      alignmentGap, 
      strandedAssetRisk, 
      company
    )
  };
}

generateAutomotiveRecommendations(gap, strandedRisk, company) {
  const recommendations = [];
  
  if (gap > 0.25) {
    recommendations.push({
      priority: 'Critical',
      action: 'Accelerate EV transition',
      target: 'Reach 30% EV production by 2027'
    });
  }
  
  if (strandedRisk > 0.3) {
    recommendations.push({
      priority: 'High',
      action: 'Repurpose or retire ICE plants',
      target: `Convert ${Math.round(strandedRisk * 100)}% of ICE capacity to EV production`
    });
  }
  
  if (company.bevProduction / (company.bevProduction + company.phevProduction) < 0.7) {
    recommendations.push({
      priority: 'Medium',
      action: 'Prioritize BEV over PHEV',
      target: 'BEV should be 70% of total EV production'
    });
  }
  
  return recommendations;
}
```

---

##### **SEKTÖR 3: STEEL (ÇELİK)**

**PACTA Steel Metodolojisi:**
```
1. Production Technology Mix
   ├── BF-BOF (Blast Furnace - Basic Oxygen Furnace) - High carbon
   ├── EAF (Electric Arc Furnace) - Lower carbon
   ├── DRI (Direct Reduced Iron) - Medium carbon
   └── H2-DRI (Hydrogen DRI) - Near-zero carbon

2. Alignment Metric: Carbon Intensity (tCO2/ton steel)
   Formula: CI = Total_Scope1_Emissions / Total_Steel_Production
   
3. Paris Benchmark (IEA NZE 2050):
   ├── 2025: 1.4 tCO2/ton (current: 1.85)
   ├── 2030: 1.0 tCO2/ton
   ├── 2040: 0.4 tCO2/ton
   └── 2050: 0.1 tCO2/ton (CCUS + H2)

4. Technology Transition Pathway:
   ├── Increase scrap-based EAF production
   ├── Shift from BF-BOF to DRI-EAF
   ├── Deploy H2-DRI in new plants
   └── Retrofit existing plants with CCUS
```

**Formül (PACTA Steel):**
```javascript
calculateSteelAlignment(company, scenario = 'NZE2050') {
  // Step 1: Current carbon intensity
  const totalProduction = company.annualSteelProduction; // million tons
  const scope1Emissions = company.scope1EmissionsMtCO2; // million tCO2
  const currentCarbonIntensity = scope1Emissions / totalProduction; // tCO2/ton
  
  // Step 2: Production technology breakdown
  const bfbofShare = company.bfbofProduction / totalProduction || 0.65; // Default 65%
  const eafShare = company.eafProduction / totalProduction || 0.30; // Default 30%
  const h2Share = company.h2Production / totalProduction || 0; // Default 0%
  
  // Step 3: Technology-specific emission factors
  const emissionFactors = {
    bfbof: 2.0,  // tCO2/ton steel
    eaf_virgin: 1.4,
    eaf_scrap: 0.4,
    dri: 1.2,
    h2_dri: 0.05
  };
  
  // Step 4: Forecast carbon intensity (5-year)
  // Assume gradual shift: BF-BOF -3%/yr, EAF +5%/yr, H2 +50%/yr (from low base)
  const years = 5;
  const forecastBFBOFShare = bfbofShare * Math.pow(0.97, years);
  const forecastEAFShare = eafShare * Math.pow(1.05, years);
  const forecastH2Share = h2Share * Math.pow(1.5, years);
  
  // Normalize shares to 100%
  const totalShare = forecastBFBOFShare + forecastEAFShare + forecastH2Share;
  const normBFBOF = forecastBFBOFShare / totalShare;
  const normEAF = forecastEAFShare / totalShare;
  const normH2 = forecastH2Share / totalShare;
  
  const forecastCarbonIntensity = 
    normBFBOF * emissionFactors.bfbof +
    normEAF * emissionFactors.eaf_virgin * 0.7 + // Assume 30% scrap
    normEAF * emissionFactors.eaf_scrap * 0.3 +
    normH2 * emissionFactors.h2_dri;
  
  // Step 5: Benchmark comparison
  const benchmarks = {
    'NZE2050': { 2025: 1.4, 2030: 1.0, 2040: 0.4, 2050: 0.1 },
    'SDS': { 2025: 1.5, 2030: 1.2, 2040: 0.6, 2050: 0.3 }
  };
  
  const benchmark2030 = benchmarks[scenario][2030];
  
  // Step 6: Alignment gap (higher CI = worse)
  const alignmentGap = (forecastCarbonIntensity - benchmark2030) / benchmark2030;
  
  // Step 7: Transition risk assessment
  const transitionRisk = Math.max(0, alignmentGap * 0.8); // Scale to 0-1
  
  // Step 8: Asset stranding risk (BF-BOF specific)
  const bfbofAssetValue = company.bfbofAssetValue || 0;
  const remainingLife = company.avgBFBOFAge ? (40 - company.avgBFBOFAge) : 20;
  const strandedAssetRisk = (normBFBOF > 0.3) ? 
    (bfbofAssetValue * remainingLife / 40 * alignmentGap) : 0;
  
  return {
    currentCarbonIntensity: currentCarbonIntensity.toFixed(2),
    forecastCarbonIntensity: forecastCarbonIntensity.toFixed(2),
    benchmark: benchmark2030.toFixed(2),
    alignmentGap: (alignmentGap * 100).toFixed(1),
    alignmentStatus: alignmentGap > 0.3 ? 'Not Aligned' : 
                     alignmentGap > 0.1 ? 'Partially Aligned' : 'Aligned',
    transitionRisk: transitionRisk.toFixed(2),
    technologyMix: {
      current: { bfbof: bfbofShare * 100, eaf: eafShare * 100, h2: h2Share * 100 },
      forecast: { bfbof: normBFBOF * 100, eaf: normEAF * 100, h2: normH2 * 100 }
    },
    strandedAssetRisk: strandedAssetRisk.toFixed(0),
    recommendations: this.generateSteelRecommendations(alignmentGap, company)
  };
}
```

---

### BÖLÜM 3: TCFD FRAMEWORK ARAŞTIRMASI

#### 3.1 TCFD Nedir?

**TCFD (Task Force on Climate-related Financial Disclosures):**
- FSB (Financial Stability Board) tarafından 2015'te oluşturuldu
- İklim risklerinin **finansal etki** odaklı raporlaması
- 4 ana pillar: Governance, Strategy, Risk Management, Metrics & Targets
- **Amaç:** Yatırımcılar için karar-alınabilir iklim bilgisi sağlamak

---

#### 3.2 TCFD Disclosure Framework

##### **PILLAR 1: GOVERNANCE (Yönetişim)**

**Önerilen İfşaatlar:**
```
a) YK'nın iklim riski gözetimi
b) Yönetimin iklim riski yönetimindeki rolü
```

**Ölçülebilir Metrikler:**
```javascript
calculateGovernanceScore(company) {
  let score = 0;
  const maxScore = 100;
  
  // Board oversight (40 points)
  if (company.hasClimateExpertOnBoard) score += 15;
  if (company.boardClimateDiscussionFrequency >= 4) score += 15; // Quarterly
  if (company.hasClimateRiskCommittee) score += 10;
  
  // Management responsibility (30 points)
  if (company.hasChiefSustainabilityOfficer) score += 15;
  if (company.climateRiskInERM) score += 15;
  
  // Incentives (30 points)
  if (company.climateKPIsInExecutiveComp) score += 20;
  if (company.hasClimatePolicy) score += 10;
  
  return {
    score,
    grade: score >= 80 ? 'Strong' : score >= 60 ? 'Adequate' : 'Weak',
    gaps: this.identifyGovernanceGaps(company)
  };
}
```

---

##### **PILLAR 2: STRATEGY (Strateji)**

**Önerilen İfşaatlar:**
```
a) Kısa, orta ve uzun vadeli iklim riskleri ve fırsatları
b) İklim risklerinin işe, stratejiye ve finansal planlamaya etkisi
c) İklim senaryolarına karşı stratejinin esnekliği
```

**Formüller:**

**2.1 Senaryo Analizi Etkisi:**
```javascript
calculateScenarioImpact(company, scenario) {
  // Multi-scenario analysis (NGFS)
  const scenarios = {
    'orderly_1.5C': {
      carbonPrice: 250, // USD/tCO2
      temperatureRise: 1.5,
      gdpImpact: -0.02
    },
    'disorderly_2C': {
      carbonPrice: 400,
      temperatureRise: 2.0,
      gdpImpact: -0.05
    },
    'hothouse_3C': {
      carbonPrice: 50,
      temperatureRise: 3.5,
      gdpImpact: -0.15
    }
  };
  
  const params = scenarios[scenario];
  
  // Transition impact (carbon pricing)
  const scope1_2Emissions = company.scope1Emissions + company.scope2Emissions;
  const carbonCost = scope1_2Emissions * params.carbonPrice;
  const carbonCostAsPercentRevenue = carbonCost / company.revenue;
  
  // Physical impact (temperature rise)
  const physicalRiskMultiplier = Math.pow(params.temperatureRise / 1.5, 2); // Quadratic
  const physicalImpact = company.physicalRiskExposure * physicalRiskMultiplier;
  const physicalImpactAsPercentRevenue = physicalImpact / company.revenue;
  
  // Demand impact (GDP correlation)
  const demandElasticity = company.gdpElasticity || 1.2; // Default
  const demandImpact = company.revenue * params.gdpImpact * demandElasticity;
  
  // Total EBITDA impact
  const totalImpact = carbonCost + physicalImpact + demandImpact;
  const ebitdaImpact = totalImpact / company.ebitda;
  
  return {
    scenario,
    carbonCost,
    physicalImpact,
    demandImpact,
    totalImpact,
    ebitdaImpact: ebitdaImpact * 100, // as percentage
    revenueImpact: (totalImpact / company.revenue) * 100,
    materiality: Math.abs(ebitdaImpact) > 0.1 ? 'Material' : 'Not Material'
  };
}
```

**2.2 Time Horizon Risk Mapping:**
```javascript
mapRisksByTimeHorizon(company) {
  return {
    shortTerm: { // 0-3 years
      transitionRisks: [
        {
          risk: 'Carbon pricing introduction',
          likelihood: 'High',
          financialImpact: company.scope1Emissions * 50 // USD 50/ton
        },
        {
          risk: 'Renewable energy mandate',
          likelihood: 'Medium',
          financialImpact: company.nonRenewableEnergy * 20
        }
      ],
      physicalRisks: [
        {
          risk: 'Acute flood events',
          likelihood: this.getFloodLikelihood(company.location),
          financialImpact: company.assetValue * 0.05 // 5% damage
        }
      ],
      opportunities: [
        {
          opportunity: 'Green financing',
          likelihood: 'Medium',
          financialImpact: company.debt * -0.005 // 50bps lower rate
        }
      ]
    },
    mediumTerm: { // 3-10 years
      transitionRisks: [
        {
          risk: 'Technology disruption',
          likelihood: this.getTechDisruptionLikelihood(company.sector),
          financialImpact: company.assetValue * 0.3 // 30% stranding
        },
        {
          risk: 'Reputational damage',
          likelihood: 'Medium',
          financialImpact: company.revenue * 0.05 // 5% revenue loss
        }
      ],
      physicalRisks: [
        {
          risk: 'Chronic water stress',
          likelihood: this.getWaterStressLikelihood(company.location),
          financialImpact: company.opex * 0.15 // 15% OpEx increase
        }
      ]
    },
    longTerm: { // 10+ years
      transitionRisks: [
        {
          risk: 'Market shifts (fossil fuel demand)',
          likelihood: 'High',
          financialImpact: company.fossilRevenueShare * company.revenue
        }
      ],
      physicalRisks: [
        {
          risk: 'Sea level rise',
          likelihood: company.coastalExposure ? 'High' : 'Low',
          financialImpact: company.coastalAssets * 0.50 // 50% value loss
        }
      ]
    }
  };
}
```

---

##### **PILLAR 3: RISK MANAGEMENT (Risk Yönetimi)**

**Önerilen İfşaatlar:**
```
a) İklim risklerini tanımlama ve değerlendirme süreci
b) İklim risklerini yönetme süreci
c) Genel risk yönetimine entegrasyon
```

**Formüller:**

**3.1 Risk Materiality Assessment:**
```javascript
assessRiskMateriality(risk, company) {
  // Likelihood scoring (1-5)
  const likelihood = this.calculateLikelihood(risk, company);
  
  // Impact scoring (1-5)
  const impact = this.calculateImpact(risk, company);
  
  // Heat map positioning
  const riskScore = likelihood * impact;
  
  // Materiality threshold
  const materialityThreshold = company.materialityThreshold || 9; // Default 3x3
  
  return {
    likelihood,
    impact,
    riskScore,
    isMaterial: riskScore >= materialityThreshold,
    category: riskScore >= 20 ? 'Critical' :
              riskScore >= 12 ? 'High' :
              riskScore >= 6 ? 'Medium' : 'Low',
    actionRequired: riskScore >= materialityThreshold
  };
}

calculateLikelihood(risk, company) {
  // Use scenario-based probabilities
  if (risk.type === 'carbon_pricing') {
    return company.country === 'EU' ? 5 : // Very likely
           company.country === 'US' ? 3 : // Possible
           2; // Unlikely
  }
  
  if (risk.type === 'physical_flood') {
    const floodZone = company.floodZone;
    return floodZone === 'high' ? 5 :
           floodZone === 'medium' ? 3 :
           1;
  }
  
  // Default based on time horizon
  return risk.timeHorizon === 'short' ? 4 :
         risk.timeHorizon === 'medium' ? 3 :
         2;
}

calculateImpact(risk, company) {
  // Financial impact as % of EBITDA
  const impactPercent = risk.financialImpact / company.ebitda;
  
  return impactPercent >= 0.50 ? 5 : // Catastrophic (>50% EBITDA)
         impactPercent >= 0.25 ? 4 : // Major (25-50%)
         impactPercent >= 0.10 ? 3 : // Moderate (10-25%)
         impactPercent >= 0.05 ? 2 : // Minor (5-10%)
         1; // Negligible (<5%)
}
```

**3.2 Risk Appetite Framework:**
```javascript
defineClimateRiskAppetite(company) {
  return {
    transitionRisk: {
      appetite: 'Low', // Willing to accept low transition risk
      threshold: {
        carbonPriceExposure: company.revenue * 0.05, // Max 5% of revenue
        strandedAssetRisk: company.assetValue * 0.10, // Max 10% of assets
        reputationalRisk: company.marketCap * 0.02 // Max 2% of market cap
      },
      limits: {
        highCarbonSectorExposure: 0.15, // Max 15% of portfolio
        coalExposure: 0, // Zero tolerance
        oilGasExposure: 0.10 // Max 10%
      }
    },
    physicalRisk: {
      appetite: 'Moderate',
      threshold: {
        floodRiskAssets: company.assetValue * 0.20, // Max 20% in flood zones
        waterStressAssets: company.assetValue * 0.15,
        extremeHeatExposure: company.workforce * 0.10
      }
    },
    climateOpportunities: {
      appetite: 'High',
      targets: {
        greenRevenueShare: 0.30, // Target 30% by 2030
        lowCarbonInvestments: company.capex * 0.60, // 60% of CapEx
        taxonomyAlignment: 0.50 // 50% EU Taxonomy aligned
      }
    }
  };
}
```

---

##### **PILLAR 4: METRICS & TARGETS (Metrikler ve Hedefler)**

**Önerilen İfşaatlar:**
```
a) İklim risklerini değerlendirmek için kullanılan metrikler
b) Scope 1, 2, 3 GHG emisyonları
c) İklim risklerini yönetmek için kullanılan hedefler
```

**Formüller:**

**4.1 GHG Emissions Calculation:**
```javascript
calculateGHGEmissions(company) {
  // Scope 1: Direct emissions
  const scope1 = {
    stationaryCombustion: company.fuelConsumption * emissionFactors.fuel,
    mobileCombustion: company.vehicleFuelConsumption * emissionFactors.diesel,
    processEmissions: company.processEmissions || 0,
    fugitiveEmissions: company.refrigerantLeakage * emissionFactors.refrigerant,
    total: 0
  };
  scope1.total = scope1.stationaryCombustion + scope1.mobileCombustion + 
                 scope1.processEmissions + scope1.fugitiveEmissions;
  
  // Scope 2: Indirect emissions from purchased energy
  const scope2 = {
    locationBased: company.electricityConsumption * emissionFactors.electricityGrid,
    marketBased: company.electricityConsumption * 
                 (1 - company.renewableEnergyShare) * emissionFactors.electricityGrid,
    total: 0
  };
  scope2.total = scope2.marketBased; // Use market-based method
  
  // Scope 3: Value chain emissions (15 categories)
  const scope3 = {
    // Upstream
    purchasedGoods: company.procurement * emissionFactors.avgProduct,
    capitalGoods: company.capex * emissionFactors.capitalGoods,
    fuelAndEnergyRelated: (scope1.total + scope2.total) * 0.15, // 15% well-to-tank
    upstreamTransportation: company.inboundFreight * emissionFactors.freight,
    wasteGenerated: company.waste * emissionFactors.waste,
    businessTravel: company.businessTravelKm * emissionFactors.flight,
    employeeCommuting: company.employees * 250 * 20 * emissionFactors.car, // 250 days, 20km
    
    // Downstream
    downstreamTransportation: company.outboundFreight * emissionFactors.freight,
    processingOfSoldProducts: company.intermediateProducts * emissionFactors.processing,
    useOfSoldProducts: company.productLifetimeEmissions || 0,
    endOfLifeTreatment: company.productWaste * emissionFactors.endOfLife,
    downstreamLeasedAssets: company.leasedAssetEmissions || 0,
    franchises: company.franchiseEmissions || 0,
    investments: company.investmentEmissions || 0,
    
    total: 0
  };
  scope3.total = Object.values(scope3).reduce((sum, val) => 
    typeof val === 'number' ? sum + val : sum, 0
  );
  
  // Total emissions
  const totalEmissions = scope1.total + scope2.total + scope3.total;
  
  // Intensity metrics
  const revenueIntensity = totalEmissions / (company.revenue / 1000000); // tCO2e/M USD
  const employeeIntensity = totalEmissions / company.employees; // tCO2e/employee
  
  return {
    scope1,
    scope2,
    scope3,
    totalEmissions,
    intensityMetrics: {
      revenueIntensity: revenueIntensity.toFixed(2),
      employeeIntensity: employeeIntensity.toFixed(2)
    },
    yearOverYearChange: this.calculateYoYChange(company, totalEmissions),
    benchmarkComparison: this.compareToBenchmark(company.sector, revenueIntensity)
  };
}
```

**4.2 Climate Risk Exposure Metrics:**
```javascript
calculateClimateRiskMetrics(company) {
  return {
    // Transition risk metrics
    carbonAssetExposure: {
      highCarbonSectorRevenue: company.fossilRevenueShare * company.revenue,
      asPercentTotalRevenue: company.fossilRevenueShare * 100,
      benchmark: this.getSectorBenchmark(company.sector, 'carbonRevenue')
    },
    
    strandedAssetRisk: {
      coalAssets: company.coalAssetValue || 0,
      oilGasAssets: company.oilGasAssetValue || 0,
      totalAtRisk: (company.coalAssetValue || 0) + (company.oilGasAssetValue || 0),
      asPercentTotalAssets: ((company.coalAssetValue || 0) + (company.oilGasAssetValue || 0)) / 
                            company.totalAssets * 100
    },
    
    // Physical risk metrics
    physicalRiskExposure: {
      assetsInHighRiskZones: company.highRiskAssets || 0,
      asPercentTotalAssets: (company.highRiskAssets || 0) / company.totalAssets * 100,
      floodExposure: company.floodZoneAssets || 0,
      droughtExposure: company.waterStressAssets || 0,
      heatExposure: company.heatExposureAssets || 0
    },
    
    // Climate opportunities
    climateOpportunities: {
      greenRevenue: company.greenRevenue || 0,
      asPercentTotalRevenue: (company.greenRevenue || 0) / company.revenue * 100,
      renewableEnergyInvestment: company.renewableCapex || 0,
      taxonomyAlignedActivities: company.taxonomyAlignedRevenue || 0,
      taxonomyAlignmentPercent: (company.taxonomyAlignedRevenue || 0) / company.revenue * 100
    },
    
    // Forward-looking metrics
    scienceBasedTargets: {
      hasNetZeroCommitment: company.netZeroTarget ? true : false,
      netZeroYear: company.netZeroTarget || null,
      interimTargets: company.interimEmissionTargets || [],
      sbtiValidated: company.sbtiValidated || false
    }
  };
}
```

**4.3 Target Setting & Tracking:**
```javascript
calculateTargetProgress(company) {
  const baseYear = company.emissionsBaseYear || 2020;
  const currentYear = new Date().getFullYear();
  const targetYear = company.emissionTargetYear || 2030;
  
  const yearsElapsed = currentYear - baseYear;
  const totalYears = targetYear - baseYear;
  const progressPercent = yearsElapsed / totalYears;
  
  // Linear reduction pathway
  const baselineEmissions = company.baselineEmissions;
  const targetEmissions = baselineEmissions * (1 - company.emissionReductionTarget);
  const expectedEmissions = baselineEmissions - 
    (baselineEmissions - targetEmissions) * progressPercent;
  
  const actualEmissions = company.currentEmissions;
  const variance = ((actualEmissions - expectedEmissions) / expectedEmissions) * 100;
  
  return {
    baseYear,
    targetYear,
    progressPercent: (progressPercent * 100).toFixed(1),
    baselineEmissions,
    targetEmissions,
    expectedEmissions: expectedEmissions.toFixed(0),
    actualEmissions: actualEmissions.toFixed(0),
    variance: variance.toFixed(1),
    status: variance < -5 ? 'Ahead of target' :
            variance < 5 ? 'On track' :
            variance < 15 ? 'Behind target' :
            'Significantly off track',
    annualReductionRequired: this.calculateRequiredAnnualReduction(
      actualEmissions,
      targetEmissions,
      targetYear - currentYear
    )
  };
}

calculateRequiredAnnualReduction(current, target, yearsRemaining) {
  // Calculate CAGR needed to reach target
  const reductionRate = 1 - Math.pow(target / current, 1 / yearsRemaining);
  const absoluteReduction = (current - target) / yearsRemaining;
  
  return {
    percentPerYear: (reductionRate * 100).toFixed(2),
    absolutePerYear: absoluteReduction.toFixed(0),
    feasibility: reductionRate > 0.10 ? 'Challenging' :
                 reductionRate > 0.05 ? 'Moderate' :
                 'Achievable'
  };
}
```

---

### BÖLÜM 4: SİSTEME ADAPTAS YON ÖNERİLERİ

#### 4.1 Form Güncellemeleri

**ÖNCELİK 1: PACTA Verileri İçin Form Genişletme**

**Yeni Form Adımı: Step 11 - PACTA Sector Data**
```javascript
// Eklenecek form alanları (sektöre göre dynamic rendering)

const pactaFields = {
  // ENERGY SECTOR
  energy: {
    // Capacity data
    totalInstalledCapacityMW: '',
    coalCapacityMW: '',
    gasCapacityMW: '',
    oilCapacityMW: '',
    windCapacityMW: '',
    solarCapacityMW: '',
    hydroCapacityMW: '',
    biomassCapacityMW: '',
    geothermalCapacityMW: '',
    nuclearCapacityMW: '',
    
    // Production data
    annualProductionGWh: '',
    coalProductionGWh: '',
    gasProductionGWh: '',
    renewableProductionGWh: '',
    
    // Forward-looking
    plannedRetirements: [], // [{ year, capacity, technology }]
    plannedAdditions: [], // [{ year, capacity, technology }]
    renewableTarget2030: '', // %
    coalPhaseoutDate: ''
  },
  
  // AUTOMOTIVE SECTOR
  automotive: {
    // Production data
    annualTotalProduction: '', // units
    iceProduction: '',
    hybridProduction: '',
    bevProduction: '',
    phevProduction: '',
    fcevProduction: '',
    
    // Capacity
    iceCapacity: '',
    evCapacity: '',
    
    // Forward-looking
    evProductionTarget2030: '', // %
    icePlantClosures: [], // [{ year, capacity }]
    evInvestmentPipeline: '', // USD
    batteryCapacityGWh: ''
  },
  
  // STEEL SECTOR
  steel: {
    // Production data
    annualSteelProduction: '', // million tons
    bfbofProduction: '',
    eafProduction: '',
    driProduction: '',
    h2driProduction: '',
    
    // Emissions
    carbonIntensity: '', // tCO2/ton steel
    
    // Assets
    bfbofAssetValue: '',
    avgBFBOFAge: '', // years
    
    // Forward-looking
    eafConversionPlan: [],
    h2ReadinessLevel: '', // low/medium/high
    ccusDeploymentPlan: ''
  },
  
  // CEMENT SECTOR
  cement: {
    // Production
    annualCementProduction: '', // million tons
    annualClinkerProduction: '',
    clinkerCementRatio: '',
    
    // Emissions
    carbonIntensityClinker: '', // tCO2/ton clinker
    
    // Technology
    alternativeFuelRate: '', // %
    ccusCapacity: '',
    
    // Forward-looking
    alternativeBinders: '', // %
    decarbonizationRoadmap: ''
  },
  
  // AVIATION SECTOR
  aviation: {
    // Fleet
    totalAircraftCount: '',
    avgFleetAge: '', // years
    newGenerationAircraftShare: '', // %
    
    // Fuel
    annualJetFuelConsumption: '', // tons
    safUsagePercent: '', // %
    
    // Emissions
    scope1EmissionsAviation: '', // tCO2
    carbonIntensityRTK: '', // gCO2/RTK
    
    // Forward-looking
    safTarget2030: '', // %
    fleetRenewalPlan: []
  },
  
  // REAL ESTATE SECTOR
  realEstate: {
    // Portfolio
    totalFloorAreaM2: '',
    officeAreaM2: '',
    residentialAreaM2: '',
    retailAreaM2: '',
    
    // Performance
    avgEnergyIntensity: '', // kWh/m2/year
    leedCertifiedAreaM2: '',
    breeamCertifiedAreaM2: '',
    epcDistribution: {}, // { A: %, B: %, C: %, etc }
    
    // Renewables
    renewableEnergyPercent: '',
    solarPVCapacityKW: '',
    evChargingStations: '',
    
    // Forward-looking
    deepRenovationPipelineM2: '',
    netZeroReady2030Target: '', // %
    greenBuildingCertTarget: '' // %
  }
};
```

---

**ÖNCELİK 2: TCFD Verileri İçin Form Genişletme**

**Yeni Form Adımı: Step 12 - TCFD Governance & Targets**
```javascript
const tcfdFields = {
  // GOVERNANCE
  governance: {
    hasClimateExpertOnBoard: false,
    boardClimateDiscussionFrequency: '', // per year
    hasClimateRiskCommittee: false,
    hasChiefSustainabilityOfficer: false,
    climateRiskInERM: false,
    climateKPIsInExecutiveComp: false,
    hasClimatePolicy: false,
    climateGovernanceNotes: ''
  },
  
  // STRATEGY
  strategy: {
    climateRiskTimeHorizons: {
      short: '', // years
      medium: '', // years
      long: '' // years
    },
    materialClimateRisks: [], // Array of risks with description, timeframe, impact
    materialClimateOpportunities: [],
    scenariosUsed: [], // ['1.5C', '2C', '3C', etc]
    strategyResilienceAssessment: ''
  },
  
  // RISK MANAGEMENT
  riskManagement: {
    climateRiskIdentificationProcess: '',
    riskAssessmentFrequency: '', // quarterly, annually, etc
    materialityThreshold: '', // % of EBITDA
    climateRiskAppetiteStatement: '',
    integrationWithERM: false,
    riskManagementNotes: ''
  },
  
  // METRICS & TARGETS
  metricsTargets: {
    // GHG Emissions
    scope1Emissions: '', // ✅ Already exists
    scope2Emissions: '', // ❌ NEW
    scope2Method: '', // location-based or market-based
    scope3Emissions: '', // ❌ NEW
    scope3Categories: {
      purchasedGoods: '',
      capitalGoods: '',
      fuelEnergyRelated: '',
      upstreamTransport: '',
      waste: '',
      businessTravel: '',
      employeeCommuting: '',
      downstreamTransport: '',
      useOfSoldProducts: '',
      endOfLife: '',
      investments: ''
    },
    
    // Intensity metrics
    emissionsBaseYear: '',
    emissionsBaseline: '',
    revenueIntensity: '', // tCO2/M revenue
    
    // Targets
    hasNetZeroCommitment: false,
    netZeroYear: '',
    interimTargets: [], // [{ year, reduction%, scope }]
    sbtiValidated: false,
    emissionReductionTarget: '', // % by target year
    emissionTargetYear: '',
    
    // Climate risk exposure
    highCarbonSectorRevenue: '',
    fossilRevenueShare: '', // % of total revenue
    greenRevenue: '',
    taxonomyAlignedRevenue: '',
    
    // Physical risk exposure
    assetsInHighRiskZones: '',
    floodZoneAssets: '',
    waterStressAssets: '',
    
    // Opportunities
    renewableEnergyShare: '', // % of total energy
    renewableCapex: '',
    greenFinancingAmount: ''
  }
};
```

---

#### 4.2 Yeni Hesaplama Modülleri

**DOSYA 1: `src/utils/pactaCalculator.js`**

```javascript
class PACTACalculator {
  constructor() {
    this.benchmarks = {
      energy: {
        'NZE2050': { 2025: 0.45, 2030: 0.70, 2050: 0.90 },
        'SDS': { 2025: 0.42, 2030: 0.65, 2050: 0.85 }
      },
      automotive: {
        'NZE2050': { 2025: 0.20, 2030: 0.60, 2050: 1.00 },
        'SDS': { 2025: 0.18, 2030: 0.55, 2050: 0.95 }
      },
      steel: {
        'NZE2050': { 2025: 1.4, 2030: 1.0, 2040: 0.4, 2050: 0.1 },
        'SDS': { 2025: 1.5, 2030: 1.2, 2040: 0.6, 2050: 0.3 }
      }
    };
  }
  
  calculateAlignment(company, sector, scenario = 'NZE2050') {
    switch(sector) {
      case 'Enerji':
        return this.calculatePowerAlignment(company, scenario);
      case 'Otomotiv':
        return this.calculateAutomotiveAlignment(company, scenario);
      case 'Sanayi':
        return this.calculateSteelAlignment(company, scenario);
      case 'Çimento':
        return this.calculateCementAlignment(company, scenario);
      case 'Havacılık':
        return this.calculateAviationAlignment(company, scenario);
      case 'Gayrimenkul':
        return this.calculateRealEstateAlignment(company, scenario);
      default:
        return { applicable: false, message: 'PACTA not applicable for this sector' };
    }
  }
  
  // Implement sector-specific methods from BÖLÜM 2
  calculatePowerAlignment(company, scenario) {
    // Implementation from above
  }
  
  calculateAutomotiveAlignment(company, scenario) {
    // Implementation from above
  }
  
  // ... other sectors
}

export default PACTACalculator;
```

---

**DOSYA 2: `src/utils/tcfdCalculator.js`**

```javascript
class TCFDCalculator {
  constructor() {
    this.emissionFactors = {
      electricity: 0.475, // kg CO2/kWh (Turkey grid)
      naturalGas: 2.03, // kg CO2/m3
      diesel: 2.68, // kg CO2/L
      // ... more factors
    };
  }
  
  // PILLAR 1: Governance Score
  calculateGovernanceScore(company) {
    // Implementation from BÖLÜM 3
  }
  
  // PILLAR 2: Strategy Impact
  calculateScenarioImpact(company, scenario) {
    // Implementation from BÖLÜM 3
  }
  
  mapRisksByTimeHorizon(company) {
    // Implementation from BÖLÜM 3
  }
  
  // PILLAR 3: Risk Management
  assessRiskMateriality(risk, company) {
    // Implementation from BÖLÜM 3
  }
  
  defineClimateRiskAppetite(company) {
    // Implementation from BÖLÜM 3
  }
  
  // PILLAR 4: Metrics & Targets
  calculateGHGEmissions(company) {
    // Full Scope 1, 2, 3 calculation
    // Implementation from BÖLÜM 3
  }
  
  calculateClimateRiskMetrics(company) {
    // Implementation from BÖLÜM 3
  }
  
  calculateTargetProgress(company) {
    // Implementation from BÖLÜM 3
  }
  
  // Comprehensive TCFD Report
  generateTCFDReport(company) {
    return {
      governance: this.calculateGovernanceScore(company),
      strategy: {
        scenarios: ['orderly_1.5C', 'disorderly_2C', 'hothouse_3C'].map(s => 
          this.calculateScenarioImpact(company, s)
        ),
        riskOpportunityMap: this.mapRisksByTimeHorizon(company)
      },
      riskManagement: {
        materialRisks: company.risks.map(r => this.assessRiskMateriality(r, company)),
        riskAppetite: this.defineClimateRiskAppetite(company)
      },
      metricsTargets: {
        emissions: this.calculateGHGEmissions(company),
        exposureMetrics: this.calculateClimateRiskMetrics(company),
        targetProgress: this.calculateTargetProgress(company)
      }
    };
  }
}

export default TCFDCalculator;
```

---

#### 4.3 Entegrasyon Planı

**ASama 1: Form Güncellemesi (2 hafta)**
```
1. FinancialDataForm.js'e Step 11 (PACTA) ve Step 12 (TCFD) ekle
2. Sektöre göre dynamic field rendering
3. Form validation kuralları ekle
4. i18n translations ekle
```

**Aşama 2: Calculator Geliştirme (3 hafta)**
```
1. pactaCalculator.js oluştur ve test et
2. tcfdCalculator.js oluştur ve test et
3. Mevcut enhancedRiskCalculator.js ile entegre et
4. Unit testler yaz
```

**Aşama 3: UI/Raporlama (2 hafta)**
```
1. PACTA alignment dashboard
2. TCFD disclosure report template
3. PDF export güncelleme
4. Visualization charts (D3.js veya Recharts)
```

**Aşama 4: Test ve Validasyon (1 hafta)**
```
1. Gerçek veri ile test
2. Metodoloji doğrulama (academic papers ile)
3. User acceptance testing
```

---

### BÖLÜM 5: SONUÇ VE ÖNERİLER

#### 5.1 Özet Değerlendirme

| Analiz Modülü | Mevcut Durum | Formül Durumu | Veri Yeterliliği | Aksiyon Gerekli Mi? |
|--------------|-------------|--------------|-----------------|-------------------|
| **Finansal Analiz** | ✅ Tam Çalışır | ✅ Doğru | ✅ Yeterli | ❌ Hayır |
| **PACTA** | ⚠️ Kısmi | ⚠️ Sınırlı | ❌ Yetersiz | ✅ Evet - Kritik |
| **TCFD** | ❌ Yok | ❌ Yok | ⚠️ Kısmen Yeterli | ✅ Evet - Önemli |

---

#### 5.2 Öncelik Sıralaması

**YÜK SEK ÖNCELİK (1-2 Ay)**
1. ✅ PACTA - Enerji sektörü tam implementasyon
2. ✅ PACTA - Otomotiv sektörü tam implementasyon
3. ✅ TCFD Metrics & Targets (Scope 2/3 emissions)

**ORTA ÖNCELİK (2-4 Ay)**
4. ⚠️ PACTA - Çelik, Çimento, Havacılık sektörleri
5. ⚠️ TCFD Strategy (scenario analysis genişletme)
6. ⚠️ TCFD Governance scoring

**DÜŞÜK ÖNCELİK (4-6 Ay)**
7. 📋 PACTA - Gayrimenkul ve diğer sektörler
8. 📋 TCFD Risk Management (full ERM integration)
9. 📋 Advanced visualizations

---

#### 5.3 Kaynaklar

**PACTA Metodolojisi:**
- 2° Investing Initiative: https://2degrees-investing.org/
- PACTA Technical Documentation: https://rmi.org/pacta
- GFANZ Portfolio Alignment Measurement: https://www.gfanzero.com/

**TCFD Framework:**
- TCFD Recommendations: https://www.fsb-tcfd.org/recommendations/
- TCFD Implementation Guide: https://www.tcfdhub.org/
- TCFD Knowledge Hub: https://www.tcfdhub.org/knowledge-hub/

**Emission Factors:**
- IPCC Emission Factor Database: https://www.ipcc-nggip.iges.or.jp/
- GHG Protocol: https://ghgprotocol.org/
- DEFRA/BEIS Conversion Factors: https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting

**Scenario Data:**
- NGFS Scenarios: https://www.ngfs.net/ngfs-scenarios-portal/
- IEA Net Zero by 2050: https://www.iea.org/reports/net-zero-by-2050
- IPCC Climate Scenarios: https://www.ipcc.ch/

---

## 📋 SONUÇ

**Mevcut sistemin durumu:**
- ✅ Finansal Analiz: **Eksiksiz ve doğru çalışıyor**
- ⚠️ PACTA: **Temel mantık var ama veri eksik**
- ❌ TCFD: **Formüller yok, sadece temel risk hesaplamaları var**

**Yapılması gerekenler:**
1. **Form genişletme** (Step 11-12 eklenmeli)
2. **pactaCalculator.js** modülü yazılmalı (6 sektör için)
3. **tcfdCalculator.js** modülü yazılmalı (4 pillar için)
4. **Scope 2 ve Scope 3** emissions alanları eklenmeli
5. **TCFD disclosure template** hazırlanmalı

**Tahmini süre:** 6-8 hafta (1 full-time developer)
**Zorluk seviyesi:** Orta-Yüksek (metodoloji complex, ama iyi dokümante)

---

**Hazırlayan:** AI Climate Finance Analyst  
**Tarih:** 31 Ekim 2024  
**Durum:** Detaylı metodoloji raporu hazır - implementation'a geçilebilir
