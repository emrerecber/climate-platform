import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    notes: ''
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
    if (currentStep < 10) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
            {t('step')} {currentStep} / 10
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
              width: `${(currentStep / 10) * 100}%`,
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

              {currentStep < 10 ? (
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