import React, { useState, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';

// PDF Step H: Sector × Country Risk Matrix (Page 15-16) - Moved outside component to prevent re-creation
const riskMatrix = {
    sectors: [
      'Oil & Gas', 'Utilities', 'Manufacturing', 'Transportation', 
      'Real Estate', 'Agriculture', 'Financial Services', 'Technology',
      'Healthcare', 'Consumer Goods', 'Mining', 'Construction'
    ],
    countries: [
      'Qatar', 'UAE', 'Saudi Arabia', 'Oman', 'Kuwait', 'Bahrain',
      'Turkey', 'Egypt', 'Jordan', 'Morocco', 'India', 'China',
      'Germany', 'UK', 'USA', 'Brazil', 'Indonesia', 'Nigeria'
    ],
    // EAD (Exposure at Default) in millions
    exposureMatrix: {
      'Oil & Gas': {
        'Qatar': 1250, 'UAE': 890, 'Saudi Arabia': 2100, 'Oman': 340, 'Kuwait': 670,
        'Turkey': 45, 'India': 120, 'China': 200, 'USA': 80, 'UK': 35
      },
      'Utilities': {
        'Qatar': 780, 'UAE': 560, 'Saudi Arabia': 950, 'Turkey': 340, 'Egypt': 230,
        'India': 180, 'China': 290, 'Germany': 120, 'Brazil': 85
      },
      'Manufacturing': {
        'Qatar': 430, 'UAE': 340, 'Turkey': 680, 'China': 890, 'India': 560,
        'Germany': 230, 'USA': 180, 'Mexico': 120, 'Indonesia': 95
      },
      'Transportation': {
        'Qatar': 320, 'UAE': 280, 'Turkey': 450, 'Egypt': 190, 'India': 340,
        'China': 520, 'Germany': 150, 'USA': 120
      },
      'Real Estate': {
        'Qatar': 1890, 'UAE': 1230, 'Turkey': 890, 'Egypt': 340, 'Jordan': 180,
        'Morocco': 120, 'India': 230, 'China': 180
      },
      'Financial Services': {
        'Qatar': 560, 'UAE': 340, 'Turkey': 230, 'Egypt': 180, 'India': 290,
        'China': 450, 'UK': 180, 'USA': 230
      },
      'Agriculture': {
        'Turkey': 180, 'Egypt': 230, 'Morocco': 150, 'India': 340, 'China': 280,
        'Brazil': 450, 'Indonesia': 190, 'Nigeria': 120
      },
      'Technology': {
        'UAE': 120, 'Turkey': 90, 'India': 180, 'China': 340, 'USA': 450,
        'Germany': 180, 'UK': 150
      },
      'Healthcare': {
        'Qatar': 180, 'UAE': 120, 'Turkey': 150, 'Egypt': 90, 'India': 230,
        'USA': 180, 'Germany': 120, 'UK': 90
      },
      'Consumer Goods': {
        'Turkey': 230, 'Egypt': 150, 'India': 290, 'China': 450, 'Germany': 180,
        'USA': 230, 'Brazil': 190, 'Indonesia': 120
      },
      'Mining': {
        'Oman': 180, 'Saudi Arabia': 230, 'Turkey': 120, 'India': 190,
        'China': 280, 'Brazil': 230, 'Indonesia': 150, 'Nigeria': 120
      },
      'Construction': {
        'Qatar': 670, 'UAE': 450, 'Turkey': 340, 'Egypt': 180, 'Jordan': 120,
        'India': 230, 'China': 190
      }
    },
    // Risk multipliers by scenario
    riskMultipliers: {
      orderly: {
        'Oil & Gas': 1.8, 'Utilities': 1.4, 'Manufacturing': 1.2, 'Transportation': 1.5,
        'Real Estate': 1.1, 'Agriculture': 1.3, 'Financial Services': 1.2, 'Technology': 1.0,
        'Healthcare': 1.0, 'Consumer Goods': 1.1, 'Mining': 1.6, 'Construction': 1.2
      },
      disorderly: {
        'Oil & Gas': 2.4, 'Utilities': 1.9, 'Manufacturing': 1.6, 'Transportation': 2.0,
        'Real Estate': 1.4, 'Agriculture': 1.7, 'Financial Services': 1.5, 'Technology': 1.2,
        'Healthcare': 1.1, 'Consumer Goods': 1.3, 'Mining': 2.1, 'Construction': 1.5
      },
      hothouse: {
        'Oil & Gas': 1.2, 'Utilities': 1.8, 'Manufacturing': 1.4, 'Transportation': 1.3,
        'Real Estate': 2.1, 'Agriculture': 2.3, 'Financial Services': 1.6, 'Technology': 1.1,
        'Healthcare': 1.3, 'Consumer Goods': 1.2, 'Mining': 1.4, 'Construction': 1.8
      }
    }
  };

// Country risk factors from ND-GAIN integration - Moved outside component to prevent re-creation
const countryRiskFactors = {
  'Qatar': 0.42, 'UAE': 0.40, 'Saudi Arabia': 0.42, 'Oman': 0.48, 'Kuwait': 0.44, 'Bahrain': 0.45,
  'Turkey': 0.46, 'Egypt': 0.52, 'Jordan': 0.49, 'Morocco': 0.50, 'India': 0.57, 'China': 0.42,
  'Germany': 0.30, 'UK': 0.30, 'USA': 0.34, 'Brazil': 0.53, 'Indonesia': 0.54, 'Nigeria': 0.63
};

const PortfolioRiskHeatmap = ({ 
  portfolioData = {}, 
  exposureData = {}, 
  selectedScenario = 'orderly',
  currency = 'QAR' 
}) => {
  const [activeView, setActiveView] = useState('heatmap'); // 'heatmap', 'concentration', 'rollup', 'evolution'
  const [selectedMetric, setSelectedMetric] = useState('ead'); // 'ead', 'pd', 'lgd', 'ecl'

  const calculateAdjustedRisk = (exposure, sectorRisk, countryRisk) => {
    return exposure * sectorRisk * (1 + countryRisk);
  };

  const getHeatmapColor = (value, maxValue) => {
    const intensity = value / maxValue;
    if (intensity <= 0.2) return '#22c55e'; // Green - Low risk
    if (intensity <= 0.4) return '#84cc16'; // Light green
    if (intensity <= 0.6) return '#eab308'; // Yellow - Medium risk
    if (intensity <= 0.8) return '#f59e0b'; // Orange
    return '#ef4444'; // Red - High risk
  };

  const heatmapData = useMemo(() => {
    const data = [];
    const sectorRisks = riskMatrix.riskMultipliers[selectedScenario] || {};
    
    riskMatrix.sectors.forEach(sector => {
      if (riskMatrix.exposureMatrix && riskMatrix.exposureMatrix[sector]) {
        Object.entries(riskMatrix.exposureMatrix[sector] || {}).forEach(([country, exposure]) => {
          const countryRisk = countryRiskFactors[country] || 0.5;
          const sectorRisk = sectorRisks[sector] || 1.0;
          const adjustedRisk = calculateAdjustedRisk(exposure, sectorRisk, countryRisk);
          
          data.push({
            sector,
            country,
            exposure,
            sectorRisk,
            countryRisk,
            adjustedRisk,
            riskLevel: adjustedRisk > 800 ? 'Very High' : 
                      adjustedRisk > 600 ? 'High' :
                      adjustedRisk > 400 ? 'Medium' :
                      adjustedRisk > 200 ? 'Low' : 'Very Low'
          });
        });
      }
    });
    
    return data.sort((a, b) => b.adjustedRisk - a.adjustedRisk);
  }, [selectedScenario]);

  const renderHeatmapView = () => {
    const maxRisk = heatmapData.length > 0 ? Math.max(...heatmapData.map(d => d.adjustedRisk || 0)) : 1;
    
    // Group data for heatmap visualization
    const groupedData = {};
    heatmapData.forEach(item => {
      if (!groupedData[item.sector]) groupedData[item.sector] = {};
      groupedData[item.sector][item.country] = item;
    });

    return (
      <div>
        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '25px',
          padding: '15px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px'
        }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', marginRight: '8px' }}>
              Risk Metric:
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                fontSize: '14px'
              }}
            >
              <option value="ead">EAD (Exposure at Default)</option>
              <option value="adjustedRisk">Adjusted Climate Risk</option>
              <option value="sectorRisk">Sector Risk Multiplier</option>
              <option value="countryRisk">Country Risk Factor</option>
            </select>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div style={{ 
          overflowX: 'auto',
          marginBottom: '30px',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>
            Portfolio Risk Concentration Heatmap
          </h3>
          
          <div style={{ display: 'grid', gap: '2px', minWidth: '1200px' }}>
            {/* Header row */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `200px repeat(${riskMatrix.countries.length}, 80px)`,
              gap: '2px',
              marginBottom: '2px'
            }}>
              <div style={{
                padding: '8px',
                backgroundColor: '#1e293b',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                textAlign: 'center'
              }}>
                Sector / Country
              </div>
              {riskMatrix.countries.map(country => (
                <div key={country} style={{
                  padding: '8px 4px',
                  backgroundColor: '#1e293b',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  textAlign: 'center',
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'center',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {country.slice(0, 3).toUpperCase()}
                </div>
              ))}
            </div>
            
            {/* Data rows */}
            {riskMatrix.sectors.map(sector => (
              <div key={sector} style={{
                display: 'grid',
                gridTemplateColumns: `200px repeat(${riskMatrix.countries.length}, 80px)`,
                gap: '2px'
              }}>
                <div style={{
                  padding: '8px',
                  backgroundColor: '#f1f5f9',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {sector}
                </div>
                {riskMatrix.countries.map(country => {
                  const cellData = groupedData[sector]?.[country];
                  const value = cellData && cellData[selectedMetric] !== undefined ? cellData[selectedMetric] : 0;
                  const displayValue = selectedMetric === 'ead' ? 
                    `${Math.round(value || 0)}M` :
                    selectedMetric === 'adjustedRisk' ?
                    `${Math.round(value || 0)}` :
                    (value || 0).toFixed(2);
                  
                  return (
                    <div
                      key={`${sector}-${country}`}
                      title={`${sector} - ${country}: ${displayValue}`}
                      style={{
                        padding: '8px 4px',
                        backgroundColor: cellData ? getHeatmapColor(value, maxRisk) : '#f8fafc',
                        color: value > maxRisk * 0.5 ? 'white' : '#1e293b',
                        fontSize: '10px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        border: cellData ? 'none' : '1px dashed #d1d5db'
                      }}
                    >
                      {cellData ? displayValue : '-'}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Risk Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          padding: '15px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Risk Level:</span>
          {[
            { color: '#22c55e', label: 'Very Low' },
            { color: '#84cc16', label: 'Low' },
            { color: '#eab308', label: 'Medium' },
            { color: '#f59e0b', label: 'High' },
            { color: '#ef4444', label: 'Very High' }
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: item.color,
                borderRadius: '3px'
              }}></div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderConcentrationView = () => {
    // Sector concentration analysis
    const sectorConcentration = {};
    const countryConcentration = {};
    let totalExposure = 0;

    heatmapData.forEach(item => {
      if (!item || !item.sector || !item.country) return; // Skip invalid items
      
      // Sector aggregation
      if (!sectorConcentration[item.sector]) {
        sectorConcentration[item.sector] = { exposure: 0, risk: 0, count: 0 };
      }
      sectorConcentration[item.sector].exposure += item.exposure || 0;
      sectorConcentration[item.sector].risk += item.adjustedRisk || 0;
      sectorConcentration[item.sector].count += 1;
      
      // Country aggregation
      if (!countryConcentration[item.country]) {
        countryConcentration[item.country] = { exposure: 0, risk: 0, count: 0 };
      }
      countryConcentration[item.country].exposure += item.exposure || 0;
      countryConcentration[item.country].risk += item.adjustedRisk || 0;
      countryConcentration[item.country].count += 1;
      
      totalExposure += item.exposure || 0;
    });

    const sectorChartData = {
      labels: Object.keys(sectorConcentration),
      datasets: [{
        data: Object.values(sectorConcentration).map(s => s.exposure),
        backgroundColor: [
          '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
          '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };

    const countryChartData = {
      labels: Object.keys(countryConcentration).slice(0, 10), // Top 10 countries
      datasets: [{
        data: Object.values(countryConcentration).slice(0, 10).map(c => c.exposure),
        backgroundColor: [
          '#1e293b', '#475569', '#64748b', '#94a3b8', '#cbd5e1',
          '#e2e8f0', '#f1f5f9', '#0f172a', '#334155', '#52525b'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          {/* Sector Concentration */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b', textAlign: 'center' }}>
              Sector Concentration
            </h3>
            <div style={{ height: '300px' }}>
              <Doughnut 
                data={sectorChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { fontSize: 10 }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Country Concentration */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b', textAlign: 'center' }}>
              Geographic Concentration (Top 10)
            </h3>
            <div style={{ height: '300px' }}>
              <Doughnut 
                data={countryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { fontSize: 10 }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Concentration Risk Metrics */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>
            Concentration Risk Analysis
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '5px' }}>
                {Math.round(totalExposure).toLocaleString()}M
              </div>
              <div style={{ fontSize: '14px', color: '#7f1d1d' }}>Total Portfolio EAD</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706', marginBottom: '5px' }}>
                {Object.keys(sectorConcentration).length}
              </div>
              <div style={{ fontSize: '14px', color: '#92400e' }}>Active Sectors</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginBottom: '5px' }}>
                {Object.keys(countryConcentration).length}
              </div>
              <div style={{ fontSize: '14px', color: '#1e40af' }}>Countries</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f3e8ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9333ea', marginBottom: '5px' }}>
                {((Object.values(sectorConcentration)[0]?.exposure || 0) / totalExposure * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '14px', color: '#7c2d12' }}>Top Sector Share</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRollupView = () => {
    const sectorRollup = {};
    heatmapData.forEach(item => {
      if (!item || !item.sector || !item.country) return; // Skip invalid items
      
      if (!sectorRollup[item.sector]) {
        sectorRollup[item.sector] = { 
          totalExposure: 0, 
          totalRisk: 0, 
          avgSectorRisk: item.sectorRisk || 1.0,
          countries: new Set()
        };
      }
      sectorRollup[item.sector].totalExposure += item.exposure || 0;
      sectorRollup[item.sector].totalRisk += item.adjustedRisk || 0;
      sectorRollup[item.sector].countries.add(item.country);
    });

    const rollupData = Object.entries(sectorRollup)
      .map(([sector, data]) => ({
        sector,
        totalExposure: data.totalExposure,
        totalRisk: data.totalRisk,
        avgRisk: data.totalRisk / data.totalExposure,
        riskMultiplier: data.avgSectorRisk,
        countryCount: data.countries.size,
        riskCategory: data.totalRisk > 2000 ? 'Very High' :
                     data.totalRisk > 1500 ? 'High' :
                     data.totalRisk > 1000 ? 'Medium' :
                     data.totalRisk > 500 ? 'Low' : 'Very Low'
      }))
      .sort((a, b) => b.totalRisk - a.totalRisk);

    return (
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>
          Sector Risk Roll-up Analysis
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px' }}>Sector</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px' }}>Total EAD (M)</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px' }}>Adjusted Risk</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px' }}>Risk Multiplier</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px' }}>Countries</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px' }}>Risk Category</th>
              </tr>
            </thead>
            <tbody>
              {rollupData.map((row, idx) => (
                <tr key={row.sector} style={{ 
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: idx % 2 === 0 ? '#f8fafc' : 'white'
                }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '13px' }}>{row.sector}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px' }}>
                    {Math.round(row.totalExposure).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 'bold' }}>
                    {Math.round(row.totalRisk).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px' }}>
                    {row.riskMultiplier.toFixed(2)}x
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px' }}>
                    {row.countryCount}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: 
                        row.riskCategory === 'Very High' ? '#fee2e2' :
                        row.riskCategory === 'High' ? '#fed7aa' :
                        row.riskCategory === 'Medium' ? '#fef3c7' :
                        row.riskCategory === 'Low' ? '#dcfce7' : '#f0fdf4',
                      color:
                        row.riskCategory === 'Very High' ? '#dc2626' :
                        row.riskCategory === 'High' ? '#ea580c' :
                        row.riskCategory === 'Medium' ? '#d97706' :
                        row.riskCategory === 'Low' ? '#16a34a' : '#15803d'
                    }}>
                      {row.riskCategory}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Early return if required data is missing
  if (!portfolioData && !exposureData) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#64748b', marginBottom: '10px' }}>No Portfolio Data Available</h3>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Please provide portfolio or exposure data to view the risk heatmap.</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
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
            🔥 Portfolio Risk Heatmap & Concentration Analysis
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            PDF Step H: Sector × Country EAD-weighted risk concentrations
          </p>
        </div>

        {/* Current Scenario Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#dbeafe',
          padding: '8px 16px',
          borderRadius: '20px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '500', marginRight: '8px', color: '#1e40af' }}>
            Scenario:
          </span>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e40af' }}>
            {selectedScenario === 'orderly' ? 'NGFS Orderly' :
             selectedScenario === 'disorderly' ? 'NGFS Disorderly' :
             selectedScenario === 'hothouse' ? 'NGFS Hot House' : selectedScenario}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
        padding: '4px',
        marginBottom: '30px'
      }}>
        {[
          { key: 'heatmap', label: '🔥 Risk Heatmap', title: 'Sector × Country risk matrix' },
          { key: 'concentration', label: '📊 Concentration', title: 'Portfolio concentration analysis' },
          { key: 'rollup', label: '📋 Sector Roll-up', title: 'Aggregated sector risk metrics' }
        ].map(view => (
          <button
            key={view.key}
            onClick={() => setActiveView(view.key)}
            title={view.title}
            style={{
              flex: 1,
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

      {/* Content */}
      <div>
        {activeView === 'heatmap' && renderHeatmapView()}
        {activeView === 'concentration' && renderConcentrationView()}
        {activeView === 'rollup' && renderRollupView()}
      </div>
    </div>
  );
};

export default PortfolioRiskHeatmap;