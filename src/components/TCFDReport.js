import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer
} from 'recharts';

const TCFDReport = ({ tcfdResults, formData, onClose }) => {
  const { t } = useTranslation();
  const currentDate = new Date().toLocaleDateString('tr-TR');
  
  if (!tcfdResults) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{t('errorGeneratingReport')}</h2>
        <p>{t('unknownError')}</p>
        <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px' }}>
          {t('close')}
        </button>
      </div>
    );
  }

  const { pillars, overallScore, overallCompliance, financialImpact, recommendations } = tcfdResults;

  // Prepare radar chart data for 4 pillars
  const pillarRadarData = [
    { pillar: 'Governance', score: pillars.governance.score, fullMark: 100 },
    { pillar: 'Strategy', score: pillars.strategy.score, fullMark: 100 },
    { pillar: 'Risk Mgmt', score: pillars.riskManagement.score, fullMark: 100 },
    { pillar: 'Metrics', score: pillars.metricsTargets.score, fullMark: 100 }
  ];

  // Emissions profile data
  const emissionsData = [
    { name: 'Scope 1', value: pillars.metricsTargets.emissionsProfile.scope1, color: '#ef4444' },
    { name: 'Scope 2', value: pillars.metricsTargets.emissionsProfile.scope2, color: '#f59e0b' },
    { name: 'Scope 3', value: pillars.metricsTargets.emissionsProfile.scope3, color: '#fbbf24' }
  ].filter(item => item.value > 0);

  const COLORS = ['#ef4444', '#f59e0b', '#fbbf24'];

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #tcfd-report-content, #tcfd-report-content * {
            visibility: visible;
          }
          #tcfd-report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 1.5cm;
          }
        }
      `}</style>
      
      <div className="no-print" style={{
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
        <div id="tcfd-report-content" style={{
          backgroundColor: 'white',
          width: '90%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: '12px',
          padding: '40px'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '3px solid #3b82f6', paddingBottom: '20px' }}>
            <h1 style={{ color: '#1a1a1a', marginBottom: '10px', fontSize: '32px' }}>
              TCFD COMPLIANCE ASSESSMENT REPORT
            </h1>
            <h2 style={{ color: '#3b82f6', marginBottom: '10px', fontSize: '18px' }}>
              Task Force on Climate-related Financial Disclosures
            </h2>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>{formData.entityName || 'Company'}</h3>
            <p style={{ color: '#666' }}>{t('reportDate')}: {currentDate}</p>
          </div>

          {/* Executive Summary */}
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '30px',
            color: 'white'
          }}>
            <h2 style={{ marginBottom: '20px', color: 'white' }}>Executive Summary</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Overall TCFD Score</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{overallScore}/100</div>
                <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '5px' }}>{tcfdResults.rating}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Compliance Level</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>{overallCompliance}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Readiness Status</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '10px', lineHeight: '1.4' }}>
                  {tcfdResults.readinessLevel}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillar Scores */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ marginBottom: '20px' }}>TCFD Four Pillar Assessment</h3>
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={pillarRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="pillar" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1 }}>
                {[
                  { name: 'Governance', data: pillars.governance },
                  { name: 'Strategy', data: pillars.strategy },
                  { name: 'Risk Management', data: pillars.riskManagement },
                  { name: 'Metrics & Targets', data: pillars.metricsTargets }
                ].map((pillar, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    marginBottom: '10px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${getScoreColor(pillar.data.score)}`
                  }}>
                    <span style={{ fontWeight: 'bold' }}>{pillar.name}</span>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: getScoreColor(pillar.data.score) }}>
                      {pillar.data.score}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pillar Details */}
          {[
            { title: 'Pillar 1: Governance', data: pillars.governance, color: '#8b5cf6' },
            { title: 'Pillar 2: Strategy', data: pillars.strategy, color: '#3b82f6' },
            { title: 'Pillar 3: Risk Management', data: pillars.riskManagement, color: '#10b981' },
            { title: 'Pillar 4: Metrics & Targets', data: pillars.metricsTargets, color: '#f59e0b' }
          ].map((pillar, idx) => (
            <div key={idx} style={{
              backgroundColor: '#f9fafb',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: `2px solid ${pillar.color}`
            }}>
              <h4 style={{ marginBottom: '15px', color: pillar.color }}>{pillar.title}</h4>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>Score:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: getScoreColor(pillar.data.score) }}>
                    {pillar.data.score}/100 ({pillar.data.rating})
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Compliance:</span>
                  <span style={{ 
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: pillar.data.complianceLevel === 'Full' ? '#d1fae5' : 
                                    pillar.data.complianceLevel === 'Partial' ? '#fef3c7' : '#fee2e2',
                    color: pillar.data.complianceLevel === 'Full' ? '#065f46' : 
                           pillar.data.complianceLevel === 'Partial' ? '#92400e' : '#991b1b'
                  }}>
                    {pillar.data.complianceLevel}
                  </span>
                </div>
              </div>
              
              {pillar.data.details && pillar.data.details.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#065f46' }}>✓ Strengths:</div>
                  <ul style={{ marginLeft: '20px', lineHeight: '1.6', fontSize: '14px' }}>
                    {pillar.data.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {pillar.data.gaps && pillar.data.gaps.length > 0 && (
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#dc2626' }}>⚠ Gaps to Address:</div>
                  <ul style={{ marginLeft: '20px', lineHeight: '1.6', fontSize: '14px' }}>
                    {pillar.data.gaps.map((gap, i) => (
                      <li key={i}>{gap}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Emissions Profile */}
          {emissionsData.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ marginBottom: '20px' }}>GHG Emissions Profile</h3>
              <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={emissionsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {emissionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toLocaleString()} tCO₂e`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Total Emissions</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                      {pillars.metricsTargets.emissionsProfile.total.toLocaleString()} tCO₂e
                    </div>
                  </div>
                  {pillars.metricsTargets.emissionsProfile.intensity && (
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Emissions Intensity</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                        {pillars.metricsTargets.emissionsProfile.intensity.toFixed(2)} tCO₂e/revenue
                      </div>
                    </div>
                  )}
                  {pillars.metricsTargets.targets.netZero && (
                    <div style={{
                      backgroundColor: '#d1fae5',
                      padding: '12px',
                      borderRadius: '8px',
                      marginTop: '15px'
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#065f46', marginBottom: '5px' }}>
                        ✓ Net-Zero Commitment
                      </div>
                      <div style={{ fontSize: '14px', color: '#047857' }}>
                        Target Year: {pillars.metricsTargets.targets.netZeroYear}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Financial Impact */}
          {financialImpact && (
            <div style={{
              backgroundColor: '#fef3c7',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '30px',
              border: '2px solid #fbbf24'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#92400e' }}>Climate Risk Financial Impact Assessment</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4 style={{ marginBottom: '15px', color: '#1f2937' }}>Transition Risk - Carbon Pricing</h4>
                  <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>2030 Impact (@$75/ton):</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {financialImpact.transitionRisk.carbonCost2030.toLocaleString()} {financialImpact.currency}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>2040 Impact (@$150/ton):</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {financialImpact.transitionRisk.carbonCost2040.toLocaleString()} {financialImpact.currency}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>2050 Impact (@$200/ton):</span>
                      <span style={{ fontWeight: 'bold', color: '#ef4444' }}>
                        {financialImpact.transitionRisk.carbonCost2050.toLocaleString()} {financialImpact.currency}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 style={{ marginBottom: '15px', color: '#1f2937' }}>Physical Risk Assessment</h4>
                  <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', 
                        color: financialImpact.physicalRisk.level === 'High' ? '#ef4444' : 
                               financialImpact.physicalRisk.level === 'Medium' ? '#f59e0b' : '#10b981' 
                      }}>
                        {financialImpact.physicalRisk.level}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>Physical Risk Level</div>
                    </div>
                    {financialImpact.physicalRisk.recommendations && financialImpact.physicalRisk.recommendations.length > 0 && (
                      <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        {financialImpact.physicalRisk.recommendations.map((rec, i) => (
                          <div key={i} style={{ marginBottom: '5px' }}>• {rec}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Priority Actions */}
          {recommendations && recommendations.length > 0 && (
            <div style={{
              backgroundColor: '#eff6ff',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '30px',
              border: '2px solid #3b82f6'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#1e40af' }}>Priority Action Plan</h3>
              {recommendations.map((rec, idx) => (
                <div key={idx} style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  borderLeft: `4px solid ${
                    rec.priority === 'Critical' ? '#ef4444' : 
                    rec.priority === 'High' ? '#f59e0b' : '#3b82f6'
                  }`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{rec.action}</span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: rec.priority === 'Critical' ? '#fee2e2' : 
                                      rec.priority === 'High' ? '#fef3c7' : '#dbeafe',
                      color: rec.priority === 'Critical' ? '#991b1b' : 
                             rec.priority === 'High' ? '#92400e' : '#1e40af'
                    }}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
                    {rec.description}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    <strong>Timeline:</strong> {rec.timeline}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Methodology Note */}
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '20px',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '30px'
          }}>
            <strong>Methodology:</strong> This assessment evaluates compliance with TCFD Final Report 2017 recommendations across four pillars: 
            Governance (board oversight), Strategy (scenario analysis), Risk Management (process integration), and Metrics & Targets (GHG disclosure).
            Scores are calculated using weighted criteria with financial impact scenarios based on IEA World Energy Outlook carbon pricing projections.
          </div>

          {/* Action Buttons */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '12px 30px',
                backgroundColor: '#6b7280',
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
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              📄 {t('downloadPdf')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TCFDReport;
