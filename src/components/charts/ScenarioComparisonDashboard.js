import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';

const ScenarioComparisonDashboard = ({ selectedScenarios, sectorData, maturityPeriod }) => {
  const [activeView, setActiveView] = useState('comparison'); // 'comparison', 'matrix', 'timeline'
  
  // NGFS Scenarios as per PDF methodology
  const ngfsScenarios = {
    orderly: {
      name: 'NGFS Orderly Transition',
      description: 'Early policy action, coordinated global effort',
      color: '#22c55e',
      carbonPrice2030: 125, // USD/tCO2
      carbonPrice2050: 250,
      temperatureRise: 1.6, // Celsius
      transitionRisk: 'High',
      physicalRisk: 'Low-Medium',
      keyFeatures: [
        'Immediate policy response',
        'International cooperation',
        'Gradual carbon price increase',
        'Technology advancement'
      ]
    },
    disorderly: {
      name: 'NGFS Disorderly Transition',
      description: 'Late policy action, abrupt transition',
      color: '#f59e0b',
      carbonPrice2030: 80,
      carbonPrice2050: 350,
      temperatureRise: 1.7,
      transitionRisk: 'Very High',
      physicalRisk: 'Medium',
      keyFeatures: [
        'Delayed policy response',
        'Sudden policy changes',
        'Economic disruption',
        'Stranded assets risk'
      ]
    },
    hothouse: {
      name: 'NGFS Hot House World',
      description: 'No additional climate policies',
      color: '#ef4444',
      carbonPrice2030: 0,
      carbonPrice2050: 0,
      temperatureRise: 3.2,
      transitionRisk: 'Low',
      physicalRisk: 'Very High',
      keyFeatures: [
        'No new climate policies',
        'Current policies only',
        'Severe physical impacts',
        'Economic losses from climate damages'
      ]
    }
  };

  // Matrix view for Step H implementation (PDF page 15-16)
  const stepHMatrix = {
    sectors: ['Oil & Gas', 'Utilities', 'Manufacturing', 'Transportation', 'Real Estate', 'Agriculture'],
    riskFactors: [
      'Carbon Pricing',
      'Policy Transition',
      'Technology Shift',
      'Market Preferences',
      'Physical Climate',
      'Regulatory Changes'
    ],
    // Risk intensity matrix (0-5 scale)
    matrixData: {
      orderly: {
        'Oil & Gas': [5, 4, 5, 4, 2, 4],
        'Utilities': [4, 4, 4, 3, 3, 4],
        'Manufacturing': [3, 3, 3, 3, 2, 3],
        'Transportation': [4, 4, 5, 4, 2, 3],
        'Real Estate': [2, 2, 2, 2, 4, 2],
        'Agriculture': [1, 2, 2, 2, 5, 2]
      },
      disorderly: {
        'Oil & Gas': [5, 5, 5, 5, 3, 5],
        'Utilities': [5, 5, 4, 4, 3, 5],
        'Manufacturing': [4, 4, 4, 4, 3, 4],
        'Transportation': [5, 5, 5, 5, 3, 4],
        'Real Estate': [3, 3, 3, 3, 4, 3],
        'Agriculture': [2, 3, 2, 3, 5, 3]
      },
      hothouse: {
        'Oil & Gas': [1, 1, 2, 2, 5, 1],
        'Utilities': [1, 1, 2, 2, 5, 2],
        'Manufacturing': [1, 1, 2, 2, 4, 1],
        'Transportation': [1, 1, 2, 3, 4, 1],
        'Real Estate': [0, 0, 1, 1, 5, 0],
        'Agriculture': [0, 0, 1, 1, 5, 0]
      }
    }
  };

  const getHeatmapColor = (value) => {
    const colors = ['#22c55e', '#84cc16', '#eab308', '#f59e0b', '#f97316', '#ef4444'];
    return colors[Math.min(value, 5)];
  };

  const renderComparisonView = () => {
    const scenarios = (selectedScenarios && selectedScenarios.length > 0) 
      ? selectedScenarios.filter(s => s && ngfsScenarios[s]) 
      : ['orderly', 'disorderly', 'hothouse'];
    
    // Ensure we have valid scenarios
    const validScenarios = scenarios.filter(s => s && ngfsScenarios[s]);
    if (validScenarios.length === 0) {
      return <div>No valid scenarios selected</div>;
    }
    
    const chartData = {
      labels: validScenarios.map(s => ngfsScenarios[s].name),
      datasets: [
        {
          label: 'Carbon Price 2030 (USD/tCO₂)',
          data: validScenarios.map(s => ngfsScenarios[s].carbonPrice2030),
          backgroundColor: validScenarios.map(s => ngfsScenarios[s].color + '80'),
          borderColor: validScenarios.map(s => ngfsScenarios[s].color),
          borderWidth: 2,
          yAxisID: 'y'
        },
        {
          label: 'Temperature Rise (°C)',
          data: validScenarios.map(s => ngfsScenarios[s].temperatureRise),
          backgroundColor: '#8b5cf6',
          borderColor: '#7c3aed',
          borderWidth: 2,
          type: 'line',
          yAxisID: 'y1'
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'NGFS Scenarios: Key Metrics Comparison'
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Carbon Price (USD/tCO₂)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Temperature Rise (°C)'
          },
          grid: {
            drawOnChartArea: false,
          },
        }
      }
    };

    return (
      <div>
        <div style={{ height: '400px', marginBottom: '30px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
        
        {/* Scenario Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {validScenarios.map(scenarioKey => {
            const scenario = ngfsScenarios[scenarioKey];
            return (
              <div key={scenarioKey} style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                border: `3px solid ${scenario.color}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  backgroundColor: scenario.color + '20', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  marginBottom: '15px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    color: scenario.color,
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    {scenario.name}
                  </h3>
                </div>
                
                <p style={{ 
                  fontSize: '14px', 
                  color: '#64748b', 
                  marginBottom: '15px',
                  lineHeight: '1.4'
                }}>
                  {scenario.description}
                </p>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                    <div>
                      <strong>Carbon Price 2030:</strong>
                      <div style={{ color: scenario.color, fontWeight: 'bold' }}>
                        ${scenario.carbonPrice2030}/tCO₂
                      </div>
                    </div>
                    <div>
                      <strong>Temp. Rise:</strong>
                      <div style={{ color: scenario.color, fontWeight: 'bold' }}>
                        {scenario.temperatureRise}°C
                      </div>
                    </div>
                    <div>
                      <strong>Transition Risk:</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {scenario.transitionRisk}
                      </div>
                    </div>
                    <div>
                      <strong>Physical Risk:</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {scenario.physicalRisk}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <strong style={{ fontSize: '13px' }}>Key Features:</strong>
                  <ul style={{ 
                    fontSize: '12px', 
                    color: '#64748b', 
                    marginTop: '8px',
                    paddingLeft: '16px'
                  }}>
                    {scenario.keyFeatures.map((feature, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMatrixView = () => {
    const selectedScenario = (selectedScenarios && selectedScenarios.length > 0 && ngfsScenarios[selectedScenarios[0]]) 
      ? selectedScenarios[0] 
      : 'orderly';
    
    return (
      <div>
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#1e293b' }}>
            PDF Step H: Sector × Risk Factor Matrix Analysis
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Risk intensity scores (0-5 scale) for {ngfsScenarios[selectedScenario].name} scenario
          </p>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
                <th style={{ 
                  padding: '15px 12px', 
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>Sector</th>
                {stepHMatrix.riskFactors.map((factor, idx) => (
                  <th key={idx} style={{ 
                    padding: '15px 8px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    maxWidth: '80px'
                  }}>{factor}</th>
                ))}
                <th style={{ 
                  padding: '15px 12px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>Avg Risk</th>
              </tr>
            </thead>
            <tbody>
              {stepHMatrix.sectors.map((sector, sectorIdx) => {
                const riskValues = stepHMatrix.matrixData[selectedScenario]?.[sector] || [0, 0, 0, 0, 0, 0];
                const avgRisk = (riskValues.reduce((a, b) => a + b, 0) / riskValues.length).toFixed(1);
                
                return (
                  <tr key={sectorIdx} style={{ 
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: sectorIdx % 2 === 0 ? '#f8fafc' : 'white'
                  }}>
                    <td style={{ 
                      padding: '12px',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      color: '#1e293b'
                    }}>{sector}</td>
                    {riskValues.map((value, valueIdx) => (
                      <td key={valueIdx} style={{
                        padding: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: getHeatmapColor(value),
                          color: value > 2 ? 'white' : '#1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          margin: '0 auto'
                        }}>
                          {value}
                        </div>
                      </td>
                    ))}
                    <td style={{ 
                      padding: '12px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      color: parseFloat(avgRisk) > 3 ? '#ef4444' : parseFloat(avgRisk) > 2 ? '#f59e0b' : '#22c55e'
                    }}>
                      {avgRisk}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
          gap: '15px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Risk Level:</span>
          {[0, 1, 2, 3, 4, 5].map(level => (
            <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: getHeatmapColor(level),
                border: '1px solid #e2e8f0'
              }}></div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{level}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTimelineView = () => {
    const years = [2025, 2030, 2035, 2040, 2045, 2050];
    
    const timelineData = {
      labels: years,
      datasets: Object.keys(ngfsScenarios).map(scenarioKey => ({
        label: ngfsScenarios[scenarioKey].name,
        data: years.map(year => {
          const scenario = ngfsScenarios[scenarioKey];
          // Linear interpolation between 2030 and 2050 values
          const progress = (year - 2030) / (2050 - 2030);
          return scenario.carbonPrice2030 + progress * (scenario.carbonPrice2050 - scenario.carbonPrice2030);
        }),
        borderColor: ngfsScenarios[scenarioKey].color,
        backgroundColor: ngfsScenarios[scenarioKey].color + '20',
        borderWidth: 3,
        fill: false,
        tension: 0.4
      }))
    };

    const timelineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Carbon Price Evolution by NGFS Scenario'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Carbon Price (USD/tCO₂)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        }
      }
    };

    return (
      <div style={{ height: '500px' }}>
        <Line data={timelineData} options={timelineOptions} />
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Header with navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f1f5f9'
      }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#1e293b' }}>
            🌡️ NGFS Scenario Analysis Dashboard
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            PDF Implementation: Network for Greening the Financial System scenarios
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          padding: '4px'
        }}>
          {[
            { key: 'comparison', label: '📊 Comparison', title: 'Compare scenarios side-by-side' },
            { key: 'matrix', label: '🔥 Risk Matrix', title: 'PDF Step H matrix analysis' },
            { key: 'timeline', label: '📈 Timeline', title: 'Carbon price evolution' }
          ].map(view => (
            <button
              key={view.key}
              onClick={() => setActiveView(view.key)}
              title={view.title}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: activeView === view.key ? '#3b82f6' : 'transparent',
                color: activeView === view.key ? 'white' : '#64748b',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeView === view.key ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeView === 'comparison' && renderComparisonView()}
        {activeView === 'matrix' && renderMatrixView()}
        {activeView === 'timeline' && renderTimelineView()}
      </div>
    </div>
  );
};

export default ScenarioComparisonDashboard;