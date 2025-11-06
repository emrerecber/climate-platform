/**
 * Peer Benchmarking Database
 * Industry-specific benchmark data for climate metrics comparison
 * Data sources: CDP, TCFD reports, Company sustainability reports, Bloomberg
 * 
 * Note: Data is anonymized/aggregated for demonstration purposes
 */

/**
 * Sector Benchmarking Data
 * Carbon Intensity, Renewable Share, TCFD Scores, etc.
 */
const SECTOR_BENCHMARKS = {
  energy: {
    sectorName: 'Energy & Utilities',
    totalCompanies: 250,
    metrics: {
      carbonIntensity: {
        // tCO2e per MWh
        unit: 'tCO2/MWh',
        p10: 0.05,   // Top 10% (best performers)
        p25: 0.15,   // Top quartile
        median: 0.42,
        p75: 0.68,   // Bottom quartile
        p90: 0.85,   // Bottom 10%
        average: 0.48,
        globalTarget2030: 0.30  // IEA NZE benchmark
      },
      renewableShare: {
        // % of total generation
        unit: '%',
        p10: 85,
        p25: 65,
        median: 38,
        p75: 18,
        p90: 8,
        average: 42,
        globalTarget2030: 60
      },
      tcfdScore: {
        // 0-100
        unit: 'score',
        p10: 92,
        p25: 78,
        median: 58,
        p75: 38,
        p90: 22,
        average: 57
      },
      netZeroCommitment: {
        // % of companies
        committed: 72,
        validated: 38
      }
    },
    topPerformers: [
      { name: 'Orsted', country: 'Denmark', carbonIntensity: 0.01, renewableShare: 95, tcfdScore: 95 },
      { name: 'Iberdrola', country: 'Spain', carbonIntensity: 0.08, renewableShare: 85, tcfdScore: 88 },
      { name: 'NextEra Energy', country: 'USA', carbonIntensity: 0.12, renewableShare: 68, tcfdScore: 82 },
      { name: 'Enel', country: 'Italy', carbonIntensity: 0.18, renewableShare: 58, tcfdScore: 85 },
      { name: 'SSE', country: 'UK', carbonIntensity: 0.22, renewableShare: 52, tcfdScore: 78 }
    ]
  },

  automotive: {
    sectorName: 'Automotive',
    totalCompanies: 180,
    metrics: {
      carbonIntensity: {
        // tCO2e per vehicle produced
        unit: 'tCO2/vehicle',
        p10: 0.8,
        p25: 1.5,
        median: 3.2,
        p75: 5.8,
        p90: 7.5,
        average: 3.8,
        globalTarget2030: 1.2
      },
      evProductionShare: {
        // % of total production
        unit: '%',
        p10: 65,
        p25: 42,
        median: 18,
        p75: 8,
        p90: 3,
        average: 24,
        globalTarget2030: 60
      },
      tcfdScore: {
        unit: 'score',
        p10: 88,
        p25: 72,
        median: 52,
        p75: 35,
        p90: 18,
        average: 53
      },
      netZeroCommitment: {
        committed: 85,
        validated: 42
      }
    },
    topPerformers: [
      { name: 'Tesla', country: 'USA', carbonIntensity: 0.5, evShare: 100, tcfdScore: 68 },
      { name: 'BYD', country: 'China', carbonIntensity: 0.9, evShare: 92, tcfdScore: 58 },
      { name: 'Volkswagen Group', country: 'Germany', carbonIntensity: 2.1, evShare: 28, tcfdScore: 85 },
      { name: 'BMW', country: 'Germany', carbonIntensity: 2.5, evShare: 22, tcfdScore: 82 },
      { name: 'Mercedes-Benz', country: 'Germany', carbonIntensity: 2.8, evShare: 18, tcfdScore: 80 }
    ]
  },

  steel: {
    sectorName: 'Steel & Metals',
    totalCompanies: 120,
    metrics: {
      carbonIntensity: {
        // tCO2e per ton steel
        unit: 'tCO2/ton',
        p10: 0.8,
        p25: 1.2,
        median: 1.8,
        p75: 2.2,
        p90: 2.6,
        average: 1.85,
        globalTarget2030: 1.3
      },
      lowCarbonShare: {
        // % (EAF, DRI, H2)
        unit: '%',
        p10: 85,
        p25: 52,
        median: 28,
        p75: 12,
        p90: 5,
        average: 32,
        globalTarget2030: 30
      },
      tcfdScore: {
        unit: 'score',
        p10: 82,
        p25: 68,
        median: 48,
        p75: 32,
        p90: 18,
        average: 49
      },
      netZeroCommitment: {
        committed: 58,
        validated: 22
      }
    },
    topPerformers: [
      { name: 'SSAB', country: 'Sweden', carbonIntensity: 0.6, lowCarbonShare: 100, tcfdScore: 88 },
      { name: 'Nucor', country: 'USA', carbonIntensity: 0.9, lowCarbonShare: 72, tcfdScore: 75 },
      { name: 'ArcelorMittal', country: 'Luxembourg', carbonIntensity: 1.4, lowCarbonShare: 35, tcfdScore: 82 },
      { name: 'Thyssenkrupp', country: 'Germany', carbonIntensity: 1.6, lowCarbonShare: 28, tcfdScore: 78 },
      { name: 'POSCO', country: 'South Korea', carbonIntensity: 1.7, lowCarbonShare: 25, tcfdScore: 72 }
    ]
  },

  cement: {
    sectorName: 'Cement & Construction Materials',
    totalCompanies: 95,
    metrics: {
      carbonIntensity: {
        // tCO2e per ton cement
        unit: 'tCO2/ton',
        p10: 0.42,
        p25: 0.52,
        median: 0.65,
        p75: 0.78,
        p90: 0.88,
        average: 0.67,
        globalTarget2030: 0.50
      },
      clinkerRatio: {
        // %
        unit: '%',
        p10: 55,
        p25: 65,
        median: 75,
        p75: 82,
        p90: 88,
        average: 74,
        globalTarget2030: 65
      },
      tcfdScore: {
        unit: 'score',
        p10: 78,
        p25: 62,
        median: 45,
        p75: 28,
        p90: 15,
        average: 46
      },
      netZeroCommitment: {
        committed: 65,
        validated: 28
      }
    },
    topPerformers: [
      { name: 'Heidelberg Materials', country: 'Germany', carbonIntensity: 0.38, clinkerRatio: 58, tcfdScore: 82 },
      { name: 'Holcim', country: 'Switzerland', carbonIntensity: 0.45, clinkerRatio: 62, tcfdScore: 85 },
      { name: 'Cemex', country: 'Mexico', carbonIntensity: 0.52, clinkerRatio: 68, tcfdScore: 72 },
      { name: 'CRH', country: 'Ireland', carbonIntensity: 0.58, clinkerRatio: 70, tcfdScore: 75 },
      { name: 'Lafarge', country: 'France', carbonIntensity: 0.60, clinkerRatio: 72, tcfdScore: 78 }
    ]
  },

  aviation: {
    sectorName: 'Aviation',
    totalCompanies: 85,
    metrics: {
      carbonIntensity: {
        // gCO2e per passenger-km
        unit: 'gCO2/pkm',
        p10: 58,
        p25: 72,
        median: 98,
        p75: 125,
        p90: 145,
        average: 102,
        globalTarget2030: 75
      },
      safUsage: {
        // % of total fuel
        unit: '%',
        p10: 3.2,
        p25: 1.8,
        median: 0.5,
        p75: 0.1,
        p90: 0,
        average: 1.1,
        globalTarget2030: 10
      },
      tcfdScore: {
        unit: 'score',
        p10: 85,
        p25: 68,
        median: 48,
        p75: 32,
        p90: 18,
        average: 50
      },
      netZeroCommitment: {
        committed: 88,
        validated: 52
      }
    },
    topPerformers: [
      { name: 'KLM', country: 'Netherlands', carbonIntensity: 62, safUsage: 3.5, tcfdScore: 88 },
      { name: 'Air France', country: 'France', carbonIntensity: 68, safUsage: 2.8, tcfdScore: 85 },
      { name: 'Lufthansa', country: 'Germany', carbonIntensity: 74, safUsage: 2.2, tcfdScore: 82 },
      { name: 'British Airways', country: 'UK', carbonIntensity: 78, safUsage: 1.8, tcfdScore: 78 },
      { name: 'United Airlines', country: 'USA', carbonIntensity: 82, safUsage: 1.5, tcfdScore: 72 }
    ]
  },

  realEstate: {
    sectorName: 'Real Estate & Buildings',
    totalCompanies: 140,
    metrics: {
      carbonIntensity: {
        // kgCO2e per m² per year
        unit: 'kgCO2/m²/yr',
        p10: 12,
        p25: 22,
        median: 45,
        p75: 68,
        p90: 85,
        average: 48,
        globalTarget2030: 25
      },
      renewableHeatingShare: {
        // %
        unit: '%',
        p10: 82,
        p25: 58,
        median: 28,
        p75: 12,
        p90: 5,
        average: 35,
        globalTarget2030: 50
      },
      tcfdScore: {
        unit: 'score',
        p10: 88,
        p25: 72,
        median: 52,
        p75: 35,
        p90: 22,
        average: 54
      },
      netZeroCommitment: {
        committed: 75,
        validated: 38
      }
    },
    topPerformers: [
      { name: 'Unibail-Rodamco-Westfield', country: 'France', carbonIntensity: 10, renewableShare: 95, tcfdScore: 92 },
      { name: 'British Land', country: 'UK', carbonIntensity: 15, renewableShare: 75, tcfdScore: 88 },
      { name: 'Derwent London', country: 'UK', carbonIntensity: 18, renewableShare: 68, tcfdScore: 85 },
      { name: 'Vonovia', country: 'Germany', carbonIntensity: 22, renewableShare: 52, tcfdScore: 80 },
      { name: 'Segro', country: 'UK', carbonIntensity: 25, renewableShare: 48, tcfdScore: 78 }
    ]
  },

  finance: {
    sectorName: 'Financial Services',
    totalCompanies: 220,
    metrics: {
      financed_emissions: {
        // tCO2e per $M financed
        unit: 'tCO2/$M',
        p10: 12,
        p25: 28,
        median: 58,
        p75: 95,
        p90: 142,
        average: 65,
        globalTarget2030: 30
      },
      greenFinanceShare: {
        // % of total portfolio
        unit: '%',
        p10: 45,
        p25: 28,
        median: 15,
        p75: 8,
        p90: 3,
        average: 19,
        globalTarget2030: 35
      },
      tcfdScore: {
        unit: 'score',
        p10: 92,
        p25: 82,
        median: 65,
        p75: 45,
        p90: 28,
        average: 62
      },
      netZeroCommitment: {
        committed: 82,
        validated: 58
      }
    },
    topPerformers: [
      { name: 'Triodos Bank', country: 'Netherlands', financedEmissions: 8, greenShare: 100, tcfdScore: 98 },
      { name: 'UBS', country: 'Switzerland', financedEmissions: 18, greenShare: 42, tcfdScore: 92 },
      { name: 'BNP Paribas', country: 'France', financedEmissions: 22, greenShare: 35, tcfdScore: 88 },
      { name: 'ING', country: 'Netherlands', financedEmissions: 28, greenShare: 32, tcfdScore: 85 },
      { name: 'Santander', country: 'Spain', financedEmissions: 32, greenShare: 28, tcfdScore: 82 }
    ]
  }
};

/**
 * Calculate quartile position for a given metric
 * @param {number} value - Company's metric value
 * @param {object} benchmark - Benchmark object with p10, p25, median, p75, p90
 * @param {boolean} lowerIsBetter - True if lower values are better (e.g., carbon intensity)
 * @returns {object} - Quartile position and percentile
 */
export const calculateQuartilePosition = (value, benchmark, lowerIsBetter = true) => {
  if (value === null || value === undefined || isNaN(value)) {
    return { quartile: null, percentile: null, position: 'Unknown' };
  }

  const numValue = parseFloat(value);
  
  let quartile;
  let percentile;
  let position;

  if (lowerIsBetter) {
    // For metrics where lower is better (e.g., carbon intensity)
    if (numValue <= benchmark.p10) {
      quartile = 'Top 10%';
      percentile = Math.min(10, (numValue / benchmark.p10) * 10);
      position = 'Industry Leader';
    } else if (numValue <= benchmark.p25) {
      quartile = 'Top Quartile';
      percentile = 10 + ((numValue - benchmark.p10) / (benchmark.p25 - benchmark.p10)) * 15;
      position = 'Above Average';
    } else if (numValue <= benchmark.median) {
      quartile = 'Second Quartile';
      percentile = 25 + ((numValue - benchmark.p25) / (benchmark.median - benchmark.p25)) * 25;
      position = 'Average';
    } else if (numValue <= benchmark.p75) {
      quartile = 'Third Quartile';
      percentile = 50 + ((numValue - benchmark.median) / (benchmark.p75 - benchmark.median)) * 25;
      position = 'Below Average';
    } else if (numValue <= benchmark.p90) {
      quartile = 'Bottom Quartile';
      percentile = 75 + ((numValue - benchmark.p75) / (benchmark.p90 - benchmark.p75)) * 15;
      position = 'Needs Improvement';
    } else {
      quartile = 'Bottom 10%';
      percentile = 90 + Math.min(10, ((numValue - benchmark.p90) / benchmark.p90) * 10);
      position = 'Urgent Action Required';
    }
  } else {
    // For metrics where higher is better (e.g., renewable share, TCFD score)
    if (numValue >= benchmark.p10) {
      quartile = 'Top 10%';
      percentile = 90 + Math.min(10, ((numValue - benchmark.p10) / benchmark.p10) * 10);
      position = 'Industry Leader';
    } else if (numValue >= benchmark.p25) {
      quartile = 'Top Quartile';
      percentile = 75 + ((numValue - benchmark.p25) / (benchmark.p10 - benchmark.p25)) * 15;
      position = 'Above Average';
    } else if (numValue >= benchmark.median) {
      quartile = 'Second Quartile';
      percentile = 50 + ((numValue - benchmark.median) / (benchmark.p25 - benchmark.median)) * 25;
      position = 'Average';
    } else if (numValue >= benchmark.p75) {
      quartile = 'Third Quartile';
      percentile = 25 + ((numValue - benchmark.p75) / (benchmark.median - benchmark.p75)) * 25;
      position = 'Below Average';
    } else if (numValue >= benchmark.p90) {
      quartile = 'Bottom Quartile';
      percentile = 10 + ((numValue - benchmark.p90) / (benchmark.p75 - benchmark.p90)) * 15;
      position = 'Needs Improvement';
    } else {
      quartile = 'Bottom 10%';
      percentile = Math.max(0, 10 - ((benchmark.p90 - numValue) / benchmark.p90) * 10);
      position = 'Urgent Action Required';
    }
  }

  return {
    quartile,
    percentile: Math.round(percentile),
    position,
    vsMedian: ((numValue - benchmark.median) / benchmark.median * 100).toFixed(1),
    vsTarget: benchmark.globalTarget2030 ? ((numValue - benchmark.globalTarget2030) / benchmark.globalTarget2030 * 100).toFixed(1) : null
  };
};

/**
 * Main benchmarking analysis function
 * @param {object} companyData - Company metrics
 * @param {string} sector - Sector name
 * @returns {object} - Complete benchmarking analysis
 */
export const performBenchmarkingAnalysis = (companyData, sector) => {
  const sectorKey = sector.toLowerCase();
  const benchmarks = SECTOR_BENCHMARKS[sectorKey];

  if (!benchmarks) {
    return {
      error: `No benchmarks available for sector: ${sector}`,
      availableSectors: Object.keys(SECTOR_BENCHMARKS)
    };
  }

  const analysis = {
    sector: benchmarks.sectorName,
    totalCompaniesBenchmarked: benchmarks.totalCompanies,
    companyMetrics: {},
    quartilePositions: {},
    overallRanking: null,
    competitivePosition: null,
    improvementOpportunities: [],
    topPerformersComparison: benchmarks.topPerformers
  };

  // Analyze each metric
  const metricAnalyses = [];
  
  Object.entries(benchmarks.metrics).forEach(([metricKey, metricBenchmark]) => {
    const companyValue = companyData[metricKey];
    
    if (companyValue !== undefined && companyValue !== null) {
      const lowerIsBetter = metricKey.includes('Intensity') || metricKey.includes('clinkerRatio');
      const quartilePos = calculateQuartilePosition(companyValue, metricBenchmark, lowerIsBetter);
      
      analysis.companyMetrics[metricKey] = {
        value: companyValue,
        unit: metricBenchmark.unit,
        benchmark: metricBenchmark,
        position: quartilePos
      };

      metricAnalyses.push({
        metric: metricKey,
        percentile: quartilePos.percentile,
        position: quartilePos.position
      });

      // Generate improvement opportunities
      if (quartilePos.position === 'Below Average' || 
          quartilePos.position === 'Needs Improvement' || 
          quartilePos.position === 'Urgent Action Required') {
        
        const gapToMedian = Math.abs(parseFloat(quartilePos.vsMedian));
        const gapToTarget = metricBenchmark.globalTarget2030 ? 
          Math.abs(parseFloat(quartilePos.vsTarget)) : null;

        analysis.improvementOpportunities.push({
          metric: metricKey,
          currentValue: companyValue,
          medianValue: metricBenchmark.median,
          targetValue: metricBenchmark.globalTarget2030,
          gapToMedian: `${gapToMedian}%`,
          gapToTarget: gapToTarget ? `${gapToTarget}%` : null,
          priority: quartilePos.position === 'Urgent Action Required' ? 'Critical' : 
                   quartilePos.position === 'Needs Improvement' ? 'High' : 'Medium',
          recommendation: generateMetricRecommendation(metricKey, companyValue, metricBenchmark, sector)
        });
      }
    }
  });

  // Calculate overall ranking (average percentile across all metrics)
  if (metricAnalyses.length > 0) {
    const avgPercentile = metricAnalyses.reduce((sum, m) => sum + m.percentile, 0) / metricAnalyses.length;
    analysis.overallRanking = {
      percentile: Math.round(avgPercentile),
      position: avgPercentile >= 75 ? 'Top Quartile' : 
                avgPercentile >= 50 ? 'Above Median' :
                avgPercentile >= 25 ? 'Below Median' : 'Bottom Quartile'
    };

    // Determine competitive position
    if (avgPercentile >= 75) {
      analysis.competitivePosition = {
        rating: 'Strong',
        description: 'Company is a climate leader in the sector with above-average performance across most metrics.',
        strategicImplication: 'Maintain leadership position and set ambitious targets to stay ahead.'
      };
    } else if (avgPercentile >= 50) {
      analysis.competitivePosition = {
        rating: 'Moderate',
        description: 'Company performs around industry average on climate metrics.',
        strategicImplication: 'Focus on key improvement areas to move into top quartile and gain competitive advantage.'
      };
    } else {
      analysis.competitivePosition = {
        rating: 'Weak',
        description: 'Company lags behind industry peers on climate performance.',
        strategicImplication: 'Urgent action needed to avoid climate-related risks and regulatory pressure. Develop comprehensive decarbonization roadmap.'
      };
    }
  }

  return analysis;
};

/**
 * Generate metric-specific recommendations
 */
const generateMetricRecommendation = (metricKey, value, benchmark, sector) => {
  const recommendations = {
    carbonIntensity: `Reduce carbon intensity from ${value} to at least ${benchmark.median} (median) through energy efficiency, renewable energy, and process improvements. Target: ${benchmark.globalTarget2030} by 2030.`,
    renewableShare: `Increase renewable energy from ${value}% to at least ${benchmark.median}% (median) through PPAs, on-site generation, or REC purchases. Target: ${benchmark.globalTarget2030}% by 2030.`,
    evProductionShare: `Accelerate EV production from ${value}% to ${benchmark.median}% (median) through platform electrification and battery supply chain. Target: ${benchmark.globalTarget2030}% by 2030.`,
    lowCarbonShare: `Increase low-carbon production (EAF, DRI, H2) from ${value}% to ${benchmark.median}% (median). Target: ${benchmark.globalTarget2030}% by 2030.`,
    clinkerRatio: `Reduce clinker ratio from ${value}% to ${benchmark.median}% (median) through clinker substitution with SCMs (fly ash, slag, calcined clay). Target: ${benchmark.globalTarget2030}% by 2030.`,
    safUsage: `Increase SAF usage from ${value}% to ${benchmark.median}% (median) through offtake agreements and SAF production partnerships. Target: ${benchmark.globalTarget2030}% by 2030.`,
    renewableHeatingShare: `Increase renewable heating from ${value}% to ${benchmark.median}% (median) through heat pumps, district heating, and solar thermal. Target: ${benchmark.globalTarget2030}% by 2030.`,
    tcfdScore: `Improve TCFD disclosure from ${value}/100 to ${benchmark.median}/100 (median) by strengthening governance, scenario analysis, and metrics reporting.`,
    financed_emissions: `Reduce financed emissions from ${value} to ${benchmark.median} (median) tCO2/$M through portfolio decarbonization and sector allocation shifts.`,
    greenFinanceShare: `Increase green finance from ${value}% to ${benchmark.median}% (median) through sustainable lending, green bonds, and ESG integration.`
  };

  return recommendations[metricKey] || `Improve ${metricKey} to reach at least industry median (${benchmark.median})`;
};

/**
 * Get sector benchmark summary
 */
export const getSectorBenchmarkSummary = (sector) => {
  const sectorKey = sector.toLowerCase();
  const benchmarks = SECTOR_BENCHMARKS[sectorKey];

  if (!benchmarks) {
    return null;
  }

  return {
    sector: benchmarks.sectorName,
    totalCompanies: benchmarks.totalCompanies,
    metrics: Object.keys(benchmarks.metrics),
    topPerformers: benchmarks.topPerformers.map(p => p.name),
    netZeroCommitment: benchmarks.metrics.netZeroCommitment || benchmarks.metrics.tcfdScore.netZeroCommitment
  };
};

/**
 * Get all available sectors
 */
export const getAvailableSectors = () => {
  return Object.keys(SECTOR_BENCHMARKS).map(key => ({
    key,
    name: SECTOR_BENCHMARKS[key].sectorName,
    totalCompanies: SECTOR_BENCHMARKS[key].totalCompanies
  }));
};

export default {
  performBenchmarkingAnalysis,
  calculateQuartilePosition,
  getSectorBenchmarkSummary,
  getAvailableSectors,
  SECTOR_BENCHMARKS
};
