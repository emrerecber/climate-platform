# 📊 Climate Platform - Tüm Assessment Veri Alanları

Bu dokümanda platformumuzun topladığı **TÜM veri alanları** step by step listelenmiştir.

---

## 🎯 Assessment Tipleri

Platformumuzda **1 ANA FORM** var ama **3 farklı risk hesaplama modülü** kullanıyoruz:

1. **FinancialDataForm** (12 Step) - Ana form
   - PACTA Analysis (Sector-based)
   - TCFD Risk Assessment  
   - ECB/IFRS S2 Comprehensive

---

# 📝 FORM: FinancialDataForm (12 Steps)

## Step 1: Company/Personal Information

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `entityName` | text | ✅ | Şirket/Kişi adı |
| `entityType` | select | ✅ | individual, corporate, partnership, llc |
| `taxId` | text | ❌ | Vergi numarası |
| `businessType` | text | ❌ | İş tipi (serbest alan) |
| `establishmentDate` | date | ❌ | Kuruluş tarihi |
| `country` | select | ✅ | Ülke (default: Turkey) |
| `currency` | select | ✅ | Para birimi (TRY, USD, EUR, GBP, QAR) |

**Toplam**: 7 alan (3 zorunlu)

---

## Step 2: Geographic & Location Information

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `facilityLatitude` | number | ✅ | Enlem (örn: 41.0082) |
| `facilityLongitude` | number | ✅ | Boylam (örn: 28.9784) |
| `facilityElevation` | number | ❌ | Rakım (metre) |
| `physicalAddress` | text | ✅ | Fiziksel adres |
| `city` | text | ✅ | Şehir |
| `district` | text | ❌ | İlçe |
| `postalCode` | text | ❌ | Posta kodu |
| `region` | select | ❌ | Bölge (Marmara, Ege, vb.) |
| `climateZone` | select | ❌ | İklim kuşağı (Mediterranean, Continental, vb.) |
| `landUseType` | select | ❌ | Arazi kullanım tipi (industrial, commercial, residential, mixed, agricultural) |
| `proximityToCoast` | number | ❌ | Sahile uzaklık (km) |
| `proximityToRiver` | number | ❌ | Nehire uzaklık (km) |
| `facilitySize` | number | ❌ | Tesis büyüklüğü (m²) |
| `buildingAge` | number | ❌ | Bina yaşı (yıl) |

**Toplam**: 14 alan (4 zorunlu)

**Özel Özellik**: 🌍 Auto-Calculate butonu - Koordinatlardan otomatik fiziksel risk hesaplama

---

## Step 3: Income Information

### Temel Gelir Alanları

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `monthlyIncome` | number | ❌ | Aylık gelir |
| `annualRevenue` | number | ❌ | Yıllık gelir |
| `operatingIncome` | number | ❌ | İşletme geliri |
| `investmentIncome` | number | ❌ | Yatırım geliri |
| `otherIncomes` | array | ❌ | Diğer gelirler (description, amount) |

### PCAF Financial Metrics (ECB/IFRS S2)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `ebitdaAmount` | number | ❌ | EBITDA |
| `exposureAtDefault` | number | ❌ | EAD - Kredi tutarı |
| `equityMarketValue` | number | ❌ | Öz sermaye piyasa değeri |
| `probabilityOfDefaultBase` | number (0-1) | ❌ | PD (default: 0.03) |
| `lossGivenDefaultBase` | number (0-1) | ❌ | LGD (default: 0.40) |
| `riskWeightBase` | number (0-1) | ❌ | Risk ağırlığı (default: 0.75) |
| `loanTenorYears` | number | ❌ | Kredi vadesi (yıl) |
| `collateralVulnerability` | number (0-1) | ❌ | Teminat kırılganlığı |
| `requiredTransitionCapex` | number | ❌ | Gerekli dönüşüm yatırımı |
| `complianceCostAnnual` | number | ❌ | Yıllık uyumluluk maliyeti |

**Toplam**: 15 alan + array

---

## Step 4: Expense Information

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `monthlyExpenses` | number | ❌ | Aylık giderler |
| `operatingExpenses` | number | ❌ | İşletme giderleri |
| `administrativeExpenses` | number | ❌ | İdari giderler |
| `marketingExpenses` | number | ❌ | Pazarlama giderleri |
| `financialExpenses` | number | ❌ | Finansal giderler |
| `otherExpenses` | array | ❌ | Diğer giderler |

**Toplam**: 6 alan + array

---

## Step 5: Assets Information

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `cashAndEquivalents` | number | ❌ | Nakit ve benzerleri |
| `bankDeposits` | number | ❌ | Banka mevduatları |
| `investments` | number | ❌ | Yatırımlar |
| `realEstate` | number | ❌ | Gayrimenkul |
| `equipment` | number | ❌ | Ekipman |
| `inventory` | number | ❌ | Envanter |
| `accountsReceivable` | number | ❌ | Alacaklar |
| `otherAssets` | array | ❌ | Diğer varlıklar |

**Toplam**: 8 alan + array

---

## Step 6: Liabilities Information

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `shortTermLoans` | number | ❌ | Kısa vadeli krediler |
| `longTermLoans` | number | ❌ | Uzun vadeli krediler |
| `accountsPayable` | number | ❌ | Borç hesapları |
| `taxLiabilities` | number | ❌ | Vergi borçları |
| `otherLiabilities` | array | ❌ | Diğer yükümlülükler |

**Toplam**: 5 alan + array

---

## Step 7: Investment Portfolio & Goals

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `stocks` | number | ❌ | Hisse senetleri |
| `bonds` | number | ❌ | Tahviller |
| `mutualFunds` | number | ❌ | Yatırım fonları |
| `cryptoCurrency` | number | ❌ | Kripto para |
| `commodities` | number | ❌ | Emtialar |
| `riskTolerance` | select | ❌ | Risk toleransı (low, moderate, high) |
| `investmentHorizon` | text | ❌ | Yatırım ufku |
| `shortTermGoals` | array | ❌ | Kısa vadeli hedefler |
| `longTermGoals` | array | ❌ | Uzun vadeli hedefler |
| `notes` | textarea | ❌ | Notlar |

**Toplam**: 10 alan + arrays

---

## Step 8: Credit Risk Information

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `creditScore` | number (300-900) | ❌ | Kredi skoru |
| `probabilityOfDefault` | number (%) | ❌ | Temerrüt olasılığı |
| `lossGivenDefault` | number (%) | ❌ | Temerrüt zararı |
| `loanMaturityYears` | number | ❌ | Kredi vadesi |
| `repaymentStatus` | select | ❌ | Geri ödeme durumu (current, late, default, restructured) |
| `collateralValue` | number | ❌ | Teminat değeri |
| `collateralType` | select | ❌ | Teminat tipi (real_estate, vehicle, equipment, inventory, securities, cash_deposit, guarantee, other) |
| `insuranceCoverage` | number | ❌ | Sigorta teminatı |
| `assetType` | select | ❌ | Varlık tipi (retail, commercial, industrial, agricultural, sme, corporate) |
| `guarantorInfo` | textarea | ❌ | Kefil bilgisi |

**Toplam**: 10 alan

---

## Step 9: Export, CBAM & Emissions

### Export & CBAM

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `exportValue` | number | ❌ | İhracat değeri |
| `exportPercentage` | number (%) | ❌ | İhracat yüzdesi |
| `euExports` | number | ❌ | AB ihracatı |
| `cbamCoverage` | select | ❌ | CBAM kapsamı (none, partial, full) |
| `cbamSectors` | array | ❌ | CBAM sektörleri |
| `hsCodes` | array | ❌ | HS kodları |
| `carbonContent` | number | ❌ | Karbon içeriği (tCO₂/ton) |
| `exportDestinations` | array | ❌ | İhracat destinasyonları |

### Scope 2 Emissions (ECB/IFRS S2)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `scope2LocationEmissions` | number | ❌ | Scope 2 Location-Based (tCO₂e) |
| `scope2MarketEmissions` | number | ❌ | Scope 2 Market-Based (tCO₂e) |
| `scope2Method` | select | ❌ | Metod (location-based, market-based) |

### Scope 3 Emissions - 15 Categories

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `cat1_purchasedGoods` | number | ❌ | Cat 1: Satın alınan mal/hizmet |
| `cat2_capitalGoods` | number | ❌ | Cat 2: Sermaye malları |
| `cat3_fuelEnergy` | number | ❌ | Cat 3: Yakıt ve enerji |
| `cat4_upstreamTransport` | number | ❌ | Cat 4: Upstream taşıma |
| `cat5_waste` | number | ❌ | Cat 5: Atık |
| `cat6_businessTravel` | number | ❌ | Cat 6: İş seyahati |
| `cat7_employeeCommute` | number | ❌ | Cat 7: Çalışan ulaşımı |
| `cat8_upstreamLeased` | number | ❌ | Cat 8: Upstream kiralamalar |
| `cat9_downstreamTransport` | number | ❌ | Cat 9: Downstream taşıma |
| `cat10_processing` | number | ❌ | Cat 10: Satılan ürün işleme |
| `cat11_useOfProducts` | number | ❌ | Cat 11: Ürün kullanımı |
| `cat12_endOfLife` | number | ❌ | Cat 12: Ömür sonu |
| `cat13_downstreamLeased` | number | ❌ | Cat 13: Downstream kiralamalar |
| `cat14_franchises` | number | ❌ | Cat 14: Franchise |
| `cat15_investments` | number | ❌ | Cat 15: Yatırımlar |

### CBAM Extended (ECB/IFRS S2)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `cbamEmbeddedEmissions` | number | ❌ | Gömülü emisyonlar (tCO₂e) |
| `cbamEUPrice` | number | ❌ | AB karbon fiyatı (€/tCO₂) - default 85 |
| `cbamOriginPrice` | number | ❌ | Menşei ülke karbon fiyatı - default 20 |
| `cbamExportVolumeUnits` | number | ❌ | AB'ye ihraç edilen birim sayısı |
| `cbamExportValue` | number | ❌ | AB'ye toplam ihracat değeri |

**Toplam**: ~33 alan + arrays

---

## Step 10: Physical Risk Assessment

### Physical Risk Probability (0-1 scale)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `physicalRiskProbability.heat` | number (0-1) | ❌ | Sıcak dalgası riski - default 0.5 |
| `physicalRiskProbability.drought` | number (0-1) | ❌ | Kuraklık riski - default 0.5 |
| `physicalRiskProbability.flood` | number (0-1) | ❌ | Sel riski - default 0.5 |
| `physicalRiskProbability.coastal` | number (0-1) | ❌ | Kıyı riski - default 0.5 |
| `physicalRiskProbability.precip` | number (0-1) | ❌ | Aşırı yağış riski - default 0.5 |

### Adaptive Capacity (0-1 scale)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `adaptiveCapacity.infrastructure` | number (0-1) | ❌ | Altyapı direnci - default 0.5 |
| `adaptiveCapacity.financial` | number (0-1) | ❌ | Finansal kapasite - default 0.5 |
| `adaptiveCapacity.governance` | number (0-1) | ❌ | Yönetişim kalitesi - default 0.5 |
| `adaptiveCapacity.technology` | number (0-1) | ❌ | Teknoloji hazırlığı - default 0.5 |

### Additional Physical Risk Fields

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `floodZoneExposure` | text | ❌ | Sel bölgesi maruziyeti |
| `historicalHazardIncidents` | array | ❌ | Geçmiş afet olayları |
| `physicalRiskAssessment` | text | ❌ | Fiziksel risk değerlendirmesi |
| `climateAdaptationMeasures` | text | ❌ | İklim adaptasyon önlemleri |
| `emergencyPreparedness` | text | ❌ | Acil durum hazırlığı |
| `businessContinuityPlan` | text | ❌ | İş sürekliliği planı |
| `floodZoneAssets` | text | ❌ | Sel bölgesindeki varlıklar |
| `waterStressAssets` | text | ❌ | Su stresi altındaki varlıklar |
| `assetsInHighRiskZones` | text | ❌ | Yüksek riskli bölgelerdeki varlıklar |

### Risk Tags/Amplifiers (0-1 scale)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `tagWaterDependency` | number (0-1) | ❌ | Su bağımlılığı seviyesi |
| `tagStrandingRisk` | number (0-1) | ❌ | Mahsur kalma riski |
| `tagCoastalVulnerability` | number (0-1) | ❌ | Kıyı kırılganlığı |
| `tagSupplyChainExposure` | number (0-1) | ❌ | Tedarik zinciri riski |

**Toplam**: ~22 alan + arrays

**Özel Not**: Bu alanlar Step 2'deki "Auto-Calculate" butonu ile otomatik doldurulabilir!

---

## Step 11: PACTA Sector Analysis

### Sector Selection

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `pactaSector` | select | ❌ | Sektör seçimi (Enerji, Otomotiv, Çelik, Çimento, Havacılık, Gayrimenkul) |

### PACTA - Energy Sector (Enerji)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `totalInstalledCapacityMW` | number | ❌ | Toplam kurulu kapasite (MW) |
| `coalCapacityMW` | number | ❌ | Kömür kapasitesi (MW) |
| `gasCapacityMW` | number | ❌ | Doğalgaz kapasitesi (MW) |
| `oilCapacityMW` | number | ❌ | Petrol kapasitesi (MW) |
| `windCapacityMW` | number | ❌ | Rüzgar kapasitesi (MW) |
| `solarCapacityMW` | number | ❌ | Güneş kapasitesi (MW) |
| `hydroCapacityMW` | number | ❌ | Hidro kapasitesi (MW) |
| `biomassCapacityMW` | number | ❌ | Biyokütle kapasitesi (MW) |
| `geothermalCapacityMW` | number | ❌ | Jeotermal kapasitesi (MW) |
| `nuclearCapacityMW` | number | ❌ | Nükleer kapasitesi (MW) |
| `annualProductionGWh` | number | ❌ | Yıllık üretim (GWh) |
| `coalProductionGWh` | number | ❌ | Kömür üretimi (GWh) |
| `gasProductionGWh` | number | ❌ | Gaz üretimi (GWh) |
| `renewableProductionGWh` | number | ❌ | Yenilenebilir üretim (GWh) |
| `plannedRetirements` | array | ❌ | Planlı kapanışlar {year, assetType, capacityMW} |
| `plannedAdditions` | array | ❌ | Planlı eklemeler {year, technology, capacityMW} |
| `renewableTarget2030` | number (%) | ❌ | 2030 yenilenebilir hedefi |
| `coalPhaseoutDate` | text | ❌ | Kömürden çıkış tarihi |

### PACTA - Automotive Sector (Otomotiv)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `annualTotalProduction` | number | ❌ | Yıllık toplam üretim (adet) |
| `iceProduction` | number | ❌ | ICE (benzin/dizel) üretimi |
| `hybridProduction` | number | ❌ | Hibrit üretimi |
| `bevProduction` | number | ❌ | BEV (elektrikli) üretimi |
| `phevProduction` | number | ❌ | PHEV (şarjlı hibrit) üretimi |
| `fcevProduction` | number | ❌ | FCEV (hidrojen) üretimi |
| `iceCapacity` | number | ❌ | ICE üretim kapasitesi |
| `evCapacity` | number | ❌ | EV üretim kapasitesi |
| `evProductionTarget2030` | number (%) | ❌ | 2030 EV üretim hedefi |
| `icePlantClosures` | array | ❌ | ICE tesis kapanışları {year, location, capacityUnits} |
| `evInvestmentPipeline` | number | ❌ | EV yatırım hattı |
| `batteryCapacityGWh` | number | ❌ | Batarya kapasitesi (GWh) |

### PACTA - Steel Sector (Çelik)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `annualSteelProduction` | number | ❌ | Yıllık çelik üretimi (milyon ton) |
| `bofProductionShare` | number (%) | ❌ | BOF (blast furnace) üretim payı |
| `eafProductionShare` | number (%) | ❌ | EAF (elektrik ark) üretim payı |
| `driProductionShare` | number (%) | ❌ | DRI (doğrudan indirgeme) payı |
| `hydrogenSteelShare` | number (%) | ❌ | Hidrojen çelik payı |
| `steelCarbonIntensity` | number | ❌ | Çelik karbon yoğunluğu (tCO₂/ton) |
| `lowCarbonSteelTarget2030` | number (%) | ❌ | 2030 düşük karbonlu çelik hedefi |
| `hydrogenInvestmentPipeline` | text | ❌ | Hidrojen yatırım hattı |
| `ccsImplementation` | select | ❌ | CCS durumu (none, planned, active) |

### PACTA - Cement Sector (Çimento)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `annualCementProduction` | number | ❌ | Yıllık çimento üretimi (milyon ton) |
| `clinkerRatio` | number (%) | ❌ | Klinker oranı |
| `alternativeFuelsShare` | number (%) | ❌ | Alternatif yakıt payı |
| `wasteHeatRecovery` | select | ❌ | Atık ısı geri kazanımı (yes, no) |
| `cementCarbonIntensity` | number | ❌ | Çimento karbon yoğunluğu (tCO₂/ton) |
| `clinkerSubstitutionTarget` | number (%) | ❌ | Klinker ikamesi hedefi |
| `ccsCementPlans` | select | ❌ | CCS planları (none, planned, active) |

### PACTA - Aviation Sector (Havacılık)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `annualPassengerKm` | number | ❌ | Yıllık yolcu-km (milyar) |
| `annualFreightTonKm` | number | ❌ | Yıllık yük ton-km (milyon) |
| `fleetSize` | number | ❌ | Filo büyüklüğü |
| `averageFleetAge` | number | ❌ | Ortalama filo yaşı (yıl) |
| `safUsage` | number (%) | ❌ | SAF kullanım oranı |
| `safTarget2030` | number (%) | ❌ | 2030 SAF hedefi |
| `efficientAircraftOrders` | text | ❌ | Verimli uçak siparişleri |
| `offsetProgramActive` | select | ❌ | Ofset programı (yes, no) |

### PACTA - Real Estate Sector (Gayrimenkul)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `totalBuildingArea` | number | ❌ | Toplam bina alanı (m²) |
| `residentialArea` | number | ❌ | Konut alanı (m²) |
| `commercialArea` | number | ❌ | Ticari alan (m²) |
| `averageBuildingAge` | number | ❌ | Ortalama bina yaşı (yıl) |
| `energyEfficiencyRating` | select | ❌ | Enerji verimliliği sınıfı (A-G) |
| `renewableHeatingShare` | number (%) | ❌ | Yenilenebilir ısıtma payı |
| `buildingEmissionsIntensity` | number | ❌ | Bina emisyon yoğunluğu (kgCO₂/m²/yıl) |
| `retrofitPlanActive` | select | ❌ | Yenileme planı (yes, no) |
| `greenBuildingCertifications` | text | ❌ | Yeşil bina sertifikaları (LEED, BREEAM, vb.) |

**Toplam**: ~70+ alan (sektöre göre)

---

## Step 12: TCFD & ESG

### TCFD - Governance (Yönetişim)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `hasClimateExpertOnBoard` | select | ❌ | Yönetimde iklim uzmanı (yes, no) |
| `boardClimateDiscussionFrequency` | select | ❌ | İklim görüşme sıklığı (quarterly, biannually, annually) |
| `hasClimateRiskCommittee` | select | ❌ | İklim risk komitesi (yes, no) |
| `hasChiefSustainabilityOfficer` | select | ❌ | CSO var mı (yes, no) |
| `climateRiskInERM` | select | ❌ | ERM'de iklim riski (yes, no, partial) |
| `climateKPIsInExecutiveComp` | select | ❌ | Yönetici ücretinde iklim KPI'ları (yes, no) |
| `hasClimatePolicy` | select | ❌ | İklim politikası (yes, no) |
| `climateGovernanceNotes` | textarea | ❌ | Yönetişim notları |

### TCFD - Strategy (Strateji)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `climateRiskTimeHorizons.short` | number | ❌ | Kısa vade (yıl) |
| `climateRiskTimeHorizons.medium` | number | ❌ | Orta vade (yıl) |
| `climateRiskTimeHorizons.long` | number | ❌ | Uzun vade (yıl) |
| `materialClimateRisks` | array | ❌ | Önemli iklim riskleri {riskType, impact, timeHorizon} |
| `materialClimateOpportunities` | array | ❌ | İklim fırsatları {opportunityType, potential, timeHorizon} |
| `scenariosUsed` | array | ❌ | Kullanılan senaryolar (orderly_1.5C, disorderly_2C, hothouse_3C) |
| `strategyResilienceAssessment` | textarea | ❌ | Strateji direnç değerlendirmesi |

### TCFD - Risk Management

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `climateRiskIdentificationProcess` | textarea | ❌ | Risk tanımlama süreci |
| `riskAssessmentFrequency` | select | ❌ | Değerlendirme sıklığı (monthly, quarterly, annually) |
| `materialityThreshold` | number | ❌ | Önemlilik eşiği (finansal) |
| `climateRiskAppetiteStatement` | textarea | ❌ | Risk iştahı beyanı |
| `integrationWithERM` | select | ❌ | ERM entegrasyonu (yes, no, partial) |
| `riskManagementNotes` | textarea | ❌ | Risk yönetimi notları |

### TCFD - Metrics & Targets

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `scope1Emissions` | number | ❌ | Scope 1 emisyonları (tCO₂e) |
| `scope3Emissions` | number | ❌ | Scope 3 emisyonları (tCO₂e) |
| `emissionsBaseYear` | number | ❌ | Baz yıl |
| `emissionsBaseline` | number | ❌ | Baz yıl emisyonu |
| `hasNetZeroCommitment` | select | ❌ | Net sıfır taahhüdü (yes, no) |
| `netZeroYear` | number | ❌ | Net sıfır hedef yılı |
| `interimTargets` | array | ❌ | Ara hedefler {year, targetPercentage, scope} |
| `sbtiValidated` | select | ❌ | SBTi onaylı (yes, no, in-progress) |
| `emissionReductionTarget` | number (%) | ❌ | Emisyon azaltma hedefi |
| `emissionTargetYear` | number | ❌ | Hedef yılı |
| `highCarbonSectorRevenue` | number | ❌ | Yüksek karbonlu sektör geliri |
| `fossilRevenueShare` | number (%) | ❌ | Fosil yakıt gelir payı |
| `greenRevenue` | number | ❌ | Yeşil gelir |
| `taxonomyAlignedRevenue` | number (%) | ❌ | Taksonomi uyumlu gelir payı |
| `renewableEnergyShare` | number (%) | ❌ | Yenilenebilir enerji payı |
| `renewableCapex` | number | ❌ | Yenilenebilir CapEx |
| `greenFinancingAmount` | number | ❌ | Yeşil finansman tutarı |

### Governance Scoring (ECB Calculator - 0-1 scale)

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `governanceBoardOversight` | number (0-1) | ❌ | Yönetim kurulu gözetimi - default 0.5 |
| `governanceManagementRole` | number (0-1) | ❌ | Yönetim rolü - default 0.5 |
| `governanceIncentives` | number (0-1) | ❌ | Teşvikler - default 0.5 |
| `governanceRnDScore` | number (0-1) | ❌ | Ar-Ge/İnovasyon kapasitesi - default 0.5 |

### ESG & Certifications

| Alan Adı | Tip | Gerekli | Açıklama |
|----------|-----|---------|----------|
| `isoCertifications` | array | ❌ | ISO sertifikaları |
| `eiaReports` | text | ❌ | ÇED raporları |
| `environmentalActionPlans` | text | ❌ | Çevresel eylem planları |
| `energyAudit` | text | ❌ | Enerji denetimi |
| `carbonFootprintCalculated` | boolean | ❌ | Karbon ayak izi hesaplandı mı |
| `renewableEnergyTargets` | text | ❌ | Yenilenebilir enerji hedefleri |
| `waterManagement` | text | ❌ | Su yönetimi |
| `wasteManagement` | text | ❌ | Atık yönetimi |
| `biodiversityImpact` | text | ❌ | Biyoçeşitlilik etkisi |
| `stakeholderEngagement` | text | ❌ | Paydaş katılımı |
| `productCertifications` | array | ❌ | Ürün sertifikaları |
| `financialAdvisor` | text | ❌ | Finansal danışman |
| `bankingRelationships` | array | ❌ | Bankacılık ilişkileri |
| `insurancePolicies` | array | ❌ | Sigorta poliçeleri |

**Toplam**: ~50+ alan

---

# 📊 ÖZET: Toplam Veri Alanları

| Step | Alan Sayısı | Zorunlu | Açıklama |
|------|-------------|---------|----------|
| Step 1 | 7 | 3 | Company/Personal Info |
| Step 2 | 14 | 4 | Geographic & Location |
| Step 3 | 15+ | 0 | Income & PCAF Metrics |
| Step 4 | 6+ | 0 | Expenses |
| Step 5 | 8+ | 0 | Assets |
| Step 6 | 5+ | 0 | Liabilities |
| Step 7 | 10+ | 0 | Investment & Goals |
| Step 8 | 10 | 0 | Credit Risk |
| Step 9 | 33+ | 0 | Export, CBAM, Scope 2/3 |
| Step 10 | 22+ | 0 | Physical Risk |
| Step 11 | 70+ | 0 | PACTA (Sector-specific) |
| Step 12 | 50+ | 0 | TCFD & ESG |

**TOPLAM**: **~250+ VERİ ALANI**

**Zorunlu Alanlar**: Sadece 7 alan (entityName, entityType, currency, latitude, longitude, physicalAddress, city)

---

# 🎯 Assessment Çıktıları (Hesaplamalar)

Bu form gönderildiğinde **3 farklı risk hesaplaması** yapılır:

## 1. Financial Analysis
- Asset/Liability ratios
- Liquidity metrics
- Debt-to-income
- Investment portfolio analysis

## 2. PACTA Analysis (Sector-Based)
- Paris Agreement alignment
- Technology mix analysis
- Transition pathway
- 2030/2050 projections

## 3. TCFD Risk Assessment
- Governance score
- Strategy resilience
- Physical risk score
- Transition risk score
- Overall TCFD compliance

## 4. ECB/IFRS S2 Comprehensive
- Climate-adjusted credit risk
- Expected Loss (EL) calculation
- Risk Weight adjustments
- Financed emissions (PCAF)
- CBAM cost impact
- Physical risk exposure

---

# 📋 Alan Tipleri Özeti

| Tip | Örnek | Validasyon |
|-----|-------|------------|
| `text` | "ABC Company" | String |
| `number` | 1000000 | Numeric |
| `date` | 2020-01-15 | YYYY-MM-DD |
| `select` | "corporate" | Enum |
| `textarea` | Uzun metin | String (multi-line) |
| `array` | [{...}, {...}] | JSON array |
| `boolean` | true/false | Boolean |
| `number (0-1)` | 0.75 | Float 0-1 |
| `number (%)` | 25 | Integer 0-100 |
| `currency` | 1000000.50 | Float with 2 decimals |

---

**📌 Not**: Bu liste `FinancialDataForm.js` dosyasından çıkarılmıştır. Forma yeni alanlar eklendiğinde bu döküman güncellenmelidir.

**Son Güncelleme**: 2025-01-10
