import React from 'react';
import { useTranslation } from 'react-i18next';
import CountryRiskDashboard from './tables/CountryRiskDashboard';
import EBITDABridgeChart from './charts/EBITDABridgeChart';
import ScenarioComparisonDashboard from './charts/ScenarioComparisonDashboard';
import PACTABenchmarkVisualizer from './charts/PACTABenchmarkVisualizer';
import PortfolioRiskHeatmap from './charts/PortfolioRiskHeatmap';

const RiskReport = ({ company, scores, enhanced, productSpecific, settings, onClose }) => {
  const { t } = useTranslation();
  const currentDate = new Date().toLocaleDateString('tr-TR');
  
  // PACTA debug
  console.log('Company data:', company);
  console.log('Scores data:', scores);
  console.log('PACTA check:', {
    totalInstalledCapacity: company.totalInstalledCapacity,
    annualProduction: company.annualProduction,
    coalCapacity: company.coalCapacity,
    plannedInvestments: company.plannedInvestments
  });
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      overflow: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '90%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflow: 'auto',
        borderRadius: '12px',
        padding: '40px'
      }}>
        {/* Başlık */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#1a1a1a', marginBottom: '10px' }}>{t('climateRiskAssessmentReport')}</h1>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>{company.companyName}</h2>
          <p style={{ color: '#666' }}>{t('reportDate')}: {currentDate}</p>
        </div>

        {/* Özet Bilgiler */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            borderLeft: '4px solid #0066cc'
          }}>
            <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{t('sector')}</h3>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{company.sector}</p>
          </div>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            borderLeft: '4px solid #28a745'
          }}>
            <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{t('creditAmount')}</h3>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{company.currency} {(company.creditAmount / 1000000).toFixed(1)}M</p>
          </div>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            borderLeft: '4px solid #ffc107'
          }}>
            <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{t('employeeCount')}</h3>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{company.employeeCount || 'N/A'}</p>
          </div>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            borderLeft: '4px solid #dc3545'
          }}>
            <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{t('riskCategory')}</h3>
            <p style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: scores.riskCategory === 'High' ? '#dc3545' : scores.riskCategory === 'Medium' ? '#ffc107' : '#28a745'
            }}>
              {scores.riskCategory === 'High' ? t('high') : scores.riskCategory === 'Medium' ? t('medium') : t('low')}
            </p>
          </div>
        </div>

        {/* Enhanced Risk Assessment Results */}
        {enhanced && enhanced.success && (
          <div style={{
            backgroundColor: '#f0fff4',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: '2px solid #22c55e'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#16a34a', marginBottom: 0 }}>🆕 {t('enhancedFinancialImpact')}</h2>
              <div style={{
                backgroundColor: '#dcfce7',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#166534'
              }}>
                PDF Metodolojisi • {settings?.scenario?.toUpperCase()} • {settings?.productType?.toUpperCase()}
              </div>
            </div>
            
            {/* EBITDA Bridge Analysis */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>📊 {t('ebitdaBridgeAnalysis')} ({enhanced.scenario})</h3>
              
              {/* Interactive Chart */}
              <div style={{ marginBottom: '20px', height: '300px' }}>
                <EBITDABridgeChart 
                  scenario={enhanced.scenario}
                  data={{
                    carbonCost: enhanced.transition?.carbonCost || 0,
                    electricityCost: enhanced.transition?.electricityCost || 0,
                    demandImpact: enhanced.transition?.demandImpact || 0,
                    shockPercentage: enhanced.transition?.shockPercentage || 0
                  }}
                />
              </div>
              
              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fef3c7', borderRadius: '6px' }}>
                  <div style={{ fontSize: '14px', color: '#92400e', marginBottom: '5px' }}>{t('carbonCost')}</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d97706' }}>
                    {enhanced.transition?.carbonCost ? Math.round(enhanced.transition.carbonCost).toLocaleString() : 0} QAR
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fee2e2', borderRadius: '6px' }}>
                  <div style={{ fontSize: '14px', color: '#991b1b', marginBottom: '5px' }}>{t('energyCost')}</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>
                    {enhanced.transition?.electricityCost ? Math.round(enhanced.transition.electricityCost).toLocaleString() : 0} QAR
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f3e8ff', borderRadius: '6px' }}>
                  <div style={{ fontSize: '14px', color: '#6b21a8', marginBottom: '5px' }}>{t('demandImpact')}</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#9333ea' }}>
                    {enhanced.transition?.demandImpact ? Math.round(enhanced.transition.demandImpact).toLocaleString() : 0} QAR
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#dbeafe', borderRadius: '6px' }}>
                  <div style={{ fontSize: '14px', color: '#1e40af', marginBottom: '5px' }}>{t('ebitdaShock')}</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>
                    {enhanced.transition?.shockPercentage ? enhanced.transition.shockPercentage.toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            </div>
            
            {/* Country Risk Analysis Dashboard */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>🌍 {t('countryRiskAnalysis')}</h3>
              <CountryRiskDashboard />
            </div>
            
            {/* NGFS Scenario Analysis Dashboard */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>🌡️ {t('ngfsScenarioComparison')}</h3>
              <ScenarioComparisonDashboard 
                selectedScenarios={[
                  (enhanced.scenario && enhanced.scenario.toLowerCase()) || 
                  (settings?.scenario && settings.scenario.toLowerCase()) || 
                  'orderly', 
                  'disorderly', 
                  'hothouse'
                ].filter(s => s && ['orderly', 'disorderly', 'hothouse'].includes(s))}
                sectorData={company?.sector}
                maturityPeriod={settings?.maturity}
              />
            </div>
            
            {/* Risk Index Combination */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>⚖️ {t('riskIndexCombination')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>TRS (Adjusted)</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>
                    {enhanced.transition?.trs_adjusted || enhanced.transition?.trs || '0.00'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{t('transitionRisk')}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>PRS (New)</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {enhanced.physical?.prs_new || '0.00'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{t('physicalRisk')}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>RI*</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {enhanced.riskIndex?.ri_adjusted || '0.00'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{t('adjustedRisk')}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>{t('riskCategory')}</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', 
                    color: enhanced.summary?.riskCategory === 'High' ? '#ef4444' : 
                           enhanced.summary?.riskCategory === 'Medium' ? '#f59e0b' : '#22c55e' }}>
                    {enhanced.summary?.riskCategory === 'High' ? t('high').toUpperCase() : 
                     enhanced.summary?.riskCategory === 'Medium' ? t('medium').toUpperCase() : t('low').toUpperCase()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{t('riskLevel')}</div>
                </div>
              </div>
            </div>
            
            {/* PACTA Enhancement */}
            {enhanced.pacta?.applicable && (
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>🎯 {t('pactaTechnologyAlignment')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>{t('misalignmentGap')}</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                      {enhanced.pacta.gapPercentage}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{t('benchmarkDistance')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Benchmark</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>
                      {enhanced.pacta.benchmark?.target}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{enhanced.pacta.benchmark?.metric}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Actual</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#3b82f6' }}>
                      {enhanced.pacta.actual?.value}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{enhanced.pacta.actual?.metric}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* PACTA Technology Alignment Analysis */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>🎯 {t('pactaTechnologyAlignment')}</h3>
              <PACTABenchmarkVisualizer 
                companyData={company}
                sectorData={company.sector}
                benchmarkScenario={settings?.scenario || 'iea-nze'}
                targetYear={2030}
              />
            </div>
            
            {/* Portfolio Risk Heatmap */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>🔥 Portföy Risk Konsantrasyonu ve Heat Map</h3>
              <PortfolioRiskHeatmap 
                selectedScenario={enhanced.scenario?.toLowerCase() || 'orderly'}
                portfolioData={company}
                exposureData={settings}
                currency={company.currency || 'QAR'}
              />
            </div>
          </div>
        )}
        
        {/* Financial Product Specific Analysis */}
        {productSpecific && (
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: '2px solid #3b82f6'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#1e40af', marginBottom: 0 }}>💼 {productSpecific.productType} Analizi</h2>
              <div style={{
                backgroundColor: '#dbeafe',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#1e40af'
              }}>
                Vade: {productSpecific.maturityAdjustment?.category} (x{productSpecific.maturityAdjustment?.multiplier})
              </div>
            </div>
            
            {/* Credit Risk Metrics */}
            {productSpecific.creditMetrics && (
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>📉 Kredi Risk Metrikleri</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>PD Artışı</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626' }}>
                      +{productSpecific.creditMetrics.pd_uplift_pct}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{productSpecific.creditMetrics.pd_base} → {productSpecific.creditMetrics.pd_new}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>LGD Artışı</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ea580c' }}>
                      +{productSpecific.creditMetrics.pd_uplift_pct}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{productSpecific.creditMetrics.lgd_base} → {productSpecific.creditMetrics.lgd_new}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>ECL (12m)</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#9333ea' }}>
                      {productSpecific.expectedLoss?.ecl_12m_qar?.toLocaleString()} QAR
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{productSpecific.expectedLoss?.ecl_12m_bps} bps</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Teminat Vuln.</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#7c2d12' }}>
                      {(productSpecific.creditMetrics.collateralVulnerability * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Risk faktörü</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Product-specific metrics */}
            {productSpecific.projectFinance && (
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>🏗️ Proje Finansmanı Covenant Analizi</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>DSCR (Baseline)</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                      {productSpecific.projectFinance.dscr_base}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>DSCR (Stressed)</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
                      {productSpecific.projectFinance.dscr_new}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Covenant Risk</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', 
                      color: productSpecific.projectFinance.covenantRisk === 'HIGH' ? '#dc2626' : 
                             productSpecific.projectFinance.covenantRisk === 'MEDIUM' ? '#ea580c' : '#059669' }}>
                      {productSpecific.projectFinance.covenantRisk}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Expected Loss Summary */}
            <div style={{
              backgroundColor: '#1e293b',
              padding: '20px',
              borderRadius: '8px',
              color: 'white'
            }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', color: 'white' }}>💰 Beklenen Kayıp Özeti</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>12 Aylık ECL</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24' }}>
                    {productSpecific.expectedLoss?.ecl_12m_qar?.toLocaleString() || 'N/A'} QAR
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>Lifetime ECL</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {productSpecific.expectedLoss?.ecl_lifetime_qar?.toLocaleString() || 'N/A'} QAR
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>Risk-Adjusted Pricing</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                    +{productSpecific.stresses?.spread_shock_bps || 0} bps
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Risk Skorları */}
        <div style={{
          backgroundColor: '#f0f8ff',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '40px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>{t('riskAssessmentSummary')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#666' }}>{t('transitionRisk')}</h3>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#ff6b6b',
                marginBottom: '10px'
              }}>
                {scores.transitionRisk}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>{t('outOf5')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#666' }}>{t('physicalRisk')}</h3>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#ffa94d',
                marginBottom: '10px'
              }}>
                {scores.physicalRisk}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>{t('outOf5')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#666' }}>{t('totalRiskScore')}</h3>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#6c5ce7',
                marginBottom: '10px'
              }}>
                {scores.totalRisk}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>{t('outOf5')}</div>
            </div>
          </div>
        </div>

        {/* Detaylı Risk Analizi */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ marginBottom: '20px' }}>{t('detailedRiskAnalysis')}</h2>
          
          {/* Geçiş Riski Detayları */}
          <div style={{
            backgroundColor: '#fff5f5',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#c92a2a', marginBottom: '15px' }}>{t('transitionRiskFactorsReport')}</h3>
            {Object.entries(scores.details.transitionComponents).map(([key, component]) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #ffe3e3'
              }}>
                <span>{component.label} ({component.weight})</span>
                <span style={{ fontWeight: 'bold' }}>
                  {component.value} {component.unit}
                </span>
              </div>
            ))}
          </div>

          {/* Fiziksel Risk Detayları */}
          <div style={{
            backgroundColor: '#fff4e6',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#e67700', marginBottom: '15px' }}>{t('physicalRiskFactorsReport')}</h3>
            {Object.entries(scores.details.physicalComponents).map(([key, component]) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #ffd8a8'
              }}>
                <span>{component.label} ({component.weight})</span>
                <span style={{ fontWeight: 'bold' }}>{component.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emisyon Verileri */}
        {company.scope1Emissions && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px' }}>{t('emissionProfile')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Scope 1</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {parseInt(company.scope1Emissions).toLocaleString()} tCO₂e
                </p>
              </div>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Scope 2</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {parseInt(company.scope2Emissions).toLocaleString()} tCO₂e
                </p>
              </div>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Scope 3</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {company.scope3Emissions ? parseInt(company.scope3Emissions).toLocaleString() : 'N/A'} tCO₂e
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PACTA Analizi - Debug Mode */}
        {true && (
          <div style={{
            backgroundColor: '#f0f8ff',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '40px'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#1e40af' }}>{t('pactaAnalysisReport')}</h2>
            
            {/* Temel Metrikler */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '20px',
              marginBottom: '30px'
            }}>
              {/* Toplam Kapasite */}
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                borderLeft: '4px solid #3b82f6'
              }}>
                <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>PACTA Test</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                  {company.totalInstalledCapacity || 'Debug Mode'}
                </p>
                <p style={{ fontSize: '12px', color: '#666' }}>PACTA Aktif</p>
              </div>
              
              {/* Yıllık Üretim */}
              {company.annualProduction && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  borderLeft: '4px solid #10b981'
                }}>
                  <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{t('annualProductionReport')}</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                    {company.annualProduction} GWh
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>{t('energyProduction')}</p>
                </div>
              )}
              
              {/* Otomotiv Üretimi */}
              {company.annualTotalProduction && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  borderLeft: '4px solid #f59e0b'
                }}>
                  <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{t('annualVehicleProduction')}</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
                    {parseInt(company.annualTotalProduction).toLocaleString()}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>{t('pieces')}</p>
                </div>
              )}
              
              {/* Sanayi Kapasitesi */}
              {company.annualProductionCapacity && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  borderLeft: '4px solid #8b5cf6'
                }}>
                  <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{t('productionCapacityReport')}</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>
                    {parseInt(company.annualProductionCapacity).toLocaleString()} ton
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>{t('annual')}</p>
                </div>
              )}
            </div>
            
            {/* Teknoloji Dağılımı - Enerji */}
            {(company.coalCapacity || company.windCapacity || company.solarCapacity) && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1f2937' }}>{t('technologyDistributionEnergy')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                  {company.coalCapacity && (
                    <div style={{ padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                      <strong>{t('coal')}:</strong> {company.coalCapacity} MW
                    </div>
                  )}
                  {company.naturalGasCapacity && (
                    <div style={{ padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                      <strong>{t('naturalGas')}:</strong> {company.naturalGasCapacity} MW
                    </div>
                  )}
                  {company.windCapacity && (
                    <div style={{ padding: '15px', backgroundColor: '#dcfce7', borderRadius: '8px' }}>
                      <strong>{t('wind')}:</strong> {company.windCapacity} MW
                    </div>
                  )}
                  {company.solarCapacity && (
                    <div style={{ padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                      <strong>{t('solar')}:</strong> {company.solarCapacity} MW
                    </div>
                  )}
                  {company.hydroCapacity && (
                    <div style={{ padding: '15px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                      <strong>{t('hydroelectric')}:</strong> {company.hydroCapacity} MW
                    </div>
                  )}
                  {company.nuclearCapacity && (
                    <div style={{ padding: '15px', backgroundColor: '#ede9fe', borderRadius: '8px' }}>
                      <strong>{t('nuclear')}:</strong> {company.nuclearCapacity} MW
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Araç Tipi Dağılımı - Otomotiv */}
            {(company.iceProduction || company.bevProduction || company.phevProduction) && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1f2937' }}>{t('vehicleTypeDistribution')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                  {company.iceProduction && (
                    <div style={{ padding: '15px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                      <strong>ICE:</strong> {parseInt(company.iceProduction).toLocaleString()} {t('pieces')}
                    </div>
                  )}
                  {company.bevProduction && (
                    <div style={{ padding: '15px', backgroundColor: '#dcfce7', borderRadius: '8px' }}>
                      <strong>{t('electric')}:</strong> {parseInt(company.bevProduction).toLocaleString()} {t('pieces')}
                    </div>
                  )}
                  {company.phevProduction && (
                    <div style={{ padding: '15px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                      <strong>PHEV:</strong> {parseInt(company.phevProduction).toLocaleString()} {t('pieces')}
                    </div>
                  )}
                  {company.hevProduction && (
                    <div style={{ padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                      <strong>HEV:</strong> {parseInt(company.hevProduction).toLocaleString()} {t('pieces')}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* PACTA Skorları */}
            <div style={{
              backgroundColor: '#1e293b',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>{t('pactaComplianceScores')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '8px' }}>
                    {scores.pactaTechnologyAlignment || '65'}%
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>{t('technologyAlignment')}</div>
                </div>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
                    {scores.pactaScenarioDeviation || '-12'}%
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>{t('scenarioDeviation')}</div>
                </div>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                    {scores.pacta2030Readiness || 'B+'}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>{t('readiness2030')}</div>
                </div>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
                    {scores.pactaParisAlignment || '2.1'}°C
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>{t('parisAlignment')}</div>
                </div>
              </div>
            </div>
            
            {/* Senaryo Uyumu */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                borderLeft: '4px solid #06b6d4'
              }}>
                <h4 style={{ marginBottom: '10px', color: '#0891b2' }}>{t('referenceScenarioReport')}</h4>
                <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {company.referenceScenario === 'iea-sds' ? 'IEA SDS (2°C)' :
                   company.referenceScenario === 'iea-nze' ? 'IEA Net Zero (1.5°C)' :
                   company.referenceScenario === 'ngfs-orderly' ? 'NGFS Orderly Transition' :
                   company.referenceScenario === 'ngfs-disorderly' ? 'NGFS Disorderly Transition' :
                   company.referenceScenario === 'national-ndc' ? 'Ulusal NDC Hedefleri' :
                   t('notSpecified')}
                </p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                borderLeft: '4px solid #84cc16'
              }}>
                <h4 style={{ marginBottom: '10px', color: '#65a30d' }}>{t('carbonBudgetComplianceReport')}</h4>
                <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {company.carbonBudgetCompliance === 'compliant' ? t('compliant') :
                   company.carbonBudgetCompliance === 'partially-compliant' ? t('partiallyCompliantShort') :
                   company.carbonBudgetCompliance === 'non-compliant' ? t('nonCompliantShort') :
                   t('notSpecified')}
                </p>
              </div>
            </div>
            
            {/* Dekarbonizasyon Yol Haritası */}
            {company.decarbonizationRoadmap && (
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                borderLeft: '4px solid #10b981',
                marginBottom: '20px'
              }}>
                <h4 style={{ marginBottom: '10px', color: '#059669' }}>{t('decarbonizationRoadmapReport')}</h4>
                <p style={{ lineHeight: '1.6', fontSize: '14px' }}>{company.decarbonizationRoadmap}</p>
              </div>
            )}
            
            {/* Yatırım Bilgileri */}
            {(company.plannedInvestments || company.greenTechInvestmentRatio || company.rdBudget) && (
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ marginBottom: '15px', color: '#1f2937' }}>{t('strategicInvestments')}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                  {company.plannedInvestments && (
                    <div>
                      <span style={{ fontSize: '12px', color: '#666' }}>{t('plannedInvestmentsReport')}</span>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>
                        €{company.plannedInvestments}M
                      </p>
                    </div>
                  )}
                  {company.greenTechInvestmentRatio && (
                    <div>
                      <span style={{ fontSize: '12px', color: '#666' }}>{t('greenTechRatioReport')}</span>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0', color: '#10b981' }}>
                        %{company.greenTechInvestmentRatio}
                      </p>
                    </div>
                  )}
                  {company.rdBudget && (
                    <div>
                      <span style={{ fontSize: '12px', color: '#666' }}>{t('rdBudgetReport')}</span>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>
                        €{company.rdBudget}M{t('perYear')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Öneriler */}
        <div style={{
          backgroundColor: '#e6fcf5',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '40px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>{t('recommendationsActionPlan')}</h2>
          <ul style={{ lineHeight: '1.8' }}>
            <li>{t('tcfdReporting')}</li>
            <li>{t('scienceBasedTargets')}</li>
            <li>{t('renewableEnergyIncrease')}</li>
            <li>{t('carbonManagement')}</li>
            <li>{t('climateScenarioAnalysisRec')}</li>
            {/* PACTA bazlı öneriler */}
            {scores.pactaTechnologyAlignment < 60 && <li>{t('cleanTechInvestment')}</li>}
            {scores.pactaParisAlignment > 2.0 && <li>{t('parisAlignmentStrategy')}</li>}
            {company.sector === 'Enerji' && scores.pactaTechnologyAlignment < 70 && <li>{t('fossilPhaseOutRec')}</li>}
            {company.sector === 'Otomotiv' && scores.pactaTechnologyAlignment < 70 && <li>{t('evProductionIncrease')}</li>}
          </ul>
        </div>

        {/* Butonlar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 30px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {t('close')}
          </button>
          <button
            onClick={() => window.print()}
            style={{
              padding: '12px 30px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {t('downloadPdf')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskReport;