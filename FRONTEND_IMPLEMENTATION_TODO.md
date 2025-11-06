# FRONTEND IMPLEMENTATION TODO LIST
## Backend'siz Kusursuz Çalışma İçin Yapılacaklar

**Proje:** Climate Risk Analysis Platform  
**Hedef:** Backend olmadan tam fonksiyonel, kusursuz çalışan sistem  
**Tarih:** 31 Ekim 2024  
**Tahmini Süre:** 6-8 hafta (1 full-time developer)

---

## 📊 DURUM ÖZETİ

| Kategori | Durum | Eksikler | Öncelik |
|----------|-------|----------|---------|
| **Finansal Analiz** | ✅ %100 | Yok | - |
| **Form Yapısı** | ⚠️ %40 | PACTA/TCFD alanları | 🔴 Kritik |
| **PACTA Hesaplamaları** | ❌ %10 | 5 sektör eksik | 🔴 Kritik |
| **TCFD Hesaplamaları** | ❌ %5 | Tüm pillar'lar eksik | 🔴 Kritik |
| **Veri Yönetimi** | ⚠️ %70 | Validation eksik | 🟡 Orta |
| **UI/Raporlama** | ⚠️ %60 | PACTA/TCFD raporları | 🟡 Orta |
| **i18n** | ⚠️ %50 | 200+ yeni terim | 🟡 Orta |

---

## 🎯 PHASE 1: FORM GENİŞLETME (2-3 Hafta)

### 1.1 FinancialDataForm.js - Step 11 Eklenmesi (PACTA Data)

**Dosya:** `src/components/FinancialDataForm.js`

**Yapılacaklar:**

```javascript
// ✅ TODO 1.1.1: Step 11 için state alanları ekle
const [formData, setFormData] = useState({
  // ... mevcut alanlar
  
  // PACTA - ENERGY SECTOR
  sector: '', // Mevcut alan - değişiklik yok
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
  annualProductionGWh: '',
  coalProductionGWh: '',
  gasProductionGWh: '',
  renewableProductionGWh: '',
  plannedRetirements: [], // [{ year: '', capacity: '', technology: '' }]
  plannedAdditions: [], // [{ year: '', capacity: '', technology: '' }]
  renewableTarget2030: '',
  coalPhaseoutDate: '',
  
  // PACTA - AUTOMOTIVE SECTOR
  annualTotalProduction: '',
  iceProduction: '',
  hybridProduction: '',
  bevProduction: '',
  phevProduction: '',
  fcevProduction: '',
  iceCapacity: '',
  evCapacity: '',
  evProductionTarget2030: '',
  icePlantClosures: [], // [{ year: '', capacity: '' }]
  evInvestmentPipeline: '',
  batteryCapacityGWh: '',
  
  // PACTA - STEEL SECTOR
  annualSteelProduction: '',
  bfbofProduction: '',
  eafProduction: '',
  driProduction: '',
  h2driProduction: '',
  carbonIntensity: '',
  bfbofAssetValue: '',
  avgBFBOFAge: '',
  eafConversionPlan: [],
  h2ReadinessLevel: '',
  ccusDeploymentPlan: '',
  
  // PACTA - CEMENT SECTOR
  annualCementProduction: '',
  annualClinkerProduction: '',
  clinkerCementRatio: '',
  carbonIntensityClinker: '',
  alternativeFuelRate: '',
  ccusCapacity: '',
  alternativeBinders: '',
  decarbonizationRoadmap: '',
  
  // PACTA - AVIATION SECTOR
  totalAircraftCount: '',
  avgFleetAge: '',
  newGenerationAircraftShare: '',
  annualJetFuelConsumption: '',
  safUsagePercent: '',
  scope1EmissionsAviation: '',
  carbonIntensityRTK: '',
  safTarget2030: '',
  fleetRenewalPlan: [],
  
  // PACTA - REAL ESTATE SECTOR
  totalFloorAreaM2: '',
  officeAreaM2: '',
  residentialAreaM2: '',
  retailAreaM2: '',
  avgEnergyIntensity: '',
  leedCertifiedAreaM2: '',
  breeamCertifiedAreaM2: '',
  epcDistribution: {},
  renewableEnergyPercent: '',
  solarPVCapacityKW: '',
  evChargingStations: '',
  deepRenovationPipelineM2: '',
  netZeroReady2030Target: '',
  greenBuildingCertTarget: ''
});
```

**✅ TODO 1.1.2: Step 11 rendering fonksiyonu yaz**
```javascript
const renderStep11 = () => {
  // Sektöre göre dynamic form rendering
  const getSectorFields = () => {
    switch(formData.sector) {
      case 'Enerji':
        return renderEnergyFields();
      case 'Otomotiv':
        return renderAutomotiveFields();
      case 'Sanayi':
        return renderSteelFields();
      case 'Çimento':
        return renderCementFields();
      case 'Havacılık':
        return renderAviationFields();
      case 'Gayrimenkul':
        return renderRealEstateFields();
      default:
        return <p>Bu sektör için PACTA verisi gerekmemektedir.</p>;
    }
  };
  
  return (
    <div>
      <h2>{t('pactaSectorData')}</h2>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        {t('pactaDescription')}
      </p>
      {getSectorFields()}
    </div>
  );
};
```

**✅ TODO 1.1.3: Sektöre özel field rendering fonksiyonları**
```javascript
const renderEnergyFields = () => (
  <div>
    <div style={sectionStyle}>
      <h3>{t('capacityData')}</h3>
      
      <label style={labelStyle}>{t('totalInstalledCapacityMW')} *</label>
      <input
        type="number"
        style={inputStyle}
        value={formData.totalInstalledCapacityMW}
        onChange={(e) => handleInputChange('totalInstalledCapacityMW', e.target.value)}
        placeholder={t('enterCapacity')}
      />
      
      <label style={labelStyle}>{t('coalCapacityMW')}</label>
      <input
        type="number"
        style={inputStyle}
        value={formData.coalCapacityMW}
        onChange={(e) => handleInputChange('coalCapacityMW', e.target.value)}
      />
      
      <label style={labelStyle}>{t('windCapacityMW')}</label>
      <input
        type="number"
        style={inputStyle}
        value={formData.windCapacityMW}
        onChange={(e) => handleInputChange('windCapacityMW', e.target.value)}
      />
      
      <label style={labelStyle}>{t('solarCapacityMW')}</label>
      <input
        type="number"
        style={inputStyle}
        value={formData.solarCapacityMW}
        onChange={(e) => handleInputChange('solarCapacityMW', e.target.value)}
      />
      
      {/* Diğer capacity alanları... */}
    </div>
    
    <div style={sectionStyle}>
      <h3>{t('productionData')}</h3>
      {/* Production alanları */}
    </div>
    
    <div style={sectionStyle}>
      <h3>{t('forwardLookingData')}</h3>
      
      <label style={labelStyle}>{t('renewableTarget2030')}</label>
      <input
        type="number"
        style={inputStyle}
        value={formData.renewableTarget2030}
        onChange={(e) => handleInputChange('renewableTarget2030', e.target.value)}
        placeholder="%"
      />
      
      {/* Planned retirements/additions - dynamic arrays */}
      <label style={labelStyle}>{t('plannedRetirements')}</label>
      {formData.plannedRetirements.map((item, index) => (
        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="number"
            placeholder={t('year')}
            value={item.year}
            onChange={(e) => handleArrayChange('plannedRetirements', index, {...item, year: e.target.value})}
            style={{ ...inputStyle, flex: 1 }}
          />
          <input
            type="number"
            placeholder={t('capacity')}
            value={item.capacity}
            onChange={(e) => handleArrayChange('plannedRetirements', index, {...item, capacity: e.target.value})}
            style={{ ...inputStyle, flex: 1 }}
          />
          <input
            type="text"
            placeholder={t('technology')}
            value={item.technology}
            onChange={(e) => handleArrayChange('plannedRetirements', index, {...item, technology: e.target.value})}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={() => removeArrayItem('plannedRetirements', index)}>
            {t('remove')}
          </button>
        </div>
      ))}
      <button onClick={() => addArrayItem('plannedRetirements', { year: '', capacity: '', technology: '' })}>
        {t('addRetirement')}
      </button>
    </div>
  </div>
);

const renderAutomotiveFields = () => (
  // Otomotiv için benzer yapı
);

const renderSteelFields = () => (
  // Çelik için benzer yapı
);

// Diğer sektörler...
```

**✅ TODO 1.1.4: Step navigation'ı güncelle**
```javascript
const nextStep = () => {
  if (currentStep < 12) setCurrentStep(currentStep + 1); // 10'dan 12'ye değiştir
};
```

---

### 1.2 FinancialDataForm.js - Step 12 Eklenmesi (TCFD Data)

**✅ TODO 1.2.1: Step 12 için state alanları ekle**
```javascript
const [formData, setFormData] = useState({
  // ... mevcut ve Step 11 alanları
  
  // TCFD - GOVERNANCE
  hasClimateExpertOnBoard: false,
  boardClimateDiscussionFrequency: '',
  hasClimateRiskCommittee: false,
  hasChiefSustainabilityOfficer: false,
  climateRiskInERM: false,
  climateKPIsInExecutiveComp: false,
  hasClimatePolicy: false,
  climateGovernanceNotes: '',
  
  // TCFD - STRATEGY
  climateRiskTimeHorizons: {
    short: '3',
    medium: '10',
    long: '30'
  },
  materialClimateRisks: [], // [{ risk: '', timeframe: '', impact: '' }]
  materialClimateOpportunities: [], // [{ opportunity: '', timeframe: '', impact: '' }]
  scenariosUsed: [], // ['1.5C', '2C', '3C']
  strategyResilienceAssessment: '',
  
  // TCFD - RISK MANAGEMENT
  climateRiskIdentificationProcess: '',
  riskAssessmentFrequency: 'annually',
  materialityThreshold: '',
  climateRiskAppetiteStatement: '',
  integrationWithERM: false,
  riskManagementNotes: '',
  
  // TCFD - METRICS & TARGETS
  scope2Emissions: '', // ❌ YENİ - Scope 1 zaten var
  scope2Method: 'market-based',
  scope3Emissions: '', // ❌ YENİ
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
  emissionsBaseYear: '2020',
  emissionsBaseline: '',
  revenueIntensity: '',
  hasNetZeroCommitment: false,
  netZeroYear: '',
  interimTargets: [], // [{ year: '', reductionPercent: '', scope: '' }]
  sbtiValidated: false,
  emissionReductionTarget: '',
  emissionTargetYear: '2030',
  highCarbonSectorRevenue: '',
  fossilRevenueShare: '',
  greenRevenue: '',
  taxonomyAlignedRevenue: '',
  assetsInHighRiskZones: '',
  floodZoneAssets: '',
  waterStressAssets: '',
  renewableEnergyShare: '',
  renewableCapex: '',
  greenFinancingAmount: ''
});
```

**✅ TODO 1.2.2: Step 12 rendering fonksiyonu yaz**
```javascript
const renderStep12 = () => (
  <div>
    <h2>{t('tcfdGovernanceTargets')}</h2>
    
    {/* GOVERNANCE */}
    <div style={sectionStyle}>
      <h3>{t('governance')}</h3>
      
      <label style={labelStyle}>
        <input
          type="checkbox"
          checked={formData.hasClimateExpertOnBoard}
          onChange={(e) => handleInputChange('hasClimateExpertOnBoard', e.target.checked)}
        />
        {t('hasClimateExpertOnBoard')}
      </label>
      
      <label style={labelStyle}>{t('boardClimateDiscussionFrequency')}</label>
      <input
        type="number"
        style={inputStyle}
        value={formData.boardClimateDiscussionFrequency}
        onChange={(e) => handleInputChange('boardClimateDiscussionFrequency', e.target.value)}
        placeholder={t('timesPerYear')}
      />
      
      <label style={labelStyle}>
        <input
          type="checkbox"
          checked={formData.hasClimateRiskCommittee}
          onChange={(e) => handleInputChange('hasClimateRiskCommittee', e.target.checked)}
        />
        {t('hasClimateRiskCommittee')}
      </label>
      
      {/* Diğer governance alanları... */}
    </div>
    
    {/* STRATEGY */}
    <div style={sectionStyle}>
      <h3>{t('strategy')}</h3>
      
      <label style={labelStyle}>{t('materialClimateRisks')}</label>
      {formData.materialClimateRisks.map((risk, index) => (
        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder={t('riskDescription')}
            value={risk.risk}
            onChange={(e) => handleArrayChange('materialClimateRisks', index, {...risk, risk: e.target.value})}
            style={{ ...inputStyle, flex: 2 }}
          />
          <select
            value={risk.timeframe}
            onChange={(e) => handleArrayChange('materialClimateRisks', index, {...risk, timeframe: e.target.value})}
            style={{ ...inputStyle, flex: 1 }}
          >
            <option value="">{t('selectTimeframe')}</option>
            <option value="short">{t('shortTerm')}</option>
            <option value="medium">{t('mediumTerm')}</option>
            <option value="long">{t('longTerm')}</option>
          </select>
          <input
            type="number"
            placeholder={t('impact')}
            value={risk.impact}
            onChange={(e) => handleArrayChange('materialClimateRisks', index, {...risk, impact: e.target.value})}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={() => removeArrayItem('materialClimateRisks', index)}>
            {t('remove')}
          </button>
        </div>
      ))}
      <button onClick={() => addArrayItem('materialClimateRisks', { risk: '', timeframe: '', impact: '' })}>
        {t('addRisk')}
      </button>
    </div>
    
    {/* RISK MANAGEMENT */}
    <div style={sectionStyle}>
      <h3>{t('riskManagement')}</h3>
      {/* Risk management alanları */}
    </div>
    
    {/* METRICS & TARGETS */}
    <div style={sectionStyle}>
      <h3>{t('metricsTargets')}</h3>
      
      <label style={labelStyle}>{t('scope2Emissions')} (tCO2e)</label>
      <input
        type="number"
        style={inputStyle}
        value={formData.scope2Emissions}
        onChange={(e) => handleInputChange('scope2Emissions', e.target.value)}
      />
      
      <label style={labelStyle}>{t('scope3Emissions')} (tCO2e)</label>
      <input
        type="number"
        style={inputStyle}
        value={formData.scope3Emissions}
        onChange={(e) => handleInputChange('scope3Emissions', e.target.value)}
      />
      
      <label style={labelStyle}>{t('hasNetZeroCommitment')}</label>
      <input
        type="checkbox"
        checked={formData.hasNetZeroCommitment}
        onChange={(e) => handleInputChange('hasNetZeroCommitment', e.target.checked)}
      />
      
      {formData.hasNetZeroCommitment && (
        <>
          <label style={labelStyle}>{t('netZeroYear')}</label>
          <input
            type="number"
            style={inputStyle}
            value={formData.netZeroYear}
            onChange={(e) => handleInputChange('netZeroYear', e.target.value)}
          />
        </>
      )}
      
      {/* Diğer metrics alanları... */}
    </div>
  </div>
);
```

**✅ TODO 1.2.3: Form submit'te yeni alanları kaydet**
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Save to LocalStorage
  localStorage.setItem('climateRiskFormData', JSON.stringify(formData));
  
  // DataManager ile kategorize kayıt
  dataManager.saveComprehensiveData(formData);
  dataManager.savePACTAData(formData); // Yeni
  dataManager.saveTCFDData(formData); // Yeni
  
  onSubmit(formData);
};
```

---

### 1.3 Form Validation

**✅ TODO 1.3.1: Validation helper fonksiyonları**

**Yeni Dosya:** `src/utils/formValidation.js`

```javascript
export const validatePACTAData = (formData) => {
  const errors = [];
  const warnings = [];
  
  if (!formData.sector) {
    errors.push('Sektör seçimi zorunludur');
    return { isValid: false, errors, warnings };
  }
  
  switch(formData.sector) {
    case 'Enerji':
      if (!formData.totalInstalledCapacityMW) {
        errors.push('Toplam kurulu güç kapasitesi gereklidir');
      }
      
      const totalRenewable = parseFloat(formData.windCapacityMW || 0) +
                            parseFloat(formData.solarCapacityMW || 0) +
                            parseFloat(formData.hydroCapacityMW || 0);
      const totalCapacity = parseFloat(formData.totalInstalledCapacityMW || 0);
      
      if (totalRenewable > totalCapacity) {
        errors.push('Yenilenebilir kapasite toplamı toplam kapasiteyi aşamaz');
      }
      
      if (totalCapacity > 0 && totalRenewable === 0) {
        warnings.push('Hiç yenilenebilir kapasite girilmedi - PACTA alignment hesaplanamaz');
      }
      break;
      
    case 'Otomotiv':
      if (!formData.annualTotalProduction) {
        errors.push('Yıllık toplam üretim gereklidir');
      }
      
      const totalEV = parseFloat(formData.bevProduction || 0) +
                      parseFloat(formData.phevProduction || 0) +
                      parseFloat(formData.fcevProduction || 0);
      const totalProd = parseFloat(formData.annualTotalProduction || 0);
      
      if (totalEV > totalProd) {
        errors.push('EV üretimi toplamı toplam üretimi aşamaz');
      }
      break;
      
    // Diğer sektörler...
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateTCFDData = (formData) => {
  const errors = [];
  const warnings = [];
  
  // Scope 1 zaten var, Scope 2 kontrol et
  if (formData.scope1Emissions && !formData.scope2Emissions) {
    warnings.push('Scope 2 emissions girilmedi - TCFD disclosure eksik olacak');
  }
  
  // Net-zero commitment kontrolü
  if (formData.hasNetZeroCommitment && !formData.netZeroYear) {
    errors.push('Net-zero taahhüdü varsa hedef yıl gereklidir');
  }
  
  // Baseline kontrolü
  if (formData.emissionReductionTarget && !formData.emissionsBaseline) {
    errors.push('Emisyon azaltma hedefi için baseline emisyonu gereklidir');
  }
  
  // Governance scoring için minimum alan kontrolü
  let governanceFieldCount = 0;
  if (formData.hasClimateExpertOnBoard) governanceFieldCount++;
  if (formData.hasClimateRiskCommittee) governanceFieldCount++;
  if (formData.hasChiefSustainabilityOfficer) governanceFieldCount++;
  
  if (governanceFieldCount === 0) {
    warnings.push('Governance verileri eksik - TCFD Governance skoru hesaplanamaz');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateAllFormData = (formData) => {
  const financialValidation = validateFinancialData(formData); // Mevcut
  const pactaValidation = validatePACTAData(formData);
  const tcfdValidation = validateTCFDData(formData);
  
  return {
    isValid: financialValidation.isValid && 
             pactaValidation.isValid && 
             tcfdValidation.isValid,
    errors: [
      ...financialValidation.errors,
      ...pactaValidation.errors,
      ...tcfdValidation.errors
    ],
    warnings: [
      ...financialValidation.warnings,
      ...pactaValidation.warnings,
      ...tcfdValidation.warnings
    ]
  };
};
```

**✅ TODO 1.3.2: Form'a validation entegre et**
```javascript
import { validateAllFormData } from '../utils/formValidation';

const handleSubmit = (e) => {
  e.preventDefault();
  
  const validation = validateAllFormData(formData);
  
  if (!validation.isValid) {
    alert('Formda hatalar var:\n' + validation.errors.join('\n'));
    return;
  }
  
  if (validation.warnings.length > 0) {
    const proceed = window.confirm(
      'Uyarılar:\n' + validation.warnings.join('\n') + 
      '\n\nDevam etmek istiyor musunuz?'
    );
    if (!proceed) return;
  }
  
  // Save and proceed
  localStorage.setItem('climateRiskFormData', JSON.stringify(formData));
  onSubmit(formData);
};
```

---

## 🧮 PHASE 2: HESAPLAMA MODÜLLERİ (3-4 Hafta)

### 2.1 PACTA Calculator Oluşturma

**✅ TODO 2.1.1: Yeni dosya oluştur**

**Yeni Dosya:** `src/utils/pactaCalculator.js`

```javascript
class PACTACalculator {
  constructor() {
    this.benchmarks = {
      energy: {
        'NZE2050': { 2025: 0.45, 2030: 0.70, 2035: 0.80, 2050: 0.90 },
        'SDS': { 2025: 0.42, 2030: 0.65, 2035: 0.75, 2050: 0.85 },
        'STEPS': { 2025: 0.35, 2030: 0.48, 2035: 0.55, 2050: 0.60 }
      },
      automotive: {
        'NZE2050': { 2025: 0.20, 2030: 0.60, 2035: 0.80, 2050: 1.00 },
        'SDS': { 2025: 0.18, 2030: 0.55, 2035: 0.75, 2050: 0.95 }
      },
      steel: {
        'NZE2050': { 2025: 1.4, 2030: 1.0, 2040: 0.4, 2050: 0.1 },
        'SDS': { 2025: 1.5, 2030: 1.2, 2040: 0.6, 2050: 0.3 }
      },
      cement: {
        'NZE2050': { 2025: 0.55, 2030: 0.48, 2040: 0.35, 2050: 0.20 },
        'SDS': { 2025: 0.57, 2030: 0.52, 2040: 0.40, 2050: 0.28 }
      },
      aviation: {
        'NZE2050': { 2025: 0.05, 2030: 0.15, 2040: 0.40, 2050: 0.70 },
        'SDS': { 2025: 0.03, 2030: 0.10, 2040: 0.30, 2050: 0.60 }
      },
      realEstate: {
        'NZE2050': { 2025: 0.25, 2030: 0.50, 2040: 0.75, 2050: 1.00 },
        'SDS': { 2025: 0.20, 2030: 0.45, 2040: 0.70, 2050: 0.95 }
      }
    };
  }
  
  /**
   * Ana alignment hesaplama fonksiyonu
   */
  calculateAlignment(company, scenario = 'NZE2050') {
    const sector = company.sector;
    
    // Sektör kontrolü
    if (!this.isPACTASector(sector)) {
      return {
        applicable: false,
        sector,
        message: `PACTA ${sector} sektörü için uygulanabilir değildir.`
      };
    }
    
    // Sektöre göre hesaplama
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
        return {
          applicable: false,
          sector,
          message: 'Bilinmeyen sektör'
        };
    }
  }
  
  /**
   * ENERGY SECTOR - Renewable capacity alignment
   */
  calculatePowerAlignment(company, scenario) {
    // Step 1: Calculate current renewable share
    const totalCapacity = parseFloat(company.totalInstalledCapacityMW) || 0;
    
    if (totalCapacity === 0) {
      return {
        applicable: false,
        error: 'Toplam kurulu güç kapasitesi girilmemiş'
      };
    }
    
    const renewableCapacity = 
      parseFloat(company.windCapacityMW || 0) +
      parseFloat(company.solarCapacityMW || 0) +
      parseFloat(company.hydroCapacityMW || 0) +
      parseFloat(company.biomassCapacityMW || 0) +
      parseFloat(company.geothermalCapacityMW || 0);
    
    const fossilCapacity =
      parseFloat(company.coalCapacityMW || 0) +
      parseFloat(company.gasCapacityMW || 0) +
      parseFloat(company.oilCapacityMW || 0);
    
    const currentRenewableShare = renewableCapacity / totalCapacity;
    const currentFossilShare = fossilCapacity / totalCapacity;
    
    // Step 2: Forward-looking projection (5-year)
    let forecastCapacity = totalCapacity;
    let forecastRenewableCapacity = renewableCapacity;
    
    // Planned retirements (assume 80% fossil)
    if (company.plannedRetirements && company.plannedRetirements.length > 0) {
      const retirementCapacity = company.plannedRetirements
        .filter(r => parseInt(r.year) <= new Date().getFullYear() + 5)
        .reduce((sum, r) => sum + parseFloat(r.capacity || 0), 0);
      
      forecastCapacity -= retirementCapacity;
      // Assume retirements are primarily fossil
      forecastRenewableCapacity -= retirementCapacity * 0.2; // 20% renewable
    }
    
    // Planned additions (assume all renewable)
    if (company.plannedAdditions && company.plannedAdditions.length > 0) {
      const additionCapacity = company.plannedAdditions
        .filter(a => parseInt(a.year) <= new Date().getFullYear() + 5)
        .reduce((sum, a) => sum + parseFloat(a.capacity || 0), 0);
      
      forecastCapacity += additionCapacity;
      forecastRenewableCapacity += additionCapacity;
    }
    
    // If no explicit plans, use target
    if (company.renewableTarget2030 && 
        (!company.plannedRetirements || company.plannedRetirements.length === 0)) {
      const target = parseFloat(company.renewableTarget2030) / 100;
      forecastRenewableCapacity = forecastCapacity * target;
    }
    
    const forecastRenewableShare = forecastRenewableCapacity / forecastCapacity;
    
    // Step 3: Benchmark comparison
    const benchmark2030 = this.benchmarks.energy[scenario][2030];
    const alignmentGap = (benchmark2030 - forecastRenewableShare) / benchmark2030;
    
    // Step 4: Transition risk score
    const transitionRiskScore = Math.max(0, Math.min(1, alignmentGap * 1.5));
    
    // Step 5: Stranded asset risk (coal specific)
    const coalAssets = parseFloat(company.coalCapacityMW || 0);
    const coalShare = coalAssets / totalCapacity;
    const strandedAssetRisk = coalShare * Math.max(0, alignmentGap);
    
    return {
      applicable: true,
      sector: 'Enerji',
      scenario,
      currentRenewableShare: (currentRenewableShare * 100).toFixed(1),
      currentFossilShare: (currentFossilShare * 100).toFixed(1),
      forecastRenewableShare: (forecastRenewableShare * 100).toFixed(1),
      benchmark: (benchmark2030 * 100).toFixed(1),
      alignmentGap: (alignmentGap * 100).toFixed(1),
      alignmentStatus: alignmentGap > 0.15 ? 'Not Aligned' : 
                       alignmentGap > 0.05 ? 'Partially Aligned' : 'Aligned',
      transitionRiskScore: transitionRiskScore.toFixed(3),
      strandedAssetRisk: (strandedAssetRisk * 100).toFixed(1),
      coalPhaseoutRequired: coalAssets > 0,
      recommendations: this.generatePowerRecommendations(
        alignmentGap, 
        coalAssets, 
        forecastRenewableShare, 
        company
      ),
      details: {
        totalCapacity,
        renewableCapacity,
        fossilCapacity,
        coalCapacity: coalAssets,
        forecastCapacity,
        forecastRenewableCapacity
      }
    };
  }
  
  /**
   * AUTOMOTIVE SECTOR - EV share alignment
   */
  calculateAutomotiveAlignment(company, scenario) {
    // Step 1: Current production mix
    const totalProduction = parseFloat(company.annualTotalProduction) || 0;
    
    if (totalProduction === 0) {
      return {
        applicable: false,
        error: 'Yıllık toplam üretim girilmemiş'
      };
    }
    
    const iceProduction = parseFloat(company.iceProduction || 0);
    const bevProduction = parseFloat(company.bevProduction || 0);
    const phevProduction = parseFloat(company.phevProduction || 0);
    const fcevProduction = parseFloat(company.fcevProduction || 0);
    
    const evProduction = bevProduction + phevProduction + fcevProduction;
    const currentEVShare = evProduction / totalProduction;
    
    // Step 2: Forward-looking projection
    const evGrowthRate = 0.25; // 25% CAGR default
    const iceDeclineRate = 0.10; // 10% decline per year
    const years = 5;
    
    const futureEVProduction = evProduction * Math.pow(1 + evGrowthRate, years);
    const futureICEProduction = iceProduction * Math.pow(1 - iceDeclineRate, years);
    const futureProduction = futureEVProduction + futureICEProduction;
    
    const forecastEVShare = Math.min(1, futureEVProduction / futureProduction);
    
    // If target is provided, use it
    if (company.evProductionTarget2030) {
      const target = parseFloat(company.evProductionTarget2030) / 100;
      // Blend target with projection
      const blendedForecast = (forecastEVShare + target) / 2;
      return this.calculateAutomotiveAlignment({
        ...company,
        // Override with blended forecast
        _forecastEVShare: blendedForecast
      }, scenario);
    }
    
    // Step 3: Benchmark comparison
    const benchmark2030 = this.benchmarks.automotive[scenario][2030];
    const alignmentGap = (benchmark2030 - forecastEVShare) / benchmark2030;
    
    // Step 4: Stranded asset risk (ICE capacity)
    const iceCapacity = parseFloat(company.iceCapacity) || iceProduction;
    const iceCapacityUtilization = iceProduction / iceCapacity;
    const strandedAssetRisk = iceCapacityUtilization * Math.max(0, alignmentGap);
    
    // Step 5: Transition risk
    const transitionRiskScore = Math.max(0, Math.min(1, alignmentGap * 1.2));
    
    return {
      applicable: true,
      sector: 'Otomotiv',
      scenario,
      currentEVShare: (currentEVShare * 100).toFixed(1),
      currentICEShare: ((iceProduction / totalProduction) * 100).toFixed(1),
      forecastEVShare: (forecastEVShare * 100).toFixed(1),
      benchmark: (benchmark2030 * 100).toFixed(1),
      alignmentGap: (alignmentGap * 100).toFixed(1),
      alignmentStatus: alignmentGap > 0.2 ? 'Not Aligned' : 
                       alignmentGap > 0.1 ? 'Partially Aligned' : 'Aligned',
      transitionRiskScore: transitionRiskScore.toFixed(3),
      strandedAssetRisk: (strandedAssetRisk * 100).toFixed(1),
      recommendations: this.generateAutomotiveRecommendations(
        alignmentGap,
        strandedAssetRisk,
        company
      ),
      details: {
        totalProduction,
        evProduction,
        iceProduction,
        bevShare: (bevProduction / evProduction * 100).toFixed(1),
        phevShare: (phevProduction / evProduction * 100).toFixed(1)
      }
    };
  }
  
  /**
   * STEEL SECTOR - Carbon intensity alignment
   */
  calculateSteelAlignment(company, scenario) {
    // Implementation similar to above
    // See PACTA_TCFD_FORMUL_ANALIZI.md for full formula
  }
  
  /**
   * CEMENT SECTOR
   */
  calculateCementAlignment(company, scenario) {
    // Implementation
  }
  
  /**
   * AVIATION SECTOR
   */
  calculateAviationAlignment(company, scenario) {
    // Implementation
  }
  
  /**
   * REAL ESTATE SECTOR
   */
  calculateRealEstateAlignment(company, scenario) {
    // Implementation
  }
  
  /**
   * Helper: Check if sector is PACTA-applicable
   */
  isPACTASector(sector) {
    return ['Enerji', 'Otomotiv', 'Sanayi', 'Çimento', 'Havacılık', 'Gayrimenkul'].includes(sector);
  }
  
  /**
   * Generate recommendations - Power
   */
  generatePowerRecommendations(gap, coalAssets, forecastShare, company) {
    const recommendations = [];
    
    if (gap > 0.2) {
      recommendations.push({
        priority: 'High',
        category: 'Capacity Addition',
        action: 'Yenilenebilir kapasite eklemelerini hızlandırın',
        target: `2030'a kadar yenilenebilir CapEx'i yıllık %50 artırın`,
        impact: 'Alignment gap\'i %' + (gap * 50).toFixed(0) + ' azaltabilir'
      });
    }
    
    if (coalAssets > 0) {
      const phaseoutYear = company.coalPhaseoutDate || '2030';
      recommendations.push({
        priority: 'Critical',
        category: 'Coal Phaseout',
        action: `Kömür santrallerini ${phaseoutYear} yılına kadar kapatın`,
        target: `${coalAssets.toFixed(0)} MW kömür kapasitesini emekliye ayırın`,
        impact: 'Stranded asset riskini elimine eder'
      });
    }
    
    if (forecastShare < 0.3) {
      recommendations.push({
        priority: 'Medium',
        category: 'Technology Mix',
        action: 'Rüzgar ve güneş yatırımlarına öncelik verin',
        target: 'Yeni kapasitelerin %90\'ı rüzgar + güneş olmalı',
        impact: 'LCOE optimizasyonu ve hızlı deployment'
      });
    }
    
    return recommendations;
  }
  
  /**
   * Generate recommendations - Automotive
   */
  generateAutomotiveRecommendations(gap, strandedRisk, company) {
    const recommendations = [];
    
    if (gap > 0.25) {
      recommendations.push({
        priority: 'Critical',
        category: 'EV Transition',
        action: 'EV geçişini hızlandırın',
        target: '2027 yılına kadar %30 EV üretimi hedefleyin'
      });
    }
    
    if (strandedRisk > 0.3) {
      recommendations.push({
        priority: 'High',
        category: 'Asset Repurposing',
        action: 'ICE tesislerini EV üretimine dönüştürün',
        target: `ICE kapasitesinin %${Math.round(strandedRisk * 100)}\'ünü dönüştürün`
      });
    }
    
    const bevShare = parseFloat(company.bevProduction || 0) / 
                     (parseFloat(company.bevProduction || 0) + 
                      parseFloat(company.phevProduction || 0) + 
                      parseFloat(company.fcevProduction || 0));
    
    if (bevShare < 0.7) {
      recommendations.push({
        priority: 'Medium',
        category: 'Technology Priority',
        action: 'BEV üretimine PHEV\'den daha fazla öncelik verin',
        target: 'BEV, toplam EV üretiminin %70\'i olmalı'
      });
    }
    
    return recommendations;
  }
}

export default PACTACalculator;
```

**✅ TODO 2.1.2: Diğer sektörlerin methodlarını tamamla**
- `calculateSteelAlignment()` 
- `calculateCementAlignment()`
- `calculateAviationAlignment()`
- `calculateRealEstateAlignment()`

---

### 2.2 TCFD Calculator Oluşturma

**✅ TODO 2.2.1: Yeni dosya oluştur**

**Yeni Dosya:** `src/utils/tcfdCalculator.js`

```javascript
class TCFDCalculator {
  constructor() {
    // Emission factors for Turkey
    this.emissionFactors = {
      // Energy
      electricityGrid: 0.475, // kg CO2/kWh (Turkey 2023)
      naturalGas: 2.03, // kg CO2/m3
      coal: 2.42, // kg CO2/kg
      diesel: 2.68, // kg CO2/L
      gasoline: 2.31, // kg CO2/L
      lpg: 1.51, // kg CO2/L
      
      // Transport
      freight: 0.062, // kg CO2/ton-km
      flight: 0.255, // kg CO2/passenger-km
      car: 0.171, // kg CO2/km
      
      // Other
      waste: 0.57, // kg CO2/kg waste
      refrigerant: 1810, // kg CO2/kg R-134a
      
      // Supply chain (averages)
      avgProduct: 5.2, // kg CO2/USD
      capitalGoods: 0.8, // kg CO2/USD
      processing: 0.3, // kg CO2/USD
      endOfLife: 0.05 // kg CO2/USD
    };
  }
  
  /**
   * PILLAR 1: GOVERNANCE SCORE
   */
  calculateGovernanceScore(company) {
    let score = 0;
    const maxScore = 100;
    const gaps = [];
    
    // Board Oversight (40 points)
    if (company.hasClimateExpertOnBoard) {
      score += 15;
    } else {
      gaps.push('Yönetim kurulunda iklim uzmanı bulunmuyor');
    }
    
    const frequency = parseInt(company.boardClimateDiscussionFrequency) || 0;
    if (frequency >= 4) {
      score += 15;
    } else if (frequency >= 2) {
      score += 10;
    } else if (frequency >= 1) {
      score += 5;
    } else {
      gaps.push('YK\'da iklim riski düzenli olarak tartışılmıyor');
    }
    
    if (company.hasClimateRiskCommittee) {
      score += 10;
    } else {
      gaps.push('Özel iklim risk komitesi bulunmuyor');
    }
    
    // Management Responsibility (30 points)
    if (company.hasChiefSustainabilityOfficer) {
      score += 15;
    } else {
      gaps.push('C-level sürdürülebilirlik sorumlusu bulunmuyor');
    }
    
    if (company.climateRiskInERM) {
      score += 15;
    } else {
      gaps.push('İklim riski kurumsal risk yönetimine entegre değil');
    }
    
    // Incentives (30 points)
    if (company.climateKPIsInExecutiveComp) {
      score += 20;
    } else {
      gaps.push('Yönetici maaşlarında iklim KPI\'ları yok');
    }
    
    if (company.hasClimatePolicy) {
      score += 10;
    } else {
      gaps.push('Resmi iklim politikası bulunmuyor');
    }
    
    const finalScore = Math.round((score / maxScore) * 100);
    
    return {
      score: finalScore,
      grade: finalScore >= 80 ? 'Strong' : 
             finalScore >= 60 ? 'Adequate' : 
             finalScore >= 40 ? 'Developing' : 'Weak',
      breakdown: {
        boardOversight: score >= 40 ? (score - 30 >= 0 ? 40 : score + 10) : score,
        managementRole: score >= 40 ? 30 : 0,
        incentives: score >= 70 ? 30 : Math.max(0, score - 40)
      },
      gaps,
      recommendations: this.generateGovernanceRecommendations(score, gaps)
    };
  }
  
  /**
   * PILLAR 2: STRATEGY - Scenario Impact Analysis
   */
  calculateScenarioImpact(company, scenario) {
    const scenarios = {
      'orderly_1.5C': {
        name: 'Orderly 1.5°C',
        carbonPrice: 250, // USD/tCO2
        temperatureRise: 1.5,
        gdpImpact: -0.02,
        description: 'Erken ve pürüzsüz geçiş'
      },
      'disorderly_2C': {
        name: 'Disorderly 2°C',
        carbonPrice: 400,
        temperatureRise: 2.0,
        gdpImpact: -0.05,
        description: 'Geç ve ani geçiş'
      },
      'hothouse_3C': {
        name: 'Hothouse 3°C+',
        carbonPrice: 50,
        temperatureRise: 3.5,
        gdpImpact: -0.15,
        description: 'Geçiş yok, yüksek fiziksel risk'
      }
    };
    
    const params = scenarios[scenario];
    
    // Transition impact (carbon pricing)
    const scope1Emissions = parseFloat(company.scope1Emissions) || 0;
    const scope2Emissions = parseFloat(company.scope2Emissions) || 0;
    const scope1_2Emissions = scope1Emissions + scope2Emissions; // tCO2
    
    const carbonCost = scope1_2Emissions * params.carbonPrice; // USD
    const revenue = parseFloat(company.annualRevenue) * 1000000 || 1; // Million to USD
    const carbonCostAsPercentRevenue = (carbonCost / revenue) * 100;
    
    // Physical impact (temperature rise)
    const physicalRiskExposure = parseFloat(company.assetsInHighRiskZones) || 0;
    const physicalRiskMultiplier = Math.pow(params.temperatureRise / 1.5, 2); // Quadratic
    const physicalImpact = physicalRiskExposure * physicalRiskMultiplier * 0.05; // 5% base damage
    const physicalImpactAsPercentRevenue = (physicalImpact / revenue) * 100;
    
    // Demand impact (GDP correlation)
    const gdpElasticity = this.getGDPElasticity(company.sector);
    const demandImpact = revenue * params.gdpImpact * gdpElasticity;
    
    // Total EBITDA impact
    const ebitda = revenue * 0.15; // Assume 15% EBITDA margin
    const totalImpact = carbonCost + physicalImpact + Math.abs(demandImpact);
    const ebitdaImpact = (totalImpact / ebitda) * 100;
    
    return {
      scenario: params.name,
      scenarioKey: scenario,
      description: params.description,
      carbonPrice: params.carbonPrice,
      temperatureRise: params.temperatureRise,
      impacts: {
        carbonCost: carbonCost.toFixed(0),
        carbonCostPercent: carbonCostAsPercentRevenue.toFixed(2),
        physicalImpact: physicalImpact.toFixed(0),
        physicalImpactPercent: physicalImpactAsPercentRevenue.toFixed(2),
        demandImpact: demandImpact.toFixed(0),
        demandImpactPercent: ((demandImpact / revenue) * 100).toFixed(2),
        totalImpact: totalImpact.toFixed(0),
        ebitdaImpact: ebitdaImpact.toFixed(2)
      },
      materiality: Math.abs(ebitdaImpact) > 10 ? 'Material' : 
                   Math.abs(ebitdaImpact) > 5 ? 'Moderate' : 'Not Material',
      riskLevel: ebitdaImpact > 30 ? 'Severe' :
                 ebitdaImpact > 15 ? 'High' :
                 ebitdaImpact > 5 ? 'Medium' : 'Low'
    };
  }
  
  /**
   * PILLAR 2: Time Horizon Risk Mapping
   */
  mapRisksByTimeHorizon(company) {
    const horizons = company.climateRiskTimeHorizons || { short: 3, medium: 10, long: 30 };
    
    return {
      shortTerm: {
        years: horizons.short,
        transitionRisks: this.getShortTermTransitionRisks(company),
        physicalRisks: this.getShortTermPhysicalRisks(company),
        opportunities: this.getShortTermOpportunities(company)
      },
      mediumTerm: {
        years: horizons.medium,
        transitionRisks: this.getMediumTermTransitionRisks(company),
        physicalRisks: this.getMediumTermPhysicalRisks(company),
        opportunities: this.getMediumTermOpportunities(company)
      },
      longTerm: {
        years: horizons.long,
        transitionRisks: this.getLongTermTransitionRisks(company),
        physicalRisks: this.getLongTermPhysicalRisks(company),
        opportunities: this.getLongTermOpportunities(company)
      }
    };
  }
  
  /**
   * PILLAR 3: Risk Materiality Assessment
   */
  assessRiskMateriality(risk, company) {
    const likelihood = this.calculateLikelihood(risk, company);
    const impact = this.calculateImpact(risk, company);
    const riskScore = likelihood * impact;
    
    const materialityThreshold = parseFloat(company.materialityThreshold) || 9;
    
    return {
      risk: risk.risk || risk.name,
      likelihood,
      likelihoodLabel: this.getLikelihoodLabel(likelihood),
      impact,
      impactLabel: this.getImpactLabel(impact),
      riskScore,
      isMaterial: riskScore >= materialityThreshold,
      category: riskScore >= 20 ? 'Critical' :
                riskScore >= 12 ? 'High' :
                riskScore >= 6 ? 'Medium' : 'Low',
      actionRequired: riskScore >= materialityThreshold,
      financialImpact: risk.financialImpact || 0
    };
  }
  
  /**
   * PILLAR 4: GHG Emissions Calculation (Full Scope 1,2,3)
   */
  calculateGHGEmissions(company) {
    // Scope 1: Direct emissions (already in form)
    const scope1Total = parseFloat(company.scope1Emissions) || 0;
    
    // Scope 2: Indirect from purchased energy
    const electricityConsumption = parseFloat(company.totalEnergyConsumption) || 0; // GWh
    const renewableShare = parseFloat(company.renewableEnergyShare) / 100 || 0;
    
    const scope2LocationBased = electricityConsumption * 1000 * this.emissionFactors.electricityGrid / 1000; // tCO2
    const scope2MarketBased = electricityConsumption * 1000 * (1 - renewableShare) * 
                              this.emissionFactors.electricityGrid / 1000; // tCO2
    
    const scope2Total = company.scope2Method === 'location-based' ? 
                        scope2LocationBased : scope2MarketBased;
    
    // Scope 3: Value chain emissions
    const scope3 = this.calculateScope3Emissions(company, scope1Total, scope2Total);
    
    // Total emissions
    const totalEmissions = scope1Total + scope2Total + scope3.total;
    
    // Intensity metrics
    const revenue = parseFloat(company.annualRevenue) * 1000000 || 1;
    const employees = parseFloat(company.employees) || 1;
    
    const revenueIntensity = totalEmissions / (revenue / 1000000); // tCO2e/M USD
    const employeeIntensity = totalEmissions / employees; // tCO2e/employee
    
    return {
      scope1: {
        total: scope1Total.toFixed(0),
        breakdown: {
          // Could be detailed if we had stationary/mobile combustion data
          direct: scope1Total.toFixed(0)
        }
      },
      scope2: {
        total: scope2Total.toFixed(0),
        method: company.scope2Method || 'market-based',
        locationBased: scope2LocationBased.toFixed(0),
        marketBased: scope2MarketBased.toFixed(0),
        renewableShare: (renewableShare * 100).toFixed(1)
      },
      scope3: {
        total: scope3.total.toFixed(0),
        breakdown: scope3.breakdown,
        categories: scope3.categories
      },
      totalEmissions: totalEmissions.toFixed(0),
      intensityMetrics: {
        revenueIntensity: revenueIntensity.toFixed(2),
        employeeIntensity: employeeIntensity.toFixed(2)
      },
      comparison: this.compareToBenchmark(company.sector, revenueIntensity)
    };
  }
  
  /**
   * Calculate Scope 3 emissions (15 categories)
   */
  calculateScope3Emissions(company, scope1, scope2) {
    const scope3 = {
      // Upstream
      purchasedGoods: parseFloat(company.scope3Categories?.purchasedGoods) || 0,
      capitalGoods: parseFloat(company.scope3Categories?.capitalGoods) || 0,
      fuelAndEnergyRelated: (scope1 + scope2) * 0.15, // 15% well-to-tank
      upstreamTransport: parseFloat(company.scope3Categories?.upstreamTransport) || 0,
      waste: parseFloat(company.scope3Categories?.waste) || 0,
      businessTravel: parseFloat(company.scope3Categories?.businessTravel) || 0,
      employeeCommuting: parseFloat(company.scope3Categories?.employeeCommuting) || 0,
      upstreamLeasedAssets: 0,
      
      // Downstream
      downstreamTransport: parseFloat(company.scope3Categories?.downstreamTransport) || 0,
      processingOfSoldProducts: parseFloat(company.scope3Categories?.useOfSoldProducts) || 0,
      useOfSoldProducts: 0,
      endOfLife: parseFloat(company.scope3Categories?.endOfLife) || 0,
      downstreamLeasedAssets: 0,
      franchises: 0,
      investments: parseFloat(company.scope3Categories?.investments) || 0
    };
    
    const total = Object.values(scope3).reduce((sum, val) => sum + val, 0);
    
    // Categorize for reporting
    const upstream = scope3.purchasedGoods + scope3.capitalGoods + 
                     scope3.fuelAndEnergyRelated + scope3.upstreamTransport + 
                     scope3.waste + scope3.businessTravel + scope3.employeeCommuting;
    
    const downstream = scope3.downstreamTransport + scope3.processingOfSoldProducts + 
                       scope3.useOfSoldProducts + scope3.endOfLife + scope3.investments;
    
    return {
      total,
      breakdown: scope3,
      categories: {
        upstream: upstream.toFixed(0),
        downstream: downstream.toFixed(0),
        upstreamPercent: ((upstream / total) * 100).toFixed(1),
        downstreamPercent: ((downstream / total) * 100).toFixed(1)
      }
    };
  }
  
  /**
   * PILLAR 4: Climate Risk Exposure Metrics
   */
  calculateClimateRiskMetrics(company) {
    const totalAssets = parseFloat(company.totalAssets) || 
                        (parseFloat(company.annualRevenue) * 1000000 * 0.5); // Assume 0.5x revenue
    const revenue = parseFloat(company.annualRevenue) * 1000000 || 1;
    
    return {
      // Transition risk metrics
      carbonAssetExposure: {
        highCarbonRevenue: parseFloat(company.highCarbonSectorRevenue) || 0,
        asPercentRevenue: ((parseFloat(company.fossilRevenueShare) || 0) * 100).toFixed(1),
        benchmark: this.getSectorBenchmark(company.sector, 'carbonRevenue')
      },
      
      // Physical risk metrics
      physicalRiskExposure: {
        assetsInHighRiskZones: parseFloat(company.assetsInHighRiskZones) || 0,
        asPercentTotalAssets: ((parseFloat(company.assetsInHighRiskZones) / totalAssets) * 100).toFixed(1),
        floodExposure: parseFloat(company.floodZoneAssets) || 0,
        waterStressExposure: parseFloat(company.waterStressAssets) || 0
      },
      
      // Climate opportunities
      climateOpportunities: {
        greenRevenue: parseFloat(company.greenRevenue) || 0,
        asPercentRevenue: ((parseFloat(company.greenRevenue) / revenue) * 100).toFixed(1),
        taxonomyAligned: parseFloat(company.taxonomyAlignedRevenue) || 0,
        taxonomyAlignmentPercent: ((parseFloat(company.taxonomyAlignedRevenue) / revenue) * 100).toFixed(1)
      },
      
      // Targets
      scienceBasedTargets: {
        hasNetZeroCommitment: company.hasNetZeroCommitment || false,
        netZeroYear: company.netZeroYear || null,
        sbtiValidated: company.sbtiValidated || false,
        targetYear: company.emissionTargetYear || null,
        reductionTarget: company.emissionReductionTarget || null
      }
    };
  }
  
  /**
   * PILLAR 4: Target Progress Tracking
   */
  calculateTargetProgress(company) {
    if (!company.emissionReductionTarget || !company.emissionsBaseline) {
      return {
        applicable: false,
        message: 'Emisyon azaltma hedefi veya baseline girilmemiş'
      };
    }
    
    const baseYear = parseInt(company.emissionsBaseYear) || 2020;
    const currentYear = new Date().getFullYear();
    const targetYear = parseInt(company.emissionTargetYear) || 2030;
    
    const yearsElapsed = currentYear - baseYear;
    const totalYears = targetYear - baseYear;
    const progressPercent = yearsElapsed / totalYears;
    
    // Linear reduction pathway
    const baselineEmissions = parseFloat(company.emissionsBaseline);
    const reductionTarget = parseFloat(company.emissionReductionTarget) / 100;
    const targetEmissions = baselineEmissions * (1 - reductionTarget);
    const expectedEmissions = baselineEmissions - (baselineEmissions - targetEmissions) * progressPercent;
    
    // Current emissions (Scope 1 + 2)
    const actualEmissions = parseFloat(company.scope1Emissions || 0) + 
                           parseFloat(company.scope2Emissions || 0);
    
    const variance = ((actualEmissions - expectedEmissions) / expectedEmissions) * 100;
    
    // Required annual reduction going forward
    const yearsRemaining = targetYear - currentYear;
    const reductionRate = yearsRemaining > 0 ? 
      (1 - Math.pow(targetEmissions / actualEmissions, 1 / yearsRemaining)) : 0;
    const absoluteReduction = yearsRemaining > 0 ?
      (actualEmissions - targetEmissions) / yearsRemaining : 0;
    
    return {
      applicable: true,
      baseYear,
      targetYear,
      progressPercent: (progressPercent * 100).toFixed(1),
      baseline: baselineEmissions.toFixed(0),
      target: targetEmissions.toFixed(0),
      expected: expectedEmissions.toFixed(0),
      actual: actualEmissions.toFixed(0),
      variance: variance.toFixed(1),
      status: variance < -5 ? 'Ahead of target' :
              variance < 5 ? 'On track' :
              variance < 15 ? 'Behind target' :
              'Significantly off track',
      statusColor: variance < -5 ? 'green' :
                   variance < 5 ? 'blue' :
                   variance < 15 ? 'orange' : 'red',
      annualReductionRequired: {
        percentPerYear: (reductionRate * 100).toFixed(2),
        absolutePerYear: absoluteReduction.toFixed(0),
        feasibility: reductionRate > 0.10 ? 'Challenging' :
                     reductionRate > 0.05 ? 'Moderate' :
                     'Achievable'
      },
      recommendations: this.generateTargetRecommendations(variance, reductionRate)
    };
  }
  
  /**
   * Comprehensive TCFD Report Generation
   */
  generateTCFDReport(company) {
    return {
      governance: this.calculateGovernanceScore(company),
      strategy: {
        scenarios: ['orderly_1.5C', 'disorderly_2C', 'hothouse_3C'].map(s => 
          this.calculateScenarioImpact(company, s)
        ),
        riskOpportunityMap: this.mapRisksByTimeHorizon(company),
        materialRisks: (company.materialClimateRisks || []).map(r => 
          this.assessRiskMateriality(r, company)
        )
      },
      riskManagement: {
        process: company.climateRiskIdentificationProcess || 'Not disclosed',
        frequency: company.riskAssessmentFrequency || 'Not disclosed',
        materialityThreshold: company.materialityThreshold || 'Not set',
        ermIntegration: company.integrationWithERM || false
      },
      metricsTargets: {
        emissions: this.calculateGHGEmissions(company),
        exposureMetrics: this.calculateClimateRiskMetrics(company),
        targetProgress: this.calculateTargetProgress(company)
      },
      overallAssessment: this.generateOverallAssessment(company)
    };
  }
  
  // Helper methods
  getGDPElasticity(sector) {
    const elasticities = {
      'Finans': 1.0,
      'Enerji': 0.8,
      'Sanayi': 1.2,
      'Otomotiv': 1.5,
      'Altyapı': 0.9
    };
    return elasticities[sector] || 1.0;
  }
  
  calculateLikelihood(risk, company) {
    // Implementation based on PACTA_TCFD_FORMUL_ANALIZI.md
    return 3; // Default medium
  }
  
  calculateImpact(risk, company) {
    // Implementation based on PACTA_TCFD_FORMUL_ANALIZI.md
    return 3; // Default medium
  }
  
  // ... more helper methods
}

export default TCFDCalculator;
```

**✅ TODO 2.2.2: Helper methodları tamamla**
- `getShortTermTransitionRisks()`
- `getMediumTermPhysicalRisks()`
- `getLongTermOpportunities()`
- `generateGovernanceRecommendations()`
- `generateTargetRecommendations()`
- `compareToBenchmark()`
- `getSectorBenchmark()`

---

### 2.3 DataManager Güncellemesi

**✅ TODO 2.3.1: DataManager'a yeni save metodları ekle**

**Dosya:** `src/services/DataManager.js`

```javascript
// Mevcut DataManager class'ına ekle:

class DataManager {
  // ... mevcut kod
  
  /**
   * Save PACTA-specific data
   */
  savePACTAData(formData) {
    const pactaData = {
      sector: formData.sector,
      // Energy
      totalInstalledCapacityMW: formData.totalInstalledCapacityMW,
      coalCapacityMW: formData.coalCapacityMW,
      windCapacityMW: formData.windCapacityMW,
      solarCapacityMW: formData.solarCapacityMW,
      // ... all PACTA fields
      
      savedAt: new Date().toISOString()
    };
    
    this.save('pactaData', pactaData);
  }
  
  /**
   * Save TCFD-specific data
   */
  saveTCFDData(formData) {
    const tcfdData = {
      governance: {
        hasClimateExpertOnBoard: formData.hasClimateExpertOnBoard,
        boardClimateDiscussionFrequency: formData.boardClimateDiscussionFrequency,
        // ... all governance fields
      },
      strategy: {
        materialClimateRisks: formData.materialClimateRisks,
        // ... all strategy fields
      },
      riskManagement: {
        // ... all risk management fields
      },
      metricsTargets: {
        scope2Emissions: formData.scope2Emissions,
        scope3Emissions: formData.scope3Emissions,
        // ... all metrics fields
      },
      
      savedAt: new Date().toISOString()
    };
    
    this.save('tcfdData', tcfdData);
  }
  
  /**
   * Load PACTA data
   */
  loadPACTAData() {
    return this.load('pactaData');
  }
  
  /**
   * Load TCFD data
   */
  loadTCFDData() {
    return this.load('tcfdData');
  }
}
```

---

## 📊 PHASE 3: UI/RAPORLAMA (2 Hafta)

### 3.1 PACTA Alignment Dashboard

**✅ TODO 3.1.1: Yeni component oluştur**

**Yeni Dosya:** `src/components/PACTAAlignmentDashboard.js`

```javascript
import React from 'react';
import { useTranslation } from 'react-i18next';
import PACTACalculator from '../utils/pactaCalculator';

const PACTAAlignmentDashboard = ({ formData }) => {
  const { t } = useTranslation();
  const calculator = new PACTACalculator();
  
  const alignment = calculator.calculateAlignment(formData, 'NZE2050');
  
  if (!alignment.applicable) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>{alignment.message || 'PACTA bu sektör için uygulanabilir değildir.'}</p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>{t('pactaAlignment')}: {alignment.sector}</h2>
      
      {/* Alignment Status Card */}
      <div style={{
        padding: '20px',
        backgroundColor: alignment.alignmentStatus === 'Aligned' ? '#d4edda' :
                         alignment.alignmentStatus === 'Partially Aligned' ? '#fff3cd' :
                         '#f8d7da',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>
          {t('alignmentStatus')}: {alignment.alignmentStatus}
        </h3>
        <p style={{ margin: 0, fontSize: '14px' }}>
          {alignment.alignmentStatus === 'Aligned' ? 
            'Şirket Paris Anlaşması hedefleri ile uyumludur.' :
            alignment.alignmentStatus === 'Partially Aligned' ?
            'Şirket kısmen uyumlu, ancak daha fazla aksiyon gerekiyor.' :
            'Şirket Paris Anlaşması hedeflerinin gerisinde, acil aksiyon gerekiyor.'
          }
        </p>
      </div>
      
      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('currentShare')}</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {alignment.sector === 'Enerji' ? 
              `${alignment.currentRenewableShare}%` :
              `${alignment.currentEVShare}%`
            }
          </div>
        </div>
        
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('forecastShare')}</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {alignment.sector === 'Enerji' ? 
              `${alignment.forecastRenewableShare}%` :
              `${alignment.forecastEVShare}%`
            }
          </div>
        </div>
        
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('benchmark2030')}</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {alignment.benchmark}%
          </div>
        </div>
        
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('alignmentGap')}</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: parseFloat(alignment.alignmentGap) > 0 ? '#dc3545' : '#28a745' }}>
            {alignment.alignmentGap}%
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>{t('progressToBenchmark')}</span>
          <span>{alignment.forecastShare}% / {alignment.benchmark}%</span>
        </div>
        <div style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(100, (parseFloat(alignment.forecastShare) / parseFloat(alignment.benchmark)) * 100)}%`,
            height: '100%',
            backgroundColor: parseFloat(alignment.alignmentGap) < 5 ? '#28a745' : 
                             parseFloat(alignment.alignmentGap) < 15 ? '#ffc107' : '#dc3545',
            transition: 'width 0.5s ease'
          }}></div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div style={{ marginTop: '30px' }}>
        <h3>{t('recommendations')}</h3>
        {alignment.recommendations && alignment.recommendations.map((rec, index) => (
          <div key={index} style={{
            padding: '15px',
            backgroundColor: '#ffffff',
            border: '1px solid #dee2e6',
            borderLeft: `4px solid ${rec.priority === 'Critical' ? '#dc3545' : 
                                      rec.priority === 'High' ? '#fd7e14' :
                                      rec.priority === 'Medium' ? '#ffc107' : '#28a745'}`,
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong>{rec.category}</strong>
              <span style={{
                padding: '2px 8px',
                backgroundColor: rec.priority === 'Critical' ? '#dc3545' : 
                                 rec.priority === 'High' ? '#fd7e14' :
                                 rec.priority === 'Medium' ? '#ffc107' : '#28a745',
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {rec.priority}
              </span>
            </div>
            <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>{t('action')}:</strong> {rec.action}</p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>{t('target')}:</strong> {rec.target}</p>
            {rec.impact && <p style={{ margin: '5px 0', fontSize: '12px', color: '#6c757d' }}>{rec.impact}</p>}
          </div>
        ))}
      </div>
      
      {/* Details */}
      {alignment.details && (
        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4>{t('details')}</h4>
          <pre style={{ fontSize: '12px', overflowX: 'auto' }}>
            {JSON.stringify(alignment.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PACTAAlignmentDashboard;
```

---

### 3.2 TCFD Report Component

**✅ TODO 3.2.1: Yeni component oluştur**

**Yeni Dosya:** `src/components/TCFDReportViewer.js`

```javascript
import React from 'react';
import { useTranslation } from 'react-i18next';
import TCFDCalculator from '../utils/tcfdCalculator';

const TCFDReportViewer = ({ formData }) => {
  const { t } = useTranslation();
  const calculator = new TCFDCalculator();
  
  const tcfdReport = calculator.generateTCFDReport(formData);
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        {t('tcfdDisclosureReport')}
      </h1>
      
      {/* PILLAR 1: GOVERNANCE */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
          {t('governance')}
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: tcfdReport.governance.grade === 'Strong' ? '#d4edda' :
                             tcfdReport.governance.grade === 'Adequate' ? '#fff3cd' :
                             '#f8d7da',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
              {tcfdReport.governance.score}
            </div>
            <div style={{ fontSize: '18px', marginTop: '10px' }}>
              {tcfdReport.governance.grade}
            </div>
            <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '5px' }}>
              {t('governanceScore')}
            </div>
          </div>
          
          <div>
            <h4>{t('identifiedGaps')}</h4>
            <ul style={{ paddingLeft: '20px' }}>
              {tcfdReport.governance.gaps.map((gap, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>{gap}</li>
              ))}
            </ul>
            
            {tcfdReport.governance.recommendations && (
              <>
                <h4 style={{ marginTop: '20px' }}>{t('recommendations')}</h4>
                <ul style={{ paddingLeft: '20px' }}>
                  {tcfdReport.governance.recommendations.map((rec, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>{rec}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* PILLAR 2: STRATEGY */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
          {t('strategy')}
        </h2>
        
        <h3 style={{ marginTop: '20px' }}>{t('scenarioAnalysis')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', marginTop: '15px' }}>
          {tcfdReport.strategy.scenarios.map((scenario, index) => (
            <div key={index} style={{
              padding: '15px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              backgroundColor: '#ffffff'
            }}>
              <h4 style={{ margin: '0 0 10px 0' }}>{scenario.scenario}</h4>
              <p style={{ fontSize: '12px', color: '#6c757d', margin: '0 0 15px 0' }}>
                {scenario.description}
              </p>
              
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('ebitdaImpact')}</div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: Math.abs(parseFloat(scenario.impacts.ebitdaImpact)) > 15 ? '#dc3545' :
                         Math.abs(parseFloat(scenario.impacts.ebitdaImpact)) > 5 ? '#ffc107' :
                         '#28a745'
                }}>
                  {scenario.impacts.ebitdaImpact}%
                </div>
              </div>
              
              <div style={{ fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>{t('carbonCost')}:</span>
                  <strong>${scenario.impacts.carbonCost}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>{t('physicalImpact')}:</span>
                  <strong>${scenario.impacts.physicalImpact}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t('materiality')}:</span>
                  <strong>{scenario.materiality}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* PILLAR 3: RISK MANAGEMENT */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
          {t('riskManagement')}
        </h2>
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <p><strong>{t('process')}:</strong> {tcfdReport.riskManagement.process}</p>
          <p><strong>{t('frequency')}:</strong> {tcfdReport.riskManagement.frequency}</p>
          <p><strong>{t('materialityThreshold')}:</strong> {tcfdReport.riskManagement.materialityThreshold}</p>
          <p><strong>{t('ermIntegration')}:</strong> {tcfdReport.riskManagement.ermIntegration ? t('yes') : t('no')}</p>
        </div>
      </section>
      
      {/* PILLAR 4: METRICS & TARGETS */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
          {t('metricsAndTargets')}
        </h2>
        
        {/* GHG Emissions */}
        <h3 style={{ marginTop: '20px' }}>{t('ghgEmissions')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#e7f1ff', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>Scope 1</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {tcfdReport.metricsTargets.emissions.scope1.total}
            </div>
            <div style={{ fontSize: '12px' }}>tCO2e</div>
          </div>
          
          <div style={{ padding: '15px', backgroundColor: '#e7f1ff', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>Scope 2</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {tcfdReport.metricsTargets.emissions.scope2.total}
            </div>
            <div style={{ fontSize: '12px' }}>tCO2e ({tcfdReport.metricsTargets.emissions.scope2.method})</div>
          </div>
          
          <div style={{ padding: '15px', backgroundColor: '#e7f1ff', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>Scope 3</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {tcfdReport.metricsTargets.emissions.scope3.total}
            </div>
            <div style={{ fontSize: '12px' }}>tCO2e</div>
          </div>
        </div>
        
        {/* Intensity Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('revenueIntensity')}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {tcfdReport.metricsTargets.emissions.intensityMetrics.revenueIntensity}
            </div>
            <div style={{ fontSize: '12px' }}>tCO2e / M USD</div>
          </div>
          
          <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('employeeIntensity')}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {tcfdReport.metricsTargets.emissions.intensityMetrics.employeeIntensity}
            </div>
            <div style={{ fontSize: '12px' }}>tCO2e / çalışan</div>
          </div>
        </div>
        
        {/* Target Progress */}
        {tcfdReport.metricsTargets.targetProgress.applicable && (
          <>
            <h3 style={{ marginTop: '30px' }}>{t('targetProgress')}</h3>
            <div style={{
              padding: '20px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              marginTop: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('baseline')} ({tcfdReport.metricsTargets.targetProgress.baseYear})</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {tcfdReport.metricsTargets.targetProgress.baseline} tCO2e
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('actual')} ({new Date().getFullYear()})</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {tcfdReport.metricsTargets.targetProgress.actual} tCO2e
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('target')} ({tcfdReport.metricsTargets.targetProgress.targetYear})</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {tcfdReport.metricsTargets.targetProgress.target} tCO2e
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>{t('status')}:</span>
                  <strong style={{ color: tcfdReport.metricsTargets.targetProgress.statusColor }}>
                    {tcfdReport.metricsTargets.targetProgress.status}
                  </strong>
                </div>
                <div style={{ height: '10px', backgroundColor: '#e9ecef', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${tcfdReport.metricsTargets.targetProgress.progressPercent}%`,
                    height: '100%',
                    backgroundColor: tcfdReport.metricsTargets.targetProgress.statusColor
                  }}></div>
                </div>
              </div>
              
              <div style={{ fontSize: '12px', marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <p><strong>{t('variance')}:</strong> {tcfdReport.metricsTargets.targetProgress.variance}%</p>
                <p><strong>{t('requiredReduction')}:</strong> {tcfdReport.metricsTargets.targetProgress.annualReductionRequired.percentPerYear}% per year</p>
                <p><strong>{t('feasibility')}:</strong> {tcfdReport.metricsTargets.targetProgress.annualReductionRequired.feasibility}</p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default TCFDReportViewer;
```

---

## 🌐 PHASE 4: i18n GÜNCELLEMELERİ (1 Hafta)

### 4.1 Yeni Translation Keys

**✅ TODO 4.1.1: i18n.js güncelle**

**Dosya:** `src/i18n.js`

```javascript
// Mevcut translations'a ekle:

const resources = {
  tr: {
    translation: {
      // ... mevcut translations
      
      // PACTA Sector Data (Step 11)
      pactaSectorData: 'PACTA Sektör Verileri',
      pactaDescription: 'Paris Anlaşması uyum analizi için sektörünüze özel verileri girin',
      capacityData: 'Kapasite Verileri',
      productionData: 'Üretim Verileri',
      forwardLookingData: 'Gelecek Planları',
      totalInstalledCapacityMW: 'Toplam Kurulu Güç (MW)',
      coalCapacityMW: 'Kömür Kapasitesi (MW)',
      windCapacityMW: 'Rüzgar Kapasitesi (MW)',
      solarCapacityMW: 'Güneş Kapasitesi (MW)',
      hydroCapacityMW: 'Hidroelektrik Kapasitesi (MW)',
      biomassCapacityMW: 'Biyokütle Kapasitesi (MW)',
      geothermalCapacityMW: 'Jeotermal Kapasitesi (MW)',
      nuclearCapacityMW: 'Nükleer Kapasitesi (MW)',
      gasCapacityMW: 'Doğalgaz Kapasitesi (MW)',
      oilCapacityMW: 'Petrol Kapasitesi (MW)',
      renewableTarget2030: '2030 Yenilenebilir Hedefi (%)',
      coalPhaseoutDate: 'Kömür Santral Kapatma Tarihi',
      plannedRetirements: 'Planlı Emekliye Ayırmalar',
      plannedAdditions: 'Planlı Yeni Eklemeler',
      addRetirement: 'Emekliye Ayırma Ekle',
      
      // Automotive
      annualTotalProduction: 'Yıllık Toplam Üretim (adet)',
      iceProduction: 'İçten Yanmalı Motor Üretimi',
      bevProduction: 'Bataryalı Elektrikli Araç Üretimi (BEV)',
      phevProduction: 'Şarj Edilebilir Hibrit Üretimi (PHEV)',
      fcevProduction: 'Hidrojen Yakıt Hücreli Üretimi (FCEV)',
      evProductionTarget2030: '2030 EV Üretim Hedefi (%)',
      batteryCapacityGWh: 'Batarya Kapasitesi (GWh)',
      
      // Steel
      annualSteelProduction: 'Yıllık Çelik Üretimi (milyon ton)',
      carbonIntensity: 'Karbon Yoğunluğu (tCO2/ton)',
      bfbofProduction: 'Yüksek Fırın Üretimi (BF-BOF)',
      eafProduction: 'Elektrik Ark Ocağı Üretimi (EAF)',
      
      // TCFD Governance & Targets (Step 12)
      tcfdGovernanceTargets: 'TCFD Yönetişim ve Hedefler',
      governance: 'Yönetişim',
      strategy: 'Strateji',
      riskManagement: 'Risk Yönetimi',
      metricsTargets: 'Metrikler ve Hedefler',
      
      hasClimateExpertOnBoard: 'Yönetim kurulunda iklim uzmanı var',
      boardClimateDiscussionFrequency: 'YK\'da iklim tartışma sıklığı (yıllık)',
      hasClimateRiskCommittee: 'İklim risk komitesi var',
      hasChiefSustainabilityOfficer: 'Sürdürülebilirlik direktörü var (C-level)',
      climateRiskInERM: 'İklim riski kurumsal risk yönetimine entegre',
      climateKPIsInExecutiveComp: 'Yönetici maaşlarında iklim KPI\'ları var',
      hasClimatePolicy: 'Resmi iklim politikası var',
      
      materialClimateRisks: 'Önemli İklim Riskleri',
      materialClimateOpportunities: 'İklim Fırsatları',
      riskDescription: 'Risk Açıklaması',
      selectTimeframe: 'Zaman Dilimi Seçin',
      shortTerm: 'Kısa Vade (0-3 yıl)',
      mediumTerm: 'Orta Vade (3-10 yıl)',
      longTerm: 'Uzun Vade (10+ yıl)',
      addRisk: 'Risk Ekle',
      
      scope2Emissions: 'Scope 2 Emisyonlar',
      scope3Emissions: 'Scope 3 Emisyonlar',
      hasNetZeroCommitment: 'Net-zero taahhüdü var',
      netZeroYear: 'Net-zero hedef yılı',
      emissionReductionTarget: 'Emisyon azaltma hedefi (%)',
      emissionTargetYear: 'Hedef yılı',
      
      // PACTA Dashboard
      pactaAlignment: 'PACTA Uyum Analizi',
      alignmentStatus: 'Uyum Durumu',
      currentShare: 'Mevcut Pay',
      forecastShare: 'Öngörülen Pay',
      benchmark2030: '2030 Benchmark',
      alignmentGap: 'Uyum Açığı',
      progressToBenchmark: 'Benchmark\'a İlerleme',
      recommendations: 'Öneriler',
      action: 'Aksiyon',
      target: 'Hedef',
      details: 'Detaylar',
      
      // TCFD Report
      tcfdDisclosureReport: 'TCFD İfşaat Raporu',
      governanceScore: 'Yönetişim Skoru',
      identifiedGaps: 'Tespit Edilen Eksiklikler',
      scenarioAnalysis: 'Senaryo Analizi',
      ebitdaImpact: 'EBITDA Etkisi',
      carbonCost: 'Karbon Maliyeti',
      physicalImpact: 'Fiziksel Etki',
      materiality: 'Önemlilik',
      process: 'Süreç',
      frequency: 'Sıklık',
      materialityThreshold: 'Önemlilik Eşiği',
      ermIntegration: 'ERM Entegrasyonu',
      ghgEmissions: 'GHG Emisyonlar',
      revenueIntensity: 'Ciro Yoğunluğu',
      employeeIntensity: 'Çalışan Başına Yoğunluk',
      targetProgress: 'Hedef İlerlemesi',
      baseline: 'Baseline',
      actual: 'Gerçekleşen',
      status: 'Durum',
      variance: 'Sapma',
      requiredReduction: 'Gerekli Azaltma',
      feasibility: 'Uygulanabilirlik',
      
      // ... 100+ more translations
    }
  },
  en: {
    translation: {
      // ... corresponding English translations
      pactaSectorData: 'PACTA Sector Data',
      pactaDescription: 'Enter sector-specific data for Paris Agreement alignment analysis',
      capacityData: 'Capacity Data',
      productionData: 'Production Data',
      forwardLookingData: 'Forward-Looking Plans',
      totalInstalledCapacityMW: 'Total Installed Capacity (MW)',
      coalCapacityMW: 'Coal Capacity (MW)',
      windCapacityMW: 'Wind Capacity (MW)',
      solarCapacityMW: 'Solar Capacity (MW)',
      // ... 200+ more English translations
    }
  }
};
```

**✅ TODO 4.1.2: Eksik translation key'leri tamamla**
- Toplam 200+ yeni terim eklenecek
- Her terim için TR ve EN versiyonları

---

## 🧪 PHASE 5: TEST & VALİDASYON (1 Hafta)

### 5.1 Unit Tests

**✅ TODO 5.1.1: PACTA Calculator testleri**

**Yeni Dosya:** `src/utils/__tests__/pactaCalculator.test.js`

```javascript
import PACTACalculator from '../pactaCalculator';

describe('PACTACalculator', () => {
  const calculator = new PACTACalculator();
  
  describe('Energy Sector', () => {
    test('should calculate renewable share correctly', () => {
      const company = {
        sector: 'Enerji',
        totalInstalledCapacityMW: 1000,
        windCapacityMW: 300,
        solarCapacityMW: 200,
        hydroCapacityMW: 100,
        coalCapacityMW: 400
      };
      
      const result = calculator.calculatePowerAlignment(company, 'NZE2050');
      
      expect(result.applicable).toBe(true);
      expect(parseFloat(result.currentRenewableShare)).toBe(60.0);
      expect(result.alignmentStatus).toBe('Partially Aligned');
    });
    
    test('should handle missing capacity data', () => {
      const company = {
        sector: 'Enerji',
        totalInstalledCapacityMW: 0
      };
      
      const result = calculator.calculatePowerAlignment(company, 'NZE2050');
      
      expect(result.applicable).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    // More tests...
  });
  
  describe('Automotive Sector', () => {
    test('should calculate EV share correctly', () => {
      const company = {
        sector: 'Otomotiv',
        annualTotalProduction: 100000,
        iceProduction: 80000,
        bevProduction: 15000,
        phevProduction: 5000
      };
      
      const result = calculator.calculateAutomotiveAlignment(company, 'NZE2050');
      
      expect(result.applicable).toBe(true);
      expect(parseFloat(result.currentEVShare)).toBe(20.0);
    });
    
    // More tests...
  });
});
```

**✅ TODO 5.1.2: TCFD Calculator testleri**

**Yeni Dosya:** `src/utils/__tests__/tcfdCalculator.test.js`

```javascript
import TCFDCalculator from '../tcfdCalculator';

describe('TCFDCalculator', () => {
  const calculator = new TCFDCalculator();
  
  describe('Governance Score', () => {
    test('should calculate score correctly with all fields', () => {
      const company = {
        hasClimateExpertOnBoard: true,
        boardClimateDiscussionFrequency: 4,
        hasClimateRiskCommittee: true,
        hasChiefSustainabilityOfficer: true,
        climateRiskInERM: true,
        climateKPIsInExecutiveComp: true,
        hasClimatePolicy: true
      };
      
      const result = calculator.calculateGovernanceScore(company);
      
      expect(result.score).toBe(100);
      expect(result.grade).toBe('Strong');
      expect(result.gaps).toHaveLength(0);
    });
    
    // More tests...
  });
  
  describe('GHG Emissions', () => {
    test('should calculate scope 1,2,3 correctly', () => {
      const company = {
        scope1Emissions: 10000,
        scope2Emissions: 5000,
        totalEnergyConsumption: 100,
        renewableEnergyShare: 30,
        annualRevenue: 500,
        employees: 1000
      };
      
      const result = calculator.calculateGHGEmissions(company);
      
      expect(parseFloat(result.scope1.total)).toBe(10000);
      expect(parseFloat(result.scope2.total)).toBeGreaterThan(0);
      expect(parseFloat(result.totalEmissions)).toBeGreaterThan(15000);
    });
    
    // More tests...
  });
});
```

---

### 5.2 Integration Tests

**✅ TODO 5.2.1: Form submission end-to-end test**

```javascript
// Test form filling ve hesaplama pipeline'ı
describe('Complete Assessment Flow', () => {
  test('should complete all 12 steps and generate reports', () => {
    // 1. Fill steps 1-12
    // 2. Validate data
    // 3. Submit form
    // 4. Generate PACTA report
    // 5. Generate TCFD report
    // 6. Verify all calculations
  });
});
```

---

## 📦 PHASE 6: ENTEGRASYONü GÜÇLENDİRME (1 Hafta)

### 6.1 App.js Router Güncellemesi

**✅ TODO 6.1.1: Yeni route'lar ekle**

**Dosya:** `src/App.js`

```javascript
import PACTAAlignmentDashboard from './components/PACTAAlignmentDashboard';
import TCFDReportViewer from './components/TCFDReportViewer';

// Router'a ekle:
<Route path="/pacta-alignment" element={<PACTAAlignmentDashboard formData={formData} />} />
<Route path="/tcfd-report" element={<TCFDReportViewer formData={formData} />} />
```

---

### 6.2 Navigation Updates

**✅ TODO 6.2.1: Layout.js'e yeni menü linkleri ekle**

```javascript
<nav>
  <Link to="/">Home</Link>
  <Link to="/assessment">Risk Assessment</Link>
  <Link to="/pacta-alignment">PACTA Alignment</Link>
  <Link to="/tcfd-report">TCFD Report</Link>
  <Link to="/reports">Financial Reports</Link>
</nav>
```

---

## 📋 ÖNCELİK SIRALAMA ve SÜRE TAHMİNİ

| Faz | İşler | Öncelik | Süre | Bağımlılıklar |
|-----|-------|---------|------|--------------|
| **Phase 1** | Form Genişletme (Step 11-12) | 🔴 Kritik | 2-3 hafta | - |
| **Phase 2** | PACTA & TCFD Calculators | 🔴 Kritik | 3-4 hafta | Phase 1 |
| **Phase 3** | UI/Dashboard Components | 🟡 Yüksek | 2 hafta | Phase 2 |
| **Phase 4** | i18n Translations | 🟡 Orta | 1 hafta | Phase 1 |
| **Phase 5** | Testing & Validation | 🟢 Orta | 1 hafta | Phase 2,3 |
| **Phase 6** | Integration | 🟢 Düşük | 1 hafta | Tümü |
| **TOPLAM** | - | - | **10-12 hafta** | - |

---

## 🎯 SUCCESS CRITERIA

### Minimum Viable Product (MVP)
- ✅ Form Step 11-12 çalışıyor
- ✅ PACTA Enerji + Otomotiv hesaplamaları çalışıyor
- ✅ TCFD 4 pillar temel hesaplamaları çalışıyor
- ✅ Scope 1,2,3 emissions hesaplanıyor
- ✅ Basit dashboard görünümü var

### Full Production Ready
- ✅ Tüm 6 PACTA sektörü çalışıyor
- ✅ TCFD tam rapor üretilebiliyor
- ✅ PDF export çalışıyor
- ✅ i18n tam çevrilmiş
- ✅ Unit testler %80+ coverage
- ✅ Validation hataları güzel mesajlarla gösteriliyor

---

## 💡 IMPLEMENTATION NOTES

### Kritik Noktalar
1. **Form validation** - Her step'te değil, final submission'da yap
2. **LocalStorage limits** - Veri 5MB'ı aşarsa uyar
3. **Calculation performance** - Heavy calculations için loading indicator
4. **Error handling** - Graceful degradation (bir calculator fail olursa diğerleri çalışmaya devam)
5. **i18n fallback** - Missing translation varsa Turkish'e fall back

### Best Practices
- Component'ler modüler ve reusable olsun
- Calculation logic UI'dan tamamen ayrı
- All numeric inputs parseFloat ile validate
- Array operations safely handle empty arrays
- Console.log'ları production'da kaldır

---

## 📞 SUPPORT & REFERANSLAR

- **PACTA Metodoloji Raporu**: `PACTA_TCFD_FORMUL_ANALIZI.md`
- **Mevcut Sistem Dökümantasyonu**: `CLIMATE_PLATFORM_DOCUMENTATION.md`
- **PACTA Official Docs**: https://2degrees-investing.org/
- **TCFD Recommendations**: https://www.fsb-tcfd.org/
- **GHG Protocol**: https://ghgprotocol.org/

---

**Son Güncelleme:** 31 Ekim 2024  
**Durum:** Implementation'a hazır - Task detayları tamamlandı  
**Tahmini Tamamlanma:** 10-12 hafta (1 developer)
