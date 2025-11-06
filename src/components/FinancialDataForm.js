import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocationClimateData, integrateLocationDataToForm } from '../services/locationClimateDataService';

const FinancialDataForm = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal/Company Information
    entityName: '',
    entityType: 'individual', // individual, corporate, partnership
    taxId: '',
    businessType: '',
    establishmentDate: '',
    country: 'Turkey',
    currency: 'TRY',
    
    // Geographic and Location Information
    facilityLatitude: '',
    facilityLongitude: '',
    facilityElevation: '',
    physicalAddress: '',
    city: '',
    district: '',
    postalCode: '',
    region: '',
    climateZone: '',
    proximityToCoast: '', // km
    proximityToRiver: '', // km
    landUseType: '', // industrial, commercial, residential, mixed
    facilitySize: '', // m2
    buildingAge: '', // years
    
    // Income Data
    monthlyIncome: '',
    annualRevenue: '',
    operatingIncome: '',
    investmentIncome: '',
    otherIncomes: [],
    
    // Expense Data
    monthlyExpenses: '',
    operatingExpenses: '',
    administrativeExpenses: '',
    marketingExpenses: '',
    financialExpenses: '',
    otherExpenses: [],
    
    // Assets
    cashAndEquivalents: '',
    bankDeposits: '',
    investments: '',
    realEstate: '',
    equipment: '',
    inventory: '',
    accountsReceivable: '',
    otherAssets: [],
    
    // Liabilities
    shortTermLoans: '',
    longTermLoans: '',
    accountsPayable: '',
    taxLiabilities: '',
    otherLiabilities: [],
    
    // Financial Ratios & Metrics
    debtToIncomeRatio: '',
    liquidityRatio: '',
    profitMargin: '',
    
    // Investment Portfolio
    stocks: '',
    bonds: '',
    mutualFunds: '',
    cryptoCurrency: '',
    commodities: '',
    
    // Financial Goals
    shortTermGoals: [],
    longTermGoals: [],
    riskTolerance: 'moderate', // low, moderate, high
    investmentHorizon: '',
    
    // Credit Risk Information
    creditScore: '',
    probabilityOfDefault: '', // PD %
    lossGivenDefault: '', // LGD %
    loanMaturityYears: '',
    repaymentStatus: 'current', // current, late, default
    collateralValue: '',
    collateralType: '',
    insuranceCoverage: '',
    assetType: '',
    guarantorInfo: '',
    
    // Export and CBAM Information
    exportDestinations: [],
    cbamCoverage: 'none', // none, partial, full
    cbamSectors: [],
    hsCodes: [],
    exportValue: '',
    exportPercentage: '',
    euExports: '',
    carbonContent: '',
    productCertifications: [],
    
    // ESG and Environmental Information
    isoCertifications: [],
    eiaReports: '',
    environmentalActionPlans: '',
    energyAudit: '',
    carbonFootprintCalculated: false,
    renewableEnergyTargets: '',
    waterManagement: '',
    wasteManagement: '',
    biodiversityImpact: '',
    stakeholderEngagement: '',
    
    // Physical Risk Assessment
    floodZoneExposure: '',
    historicalHazardIncidents: [],
    physicalRiskAssessment: '',
    climateAdaptationMeasures: '',
    emergencyPreparedness: '',
    businessContinuityPlan: '',
    
    // Additional Information
    financialAdvisor: '',
    bankingRelationships: [],
    insurancePolicies: [],
    notes: '',
    
    // PACTA Sector Selection
    pactaSector: '', // Enerji, Otomotiv, Çelik, Çimento, Havacılık, Gayrimenkul
    
    // PACTA - Energy Sector Data
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
    plannedRetirements: [], // {year, assetType, capacityMW}
    plannedAdditions: [], // {year, technology, capacityMW}
    renewableTarget2030: '',
    coalPhaseoutDate: '',
    
    // PACTA - Automotive Sector Data
    annualTotalProduction: '',
    iceProduction: '',
    hybridProduction: '',
    bevProduction: '',
    phevProduction: '',
    fcevProduction: '',
    iceCapacity: '',
    evCapacity: '',
    evProductionTarget2030: '',
    icePlantClosures: [], // {year, location, capacityUnits}
    evInvestmentPipeline: '',
    batteryCapacityGWh: '',
    
    // PACTA - Steel Sector Data
    annualSteelProduction: '', // million tons
    bofProductionShare: '', // %
    eafProductionShare: '', // %
    driProductionShare: '', // %
    hydrogenSteelShare: '', // %
    steelCarbonIntensity: '', // tCO2/ton steel
    lowCarbonSteelTarget2030: '', // %
    hydrogenInvestmentPipeline: '',
    ccsImplementation: '', // none, planned, active
    
    // PACTA - Cement Sector Data
    annualCementProduction: '', // million tons
    clinkerRatio: '', // %
    alternativeFuelsShare: '', // %
    wasteHeatRecovery: '', // yes, no
    cementCarbonIntensity: '', // tCO2/ton cement
    clinkerSubstitutionTarget: '', // %
    ccsCementPlans: '', // none, planned, active
    
    // PACTA - Aviation Sector Data
    annualPassengerKm: '', // billion pkm
    annualFreightTonKm: '', // million tkm
    fleetSize: '',
    averageFleetAge: '', // years
    safUsage: '', // % of total fuel
    safTarget2030: '', // %
    efficientAircraftOrders: '',
    offsetProgramActive: '', // yes, no
    
    // PACTA - Real Estate Sector Data
    totalBuildingArea: '', // m2
    residentialArea: '', // m2
    commercialArea: '', // m2
    averageBuildingAge: '', // years
    energyEfficiencyRating: '', // A, B, C, D, E, F, G
    renewableHeatingShare: '', // %
    buildingEmissionsIntensity: '', // kgCO2/m2/year
    retrofitPlanActive: '', // yes, no
    greenBuildingCertifications: '', // LEED, BREEAM, etc.
    
    // TCFD - Governance
    hasClimateExpertOnBoard: '', // yes, no
    boardClimateDiscussionFrequency: '', // quarterly, biannually, annually
    hasClimateRiskCommittee: '', // yes, no
    hasChiefSustainabilityOfficer: '', // yes, no
    climateRiskInERM: '', // yes, no, partial
    climateKPIsInExecutiveComp: '', // yes, no
    hasClimatePolicy: '', // yes, no
    climateGovernanceNotes: '',
    
    // TCFD - Strategy
    climateRiskTimeHorizons: {
      short: '', // years
      medium: '', // years
      long: '' // years
    },
    materialClimateRisks: [], // {riskType, impact, timeHorizon}
    materialClimateOpportunities: [], // {opportunityType, potential, timeHorizon}
    scenariosUsed: [], // orderly_1.5C, disorderly_2C, hothouse_3C
    strategyResilienceAssessment: '',
    
    // TCFD - Risk Management
    climateRiskIdentificationProcess: '',
    riskAssessmentFrequency: '', // monthly, quarterly, annually
    materialityThreshold: '', // financial threshold
    climateRiskAppetiteStatement: '',
    integrationWithERM: '', // yes, no, partial
    riskManagementNotes: '',
    
    // TCFD - Metrics & Targets (ECB/IFRS S2 Enhanced)
    scope1Emissions: '', // tCO2e
    scope2LocationEmissions: '', // location-based method
    scope2MarketEmissions: '', // market-based method (preferred)
    scope2Method: 'market-based', // location-based, market-based
    scope3Emissions: '',
    
    // Scope 3 Categories (individual fields for easier handling)
    cat1_purchasedGoods: '',
    cat2_capitalGoods: '',
    cat3_fuelEnergy: '',
    cat4_upstreamTransport: '',
    cat5_waste: '',
    cat6_businessTravel: '',
    cat7_employeeCommute: '',
    cat8_upstreamLeased: '',
    cat9_downstreamTransport: '',
    cat10_processing: '',
    cat11_useOfProducts: '',
    cat12_endOfLife: '',
    cat13_downstreamLeased: '',
    cat14_franchises: '',
    cat15_investments: '',
    emissionsBaseYear: '',
    emissionsBaseline: '',
    hasNetZeroCommitment: '', // yes, no
    netZeroYear: '',
    interimTargets: [], // {year, targetPercentage, scope}
    sbtiValidated: '', // yes, no, in-progress
    emissionReductionTarget: '', // %
    emissionTargetYear: '',
    highCarbonSectorRevenue: '',
    fossilRevenueShare: '', // %
    greenRevenue: '',
    taxonomyAlignedRevenue: '', // %
    assetsInHighRiskZones: '',
    floodZoneAssets: '',
    waterStressAssets: '',
    renewableEnergyShare: '', // %
    renewableCapex: '',
    greenFinancingAmount: '',
    
    // ECB/IFRS S2 PCAF Financial Fields
    ebitdaAmount: '', // EBITDA in local currency
    exposureAtDefault: '', // EAD - outstanding loan/credit amount
    equityMarketValue: '', // For attribution factor
    probabilityOfDefaultBase: '0.03', // PD baseline (default 3%)
    lossGivenDefaultBase: '0.40', // LGD baseline (default 40%)
    riskWeightBase: '0.75', // Risk weight (default 75%)
    loanTenorYears: '8', // Maturity in years
    collateralVulnerability: '0.5', // 0-1 scale
    requiredTransitionCapex: '', // CapEx needed for net-zero
    complianceCostAnnual: '', // Annual compliance costs
    
    // Physical Risk - P-S-A Components (0-1 scale)
    physicalRiskProbability: {
      heat: '0.5',
      drought: '0.5',
      flood: '0.5',
      coastal: '0.5',
      precip: '0.5'
    },
    adaptiveCapacity: {
      infrastructure: '0.5', // 0-1: physical infrastructure resilience
      financial: '0.5', // 0-1: financial capacity for adaptation
      governance: '0.5', // 0-1: governance quality
      technology: '0.5' // 0-1: technology readiness
    },
    
    // Governance Scoring (0-1 scale for ECB calculator)
    governanceBoardOversight: '0.5', // 0-1 scale
    governanceManagementRole: '0.5', // 0-1 scale
    governanceIncentives: '0.5', // 0-1 scale
    governanceRnDScore: '0.5', // 0-1 scale: R&D/Innovation capacity
    
    // CBAM (Carbon Border Adjustment Mechanism)
    cbamEmbeddedEmissions: '', // tCO2 per unit product
    cbamEUPrice: '85', // EU ETS price (default $85/tCO2)
    cbamOriginPrice: '20', // Origin country carbon price (default $20)
    cbamExportVolumeUnits: '', // Number of units exported to EU
    cbamExportValue: '', // Total export value to EU
    
    // Risk Tags / Amplifiers (0-1 scale)
    tagWaterDependency: '0', // 0-1: Water dependency level
    tagStrandingRisk: '0', // 0-1: Stranded asset exposure
    tagCoastalVulnerability: '0', // 0-1: Coastal location risk
    tagSupplyChainExposure: '0' // 0-1: Supply chain climate risk
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < 12) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Auto-calculate physical risks from location data
  const handleAutoCalculateRisks = async () => {
    try {
      // Validate location inputs
      if (!formData.facilityLatitude || !formData.facilityLongitude) {
        alert(t('pleaseEnterLatitudeLongitude') || 'Please enter latitude and longitude first!');
        return;
      }

      const latitude = parseFloat(formData.facilityLatitude);
      const longitude = parseFloat(formData.facilityLongitude);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        alert(t('invalidCoordinates') || 'Invalid coordinates. Please check your input.');
        return;
      }

      // Get location-based climate data
      const locationData = await getLocationClimateData({
        latitude,
        longitude,
        elevation: parseFloat(formData.facilityElevation) || 0,
        distanceToCoast: parseFloat(formData.proximityToCoast) || 50
      });

      // Integrate into form data
      const updatedData = integrateLocationDataToForm(formData, locationData);
      setFormData(updatedData);

      // Success message
      const message = `✅ ${t('physicalRisksCalculated') || 'Physical risks auto-calculated'} \n` +
        `${t('climateZone') || 'Climate Zone'}: ${locationData.climate.climateName}\n` +
        `${t('country') || 'Country'}: ${locationData.location.countryCode}\n\n` +
        `${t('riskScores') || 'Risk Scores'}:\n` +
        `• ${t('heat') || 'Heat'}: ${(locationData.physicalRiskProbability.heat * 100).toFixed(0)}%\n` +
        `• ${t('drought') || 'Drought'}: ${(locationData.physicalRiskProbability.drought * 100).toFixed(0)}%\n` +
        `• ${t('flood') || 'Flood'}: ${(locationData.physicalRiskProbability.flood * 100).toFixed(0)}%\n` +
        `• ${t('coastal') || 'Coastal'}: ${(locationData.physicalRiskProbability.coastal * 100).toFixed(0)}%`;
      
      alert(message);

    } catch (error) {
      console.error('Location calculation error:', error);
      alert(t('errorCalculatingRisks') || 'Error calculating risks. Please check your coordinates and try again.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#374151'
  };

  const sectionStyle = {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  };

  const renderStep1 = () => (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>{t('personalCompanyInfo')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('entityName')} *</label>
          <input
            type="text"
            value={formData.entityName}
            onChange={(e) => handleInputChange('entityName', e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>{t('entityType')} *</label>
          <select
            value={formData.entityType}
            onChange={(e) => handleInputChange('entityType', e.target.value)}
            style={inputStyle}
            required
          >
            <option value="individual">{t('individual')}</option>
            <option value="corporate">{t('corporate')}</option>
            <option value="partnership">{t('partnership')}</option>
            <option value="llc">{t('limitedLiabilityCompany')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('taxId')}</label>
          <input
            type="text"
            value={formData.taxId}
            onChange={(e) => handleInputChange('taxId', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>{t('businessType')}</label>
          <input
            type="text"
            value={formData.businessType}
            onChange={(e) => handleInputChange('businessType', e.target.value)}
            style={inputStyle}
            placeholder={t('businessTypePlaceholder')}
          />
        </div>
        <div>
          <label style={labelStyle}>{t('establishmentDate')}</label>
          <input
            type="date"
            value={formData.establishmentDate}
            onChange={(e) => handleInputChange('establishmentDate', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>{t('currency')} *</label>
          <select
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            style={inputStyle}
            required
          >
            <option value="TRY">TRY - Turkish Lira</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="QAR">QAR - Qatari Riyal</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>{t('geographicLocationInfo')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('facilityLatitude')} *</label>
          <input
            type="number"
            step="any"
            value={formData.facilityLatitude}
            onChange={(e) => handleInputChange('facilityLatitude', e.target.value)}
            style={inputStyle}
            placeholder="41.0082"
            required
          />
        </div>
        <div>
          <label style={labelStyle}>{t('facilityLongitude')} *</label>
          <input
            type="number"
            step="any"
            value={formData.facilityLongitude}
            onChange={(e) => handleInputChange('facilityLongitude', e.target.value)}
            style={inputStyle}
            placeholder="28.9784"
            required
          />
        </div>
        <div>
          <label style={labelStyle}>{t('facilityElevation')} (m)</label>
          <input
            type="number"
            value={formData.facilityElevation}
            onChange={(e) => handleInputChange('facilityElevation', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('physicalAddress')} *</label>
          <input
            type="text"
            value={formData.physicalAddress}
            onChange={(e) => handleInputChange('physicalAddress', e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>{t('city')} *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>{t('district')}</label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>{t('postalCode')}</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            style={inputStyle}
            placeholder="34000"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('region')}</label>
          <select
            value={formData.region}
            onChange={(e) => handleInputChange('region', e.target.value)}
            style={inputStyle}
          >
            <option value="">{t('selectRegion')}</option>
            <option value="marmara">{t('marmaraRegion')}</option>
            <option value="aegean">{t('aegeanRegion')}</option>
            <option value="mediterranean">{t('mediterraneanRegion')}</option>
            <option value="central_anatolia">{t('centralAnatoliaRegion')}</option>
            <option value="black_sea">{t('blackSeaRegion')}</option>
            <option value="eastern_anatolia">{t('easternAnatoliaRegion')}</option>
            <option value="southeastern_anatolia">{t('southeasternAnatoliaRegion')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('climateZone')}</label>
          <select
            value={formData.climateZone}
            onChange={(e) => handleInputChange('climateZone', e.target.value)}
            style={inputStyle}
          >
            <option value="">{t('selectClimateZone')}</option>
            <option value="mediterranean">{t('mediterraneanClimate')}</option>
            <option value="continental">{t('continentalClimate')}</option>
            <option value="oceanic">{t('oceanicClimate')}</option>
            <option value="semi_arid">{t('semiAridClimate')}</option>
            <option value="humid_subtropical">{t('humidSubtropicalClimate')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('landUseType')}</label>
          <select
            value={formData.landUseType}
            onChange={(e) => handleInputChange('landUseType', e.target.value)}
            style={inputStyle}
          >
            <option value="">{t('selectLandUseType')}</option>
            <option value="industrial">{t('industrial')}</option>
            <option value="commercial">{t('commercial')}</option>
            <option value="residential">{t('residential')}</option>
            <option value="mixed">{t('mixed')}</option>
            <option value="agricultural">{t('agricultural')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('proximityToCoast')} (km)</label>
          <input
            type="number"
            value={formData.proximityToCoast}
            onChange={(e) => handleInputChange('proximityToCoast', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('proximityToRiver')} (km)</label>
          <input
            type="number"
            value={formData.proximityToRiver}
            onChange={(e) => handleInputChange('proximityToRiver', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('facilitySize')} (m²)</label>
          <input
            type="number"
            value={formData.facilitySize}
            onChange={(e) => handleInputChange('facilitySize', e.target.value)}
            style={inputStyle}
            placeholder="1000"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('buildingAge')} ({t('years')})</label>
          <input
            type="number"
            value={formData.buildingAge}
            onChange={(e) => handleInputChange('buildingAge', e.target.value)}
            style={inputStyle}
            placeholder="10"
          />
        </div>
      </div>
      
      {/* Auto-Calculate from Location Button */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '2px solid #3b82f6' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#1e40af', fontSize: '16px' }}>
          🌍 {t('autoCalculatePhysicalRisks') || 'Auto-Calculate Physical Risks from Location'}
        </h3>
        <p style={{ margin: '0 0 15px 0', color: '#475569', fontSize: '14px' }}>
          {t('autoCalculateDescription') || 'Automatically calculate climate risk probabilities and adaptive capacity based on your facility coordinates using Köppen climate classification and ND-GAIN country data.'}
        </p>
        <button
          type="button"
          onClick={handleAutoCalculateRisks}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          ⚡ {t('calculateNow') || 'Calculate Now'}
        </button>
        <span style={{ marginLeft: '15px', color: '#64748b', fontSize: '13px' }}>
          {t('autoFillsStep10') || 'Auto-fills Step 10 (Physical Risk) fields'}
        </span>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>{t('incomeInformation')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('monthlyIncome')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.monthlyIncome}
            onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('annualRevenue')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.annualRevenue}
            onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('operatingIncome')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.operatingIncome}
            onChange={(e) => handleInputChange('operatingIncome', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('investmentIncome')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.investmentIncome}
            onChange={(e) => handleInputChange('investmentIncome', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
      </div>
      
      {/* ECB/IFRS S2 PCAF Financial Fields */}
      <div style={{ ...sectionStyle, marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>PCAF Financial Metrics (ECB/IFRS S2)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>EBITDA ({formData.currency})</label>
            <input
              type="number"
              value={formData.ebitdaAmount}
              onChange={(e) => handleInputChange('ebitdaAmount', e.target.value)}
              style={inputStyle}
              placeholder="0"
            />
          </div>
          <div>
            <label style={labelStyle}>Exposure at Default (EAD) ({formData.currency})</label>
            <input
              type="number"
              value={formData.exposureAtDefault}
              onChange={(e) => handleInputChange('exposureAtDefault', e.target.value)}
              style={inputStyle}
              placeholder="0"
            />
          </div>
          <div>
            <label style={labelStyle}>Equity Market Value ({formData.currency})</label>
            <input
              type="number"
              value={formData.equityMarketValue}
              onChange={(e) => handleInputChange('equityMarketValue', e.target.value)}
              style={inputStyle}
              placeholder="0"
            />
          </div>
          <div>
            <label style={labelStyle}>Probability of Default (PD Base) (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.001"
              value={formData.probabilityOfDefaultBase}
              onChange={(e) => handleInputChange('probabilityOfDefaultBase', e.target.value)}
              style={inputStyle}
              placeholder="0.02"
            />
          </div>
          <div>
            <label style={labelStyle}>Loss Given Default (LGD Base) (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.lossGivenDefaultBase}
              onChange={(e) => handleInputChange('lossGivenDefaultBase', e.target.value)}
              style={inputStyle}
              placeholder="0.45"
            />
          </div>
          <div>
            <label style={labelStyle}>Risk Weight Base (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.riskWeightBase}
              onChange={(e) => handleInputChange('riskWeightBase', e.target.value)}
              style={inputStyle}
              placeholder="0.75"
            />
          </div>
          <div>
            <label style={labelStyle}>Loan Tenor (Years)</label>
            <input
              type="number"
              min="0"
              value={formData.loanTenorYears}
              onChange={(e) => handleInputChange('loanTenorYears', e.target.value)}
              style={inputStyle}
              placeholder="5"
            />
          </div>
          <div>
            <label style={labelStyle}>Collateral Vulnerability (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.collateralVulnerability}
              onChange={(e) => handleInputChange('collateralVulnerability', e.target.value)}
              style={inputStyle}
              placeholder="0.3"
            />
          </div>
          <div>
            <label style={labelStyle}>Required Transition CapEx ({formData.currency})</label>
            <input
              type="number"
              value={formData.requiredTransitionCapex}
              onChange={(e) => handleInputChange('requiredTransitionCapex', e.target.value)}
              style={inputStyle}
              placeholder="0"
            />
          </div>
          <div>
            <label style={labelStyle}>Annual Compliance Cost ({formData.currency})</label>
            <input
              type="number"
              value={formData.complianceCostAnnual}
              onChange={(e) => handleInputChange('complianceCostAnnual', e.target.value)}
              style={inputStyle}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '25px' }}>
        <label style={labelStyle}>{t('otherIncomes')}</label>
        {formData.otherIncomes.map((income, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={income.description || ''}
              onChange={(e) => handleArrayChange('otherIncomes', index, { ...income, description: e.target.value })}
              placeholder={t('incomeDescription')}
              style={{ ...inputStyle, flex: 2 }}
            />
            <input
              type="number"
              value={income.amount || ''}
              onChange={(e) => handleArrayChange('otherIncomes', index, { ...income, amount: e.target.value })}
              placeholder={t('amount')}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => removeArrayItem('otherIncomes', index)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {t('remove')}
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('otherIncomes')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {t('addIncome')}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>{t('expenseInformation')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('monthlyExpenses')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.monthlyExpenses}
            onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('operatingExpenses')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.operatingExpenses}
            onChange={(e) => handleInputChange('operatingExpenses', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('administrativeExpenses')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.administrativeExpenses}
            onChange={(e) => handleInputChange('administrativeExpenses', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('marketingExpenses')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.marketingExpenses}
            onChange={(e) => handleInputChange('marketingExpenses', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('financialExpenses')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.financialExpenses}
            onChange={(e) => handleInputChange('financialExpenses', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>{t('assetsInformation')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('cashAndEquivalents')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.cashAndEquivalents}
            onChange={(e) => handleInputChange('cashAndEquivalents', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('bankDeposits')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.bankDeposits}
            onChange={(e) => handleInputChange('bankDeposits', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('investments')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.investments}
            onChange={(e) => handleInputChange('investments', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('realEstate')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.realEstate}
            onChange={(e) => handleInputChange('realEstate', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('equipment')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.equipment}
            onChange={(e) => handleInputChange('equipment', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('inventory')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.inventory}
            onChange={(e) => handleInputChange('inventory', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('accountsReceivable')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.accountsReceivable}
            onChange={(e) => handleInputChange('accountsReceivable', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>{t('liabilitiesInformation')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('shortTermLoans')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.shortTermLoans}
            onChange={(e) => handleInputChange('shortTermLoans', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('longTermLoans')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.longTermLoans}
            onChange={(e) => handleInputChange('longTermLoans', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('accountsPayable')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.accountsPayable}
            onChange={(e) => handleInputChange('accountsPayable', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('taxLiabilities')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.taxLiabilities}
            onChange={(e) => handleInputChange('taxLiabilities', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>{t('creditRiskInformation')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('creditScore')}</label>
          <input
            type="number"
            min="300"
            max="900"
            value={formData.creditScore}
            onChange={(e) => handleInputChange('creditScore', e.target.value)}
            style={inputStyle}
            placeholder="750"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('probabilityOfDefault')} (%)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.probabilityOfDefault}
            onChange={(e) => handleInputChange('probabilityOfDefault', e.target.value)}
            style={inputStyle}
            placeholder="2.5"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('lossGivenDefault')} (%)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.lossGivenDefault}
            onChange={(e) => handleInputChange('lossGivenDefault', e.target.value)}
            style={inputStyle}
            placeholder="45"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('loanMaturityYears')}</label>
          <input
            type="number"
            min="1"
            max="50"
            value={formData.loanMaturityYears}
            onChange={(e) => handleInputChange('loanMaturityYears', e.target.value)}
            style={inputStyle}
            placeholder="5"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('repaymentStatus')}</label>
          <select
            value={formData.repaymentStatus}
            onChange={(e) => handleInputChange('repaymentStatus', e.target.value)}
            style={inputStyle}
          >
            <option value="current">{t('current')}</option>
            <option value="late">{t('late')}</option>
            <option value="default">{t('default')}</option>
            <option value="restructured">{t('restructured')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('collateralValue')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.collateralValue}
            onChange={(e) => handleInputChange('collateralValue', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('collateralType')}</label>
          <select
            value={formData.collateralType}
            onChange={(e) => handleInputChange('collateralType', e.target.value)}
            style={inputStyle}
          >
            <option value="">{t('selectCollateralType')}</option>
            <option value="real_estate">{t('realEstate')}</option>
            <option value="vehicle">{t('vehicle')}</option>
            <option value="equipment">{t('equipment')}</option>
            <option value="inventory">{t('inventory')}</option>
            <option value="securities">{t('securities')}</option>
            <option value="cash_deposit">{t('cashDeposit')}</option>
            <option value="guarantee">{t('guarantee')}</option>
            <option value="other">{t('other')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('insuranceCoverage')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.insuranceCoverage}
            onChange={(e) => handleInputChange('insuranceCoverage', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('assetType')}</label>
          <select
            value={formData.assetType}
            onChange={(e) => handleInputChange('assetType', e.target.value)}
            style={inputStyle}
          >
            <option value="">{t('selectAssetType')}</option>
            <option value="retail">{t('retail')}</option>
            <option value="commercial">{t('commercial')}</option>
            <option value="industrial">{t('industrial')}</option>
            <option value="agricultural">{t('agricultural')}</option>
            <option value="sme">{t('sme')}</option>
            <option value="corporate">{t('corporate')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('guarantorInfo')}</label>
          <textarea
            value={formData.guarantorInfo}
            onChange={(e) => handleInputChange('guarantorInfo', e.target.value)}
            style={{
              ...inputStyle,
              minHeight: '80px',
              resize: 'vertical'
            }}
            placeholder={t('guarantorInfoPlaceholder')}
          />
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>{t('investmentAndGoals')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        <div>
          <label style={labelStyle}>{t('stocks')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.stocks}
            onChange={(e) => handleInputChange('stocks', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('bonds')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.bonds}
            onChange={(e) => handleInputChange('bonds', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('mutualFunds')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.mutualFunds}
            onChange={(e) => handleInputChange('mutualFunds', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('riskTolerance')}</label>
          <select
            value={formData.riskTolerance}
            onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
            style={inputStyle}
          >
            <option value="low">{t('lowRisk')}</option>
            <option value="moderate">{t('moderateRisk')}</option>
            <option value="high">{t('highRisk')}</option>
          </select>
        </div>
      </div>
      
      <div style={{ marginBottom: '25px' }}>
        <label style={labelStyle}>{t('notes')}</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          style={{
            ...inputStyle,
            minHeight: '100px',
            resize: 'vertical'
          }}
          placeholder={t('additionalNotesPlaceholder')}
        />
      </div>
    </div>
  );

  const renderStep9 = () => (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>{t('exportCbamInformation')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('exportValue')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.exportValue}
            onChange={(e) => handleInputChange('exportValue', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('exportPercentage')} (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.exportPercentage}
            onChange={(e) => handleInputChange('exportPercentage', e.target.value)}
            style={inputStyle}
            placeholder="25"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('euExports')} ({formData.currency})</label>
          <input
            type="number"
            value={formData.euExports}
            onChange={(e) => handleInputChange('euExports', e.target.value)}
            style={inputStyle}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('cbamCoverage')}</label>
          <select
            value={formData.cbamCoverage}
            onChange={(e) => handleInputChange('cbamCoverage', e.target.value)}
            style={inputStyle}
          >
            <option value="none">{t('none')}</option>
            <option value="partial">{t('partial')}</option>
            <option value="full">{t('full')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('carbonContent')} (tCO₂/ton)</label>
          <input
            type="number"
            step="0.01"
            value={formData.carbonContent}
            onChange={(e) => handleInputChange('carbonContent', e.target.value)}
            style={inputStyle}
            placeholder="0.5"
          />
        </div>
      </div>

      {/* ECB/IFRS S2 Scope 2 & Scope 3 Emissions Breakdown */}
      <div style={{ ...sectionStyle, marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Scope 2 Emissions (ECB/IFRS S2)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Scope 2 Location-Based (tCO₂e)</label>
            <input
              type="number"
              value={formData.scope2LocationEmissions}
              onChange={(e) => handleInputChange('scope2LocationEmissions', e.target.value)}
              style={inputStyle}
              placeholder="0"
            />
          </div>
          <div>
            <label style={labelStyle}>Scope 2 Market-Based (tCO₂e)</label>
            <input
              type="number"
              value={formData.scope2MarketEmissions}
              onChange={(e) => handleInputChange('scope2MarketEmissions', e.target.value)}
              style={inputStyle}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div style={{ ...sectionStyle, marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Scope 3 Emissions - 15 Categories (ECB/IFRS S2)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Cat 1: Purchased Goods & Services (tCO₂e)</label>
            <input type="number" value={formData.cat1_purchasedGoods} onChange={(e) => handleInputChange('cat1_purchasedGoods', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 2: Capital Goods (tCO₂e)</label>
            <input type="number" value={formData.cat2_capitalGoods} onChange={(e) => handleInputChange('cat2_capitalGoods', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 3: Fuel & Energy Activities (tCO₂e)</label>
            <input type="number" value={formData.cat3_fuelEnergy} onChange={(e) => handleInputChange('cat3_fuelEnergy', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 4: Upstream Transport (tCO₂e)</label>
            <input type="number" value={formData.cat4_upstreamTransport} onChange={(e) => handleInputChange('cat4_upstreamTransport', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 5: Waste (tCO₂e)</label>
            <input type="number" value={formData.cat5_waste} onChange={(e) => handleInputChange('cat5_waste', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 6: Business Travel (tCO₂e)</label>
            <input type="number" value={formData.cat6_businessTravel} onChange={(e) => handleInputChange('cat6_businessTravel', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 7: Employee Commuting (tCO₂e)</label>
            <input type="number" value={formData.cat7_employeeCommute} onChange={(e) => handleInputChange('cat7_employeeCommute', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 8: Upstream Leased Assets (tCO₂e)</label>
            <input type="number" value={formData.cat8_upstreamLeased} onChange={(e) => handleInputChange('cat8_upstreamLeased', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 9: Downstream Transport (tCO₂e)</label>
            <input type="number" value={formData.cat9_downstreamTransport} onChange={(e) => handleInputChange('cat9_downstreamTransport', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 10: Processing of Sold Products (tCO₂e)</label>
            <input type="number" value={formData.cat10_processing} onChange={(e) => handleInputChange('cat10_processing', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 11: Use of Sold Products (tCO₂e)</label>
            <input type="number" value={formData.cat11_useOfProducts} onChange={(e) => handleInputChange('cat11_useOfProducts', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 12: End-of-Life Treatment (tCO₂e)</label>
            <input type="number" value={formData.cat12_endOfLife} onChange={(e) => handleInputChange('cat12_endOfLife', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 13: Downstream Leased Assets (tCO₂e)</label>
            <input type="number" value={formData.cat13_downstreamLeased} onChange={(e) => handleInputChange('cat13_downstreamLeased', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 14: Franchises (tCO₂e)</label>
            <input type="number" value={formData.cat14_franchises} onChange={(e) => handleInputChange('cat14_franchises', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Cat 15: Investments (tCO₂e)</label>
            <input type="number" value={formData.cat15_investments} onChange={(e) => handleInputChange('cat15_investments', e.target.value)} style={inputStyle} placeholder="0" />
          </div>
        </div>
      </div>

      {/* ECB/IFRS S2 CBAM Additional Fields */}
      <div style={{ ...sectionStyle, marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>CBAM Extended Data (ECB/IFRS S2)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>CBAM Embedded Emissions (tCO₂e)</label>
            <input
              type="number"
              step="0.01"
              value={formData.cbamEmbeddedEmissions}
              onChange={(e) => handleInputChange('cbamEmbeddedEmissions', e.target.value)}
              style={inputStyle}
              placeholder="0"
            />
          </div>
          <div>
            <label style={labelStyle}>CBAM EU Carbon Price (€/tCO₂)</label>
            <input
              type="number"
              value={formData.cbamEUPrice}
              onChange={(e) => handleInputChange('cbamEUPrice', e.target.value)}
              style={inputStyle}
              placeholder="85"
            />
          </div>
          <div>
            <label style={labelStyle}>CBAM Origin Country Price (€/tCO₂)</label>
            <input
              type="number"
              value={formData.cbamOriginPrice}
              onChange={(e) => handleInputChange('cbamOriginPrice', e.target.value)}
              style={inputStyle}
              placeholder="20"
            />
          </div>
          <div>
            <label style={labelStyle}>CBAM Export Volume (units)</label>
            <input
              type="number"
              value={formData.cbamExportVolumeUnits}
              onChange={(e) => handleInputChange('cbamExportVolumeUnits', e.target.value)}
              style={inputStyle}
              placeholder="0"
            />
          </div>
          <div>
            <label style={labelStyle}>CBAM Export Value ({formData.currency})</label>
            <input
              type="number"
              value={formData.cbamExportValue}
              onChange={(e) => handleInputChange('cbamExportValue', e.target.value)}
              style={inputStyle}
              placeholder="0"
            />
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '25px' }}>
        <label style={labelStyle}>{t('exportDestinations')}</label>
        {formData.exportDestinations.map((destination, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={destination.country || ''}
              onChange={(e) => handleArrayChange('exportDestinations', index, { ...destination, country: e.target.value })}
              placeholder={t('countryName')}
              style={{ ...inputStyle, flex: 2 }}
            />
            <input
              type="number"
              value={destination.percentage || ''}
              onChange={(e) => handleArrayChange('exportDestinations', index, { ...destination, percentage: e.target.value })}
              placeholder={t('percentage')}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => removeArrayItem('exportDestinations', index)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {t('remove')}
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('exportDestinations')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {t('addDestination')}
        </button>
      </div>
      
      <div style={{ marginTop: '25px' }}>
        <label style={labelStyle}>{t('hsCodes')}</label>
        {formData.hsCodes.map((code, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={code.code || ''}
              onChange={(e) => handleArrayChange('hsCodes', index, { ...code, code: e.target.value })}
              placeholder={t('hsCodePlaceholder')}
              style={{ ...inputStyle, flex: 2 }}
            />
            <input
              type="text"
              value={code.description || ''}
              onChange={(e) => handleArrayChange('hsCodes', index, { ...code, description: e.target.value })}
              placeholder={t('productDescription')}
              style={{ ...inputStyle, flex: 3 }}
            />
            <button
              type="button"
              onClick={() => removeArrayItem('hsCodes', index)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {t('remove')}
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('hsCodes')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {t('addHsCode')}
        </button>
      </div>
    </div>
  );

  const renderStep11 = () => {
    const renderEnergyFields = () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('totalInstalledCapacityMW')} (MW)</label>
          <input type="number" value={formData.totalInstalledCapacityMW} onChange={(e) => handleInputChange('totalInstalledCapacityMW', e.target.value)} style={inputStyle} placeholder="5000" />
        </div>
        <div>
          <label style={labelStyle}>{t('coalCapacityMW')} (MW)</label>
          <input type="number" value={formData.coalCapacityMW} onChange={(e) => handleInputChange('coalCapacityMW', e.target.value)} style={inputStyle} placeholder="1500" />
        </div>
        <div>
          <label style={labelStyle}>{t('gasCapacityMW')} (MW)</label>
          <input type="number" value={formData.gasCapacityMW} onChange={(e) => handleInputChange('gasCapacityMW', e.target.value)} style={inputStyle} placeholder="2000" />
        </div>
        <div>
          <label style={labelStyle}>{t('windCapacityMW')} (MW)</label>
          <input type="number" value={formData.windCapacityMW} onChange={(e) => handleInputChange('windCapacityMW', e.target.value)} style={inputStyle} placeholder="800" />
        </div>
        <div>
          <label style={labelStyle}>{t('solarCapacityMW')} (MW)</label>
          <input type="number" value={formData.solarCapacityMW} onChange={(e) => handleInputChange('solarCapacityMW', e.target.value)} style={inputStyle} placeholder="500" />
        </div>
        <div>
          <label style={labelStyle}>{t('hydroCapacityMW')} (MW)</label>
          <input type="number" value={formData.hydroCapacityMW} onChange={(e) => handleInputChange('hydroCapacityMW', e.target.value)} style={inputStyle} placeholder="200" />
        </div>
        <div>
          <label style={labelStyle}>{t('renewableTarget2030')} (%)</label>
          <input type="number" max="100" value={formData.renewableTarget2030} onChange={(e) => handleInputChange('renewableTarget2030', e.target.value)} style={inputStyle} placeholder="50" />
        </div>
        <div>
          <label style={labelStyle}>{t('coalPhaseoutDate')}</label>
          <input type="date" value={formData.coalPhaseoutDate} onChange={(e) => handleInputChange('coalPhaseoutDate', e.target.value)} style={inputStyle} />
        </div>
      </div>
    );

    const renderAutomotiveFields = () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('annualTotalProduction')} ({t('units')})</label>
          <input type="number" value={formData.annualTotalProduction} onChange={(e) => handleInputChange('annualTotalProduction', e.target.value)} style={inputStyle} placeholder="500000" />
        </div>
        <div>
          <label style={labelStyle}>{t('iceProduction')} ({t('units')})</label>
          <input type="number" value={formData.iceProduction} onChange={(e) => handleInputChange('iceProduction', e.target.value)} style={inputStyle} placeholder="300000" />
        </div>
        <div>
          <label style={labelStyle}>{t('bevProduction')} ({t('units')})</label>
          <input type="number" value={formData.bevProduction} onChange={(e) => handleInputChange('bevProduction', e.target.value)} style={inputStyle} placeholder="100000" />
        </div>
        <div>
          <label style={labelStyle}>{t('phevProduction')} ({t('units')})</label>
          <input type="number" value={formData.phevProduction} onChange={(e) => handleInputChange('phevProduction', e.target.value)} style={inputStyle} placeholder="50000" />
        </div>
        <div>
          <label style={labelStyle}>{t('evProductionTarget2030')} (%)</label>
          <input type="number" max="100" value={formData.evProductionTarget2030} onChange={(e) => handleInputChange('evProductionTarget2030', e.target.value)} style={inputStyle} placeholder="60" />
        </div>
        <div>
          <label style={labelStyle}>{t('batteryCapacityGWh')} (GWh)</label>
          <input type="number" value={formData.batteryCapacityGWh} onChange={(e) => handleInputChange('batteryCapacityGWh', e.target.value)} style={inputStyle} placeholder="50" />
        </div>
      </div>
    );

    const renderSteelFields = () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('annualSteelProduction')} ({t('millionTons')})</label>
          <input type="number" step="0.1" value={formData.annualSteelProduction} onChange={(e) => handleInputChange('annualSteelProduction', e.target.value)} style={inputStyle} placeholder="5.0" />
        </div>
        <div>
          <label style={labelStyle}>{t('bofProductionShare')} (%)</label>
          <input type="number" max="100" value={formData.bofProductionShare} onChange={(e) => handleInputChange('bofProductionShare', e.target.value)} style={inputStyle} placeholder="70" />
        </div>
        <div>
          <label style={labelStyle}>{t('eafProductionShare')} (%)</label>
          <input type="number" max="100" value={formData.eafProductionShare} onChange={(e) => handleInputChange('eafProductionShare', e.target.value)} style={inputStyle} placeholder="30" />
        </div>
        <div>
          <label style={labelStyle}>{t('steelCarbonIntensity')} (tCO₂/ton)</label>
          <input type="number" step="0.01" value={formData.steelCarbonIntensity} onChange={(e) => handleInputChange('steelCarbonIntensity', e.target.value)} style={inputStyle} placeholder="1.85" />
        </div>
        <div>
          <label style={labelStyle}>{t('lowCarbonSteelTarget2030')} (%)</label>
          <input type="number" max="100" value={formData.lowCarbonSteelTarget2030} onChange={(e) => handleInputChange('lowCarbonSteelTarget2030', e.target.value)} style={inputStyle} placeholder="40" />
        </div>
        <div>
          <label style={labelStyle}>{t('ccsImplementation')}</label>
          <select value={formData.ccsImplementation} onChange={(e) => handleInputChange('ccsImplementation', e.target.value)} style={inputStyle}>
            <option value="">{t('selectStatus')}</option>
            <option value="none">{t('none')}</option>
            <option value="planned">{t('planned')}</option>
            <option value="active">{t('active')}</option>
          </select>
        </div>
      </div>
    );

    const renderCementFields = () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('annualCementProduction')} ({t('millionTons')})</label>
          <input type="number" step="0.1" value={formData.annualCementProduction} onChange={(e) => handleInputChange('annualCementProduction', e.target.value)} style={inputStyle} placeholder="3.0" />
        </div>
        <div>
          <label style={labelStyle}>{t('clinkerRatio')} (%)</label>
          <input type="number" max="100" value={formData.clinkerRatio} onChange={(e) => handleInputChange('clinkerRatio', e.target.value)} style={inputStyle} placeholder="75" />
        </div>
        <div>
          <label style={labelStyle}>{t('alternativeFuelsShare')} (%)</label>
          <input type="number" max="100" value={formData.alternativeFuelsShare} onChange={(e) => handleInputChange('alternativeFuelsShare', e.target.value)} style={inputStyle} placeholder="20" />
        </div>
        <div>
          <label style={labelStyle}>{t('cementCarbonIntensity')} (tCO₂/ton)</label>
          <input type="number" step="0.01" value={formData.cementCarbonIntensity} onChange={(e) => handleInputChange('cementCarbonIntensity', e.target.value)} style={inputStyle} placeholder="0.65" />
        </div>
        <div>
          <label style={labelStyle}>{t('clinkerSubstitutionTarget')} (%)</label>
          <input type="number" max="100" value={formData.clinkerSubstitutionTarget} onChange={(e) => handleInputChange('clinkerSubstitutionTarget', e.target.value)} style={inputStyle} placeholder="30" />
        </div>
      </div>
    );

    const renderAviationFields = () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('annualPassengerKm')} ({t('billionPkm')})</label>
          <input type="number" step="0.1" value={formData.annualPassengerKm} onChange={(e) => handleInputChange('annualPassengerKm', e.target.value)} style={inputStyle} placeholder="50.0" />
        </div>
        <div>
          <label style={labelStyle}>{t('fleetSize')}</label>
          <input type="number" value={formData.fleetSize} onChange={(e) => handleInputChange('fleetSize', e.target.value)} style={inputStyle} placeholder="100" />
        </div>
        <div>
          <label style={labelStyle}>{t('averageFleetAge')} ({t('years')})</label>
          <input type="number" value={formData.averageFleetAge} onChange={(e) => handleInputChange('averageFleetAge', e.target.value)} style={inputStyle} placeholder="12" />
        </div>
        <div>
          <label style={labelStyle}>{t('safUsage')} (%)</label>
          <input type="number" step="0.1" max="100" value={formData.safUsage} onChange={(e) => handleInputChange('safUsage', e.target.value)} style={inputStyle} placeholder="2.5" />
        </div>
        <div>
          <label style={labelStyle}>{t('safTarget2030')} (%)</label>
          <input type="number" max="100" value={formData.safTarget2030} onChange={(e) => handleInputChange('safTarget2030', e.target.value)} style={inputStyle} placeholder="10" />
        </div>
      </div>
    );

    const renderRealEstateFields = () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('totalBuildingArea')} (m²)</label>
          <input type="number" value={formData.totalBuildingArea} onChange={(e) => handleInputChange('totalBuildingArea', e.target.value)} style={inputStyle} placeholder="100000" />
        </div>
        <div>
          <label style={labelStyle}>{t('averageBuildingAge')} ({t('years')})</label>
          <input type="number" value={formData.averageBuildingAge} onChange={(e) => handleInputChange('averageBuildingAge', e.target.value)} style={inputStyle} placeholder="25" />
        </div>
        <div>
          <label style={labelStyle}>{t('energyEfficiencyRating')}</label>
          <select value={formData.energyEfficiencyRating} onChange={(e) => handleInputChange('energyEfficiencyRating', e.target.value)} style={inputStyle}>
            <option value="">{t('selectRating')}</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('buildingEmissionsIntensity')} (kgCO₂/m²/year)</label>
          <input type="number" step="0.1" value={formData.buildingEmissionsIntensity} onChange={(e) => handleInputChange('buildingEmissionsIntensity', e.target.value)} style={inputStyle} placeholder="50" />
        </div>
        <div>
          <label style={labelStyle}>{t('renewableHeatingShare')} (%)</label>
          <input type="number" max="100" value={formData.renewableHeatingShare} onChange={(e) => handleInputChange('renewableHeatingShare', e.target.value)} style={inputStyle} placeholder="15" />
        </div>
      </div>
    );

    const getSectorFields = () => {
      switch(formData.pactaSector) {
        case 'energy': return renderEnergyFields();
        case 'automotive': return renderAutomotiveFields();
        case 'steel': return renderSteelFields();
        case 'cement': return renderCementFields();
        case 'aviation': return renderAviationFields();
        case 'realestate': return renderRealEstateFields();
        default: return <p style={{ color: '#6b7280', fontStyle: 'italic' }}>{t('pactaSelectSectorPrompt')}</p>;
      }
    };

    return (
      <div>
        <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>{t('pactaSectorData')}</h2>
        <div style={{ marginBottom: '30px' }}>
          <label style={labelStyle}>{t('pactaSectorSelection')} *</label>
          <select value={formData.pactaSector} onChange={(e) => handleInputChange('pactaSector', e.target.value)} style={inputStyle} required>
            <option value="">{t('selectSector')}</option>
            <option value="energy">{t('energy')}</option>
            <option value="automotive">{t('automotive')}</option>
            <option value="steel">{t('steel')}</option>
            <option value="cement">{t('cement')}</option>
            <option value="aviation">{t('aviation')}</option>
            <option value="realestate">{t('realEstate')}</option>
          </select>
        </div>
        {getSectorFields()}
      </div>
    );
  };

  const renderStep12 = () => (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>{t('tcfdGovernanceTargets')}</h2>
      
      {/* Governance */}
      <div style={{ ...sectionStyle, marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>{t('tcfdGovernance')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>{t('hasClimateExpertOnBoard')}</label>
            <select value={formData.hasClimateExpertOnBoard} onChange={(e) => handleInputChange('hasClimateExpertOnBoard', e.target.value)} style={inputStyle}>
              <option value="">{t('select')}</option>
              <option value="yes">{t('yes')}</option>
              <option value="no">{t('no')}</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t('boardClimateDiscussionFrequency')}</label>
            <select value={formData.boardClimateDiscussionFrequency} onChange={(e) => handleInputChange('boardClimateDiscussionFrequency', e.target.value)} style={inputStyle}>
              <option value="">{t('select')}</option>
              <option value="quarterly">{t('quarterly')}</option>
              <option value="biannually">{t('biannually')}</option>
              <option value="annually">{t('annually')}</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t('hasClimateRiskCommittee')}</label>
            <select value={formData.hasClimateRiskCommittee} onChange={(e) => handleInputChange('hasClimateRiskCommittee', e.target.value)} style={inputStyle}>
              <option value="">{t('select')}</option>
              <option value="yes">{t('yes')}</option>
              <option value="no">{t('no')}</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t('climateKPIsInExecutiveComp')}</label>
            <select value={formData.climateKPIsInExecutiveComp} onChange={(e) => handleInputChange('climateKPIsInExecutiveComp', e.target.value)} style={inputStyle}>
              <option value="">{t('select')}</option>
              <option value="yes">{t('yes')}</option>
              <option value="no">{t('no')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* ECB/IFRS S2 Governance Scoring (0-1 scale) */}
      <div style={{ ...sectionStyle, marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Governance Quality Scoring (ECB/IFRS S2)</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '15px' }}>Rate governance effectiveness (0 = poor, 1 = excellent)</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Board Oversight Quality (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.governanceBoardOversight}
              onChange={(e) => handleInputChange('governanceBoardOversight', e.target.value)}
              style={inputStyle}
              placeholder="0.6"
            />
          </div>
          <div>
            <label style={labelStyle}>Management Role & Integration (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.governanceManagementRole}
              onChange={(e) => handleInputChange('governanceManagementRole', e.target.value)}
              style={inputStyle}
              placeholder="0.7"
            />
          </div>
          <div>
            <label style={labelStyle}>Incentive Alignment (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.governanceIncentives}
              onChange={(e) => handleInputChange('governanceIncentives', e.target.value)}
              style={inputStyle}
              placeholder="0.5"
            />
          </div>
          <div>
            <label style={labelStyle}>R&D Investment in Climate Solutions (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.governanceRnDScore}
              onChange={(e) => handleInputChange('governanceRnDScore', e.target.value)}
              style={inputStyle}
              placeholder="0.4"
            />
          </div>
        </div>
      </div>
      
      {/* Strategy */}
      <div style={{ ...sectionStyle, marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>{t('tcfdStrategy')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>{t('shortTermHorizon')} ({t('years')})</label>
            <input type="number" value={formData.climateRiskTimeHorizons.short} onChange={(e) => handleInputChange('climateRiskTimeHorizons', {...formData.climateRiskTimeHorizons, short: e.target.value})} style={inputStyle} placeholder="1-3" />
          </div>
          <div>
            <label style={labelStyle}>{t('mediumTermHorizon')} ({t('years')})</label>
            <input type="number" value={formData.climateRiskTimeHorizons.medium} onChange={(e) => handleInputChange('climateRiskTimeHorizons', {...formData.climateRiskTimeHorizons, medium: e.target.value})} style={inputStyle} placeholder="3-10" />
          </div>
          <div>
            <label style={labelStyle}>{t('longTermHorizon')} ({t('years')})</label>
            <input type="number" value={formData.climateRiskTimeHorizons.long} onChange={(e) => handleInputChange('climateRiskTimeHorizons', {...formData.climateRiskTimeHorizons, long: e.target.value})} style={inputStyle} placeholder="10+" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>{t('strategyResilienceAssessment')}</label>
          <textarea value={formData.strategyResilienceAssessment} onChange={(e) => handleInputChange('strategyResilienceAssessment', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder={t('strategyResiliencePlaceholder')} />
        </div>
      </div>
      
      {/* Risk Management */}
      <div style={{ ...sectionStyle, marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>{t('tcfdRiskManagement')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>{t('riskAssessmentFrequency')}</label>
            <select value={formData.riskAssessmentFrequency} onChange={(e) => handleInputChange('riskAssessmentFrequency', e.target.value)} style={inputStyle}>
              <option value="">{t('select')}</option>
              <option value="monthly">{t('monthly')}</option>
              <option value="quarterly">{t('quarterly')}</option>
              <option value="annually">{t('annually')}</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t('integrationWithERM')}</label>
            <select value={formData.integrationWithERM} onChange={(e) => handleInputChange('integrationWithERM', e.target.value)} style={inputStyle}>
              <option value="">{t('select')}</option>
              <option value="yes">{t('yes')}</option>
              <option value="no">{t('no')}</option>
              <option value="partial">{t('partial')}</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Metrics & Targets */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>{t('tcfdMetricsTargets')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>{t('scope2Emissions')} (tCO₂e)</label>
            <input type="number" value={formData.scope2Emissions} onChange={(e) => handleInputChange('scope2Emissions', e.target.value)} style={inputStyle} placeholder="10000" />
          </div>
          <div>
            <label style={labelStyle}>{t('scope3Emissions')} (tCO₂e)</label>
            <input type="number" value={formData.scope3Emissions} onChange={(e) => handleInputChange('scope3Emissions', e.target.value)} style={inputStyle} placeholder="50000" />
          </div>
          <div>
            <label style={labelStyle}>{t('emissionsBaseYear')}</label>
            <input type="number" min="2000" max="2030" value={formData.emissionsBaseYear} onChange={(e) => handleInputChange('emissionsBaseYear', e.target.value)} style={inputStyle} placeholder="2020" />
          </div>
          <div>
            <label style={labelStyle}>{t('hasNetZeroCommitment')}</label>
            <select value={formData.hasNetZeroCommitment} onChange={(e) => handleInputChange('hasNetZeroCommitment', e.target.value)} style={inputStyle}>
              <option value="">{t('select')}</option>
              <option value="yes">{t('yes')}</option>
              <option value="no">{t('no')}</option>
            </select>
          </div>
          {formData.hasNetZeroCommitment === 'yes' && (
            <div>
              <label style={labelStyle}>{t('netZeroYear')}</label>
              <input type="number" min="2025" max="2100" value={formData.netZeroYear} onChange={(e) => handleInputChange('netZeroYear', e.target.value)} style={inputStyle} placeholder="2050" />
            </div>
          )}
          <div>
            <label style={labelStyle}>{t('sbtiValidated')}</label>
            <select value={formData.sbtiValidated} onChange={(e) => handleInputChange('sbtiValidated', e.target.value)} style={inputStyle}>
              <option value="">{t('select')}</option>
              <option value="yes">{t('yes')}</option>
              <option value="no">{t('no')}</option>
              <option value="in-progress">{t('inProgress')}</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t('emissionReductionTarget')} (%)</label>
            <input type="number" max="100" value={formData.emissionReductionTarget} onChange={(e) => handleInputChange('emissionReductionTarget', e.target.value)} style={inputStyle} placeholder="50" />
          </div>
          <div>
            <label style={labelStyle}>{t('renewableEnergyShareTarget')} (%)</label>
            <input type="number" max="100" value={formData.renewableEnergyShare} onChange={(e) => handleInputChange('renewableEnergyShare', e.target.value)} style={inputStyle} placeholder="30" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep10 = () => (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>{t('esgEnvironmentalInfo')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={labelStyle}>{t('carbonFootprintCalculated')}</label>
          <select
            value={formData.carbonFootprintCalculated}
            onChange={(e) => handleInputChange('carbonFootprintCalculated', e.target.value === 'true')}
            style={inputStyle}
          >
            <option value={false}>{t('no')}</option>
            <option value={true}>{t('yes')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('renewableEnergyTargets')} (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.renewableEnergyTargets}
            onChange={(e) => handleInputChange('renewableEnergyTargets', e.target.value)}
            style={inputStyle}
            placeholder="50"
          />
        </div>
        <div>
          <label style={labelStyle}>{t('floodZoneExposure')}</label>
          <select
            value={formData.floodZoneExposure}
            onChange={(e) => handleInputChange('floodZoneExposure', e.target.value)}
            style={inputStyle}
          >
            <option value="">{t('selectExposure')}</option>
            <option value="low">{t('low')}</option>
            <option value="medium">{t('medium')}</option>
            <option value="high">{t('high')}</option>
            <option value="very_high">{t('veryHigh')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('waterManagement')}</label>
          <select
            value={formData.waterManagement}
            onChange={(e) => handleInputChange('waterManagement', e.target.value)}
            style={inputStyle}
          >
            <option value="">{t('selectLevel')}</option>
            <option value="basic">{t('basic')}</option>
            <option value="intermediate">{t('intermediate')}</option>
            <option value="advanced">{t('advanced')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('wasteManagement')}</label>
          <select
            value={formData.wasteManagement}
            onChange={(e) => handleInputChange('wasteManagement', e.target.value)}
            style={inputStyle}
          >
            <option value="">{t('selectLevel')}</option>
            <option value="basic">{t('basic')}</option>
            <option value="intermediate">{t('intermediate')}</option>
            <option value="advanced">{t('advanced')}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('businessContinuityPlan')}</label>
          <select
            value={formData.businessContinuityPlan}
            onChange={(e) => handleInputChange('businessContinuityPlan', e.target.value)}
            style={inputStyle}
          >
            <option value="">{t('selectStatus')}</option>
            <option value="none">{t('none')}</option>
            <option value="basic">{t('basic')}</option>
            <option value="comprehensive">{t('comprehensive')}</option>
          </select>
        </div>
      </div>

      {/* ECB/IFRS S2 Physical Risk P-S-A Components */}
      <div style={{ ...sectionStyle, marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Physical Risk Probability (P) - Hazard Exposure (ECB/IFRS S2)</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '15px' }}>Rate exposure to each hazard type (0 = no exposure, 1 = maximum exposure)</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Heat/Drought Exposure (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.physicalRiskProbability.heat}
              onChange={(e) => handleInputChange('physicalRiskProbability', {...formData.physicalRiskProbability, heat: e.target.value})}
              style={inputStyle}
              placeholder="0.3"
            />
          </div>
          <div>
            <label style={labelStyle}>Flood/Riverine Exposure (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.physicalRiskProbability.flood}
              onChange={(e) => handleInputChange('physicalRiskProbability', {...formData.physicalRiskProbability, flood: e.target.value})}
              style={inputStyle}
              placeholder="0.4"
            />
          </div>
          <div>
            <label style={labelStyle}>Coastal/Sea-Level Exposure (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.physicalRiskProbability.coastal}
              onChange={(e) => handleInputChange('physicalRiskProbability', {...formData.physicalRiskProbability, coastal: e.target.value})}
              style={inputStyle}
              placeholder="0.2"
            />
          </div>
          <div>
            <label style={labelStyle}>Precipitation/Storm Exposure (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.physicalRiskProbability.precipitation}
              onChange={(e) => handleInputChange('physicalRiskProbability', {...formData.physicalRiskProbability, precipitation: e.target.value})}
              style={inputStyle}
              placeholder="0.3"
            />
          </div>
          <div>
            <label style={labelStyle}>Drought/Water Stress Exposure (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.physicalRiskProbability.drought}
              onChange={(e) => handleInputChange('physicalRiskProbability', {...formData.physicalRiskProbability, drought: e.target.value})}
              style={inputStyle}
              placeholder="0.25"
            />
          </div>
        </div>
      </div>

      <div style={{ ...sectionStyle, marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Adaptive Capacity (A) - Resilience Components (ECB/IFRS S2)</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '15px' }}>Rate adaptive capacity for each component (0 = no capacity, 1 = maximum capacity)</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Infrastructure Resilience (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.adaptiveCapacity.infrastructure}
              onChange={(e) => handleInputChange('adaptiveCapacity', {...formData.adaptiveCapacity, infrastructure: e.target.value})}
              style={inputStyle}
              placeholder="0.6"
            />
          </div>
          <div>
            <label style={labelStyle}>Financial Resources (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.adaptiveCapacity.financial}
              onChange={(e) => handleInputChange('adaptiveCapacity', {...formData.adaptiveCapacity, financial: e.target.value})}
              style={inputStyle}
              placeholder="0.7"
            />
          </div>
          <div>
            <label style={labelStyle}>Governance & Planning (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.adaptiveCapacity.governance}
              onChange={(e) => handleInputChange('adaptiveCapacity', {...formData.adaptiveCapacity, governance: e.target.value})}
              style={inputStyle}
              placeholder="0.5"
            />
          </div>
          <div>
            <label style={labelStyle}>Technology & Innovation (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.adaptiveCapacity.technology}
              onChange={(e) => handleInputChange('adaptiveCapacity', {...formData.adaptiveCapacity, technology: e.target.value})}
              style={inputStyle}
              placeholder="0.65"
            />
          </div>
        </div>
      </div>

      {/* ECB/IFRS S2 Risk Amplifiers/Tags */}
      <div style={{ ...sectionStyle, marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Risk Amplifiers & Tags (ECB/IFRS S2)</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '15px' }}>Rate sector-specific risk factors (0 = no risk, 1 = maximum risk)</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Water Dependency Risk (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.tagWaterDependency}
              onChange={(e) => handleInputChange('tagWaterDependency', e.target.value)}
              style={inputStyle}
              placeholder="0.3"
            />
          </div>
          <div>
            <label style={labelStyle}>Asset Stranding Risk (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.tagStrandingRisk}
              onChange={(e) => handleInputChange('tagStrandingRisk', e.target.value)}
              style={inputStyle}
              placeholder="0.4"
            />
          </div>
          <div>
            <label style={labelStyle}>Coastal Vulnerability (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.tagCoastalVulnerability}
              onChange={(e) => handleInputChange('tagCoastalVulnerability', e.target.value)}
              style={inputStyle}
              placeholder="0.2"
            />
          </div>
          <div>
            <label style={labelStyle}>Supply Chain Exposure (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.tagSupplyChainExposure}
              onChange={(e) => handleInputChange('tagSupplyChainExposure', e.target.value)}
              style={inputStyle}
              placeholder="0.5"
            />
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '25px' }}>
        <label style={labelStyle}>{t('eiaReports')}</label>
        <textarea
          value={formData.eiaReports}
          onChange={(e) => handleInputChange('eiaReports', e.target.value)}
          style={{
            ...inputStyle,
            minHeight: '80px',
            resize: 'vertical'
          }}
          placeholder={t('eiaReportsPlaceholder')}
        />
      </div>
      
      <div style={{ marginTop: '25px' }}>
        <label style={labelStyle}>{t('environmentalActionPlans')}</label>
        <textarea
          value={formData.environmentalActionPlans}
          onChange={(e) => handleInputChange('environmentalActionPlans', e.target.value)}
          style={{
            ...inputStyle,
            minHeight: '80px',
            resize: 'vertical'
          }}
          placeholder={t('environmentalActionPlansPlaceholder')}
        />
      </div>
      
      <div style={{ marginTop: '25px' }}>
        <label style={labelStyle}>{t('physicalRiskAssessment')}</label>
        <textarea
          value={formData.physicalRiskAssessment}
          onChange={(e) => handleInputChange('physicalRiskAssessment', e.target.value)}
          style={{
            ...inputStyle,
            minHeight: '100px',
            resize: 'vertical'
          }}
          placeholder={t('physicalRiskAssessmentPlaceholder')}
        />
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 30px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
            {t('financialDataCollection')}
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            {t('step')} {currentStep} / 12
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ padding: '20px 30px 0', backgroundColor: '#f9fafb' }}>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(currentStep / 12) * 100}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '30px' }}>
            <div style={sectionStyle}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
              {currentStep === 7 && renderStep7()}
              {currentStep === 8 && renderStep8()}
              {currentStep === 9 && renderStep9()}
              {currentStep === 10 && renderStep10()}
              {currentStep === 11 && renderStep11()}
              {currentStep === 12 && renderStep12()}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '20px 30px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            display: 'flex',
            justifyContent: 'space-between',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px'
          }}>
            <div>
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {t('cancel')}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {t('previous')}
                </button>
              )}

              {currentStep < 12 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {t('next')}
                </button>
              ) : (
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {t('generateReports')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialDataForm;