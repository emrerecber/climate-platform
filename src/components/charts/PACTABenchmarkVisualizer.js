import React, { useState } from 'react';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';

const PACTABenchmarkVisualizer = ({ 
  companyData, 
  sectorData, 
  benchmarkScenario = 'iea-nze',
  targetYear = 2030 
}) => {
  const [activeView, setActiveView] = useState('alignment'); // 'alignment', 'technology', 'roadmap'
  const [selectedSector, setSelectedSector] = useState('power'); // 'power', 'automotive', 'steel', 'cement'

  // PDF Step D: PACTA Technology Alignment Data (Page 8-10)
  const pactaBenchmarks = {
    power: {
      name: 'Power Generation',
      unit: 'MW',
      technologies: {
        coal: { 
          name: 'Coal',
          benchmark2030: 0, // Phase-out by 2030 in developed countries
          benchmark2050: 0,
          color: '#64748b',
          alignmentScore: 0 // Not aligned with Paris goals
        },
        gas: { 
          name: 'Natural Gas',
          benchmark2030: 40, // Reduced role as bridge technology
          benchmark2050: 15, // Minimal role for grid stability
          color: '#94a3b8',
          alignmentScore: 2
        },
        solar: { 
          name: 'Solar PV',
          benchmark2030: 75, // Massive scale-up required
          benchmark2050: 45, // Maintained high capacity
          color: '#fbbf24',
          alignmentScore: 5
        },
        wind: { 
          name: 'Wind (Onshore/Offshore)',
          benchmark2030: 65, // Continued growth
          benchmark2050: 55, // Stable high capacity
          color: '#06b6d4',
          alignmentScore: 5
        },
        hydro: { 
          name: 'Hydro',
          benchmark2030: 25, // Stable with some growth
          benchmark2050: 28,
          color: '#3b82f6',
          alignmentScore: 4
        },
        nuclear: { 
          name: 'Nuclear',
          benchmark2030: 35, // Some growth in key regions
          benchmark2050: 40,
          color: '#8b5cf6',
          alignmentScore: 4
        }
      }
    },
    automotive: {
      name: 'Automotive Manufacturing',
      unit: '% of production',
      technologies: {
        ice: { 
          name: 'Internal Combustion Engine',
          benchmark2030: 25, // Rapid phase-out
          benchmark2050: 5, // Near elimination
          color: '#ef4444',
          alignmentScore: 1
        },
        hev: { 
          name: 'Hybrid Electric Vehicle',
          benchmark2030: 15, // Bridge technology
          benchmark2050: 8,
          color: '#f97316',
          alignmentScore: 2
        },
        phev: { 
          name: 'Plug-in Hybrid',
          benchmark2030: 20, // Transition technology
          benchmark2050: 12,
          color: '#f59e0b',
          alignmentScore: 3
        },
        bev: { 
          name: 'Battery Electric Vehicle',
          benchmark2030: 40, // Dominant technology
          benchmark2050: 75,
          color: '#22c55e',
          alignmentScore: 5
        }
      }
    },
    steel: {
      name: 'Steel Production',
      unit: '% of capacity',
      technologies: {
        bof: { 
          name: 'Basic Oxygen Furnace',
          benchmark2030: 45, // Gradual decline
          benchmark2050: 25,
          color: '#64748b',
          alignmentScore: 1
        },
        eaf: { 
          name: 'Electric Arc Furnace',
          benchmark2030: 35, // Growth with recycling
          benchmark2050: 45,
          color: '#3b82f6',
          alignmentScore: 3
        },
        dri: { 
          name: 'Direct Reduced Iron',
          benchmark2030: 20, // Emerging technology
          benchmark2050: 30,
          color: '#06b6d4',
          alignmentScore: 4
        }
      }
    },
    cement: {
      name: 'Cement Production',
      unit: '% of production',
      technologies: {
        conventional: { 
          name: 'Conventional Cement',
          benchmark2030: 70, // Slow transition
          benchmark2050: 45,
          color: '#64748b',
          alignmentScore: 1
        },
        blended: { 
          name: 'Blended Cement',
          benchmark2030: 25, // Increasing adoption
          benchmark2050: 40,
          color: '#f59e0b',
          alignmentScore: 3
        },
        alternative: { 
          name: 'Alternative Cement',
          benchmark2030: 5, // Early stage
          benchmark2050: 15,
          color: '#22c55e',
          alignmentScore: 4
        }
      }
    }
  };

  // Mock company data for demonstration (would come from props in real implementation)
  const mockCompanyData = {
    power: {
      coal: companyData?.coalCapacity || 45,
      gas: companyData?.naturalGasCapacity || 35,
      solar: companyData?.solarCapacity || 15,
      wind: companyData?.windCapacity || 25,
      hydro: companyData?.hydroCapacity || 20,
      nuclear: companyData?.nuclearCapacity || 10
    },
    automotive: {
      ice: companyData?.iceProduction || 70,
      hev: companyData?.hevProduction || 15,
      phev: companyData?.phevProduction || 8,
      bev: companyData?.bevProduction || 7
    },
    steel: {
      bof: 65,
      eaf: 25,
      dri: 10
    },
    cement: {
      conventional: 85,
      blended: 12,
      alternative: 3
    }
  };

  const getTechnologyGap = (current, benchmark) => {
    return benchmark - current;
  };

  const getAlignmentLevel = (gap) => {
    if (Math.abs(gap) <= 5) return { level: 'Aligned', color: '#22c55e' };
    if (Math.abs(gap) <= 15) return { level: 'Partially Aligned', color: '#f59e0b' };
    return { level: 'Misaligned', color: '#ef4444' };
  };

  const renderAlignmentView = () => {
    const sector = pactaBenchmarks[selectedSector];
    const companyTech = mockCompanyData[selectedSector];
    
    const technologies = Object.keys(sector.technologies);
    const benchmarkData = technologies.map(tech => sector.technologies[tech].benchmark2030);
    const actualData = technologies.map(tech => companyTech[tech] || 0);
    const gaps = technologies.map((tech, idx) => getTechnologyGap(actualData[idx], benchmarkData[idx]));

    const chartData = {
      labels: technologies.map(tech => sector.technologies[tech].name),
      datasets: [
        {
          label: `${benchmarkScenario.toUpperCase()} Benchmark ${targetYear}`,
          data: benchmarkData,
          backgroundColor: technologies.map(tech => sector.technologies[tech].color + '40'),
          borderColor: technologies.map(tech => sector.technologies[tech].color),
          borderWidth: 2
        },
        {
          label: 'Company Actual',
          data: actualData,
          backgroundColor: 'rgba(99, 102, 241, 0.6)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2
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
          text: `${sector.name}: Technology Mix Comparison (${sector.unit})`
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: sector.unit
          }
        }
      }
    };

    return (
      <div>
        {/* Chart */}
        <div style={{ height: '400px', marginBottom: '30px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
        
        {/* Gap Analysis Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {technologies.map((tech, idx) => {
            const techData = sector.technologies[tech];
            const gap = gaps[idx];
            const alignment = getAlignmentLevel(gap);
            
            return (
              <div key={tech} style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '8px',
                border: `2px solid ${alignment.color}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>
                    {techData.name}
                  </h4>
                  <div style={{
                    padding: '4px 8px',
                    backgroundColor: alignment.color + '20',
                    color: alignment.color,
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {alignment.level}
                  </div>
                </div>
                
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Benchmark:</span>
                    <span style={{ fontWeight: 'bold' }}>{techData.benchmark2030}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Actual:</span>
                    <span style={{ fontWeight: 'bold' }}>{actualData[idx]}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
                    <span>Gap:</span>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: gap > 0 ? '#ef4444' : '#22c55e'
                    }}>
                      {gap > 0 ? '+' : ''}{gap.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min((actualData[idx] / techData.benchmark2030) * 100, 100)}%`,
                    height: '100%',
                    backgroundColor: alignment.color,
                    borderRadius: '2px'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTechnologyRadar = () => {
    const sector = pactaBenchmarks[selectedSector];
    const companyTech = mockCompanyData[selectedSector];
    
    const technologies = Object.keys(sector.technologies);
    const alignmentScores = technologies.map(tech => sector.technologies[tech].alignmentScore);
    const companyScores = technologies.map(tech => {
      const actual = companyTech[tech] || 0;
      const benchmark = sector.technologies[tech].benchmark2030;
      const gap = Math.abs(getTechnologyGap(actual, benchmark));
      return Math.max(0, 5 - (gap / 10)); // Convert gap to 0-5 alignment score
    });

    const radarData = {
      labels: technologies.map(tech => sector.technologies[tech].name),
      datasets: [
        {
          label: 'Paris-Aligned Benchmark',
          data: alignmentScores,
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderWidth: 2
        },
        {
          label: 'Company Performance',
          data: companyScores,
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderWidth: 2
        }
      ]
    };

    const radarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${sector.name}: Paris Alignment Radar (0-5 Scale)`
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 5,
          ticks: {
            stepSize: 1
          }
        }
      }
    };

    return (
      <div>
        <div style={{ height: '500px', marginBottom: '30px' }}>
          <Radar data={radarData} options={radarOptions} />
        </div>
        
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>
            Overall Paris Alignment Score
          </h3>
          <div style={{
            display: 'inline-block',
            fontSize: '48px',
            fontWeight: 'bold',
            color: companyScores.reduce((a, b) => a + b, 0) / companyScores.length >= 3.5 ? '#22c55e' : 
                  companyScores.reduce((a, b) => a + b, 0) / companyScores.length >= 2.5 ? '#f59e0b' : '#ef4444'
          }}>
            {((companyScores.reduce((a, b) => a + b, 0) / companyScores.length)).toFixed(1)}/5
          </div>
          <p style={{ margin: '10px 0 0 0', color: '#64748b', fontSize: '14px' }}>
            Based on technology portfolio alignment with {benchmarkScenario.toUpperCase()} {targetYear} targets
          </p>
        </div>
      </div>
    );
  };

  const renderRoadmapView = () => {
    const sector = pactaBenchmarks[selectedSector];
    const companyTech = mockCompanyData[selectedSector];
    
    const years = [2025, 2030, 2035, 2040, 2045, 2050];
    
    // Calculate trajectory for each technology
    const trajectoryData = {
      labels: years,
      datasets: Object.keys(sector.technologies).map(tech => {
        const techData = sector.technologies[tech];
        const current = companyTech[tech] || 0;
        
        return {
          label: techData.name,
          data: years.map(year => {
            if (year === 2025) return current;
            if (year === 2030) return techData.benchmark2030;
            if (year === 2050) return techData.benchmark2050;
            
            // Linear interpolation
            const progress = (year - 2030) / (2050 - 2030);
            return techData.benchmark2030 + progress * (techData.benchmark2050 - techData.benchmark2030);
          }),
          borderColor: techData.color,
          backgroundColor: techData.color + '20',
          borderWidth: 2,
          tension: 0.4
        };
      })
    };

    const trajectoryOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${sector.name}: Required Decarbonization Roadmap`
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: sector.unit
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
      <div>
        <div style={{ height: '500px', marginBottom: '30px' }}>
          <Bar data={trajectoryData} options={trajectoryOptions} />
        </div>
        
        {/* Action Items */}
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #0ea5e9'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#0c4a6e' }}>
            🎯 Key Action Items for Paris Alignment
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {Object.keys(sector.technologies).map(tech => {
              const techData = sector.technologies[tech];
              const current = companyTech[tech] || 0;
              const gap = getTechnologyGap(current, techData.benchmark2030);
              
              if (Math.abs(gap) <= 5) return null; // Skip if aligned
              
              return (
                <div key={tech} style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: techData.color }}>
                    {techData.name}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 10px 0' }}>
                    {gap > 0 ? 
                      `Increase capacity by ${gap.toFixed(1)}% by 2030` :
                      `Reduce capacity by ${Math.abs(gap).toFixed(1)}% by 2030`
                    }
                  </p>
                  <div style={{
                    fontSize: '12px',
                    padding: '8px',
                    backgroundColor: techData.alignmentScore >= 4 ? '#dcfce7' : 
                                   techData.alignmentScore >= 3 ? '#fef3c7' : '#fee2e2',
                    borderRadius: '6px'
                  }}>
                    Priority: {techData.alignmentScore >= 4 ? 'High' : 
                              techData.alignmentScore >= 3 ? 'Medium' : 'Low'}
                  </div>
                </div>
              );
            }).filter(Boolean)}
          </div>
        </div>
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
            🎯 PACTA Technology Alignment Analysis
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            PDF Step D: Paris Agreement Capital Transition Assessment
          </p>
        </div>

        {/* Sector Selector */}
        <div>
          <label style={{ fontSize: '14px', fontWeight: '500', marginRight: '10px' }}>
            Sector:
          </label>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '14px'
            }}
          >
            {Object.keys(pactaBenchmarks).map(sector => (
              <option key={sector} value={sector}>
                {pactaBenchmarks[sector].name}
              </option>
            ))}
          </select>
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
          { key: 'alignment', label: '📊 Alignment Gap', title: 'Compare actual vs benchmark' },
          { key: 'technology', label: '🎯 Radar Analysis', title: 'Paris alignment radar chart' },
          { key: 'roadmap', label: '🗺️ Roadmap', title: 'Decarbonization trajectory' }
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
        {activeView === 'alignment' && renderAlignmentView()}
        {activeView === 'technology' && renderTechnologyRadar()}
        {activeView === 'roadmap' && renderRoadmapView()}
      </div>
    </div>
  );
};

export default PACTABenchmarkVisualizer;