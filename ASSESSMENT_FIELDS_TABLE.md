# 📊 Climate Platform - Assessment Veri Alanları Tablosu

**Toplam**: ~250+ veri alanı | **Zorunlu**: 7 alan | **Form**: FinancialDataForm (12 Step)

---

## 📋 Tüm Veri Alanları

| Form/Assessment | Step No | Alan Adı | Tip | Gereklilik | Açıklama |
|----------------|---------|----------|-----|------------|----------|
| FinancialDataForm | 1 | entityName | text | Zorunlu | Şirket/Kişi adı |
| FinancialDataForm | 1 | entityType | select | Zorunlu | Kurum tipi: individual, corporate, partnership, llc |
| FinancialDataForm | 1 | taxId | text | Opsiyonel | Vergi kimlik numarası |
| FinancialDataForm | 1 | businessType | text | Opsiyonel | İş/Sektör tipi |
| FinancialDataForm | 1 | establishmentDate | date | Opsiyonel | Kuruluş tarihi (YYYY-MM-DD) |
| FinancialDataForm | 1 | country | select | Zorunlu | Ülke (default: Turkey) |
| FinancialDataForm | 1 | currency | select | Zorunlu | Para birimi: TRY, USD, EUR, GBP, QAR |
| FinancialDataForm | 2 | facilityLatitude | number | Zorunlu | Enlem koordinatı (örn: 41.0082) |
| FinancialDataForm | 2 | facilityLongitude | number | Zorunlu | Boylam koordinatı (örn: 28.9784) |
| FinancialDataForm | 2 | facilityElevation | number | Opsiyonel | Rakım (metre) |
| FinancialDataForm | 2 | physicalAddress | text | Zorunlu | Fiziksel adres |
| FinancialDataForm | 2 | city | text | Zorunlu | Şehir |
| FinancialDataForm | 2 | district | text | Opsiyonel | İlçe |
| FinancialDataForm | 2 | postalCode | text | Opsiyonel | Posta kodu |
| FinancialDataForm | 2 | region | select | Opsiyonel | Bölge: Marmara, Ege, Akdeniz, İç Anadolu, Karadeniz, Doğu Anadolu, Güneydoğu Anadolu |
| FinancialDataForm | 2 | climateZone | select | Opsiyonel | İklim kuşağı: Mediterranean, Continental, Oceanic, Semi-Arid, Humid Subtropical |
| FinancialDataForm | 2 | landUseType | select | Opsiyonel | Arazi kullanımı: industrial, commercial, residential, mixed, agricultural |
| FinancialDataForm | 2 | proximityToCoast | number | Opsiyonel | Sahile uzaklık (km) |
| FinancialDataForm | 2 | proximityToRiver | number | Opsiyonel | Nehire uzaklık (km) |
| FinancialDataForm | 2 | facilitySize | number | Opsiyonel | Tesis büyüklüğü (m²) |
| FinancialDataForm | 2 | buildingAge | number | Opsiyonel | Bina yaşı (yıl) |
| FinancialDataForm | 3 | monthlyIncome | number | Opsiyonel | Aylık gelir (seçilen para biriminde) |
| FinancialDataForm | 3 | annualRevenue | number | Opsiyonel | Yıllık gelir |
| FinancialDataForm | 3 | operatingIncome | number | Opsiyonel | İşletme geliri (EBIT) |
| FinancialDataForm | 3 | investmentIncome | number | Opsiyonel | Yatırım geliri |
| FinancialDataForm | 3 | otherIncomes | array | Opsiyonel | Diğer gelirler [{description, amount}] |
| FinancialDataForm | 3 | ebitdaAmount | number | Opsiyonel | EBITDA (Earnings Before Interest, Taxes, Depreciation, Amortization) |
| FinancialDataForm | 3 | exposureAtDefault | number | Opsiyonel | EAD - Kredi tutarı (Exposure at Default) |
| FinancialDataForm | 3 | equityMarketValue | number | Opsiyonel | Öz sermaye piyasa değeri |
| FinancialDataForm | 3 | probabilityOfDefaultBase | number (0-1) | Opsiyonel | PD - Temerrüt olasılığı (default: 0.03) |
| FinancialDataForm | 3 | lossGivenDefaultBase | number (0-1) | Opsiyonel | LGD - Temerrüt zararı oranı (default: 0.40) |
| FinancialDataForm | 3 | riskWeightBase | number (0-1) | Opsiyonel | Risk ağırlığı (default: 0.75) |
| FinancialDataForm | 3 | loanTenorYears | number | Opsiyonel | Kredi vadesi (yıl) |
| FinancialDataForm | 3 | collateralVulnerability | number (0-1) | Opsiyonel | Teminat kırılganlığı (iklim riskine maruz kalma) |
| FinancialDataForm | 3 | requiredTransitionCapex | number | Opsiyonel | Gerekli dönüşüm yatırımı (yeşil geçiş için) |
| FinancialDataForm | 3 | complianceCostAnnual | number | Opsiyonel | Yıllık uyumluluk maliyeti (regülasyonlar için) |
| FinancialDataForm | 4 | monthlyExpenses | number | Opsiyonel | Aylık giderler |
| FinancialDataForm | 4 | operatingExpenses | number | Opsiyonel | İşletme giderleri |
| FinancialDataForm | 4 | administrativeExpenses | number | Opsiyonel | İdari giderler |
| FinancialDataForm | 4 | marketingExpenses | number | Opsiyonel | Pazarlama giderleri |
| FinancialDataForm | 4 | financialExpenses | number | Opsiyonel | Finansal giderler (faiz vb.) |
| FinancialDataForm | 4 | otherExpenses | array | Opsiyonel | Diğer giderler [{description, amount}] |
| FinancialDataForm | 5 | cashAndEquivalents | number | Opsiyonel | Nakit ve nakit benzerleri |
| FinancialDataForm | 5 | bankDeposits | number | Opsiyonel | Banka mevduatları |
| FinancialDataForm | 5 | investments | number | Opsiyonel | Yatırımlar |
| FinancialDataForm | 5 | realEstate | number | Opsiyonel | Gayrimenkul varlıkları |
| FinancialDataForm | 5 | equipment | number | Opsiyonel | Ekipman ve makine |
| FinancialDataForm | 5 | inventory | number | Opsiyonel | Envanter/Stok |
| FinancialDataForm | 5 | accountsReceivable | number | Opsiyonel | Alacak hesapları |
| FinancialDataForm | 5 | otherAssets | array | Opsiyonel | Diğer varlıklar [{description, value}] |
| FinancialDataForm | 6 | shortTermLoans | number | Opsiyonel | Kısa vadeli krediler (1 yıl içi) |
| FinancialDataForm | 6 | longTermLoans | number | Opsiyonel | Uzun vadeli krediler (1 yıl üzeri) |
| FinancialDataForm | 6 | accountsPayable | number | Opsiyonel | Borç hesapları |
| FinancialDataForm | 6 | taxLiabilities | number | Opsiyonel | Vergi borçları |
| FinancialDataForm | 6 | otherLiabilities | array | Opsiyonel | Diğer yükümlülükler [{description, amount}] |
| FinancialDataForm | 7 | stocks | number | Opsiyonel | Hisse senedi yatırımları |
| FinancialDataForm | 7 | bonds | number | Opsiyonel | Tahvil yatırımları |
| FinancialDataForm | 7 | mutualFunds | number | Opsiyonel | Yatırım fonu payları |
| FinancialDataForm | 7 | cryptoCurrency | number | Opsiyonel | Kripto para varlıkları |
| FinancialDataForm | 7 | commodities | number | Opsiyonel | Emtia yatırımları |
| FinancialDataForm | 7 | riskTolerance | select | Opsiyonel | Risk toleransı: low, moderate, high |
| FinancialDataForm | 7 | investmentHorizon | text | Opsiyonel | Yatırım ufku/zaman hedefi |
| FinancialDataForm | 7 | shortTermGoals | array | Opsiyonel | Kısa vadeli hedefler [{goal, targetYear, amount}] |
| FinancialDataForm | 7 | longTermGoals | array | Opsiyonel | Uzun vadeli hedefler [{goal, targetYear, amount}] |
| FinancialDataForm | 7 | notes | textarea | Opsiyonel | Ek notlar |
| FinancialDataForm | 8 | creditScore | number | Opsiyonel | Kredi skoru (300-900 arası) |
| FinancialDataForm | 8 | probabilityOfDefault | number (%) | Opsiyonel | Temerrüt olasılığı yüzdesi (0-100) |
| FinancialDataForm | 8 | lossGivenDefault | number (%) | Opsiyonel | Temerrüt durumunda zarar yüzdesi (0-100) |
| FinancialDataForm | 8 | loanMaturityYears | number | Opsiyonel | Kredi vadesi (1-50 yıl) |
| FinancialDataForm | 8 | repaymentStatus | select | Opsiyonel | Geri ödeme durumu: current, late, default, restructured |
| FinancialDataForm | 8 | collateralValue | number | Opsiyonel | Teminat değeri |
| FinancialDataForm | 8 | collateralType | select | Opsiyonel | Teminat tipi: real_estate, vehicle, equipment, inventory, securities, cash_deposit, guarantee, other |
| FinancialDataForm | 8 | insuranceCoverage | number | Opsiyonel | Sigorta teminat tutarı |
| FinancialDataForm | 8 | assetType | select | Opsiyonel | Varlık tipi: retail, commercial, industrial, agricultural, sme, corporate |
| FinancialDataForm | 8 | guarantorInfo | textarea | Opsiyonel | Kefil/Garantör bilgileri |
| FinancialDataForm | 9 | exportValue | number | Opsiyonel | Toplam ihracat değeri |
| FinancialDataForm | 9 | exportPercentage | number (%) | Opsiyonel | İhracatın toplam satışlardaki payı (0-100) |
| FinancialDataForm | 9 | euExports | number | Opsiyonel | AB'ye yapılan ihracat değeri |
| FinancialDataForm | 9 | cbamCoverage | select | Opsiyonel | CBAM kapsamı: none, partial, full |
| FinancialDataForm | 9 | cbamSectors | array | Opsiyonel | CBAM sektörleri (çimento, demir-çelik, alüminyum, gübre, elektrik, hidrojen) |
| FinancialDataForm | 9 | hsCodes | array | Opsiyonel | HS (Harmonized System) kodları |
| FinancialDataForm | 9 | carbonContent | number | Opsiyonel | Ürün karbon içeriği (tCO₂/ton) |
| FinancialDataForm | 9 | exportDestinations | array | Opsiyonel | İhracat destinasyonları [{country, value}] |
| FinancialDataForm | 9 | scope2LocationEmissions | number | Opsiyonel | Scope 2 Location-Based emisyonlar (tCO₂e) |
| FinancialDataForm | 9 | scope2MarketEmissions | number | Opsiyonel | Scope 2 Market-Based emisyonlar (tCO₂e) |
| FinancialDataForm | 9 | scope2Method | select | Opsiyonel | Hesaplama metodu: location-based, market-based |
| FinancialDataForm | 9 | cat1_purchasedGoods | number | Opsiyonel | Scope 3 Cat 1: Satın alınan mal/hizmet (tCO₂e) |
| FinancialDataForm | 9 | cat2_capitalGoods | number | Opsiyonel | Scope 3 Cat 2: Sermaye malları (tCO₂e) |
| FinancialDataForm | 9 | cat3_fuelEnergy | number | Opsiyonel | Scope 3 Cat 3: Yakıt ve enerji ilişkili (tCO₂e) |
| FinancialDataForm | 9 | cat4_upstreamTransport | number | Opsiyonel | Scope 3 Cat 4: Upstream taşıma (tCO₂e) |
| FinancialDataForm | 9 | cat5_waste | number | Opsiyonel | Scope 3 Cat 5: Atık (tCO₂e) |
| FinancialDataForm | 9 | cat6_businessTravel | number | Opsiyonel | Scope 3 Cat 6: İş seyahati (tCO₂e) |
| FinancialDataForm | 9 | cat7_employeeCommute | number | Opsiyonel | Scope 3 Cat 7: Çalışan ulaşımı (tCO₂e) |
| FinancialDataForm | 9 | cat8_upstreamLeased | number | Opsiyonel | Scope 3 Cat 8: Upstream kiralamalar (tCO₂e) |
| FinancialDataForm | 9 | cat9_downstreamTransport | number | Opsiyonel | Scope 3 Cat 9: Downstream taşıma (tCO₂e) |
| FinancialDataForm | 9 | cat10_processing | number | Opsiyonel | Scope 3 Cat 10: Satılan ürün işleme (tCO₂e) |
| FinancialDataForm | 9 | cat11_useOfProducts | number | Opsiyonel | Scope 3 Cat 11: Ürün kullanımı (tCO₂e) |
| FinancialDataForm | 9 | cat12_endOfLife | number | Opsiyonel | Scope 3 Cat 12: Ürün ömür sonu (tCO₂e) |
| FinancialDataForm | 9 | cat13_downstreamLeased | number | Opsiyonel | Scope 3 Cat 13: Downstream kiralamalar (tCO₂e) |
| FinancialDataForm | 9 | cat14_franchises | number | Opsiyonel | Scope 3 Cat 14: Franchise (tCO₂e) |
| FinancialDataForm | 9 | cat15_investments | number | Opsiyonel | Scope 3 Cat 15: Yatırımlar (tCO₂e) |
| FinancialDataForm | 9 | cbamEmbeddedEmissions | number | Opsiyonel | CBAM gömülü emisyonlar (tCO₂e) |
| FinancialDataForm | 9 | cbamEUPrice | number | Opsiyonel | AB karbon fiyatı (€/tCO₂) - default: 85 |
| FinancialDataForm | 9 | cbamOriginPrice | number | Opsiyonel | Menşei ülke karbon fiyatı (€/tCO₂) - default: 20 |
| FinancialDataForm | 9 | cbamExportVolumeUnits | number | Opsiyonel | AB'ye ihraç edilen birim sayısı |
| FinancialDataForm | 9 | cbamExportValue | number | Opsiyonel | AB'ye toplam ihracat değeri |
| FinancialDataForm | 10 | physicalRiskProbability.heat | number (0-1) | Opsiyonel | Sıcak dalgası riski olasılığı (default: 0.5) |
| FinancialDataForm | 10 | physicalRiskProbability.drought | number (0-1) | Opsiyonel | Kuraklık riski olasılığı (default: 0.5) |
| FinancialDataForm | 10 | physicalRiskProbability.flood | number (0-1) | Opsiyonel | Sel/Taşkın riski olasılığı (default: 0.5) |
| FinancialDataForm | 10 | physicalRiskProbability.coastal | number (0-1) | Opsiyonel | Kıyı riski olasılığı (default: 0.5) |
| FinancialDataForm | 10 | physicalRiskProbability.precip | number (0-1) | Opsiyonel | Aşırı yağış riski olasılığı (default: 0.5) |
| FinancialDataForm | 10 | adaptiveCapacity.infrastructure | number (0-1) | Opsiyonel | Altyapı direnci skoru (default: 0.5) |
| FinancialDataForm | 10 | adaptiveCapacity.financial | number (0-1) | Opsiyonel | Finansal adaptasyon kapasitesi (default: 0.5) |
| FinancialDataForm | 10 | adaptiveCapacity.governance | number (0-1) | Opsiyonel | Yönetişim kalitesi skoru (default: 0.5) |
| FinancialDataForm | 10 | adaptiveCapacity.technology | number (0-1) | Opsiyonel | Teknoloji hazırlığı skoru (default: 0.5) |
| FinancialDataForm | 10 | floodZoneExposure | text | Opsiyonel | Sel bölgesi maruziyeti açıklaması |
| FinancialDataForm | 10 | historicalHazardIncidents | array | Opsiyonel | Geçmiş afet olayları [{date, type, impact}] |
| FinancialDataForm | 10 | physicalRiskAssessment | text | Opsiyonel | Fiziksel risk değerlendirme özeti |
| FinancialDataForm | 10 | climateAdaptationMeasures | text | Opsiyonel | Alınan iklim adaptasyon önlemleri |
| FinancialDataForm | 10 | emergencyPreparedness | text | Opsiyonel | Acil durum hazırlık planı |
| FinancialDataForm | 10 | businessContinuityPlan | text | Opsiyonel | İş sürekliliği planı |
| FinancialDataForm | 10 | floodZoneAssets | text | Opsiyonel | Sel bölgesindeki varlık detayları |
| FinancialDataForm | 10 | waterStressAssets | text | Opsiyonel | Su stresi altındaki varlıklar |
| FinancialDataForm | 10 | assetsInHighRiskZones | text | Opsiyonel | Yüksek riskli bölgelerdeki varlıklar |
| FinancialDataForm | 10 | tagWaterDependency | number (0-1) | Opsiyonel | Su bağımlılığı seviyesi |
| FinancialDataForm | 10 | tagStrandingRisk | number (0-1) | Opsiyonel | Mahsur kalma/Stranded asset riski |
| FinancialDataForm | 10 | tagCoastalVulnerability | number (0-1) | Opsiyonel | Kıyı kırılganlığı |
| FinancialDataForm | 10 | tagSupplyChainExposure | number (0-1) | Opsiyonel | Tedarik zinciri fiziksel risk maruziyeti |
| FinancialDataForm | 11 | pactaSector | select | Opsiyonel | PACTA Sektör: Enerji, Otomotiv, Çelik, Çimento, Havacılık, Gayrimenkul |
| FinancialDataForm | 11 | totalInstalledCapacityMW | number | Opsiyonel | [ENERJİ] Toplam kurulu kapasite (MW) |
| FinancialDataForm | 11 | coalCapacityMW | number | Opsiyonel | [ENERJİ] Kömür kapasitesi (MW) |
| FinancialDataForm | 11 | gasCapacityMW | number | Opsiyonel | [ENERJİ] Doğalgaz kapasitesi (MW) |
| FinancialDataForm | 11 | oilCapacityMW | number | Opsiyonel | [ENERJİ] Petrol kapasitesi (MW) |
| FinancialDataForm | 11 | windCapacityMW | number | Opsiyonel | [ENERJİ] Rüzgar enerjisi kapasitesi (MW) |
| FinancialDataForm | 11 | solarCapacityMW | number | Opsiyonel | [ENERJİ] Güneş enerjisi kapasitesi (MW) |
| FinancialDataForm | 11 | hydroCapacityMW | number | Opsiyonel | [ENERJİ] Hidroelektrik kapasitesi (MW) |
| FinancialDataForm | 11 | biomassCapacityMW | number | Opsiyonel | [ENERJİ] Biyokütle kapasitesi (MW) |
| FinancialDataForm | 11 | geothermalCapacityMW | number | Opsiyonel | [ENERJİ] Jeotermal kapasitesi (MW) |
| FinancialDataForm | 11 | nuclearCapacityMW | number | Opsiyonel | [ENERJİ] Nükleer kapasitesi (MW) |
| FinancialDataForm | 11 | annualProductionGWh | number | Opsiyonel | [ENERJİ] Yıllık enerji üretimi (GWh) |
| FinancialDataForm | 11 | coalProductionGWh | number | Opsiyonel | [ENERJİ] Kömürden üretim (GWh) |
| FinancialDataForm | 11 | gasProductionGWh | number | Opsiyonel | [ENERJİ] Gazdan üretim (GWh) |
| FinancialDataForm | 11 | renewableProductionGWh | number | Opsiyonel | [ENERJİ] Yenilenebilirden üretim (GWh) |
| FinancialDataForm | 11 | plannedRetirements | array | Opsiyonel | [ENERJİ] Planlı kapanışlar [{year, assetType, capacityMW}] |
| FinancialDataForm | 11 | plannedAdditions | array | Opsiyonel | [ENERJİ] Planlı yeni kapasiteler [{year, technology, capacityMW}] |
| FinancialDataForm | 11 | renewableTarget2030 | number (%) | Opsiyonel | [ENERJİ] 2030 yenilenebilir hedefi (%) |
| FinancialDataForm | 11 | coalPhaseoutDate | text | Opsiyonel | [ENERJİ] Kömürden çıkış tarihi |
| FinancialDataForm | 11 | annualTotalProduction | number | Opsiyonel | [OTOMOTİV] Yıllık toplam üretim (adet) |
| FinancialDataForm | 11 | iceProduction | number | Opsiyonel | [OTOMOTİV] ICE (benzin/dizel) üretim (adet) |
| FinancialDataForm | 11 | hybridProduction | number | Opsiyonel | [OTOMOTİV] Hibrit araç üretim (adet) |
| FinancialDataForm | 11 | bevProduction | number | Opsiyonel | [OTOMOTİV] BEV elektrikli araç üretim (adet) |
| FinancialDataForm | 11 | phevProduction | number | Opsiyonel | [OTOMOTİV] PHEV şarjlı hibrit üretim (adet) |
| FinancialDataForm | 11 | fcevProduction | number | Opsiyonel | [OTOMOTİV] FCEV hidrojen araç üretim (adet) |
| FinancialDataForm | 11 | iceCapacity | number | Opsiyonel | [OTOMOTİV] ICE üretim kapasitesi (adet/yıl) |
| FinancialDataForm | 11 | evCapacity | number | Opsiyonel | [OTOMOTİV] EV üretim kapasitesi (adet/yıl) |
| FinancialDataForm | 11 | evProductionTarget2030 | number (%) | Opsiyonel | [OTOMOTİV] 2030 EV üretim hedefi (%) |
| FinancialDataForm | 11 | icePlantClosures | array | Opsiyonel | [OTOMOTİV] ICE tesis kapanışları [{year, location, capacityUnits}] |
| FinancialDataForm | 11 | evInvestmentPipeline | number | Opsiyonel | [OTOMOTİV] EV yatırım hattı tutarı |
| FinancialDataForm | 11 | batteryCapacityGWh | number | Opsiyonel | [OTOMOTİV] Batarya üretim kapasitesi (GWh) |
| FinancialDataForm | 11 | annualSteelProduction | number | Opsiyonel | [ÇELİK] Yıllık çelik üretimi (milyon ton) |
| FinancialDataForm | 11 | bofProductionShare | number (%) | Opsiyonel | [ÇELİK] BOF (blast furnace) üretim payı (%) |
| FinancialDataForm | 11 | eafProductionShare | number (%) | Opsiyonel | [ÇELİK] EAF (elektrik ark) üretim payı (%) |
| FinancialDataForm | 11 | driProductionShare | number (%) | Opsiyonel | [ÇELİK] DRI (doğrudan indirgeme) payı (%) |
| FinancialDataForm | 11 | hydrogenSteelShare | number (%) | Opsiyonel | [ÇELİK] Hidrojen çelik payı (%) |
| FinancialDataForm | 11 | steelCarbonIntensity | number | Opsiyonel | [ÇELİK] Karbon yoğunluğu (tCO₂/ton çelik) |
| FinancialDataForm | 11 | lowCarbonSteelTarget2030 | number (%) | Opsiyonel | [ÇELİK] 2030 düşük karbonlu çelik hedefi (%) |
| FinancialDataForm | 11 | hydrogenInvestmentPipeline | text | Opsiyonel | [ÇELİK] Hidrojen yatırım hattı açıklaması |
| FinancialDataForm | 11 | ccsImplementation | select | Opsiyonel | [ÇELİK] CCS durumu: none, planned, active |
| FinancialDataForm | 11 | annualCementProduction | number | Opsiyonel | [ÇİMENTO] Yıllık çimento üretimi (milyon ton) |
| FinancialDataForm | 11 | clinkerRatio | number (%) | Opsiyonel | [ÇİMENTO] Klinker oranı (%) |
| FinancialDataForm | 11 | alternativeFuelsShare | number (%) | Opsiyonel | [ÇİMENTO] Alternatif yakıt payı (%) |
| FinancialDataForm | 11 | wasteHeatRecovery | select | Opsiyonel | [ÇİMENTO] Atık ısı geri kazanımı: yes, no |
| FinancialDataForm | 11 | cementCarbonIntensity | number | Opsiyonel | [ÇİMENTO] Karbon yoğunluğu (tCO₂/ton çimento) |
| FinancialDataForm | 11 | clinkerSubstitutionTarget | number (%) | Opsiyonel | [ÇİMENTO] Klinker ikame hedefi (%) |
| FinancialDataForm | 11 | ccsCementPlans | select | Opsiyonel | [ÇİMENTO] CCS planları: none, planned, active |
| FinancialDataForm | 11 | annualPassengerKm | number | Opsiyonel | [HAVACILIK] Yıllık yolcu-km (milyar) |
| FinancialDataForm | 11 | annualFreightTonKm | number | Opsiyonel | [HAVACILIK] Yıllık yük ton-km (milyon) |
| FinancialDataForm | 11 | fleetSize | number | Opsiyonel | [HAVACILIK] Filo büyüklüğü (uçak sayısı) |
| FinancialDataForm | 11 | averageFleetAge | number | Opsiyonel | [HAVACILIK] Ortalama filo yaşı (yıl) |
| FinancialDataForm | 11 | safUsage | number (%) | Opsiyonel | [HAVACILIK] SAF (Sürdürülebilir havacılık yakıtı) kullanım oranı (%) |
| FinancialDataForm | 11 | safTarget2030 | number (%) | Opsiyonel | [HAVACILIK] 2030 SAF hedefi (%) |
| FinancialDataForm | 11 | efficientAircraftOrders | text | Opsiyonel | [HAVACILIK] Verimli uçak siparişleri |
| FinancialDataForm | 11 | offsetProgramActive | select | Opsiyonel | [HAVACILIK] Karbon ofset programı: yes, no |
| FinancialDataForm | 11 | totalBuildingArea | number | Opsiyonel | [GAYRİMENKUL] Toplam bina alanı (m²) |
| FinancialDataForm | 11 | residentialArea | number | Opsiyonel | [GAYRİMENKUL] Konut alanı (m²) |
| FinancialDataForm | 11 | commercialArea | number | Opsiyonel | [GAYRİMENKUL] Ticari alan (m²) |
| FinancialDataForm | 11 | averageBuildingAge | number | Opsiyonel | [GAYRİMENKUL] Ortalama bina yaşı (yıl) |
| FinancialDataForm | 11 | energyEfficiencyRating | select | Opsiyonel | [GAYRİMENKUL] Enerji verimliliği: A, B, C, D, E, F, G |
| FinancialDataForm | 11 | renewableHeatingShare | number (%) | Opsiyonel | [GAYRİMENKUL] Yenilenebilir ısıtma payı (%) |
| FinancialDataForm | 11 | buildingEmissionsIntensity | number | Opsiyonel | [GAYRİMENKUL] Emisyon yoğunluğu (kgCO₂/m²/yıl) |
| FinancialDataForm | 11 | retrofitPlanActive | select | Opsiyonel | [GAYRİMENKUL] Yenileme planı: yes, no |
| FinancialDataForm | 11 | greenBuildingCertifications | text | Opsiyonel | [GAYRİMENKUL] Yeşil bina sertifikaları (LEED, BREEAM vb.) |
| FinancialDataForm | 12 | hasClimateExpertOnBoard | select | Opsiyonel | [TCFD-Governance] Yönetimde iklim uzmanı: yes, no |
| FinancialDataForm | 12 | boardClimateDiscussionFrequency | select | Opsiyonel | [TCFD-Governance] İklim görüşme sıklığı: quarterly, biannually, annually |
| FinancialDataForm | 12 | hasClimateRiskCommittee | select | Opsiyonel | [TCFD-Governance] İklim risk komitesi: yes, no |
| FinancialDataForm | 12 | hasChiefSustainabilityOfficer | select | Opsiyonel | [TCFD-Governance] CSO (Chief Sustainability Officer): yes, no |
| FinancialDataForm | 12 | climateRiskInERM | select | Opsiyonel | [TCFD-Governance] ERM'de iklim riski: yes, no, partial |
| FinancialDataForm | 12 | climateKPIsInExecutiveComp | select | Opsiyonel | [TCFD-Governance] Yönetici ücretinde iklim KPI: yes, no |
| FinancialDataForm | 12 | hasClimatePolicy | select | Opsiyonel | [TCFD-Governance] İklim politikası: yes, no |
| FinancialDataForm | 12 | climateGovernanceNotes | textarea | Opsiyonel | [TCFD-Governance] Yönetişim notları |
| FinancialDataForm | 12 | climateRiskTimeHorizons.short | number | Opsiyonel | [TCFD-Strategy] Kısa vade risk ufku (yıl) |
| FinancialDataForm | 12 | climateRiskTimeHorizons.medium | number | Opsiyonel | [TCFD-Strategy] Orta vade risk ufku (yıl) |
| FinancialDataForm | 12 | climateRiskTimeHorizons.long | number | Opsiyonel | [TCFD-Strategy] Uzun vade risk ufku (yıl) |
| FinancialDataForm | 12 | materialClimateRisks | array | Opsiyonel | [TCFD-Strategy] Önemli iklim riskleri [{riskType, impact, timeHorizon}] |
| FinancialDataForm | 12 | materialClimateOpportunities | array | Opsiyonel | [TCFD-Strategy] İklim fırsatları [{opportunityType, potential, timeHorizon}] |
| FinancialDataForm | 12 | scenariosUsed | array | Opsiyonel | [TCFD-Strategy] Senaryo analizi: orderly_1.5C, disorderly_2C, hothouse_3C |
| FinancialDataForm | 12 | strategyResilienceAssessment | textarea | Opsiyonel | [TCFD-Strategy] Strateji direnç değerlendirmesi |
| FinancialDataForm | 12 | climateRiskIdentificationProcess | textarea | Opsiyonel | [TCFD-Risk Mgmt] Risk tanımlama süreci |
| FinancialDataForm | 12 | riskAssessmentFrequency | select | Opsiyonel | [TCFD-Risk Mgmt] Risk değerlendirme sıklığı: monthly, quarterly, annually |
| FinancialDataForm | 12 | materialityThreshold | number | Opsiyonel | [TCFD-Risk Mgmt] Önemlilik eşiği (finansal etki) |
| FinancialDataForm | 12 | climateRiskAppetiteStatement | textarea | Opsiyonel | [TCFD-Risk Mgmt] Risk iştahı beyanı |
| FinancialDataForm | 12 | integrationWithERM | select | Opsiyonel | [TCFD-Risk Mgmt] ERM entegrasyonu: yes, no, partial |
| FinancialDataForm | 12 | riskManagementNotes | textarea | Opsiyonel | [TCFD-Risk Mgmt] Risk yönetimi notları |
| FinancialDataForm | 12 | scope1Emissions | number | Opsiyonel | [TCFD-Metrics] Scope 1 emisyonlar (tCO₂e) |
| FinancialDataForm | 12 | scope3Emissions | number | Opsiyonel | [TCFD-Metrics] Scope 3 emisyonlar (tCO₂e) |
| FinancialDataForm | 12 | emissionsBaseYear | number | Opsiyonel | [TCFD-Metrics] Emisyon baz yılı |
| FinancialDataForm | 12 | emissionsBaseline | number | Opsiyonel | [TCFD-Metrics] Baz yıl emisyon değeri (tCO₂e) |
| FinancialDataForm | 12 | hasNetZeroCommitment | select | Opsiyonel | [TCFD-Metrics] Net sıfır taahhüdü: yes, no |
| FinancialDataForm | 12 | netZeroYear | number | Opsiyonel | [TCFD-Metrics] Net sıfır hedef yılı (örn: 2050) |
| FinancialDataForm | 12 | interimTargets | array | Opsiyonel | [TCFD-Metrics] Ara hedefler [{year, targetPercentage, scope}] |
| FinancialDataForm | 12 | sbtiValidated | select | Opsiyonel | [TCFD-Metrics] SBTi onaylı: yes, no, in-progress |
| FinancialDataForm | 12 | emissionReductionTarget | number (%) | Opsiyonel | [TCFD-Metrics] Emisyon azaltma hedefi (%) |
| FinancialDataForm | 12 | emissionTargetYear | number | Opsiyonel | [TCFD-Metrics] Hedef yılı |
| FinancialDataForm | 12 | highCarbonSectorRevenue | number | Opsiyonel | [TCFD-Metrics] Yüksek karbonlu sektör geliri |
| FinancialDataForm | 12 | fossilRevenueShare | number (%) | Opsiyonel | [TCFD-Metrics] Fosil yakıt gelir payı (%) |
| FinancialDataForm | 12 | greenRevenue | number | Opsiyonel | [TCFD-Metrics] Yeşil gelir |
| FinancialDataForm | 12 | taxonomyAlignedRevenue | number (%) | Opsiyonel | [TCFD-Metrics] Taksonomi uyumlu gelir payı (%) |
| FinancialDataForm | 12 | renewableEnergyShare | number (%) | Opsiyonel | [TCFD-Metrics] Yenilenebilir enerji kullanım payı (%) |
| FinancialDataForm | 12 | renewableCapex | number | Opsiyonel | [TCFD-Metrics] Yenilenebilir enerji CapEx |
| FinancialDataForm | 12 | greenFinancingAmount | number | Opsiyonel | [TCFD-Metrics] Yeşil finansman tutarı |
| FinancialDataForm | 12 | governanceBoardOversight | number (0-1) | Opsiyonel | [ECB Scoring] Yönetim kurulu gözetimi skoru (default: 0.5) |
| FinancialDataForm | 12 | governanceManagementRole | number (0-1) | Opsiyonel | [ECB Scoring] Yönetim rolü skoru (default: 0.5) |
| FinancialDataForm | 12 | governanceIncentives | number (0-1) | Opsiyonel | [ECB Scoring] Teşvik yapısı skoru (default: 0.5) |
| FinancialDataForm | 12 | governanceRnDScore | number (0-1) | Opsiyonel | [ECB Scoring] Ar-Ge/İnovasyon kapasitesi (default: 0.5) |
| FinancialDataForm | 12 | isoCertifications | array | Opsiyonel | [ESG] ISO sertifikaları (14001, 50001 vb.) |
| FinancialDataForm | 12 | eiaReports | text | Opsiyonel | [ESG] ÇED (Çevresel Etki Değerlendirmesi) raporları |
| FinancialDataForm | 12 | environmentalActionPlans | text | Opsiyonel | [ESG] Çevresel eylem planları |
| FinancialDataForm | 12 | energyAudit | text | Opsiyonel | [ESG] Enerji denetim raporları |
| FinancialDataForm | 12 | carbonFootprintCalculated | boolean | Opsiyonel | [ESG] Karbon ayak izi hesaplandı mı: true/false |
| FinancialDataForm | 12 | renewableEnergyTargets | text | Opsiyonel | [ESG] Yenilenebilir enerji hedefleri |
| FinancialDataForm | 12 | waterManagement | text | Opsiyonel | [ESG] Su yönetimi stratejisi |
| FinancialDataForm | 12 | wasteManagement | text | Opsiyonel | [ESG] Atık yönetimi stratejisi |
| FinancialDataForm | 12 | biodiversityImpact | text | Opsiyonel | [ESG] Biyoçeşitlilik etkisi |
| FinancialDataForm | 12 | stakeholderEngagement | text | Opsiyonel | [ESG] Paydaş katılımı süreci |
| FinancialDataForm | 12 | productCertifications | array | Opsiyonel | [ESG] Ürün sertifikaları |
| FinancialDataForm | 12 | financialAdvisor | text | Opsiyonel | [ESG] Finansal danışman bilgisi |
| FinancialDataForm | 12 | bankingRelationships | array | Opsiyonel | [ESG] Bankacılık ilişkileri |
| FinancialDataForm | 12 | insurancePolicies | array | Opsiyonel | [ESG] Sigorta poliçeleri |

---

## 📌 Özet İstatistikler

| Step | Açıklama | Alan Sayısı | Zorunlu |
|------|----------|-------------|---------|
| Step 1 | Company/Personal Information | 7 | 3 |
| Step 2 | Geographic & Location | 14 | 4 |
| Step 3 | Income & PCAF Financial Metrics | 15+ | 0 |
| Step 4 | Expenses | 6+ | 0 |
| Step 5 | Assets | 8+ | 0 |
| Step 6 | Liabilities | 5+ | 0 |
| Step 7 | Investment Portfolio & Goals | 10+ | 0 |
| Step 8 | Credit Risk | 10 | 0 |
| Step 9 | Export, CBAM & Scope 2/3 Emissions | 33+ | 0 |
| Step 10 | Physical Risk Assessment | 22+ | 0 |
| Step 11 | PACTA Sector Analysis | 70+ | 0 |
| Step 12 | TCFD Governance & ESG | 50+ | 0 |
| **TOPLAM** | **12 Steps** | **~250+** | **7** |

---

## 🎯 Assessment Çıktıları

Form tamamlandığında aşağıdaki analizler üretilir:

| Analiz Modülü | Hesaplanan Metrikler |
|---------------|----------------------|
| **Financial Analysis** | Asset/Liability Ratios, Liquidity, Debt Ratios, Portfolio Analysis |
| **PACTA Analysis** | Paris Agreement Alignment, Technology Mix, Transition Pathway, 2030/2050 Projections |
| **TCFD Assessment** | Governance Score, Physical Risk Score, Transition Risk Score, TCFD Compliance |
| **ECB/IFRS S2** | Climate-Adjusted Credit Risk, Expected Loss (EL), Risk Weight, PCAF Financed Emissions, CBAM Cost Impact |

---

## 🔢 Alan Tipleri

| Tip | Örnek Değer | Açıklama |
|-----|-------------|----------|
| text | "ABC Şirketi" | Metin (tek satır) |
| number | 1000000 | Sayısal değer |
| number (0-1) | 0.75 | 0 ile 1 arası ondalık (skor) |
| number (%) | 25 | Yüzde değeri (0-100) |
| date | 2020-01-15 | Tarih (YYYY-MM-DD) |
| select | "corporate" | Seçim listesi (dropdown) |
| textarea | Uzun açıklama metni | Çok satırlı metin |
| array | [{...}, {...}] | JSON dizisi |
| boolean | true / false | Evet/Hayır |

---

## 💡 Notlar

1. **Zorunlu Alanlar**: Sadece 7 alan zorunlu (entityName, entityType, country, currency, facilityLatitude, facilityLongitude, physicalAddress, city)
2. **PACTA Sektör Alanları**: Step 11'deki alanlar seçilen sektöre göre dinamik olarak gösterilir
3. **Auto-Calculate**: Step 2'deki koordinat bilgileri ile Step 10'daki fiziksel risk alanları otomatik doldurulabilir
4. **Array Alanları**: Çoklu veri girişi için JSON formatında `[{key: value}, {...}]` yapısı kullanılır
5. **ECB/IFRS S2 Uyumluluğu**: Step 3 (PCAF), Step 9 (CBAM), Step 10 (Physical Risk), Step 12 (Governance) alanları ECB Banking Supervision ve IFRS S2 standartlarına uygundur

---

**📅 Son Güncelleme**: 2025-01-10  
**📂 Kaynak**: `src/components/FinancialDataForm.js`
