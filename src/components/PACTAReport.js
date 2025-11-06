import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const PACTAReport = ({ pactaResults, formData, onClose }) => {
  const { t } = useTranslation();
  const currentDate = new Date().toLocaleDateString('tr-TR');
  
  if (!pactaResults || pactaResults.error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{t('errorGeneratingReport')}</h2>
        <p>{pactaResults?.error || t('unknownError')}</p>
        <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px' }}>
          {t('close')}
        </button>
      </div>
    );
  }

  const COLORS = {
    NZE2050: '#10b981',
    SDS: '#f59e0b',
    STEPS: '#ef4444'
  };

  // Prepare scenario comparison data
  const scenarioData = [
    {
      scenario: 'Net Zero 2050',
      score: parseFloat(pactaResults.alignmentScores.NZE2050),
      target: 100,
      temperature: '1.5°C'
    },
    {
      scenario: 'Sustainable Dev.',
      score: parseFloat(pactaResults.alignmentScores.SDS),
      target: 100,
      temperature: '1.8°C'
    },
    {
      scenario: 'Stated Policies',
      score: parseFloat(pactaResults.alignmentScores.STEPS),
      target: 100,
      temperature: '2.5°C'
    }
  ];

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #pacta-report-content, #pacta-report-content * {
            visibility: visible;
          }
          #pacta-report-content {
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
        <div id="pacta-report-content" style={{
          backgroundColor: 'white',
          width: '90%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: '12px',
          padding: '40px'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '3px solid #10b981', paddingBottom: '20px' }}>
            <h1 style={{ color: '#1a1a1a', marginBottom: '10px', fontSize: '32px' }}>
              PACTA CLIMATE ALIGNMENT REPORT
            </h1>
            <h2 style={{ color: '#10b981', marginBottom: '10px', fontSize: '20px' }}>
              Paris Agreement Capital Transition Assessment
            </h2>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>{formData.entityName || 'Company'}</h3>
            <p style={{ color: '#666' }}>{t('reportDate')}: {currentDate}</p>
          </div>

          {/* Executive Summary */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '30px',
            color: 'white'
          }}>
            <h2 style={{ marginBottom: '20px', color: 'white' }}>Executive Summary</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Sector</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{pactaResults.sector}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Best Fit Scenario</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{pactaResults.bestFitScenario}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Temperature Alignment</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{pactaResults.temperatureAlignment}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Overall Score</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{pactaResults.overallScore}/100</div>
              </div>
            </div>
          </div>

          {/* Sector-Specific Metrics */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '25px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>Sector-Specific Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              {pactaResults.sector === 'Energy' && (
                <>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Current Renewable Share</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{pactaResults.currentRenewableShare}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>2030 Target</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{pactaResults.target2030}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Coal Phase-out</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>{pactaResults.coalPhaseoutYear}</div>
                  </div>
                </>
              )}
              
              {pactaResults.sector === 'Automotive' && (
                <>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Current EV Share</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{pactaResults.currentEVShare}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>2030 EV Target</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{pactaResults.target2030}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Gap to NZE2050</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                      {(60 - parseFloat(pactaResults.target2030)).toFixed(1)}%
                    </div>
                  </div>
                </>
              )}

              {['Steel', 'Cement'].includes(pactaResults.sector) && (
                <>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Carbon Intensity</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                      {pactaResults.currentCarbonIntensity} tCO₂/ton
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Low-Carbon Share</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                      {pactaResults.currentLowCarbonShare}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>2030 Target</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{pactaResults.target2030}%</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Scenario Alignment Scores */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Climate Scenario Alignment</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scenarioData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scenario" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#10b981" name="Alignment Score">
                  {scenarioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.NZE2050 : index === 1 ? COLORS.SDS : COLORS.STEPS} />
                  ))}
                </Bar>
                <Bar dataKey="target" fill="#e5e7eb" name="Target" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
              {scenarioData.map((scenario, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{scenario.temperature}</div>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    color: idx === 0 ? COLORS.NZE2050 : idx === 1 ? COLORS.SDS : COLORS.STEPS
                  }}>
                    {scenario.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div style={{
            backgroundColor: '#eff6ff',
            padding: '25px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: '2px solid #3b82f6'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#1e40af' }}>Action Plan & Recommendations</h3>
            <ul style={{ lineHeight: '1.8', marginLeft: '20px' }}>
              {pactaResults.recommendations.map((rec, idx) => (
                <li key={idx} style={{ marginBottom: '10px', fontSize: '14px' }}>{rec}</li>
              ))}
            </ul>
          </div>

          {/* Methodology Note */}
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '20px',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '30px'
          }}>
            <strong>Methodology:</strong> This analysis uses PACTA (Paris Agreement Capital Transition Assessment) methodology developed by 2° Investing Initiative. 
            Alignment scores compare company's current trajectory and 2030 targets against IEA Net Zero by 2050 (NZE2050), 
            Sustainable Development Scenario (SDS), and Stated Policies Scenario (STEPS) benchmarks.
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
                backgroundColor: '#10b981',
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

export default PACTAReport;
