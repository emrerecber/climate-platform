import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PACTADataForm from '../PACTADataForm';
import PACTABenchmarkVisualizer from '../charts/PACTABenchmarkVisualizer';

const PACTAAnalysis = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [portfolioData, setPortfolioData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedSector, setSelectedSector] = useState('power');

  const [pactaData, setPactaData] = useState({
    // Company Info
    companyName: '',
    sector: '',
    reportingYear: '2024',
    
    // Portfolio Upload
    portfolioFile: null,
    portfolioType: 'equity',
    
    // Sector Specific Data
    // Power Sector
    totalInstalledCapacity: '',
    coalCapacity: '',
    naturalGasCapacity: '',
    oilCapacity: '',
    hydroCapacity: '',
    windCapacity: '',
    solarCapacity: '',
    nuclearCapacity: '',
    
    // Automotive Sector
    annualTotalProduction: '',
    iceProduction: '',
    bevProduction: '',
    hybridProduction: '',
    
    // Steel/Cement Sector
    annualProductionCapacity: '',
    energyIntensity: '',
    
    // Projections
    productionProjection2025: '',
    productionProjection2030: '',
    
    // Scenarios
    selectedScenario: 'nze_2050',
    referenceYear: '2023'
  });

  const handleDataChange = (field, value) => {
    setPactaData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (file) => {
    console.log('Portfolio file uploaded:', file);
    setPactaData(prev => ({
      ...prev,
      portfolioFile: file
    }));
  };

  const runAnalysis = () => {
    // Mock analysis results
    const mockResults = {
      alignmentScore: 65,
      scenario2050: 'Below 2°C',
      sectorBenchmark: 58,
      recommendations: [
        'Increase renewable energy capacity by 40%',
        'Phase out coal operations by 2030',
        'Invest in grid flexibility technologies'
      ]
    };
    
    setAnalysisResults(mockResults);
    setCurrentStep(4);
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderPortfolioUpload();
      case 3:
        return renderSectorSpecificData();
      case 4:
        return renderAnalysisResults();
      default:
        return renderBasicInfo();
    }
  };

  const renderBasicInfo = () => (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '25px' }}>🏢 {t('companyInformation')}</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            {t('companyName')}
          </label>
          <input
            type="text"
            value={pactaData.companyName}
            onChange={(e) => handleDataChange('companyName', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            placeholder={t('enterCompanyName')}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            {t('sector')}
          </label>
          <select
            value={pactaData.sector}
            onChange={(e) => {
              handleDataChange('sector', e.target.value);
              setSelectedSector(e.target.value);
            }}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="">{t('selectSectorPlaceholder')}</option>
            <option value="power">{t('powerSector')}</option>
            <option value="automotive">{t('automotive')}</option>
            <option value="steel">{t('steel')}</option>
            <option value="cement">{t('cement')}</option>
            <option value="aviation">{t('aviation')}</option>
            <option value="shipping">{t('shipping')}</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            {t('portfolioType')}
          </label>
          <select
            value={pactaData.portfolioType}
            onChange={(e) => handleDataChange('portfolioType', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="equity">{t('equityPortfolio')}</option>
            <option value="bonds">{t('bondsPortfolio')}</option>
            <option value="loans">{t('loansPortfolio')}</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            {t('reportingYear')}
          </label>
          <select
            value={pactaData.reportingYear}
            onChange={(e) => handleDataChange('reportingYear', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPortfolioUpload = () => (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '25px' }}>📊 {t('portfolioDataUpload')}</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          border: '2px dashed #3b82f6',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📁</div>
          <p style={{ fontSize: '18px', marginBottom: '10px', color: '#1e40af' }}>
            {t('dragPortfolioFile')}
          </p>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            {t('supportedFormats')}
          </p>
          <input
            type="file"
            accept=".csv,.xlsx,.json"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            style={{ display: 'none' }}
            id="portfolio-upload"
          />
          <label
            htmlFor="portfolio-upload"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {t('selectFile')}
          </label>
        </div>
        
        {pactaData.portfolioFile && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#dbeafe',
            borderRadius: '8px',
            border: '1px solid #3b82f6'
          }}>
            <p style={{ margin: 0, color: '#1e40af' }}>
              ✅ {t('fileUploaded')}: {pactaData.portfolioFile.name}
            </p>
          </div>
        )}
      </div>

      {/* Template Download */}
      <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>📋 {t('templateFiles')}</h3>
        <p style={{ margin: '0 0 15px 0', color: '#6b7280', fontSize: '14px' }}>
          {t('templateDescription')}
        </p>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            📊 {t('equityTemplate')}
          </button>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            💳 {t('bondsTemplate')}
          </button>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            🏪 {t('loansTemplate')}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSectorSpecificData = () => (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '25px' }}>
        ⚙️ {selectedSector === 'power' ? t('energySectorDetails') : t('sectoralDetails')}
      </h2>
      
      {selectedSector === 'power' && (
        <div>
          <h3 style={{ marginBottom: '20px', color: '#374151' }}>⚡ {t('electricityGenerationCapacity')}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                {t('coalCapacityMW')}
              </label>
              <input
                type="number"
                value={pactaData.coalCapacity}
                onChange={(e) => handleDataChange('coalCapacity', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                placeholder="0"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                {t('gasCapacityMW')}
              </label>
              <input
                type="number"
                value={pactaData.naturalGasCapacity}
                onChange={(e) => handleDataChange('naturalGasCapacity', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                placeholder="0"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                {t('windCapacityMW')}
              </label>
              <input
                type="number"
                value={pactaData.windCapacity}
                onChange={(e) => handleDataChange('windCapacity', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                placeholder="0"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                {t('solarCapacityMW')}
              </label>
              <input
                type="number"
                value={pactaData.solarCapacity}
                onChange={(e) => handleDataChange('solarCapacity', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                placeholder="0"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                {t('hydroCapacityMW')}
              </label>
              <input
                type="number"
                value={pactaData.hydroCapacity}
                onChange={(e) => handleDataChange('hydroCapacity', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                placeholder="0"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Nükleer Kapasitesi (MW)
              </label>
              <input
                type="number"
                value={pactaData.nuclearCapacity}
                onChange={(e) => handleDataChange('nuclearCapacity', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Future Projections */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '20px', color: '#374151' }}>📈 Gelecek Projeksiyonları</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              2025 Üretim Projeksiyonu
            </label>
            <input
              type="text"
              value={pactaData.productionProjection2025}
              onChange={(e) => handleDataChange('productionProjection2025', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
              placeholder="Örn: %15 artış bekleniyor"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              2030 Üretim Projeksiyonu
            </label>
            <input
              type="text"
              value={pactaData.productionProjection2030}
              onChange={(e) => handleDataChange('productionProjection2030', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
              placeholder="Örn: %40 yenilenebilir enerji oranı"
            />
          </div>
        </div>
      </div>

      {/* Scenario Selection */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '20px', color: '#374151' }}>🌍 İklim Senaryosu Seçimi</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          {[
            { value: 'nze_2050', label: 'Net Zero 2050', description: '1.5°C senaryosu' },
            { value: 'below_2c', label: 'Below 2°C', description: '2°C altı senaryo' },
            { value: 'ndc', label: 'NDC', description: 'Ulusal katkı senaryosu' }
          ].map(scenario => (
            <div
              key={scenario.value}
              onClick={() => handleDataChange('selectedScenario', scenario.value)}
              style={{
                padding: '20px',
                border: `2px solid ${pactaData.selectedScenario === scenario.value ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                backgroundColor: pactaData.selectedScenario === scenario.value ? '#dbeafe' : 'white',
                textAlign: 'center'
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>{scenario.label}</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{scenario.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalysisResults = () => (
    <div>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
        <h2 style={{ color: '#1e40af', marginBottom: '25px' }}>🎯 {t('pactaAnalysisResults')}</h2>
        
        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <div style={{ 
            backgroundColor: '#dbeafe', 
            padding: '25px', 
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #3b82f6'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#1e40af' }}>
              {t('alignmentScore')}
            </h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e40af' }}>
              {analysisResults?.alignmentScore || 65}%
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
              {t('sectorAverage')}: 58%
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#dcfce7', 
            padding: '25px', 
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #10b981'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#065f46' }}>
              {t('climateScenario')}
            </h3>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#065f46' }}>
              Below 2°C
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
              {t('parisAgreementCompliant')}
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#fef3c7', 
            padding: '25px', 
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #f59e0b'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#92400e' }}>
              {t('sectorPerformance')}
            </h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#92400e' }}>
              B+
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
              {t('goodLevel')}
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#ede9fe', 
            padding: '25px', 
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #8b5cf6'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#581c87' }}>
              {t('riskScore')}
            </h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#581c87' }}>
              {t('low')}
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
              {t('transitionRisk')}
            </p>
          </div>
        </div>
        
        {/* Recommendations */}
        <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '20px', color: '#1e40af' }}>💡 {t('recommendations')}</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {analysisResults?.recommendations?.map((rec, index) => (
              <li key={index} style={{ marginBottom: '10px', color: '#374151' }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Benchmark Visualization */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px' }}>
        <h2 style={{ color: '#1e40af', marginBottom: '25px' }}>📊 {t('benchmarkComparison')}</h2>
        <PACTABenchmarkVisualizer 
          sectorData={{
            sector: selectedSector,
            alignmentScore: analysisResults?.alignmentScore || 65,
            sectorBenchmark: analysisResults?.sectorBenchmark || 58
          }}
        />
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#1e40af' }}>
          📊 PACTA Portfolio Analysis
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '18px' }}>
          {t('pactaFullDescription')}
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          {[
            { step: 1, title: t('companyInformation') },
            { step: 2, title: t('portfolioUpload') },
            { step: 3, title: t('sectoralData') },
            { step: 4, title: t('analysisResults') }
          ].map((item) => (
            <div
              key={item.step}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: currentStep >= item.step ? '#dbeafe' : '#f3f4f6',
                color: currentStep >= item.step ? '#1e40af' : '#6b7280',
                border: currentStep === item.step ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                margin: '0 5px',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentStep(item.step)}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {item.step}. {item.title}
              </div>
              <div style={{ fontSize: '12px' }}>
                {currentStep > item.step ? `✅ ${t('progressCompleted')}` : 
                 currentStep === item.step ? `▶️ ${t('progressActive')}` : `⏳ ${t('progressWaiting')}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          style={{
            padding: '12px 24px',
            backgroundColor: currentStep === 1 ? '#e5e7eb' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          ← {t('previous')}
        </button>

        <button
          onClick={() => {
            if (currentStep === 3) {
              runAnalysis();
            } else {
              setCurrentStep(Math.min(4, currentStep + 1));
            }
          }}
          disabled={currentStep === 4}
          style={{
            padding: '12px 24px',
            backgroundColor: currentStep === 4 ? '#10b981' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          {currentStep === 3 ? `🔍 ${t('startAnalysis')}` : 
           currentStep === 4 ? `✅ ${t('completed')}` : `${t('next')} →`}
        </button>
      </div>
    </div>
  );
};

export default PACTAAnalysis;