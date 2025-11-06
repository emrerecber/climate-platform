/**
 * Physical Climate Risk Calculator
 * Hybrid approach: Static risk matrices + API integration hooks
 * 
 * Data sources:
 * - IPCC AR6 Climate Hazard Maps
 * - WRI Aqueduct Water Risk Atlas
 * - Think Hazard (GFDRR)
 * - Country/Region risk profiles
 * 
 * Supports both:
 * 1. Location-based assessment (country/city/coordinates)
 * 2. RCP scenario projections (RCP 2.6, 4.5, 8.5)
 */

/**
 * Country-Level Physical Risk Baseline
 * Aggregated from IPCC AR6, WRI Aqueduct, and Think Hazard
 * Scale: 1 (Very Low) to 5 (Very High)
 */
const COUNTRY_RISK_BASELINE = {
  // High Risk Countries
  Bangladesh: { flood: 5, drought: 3, heatwave: 4, seaLevel: 5, storm: 5, wildfire: 1, overall: 4.5 },
  Netherlands: { flood: 4, drought: 2, heatwave: 3, seaLevel: 5, storm: 4, wildfire: 1, overall: 3.8 },
  Philippines: { flood: 5, drought: 3, heatwave: 4, seaLevel: 4, storm: 5, wildfire: 2, overall: 4.5 },
  Vietnam: { flood: 5, drought: 3, heatwave: 4, seaLevel: 5, storm: 5, wildfire: 1, overall: 4.5 },
  Indonesia: { flood: 5, drought: 4, heatwave: 4, seaLevel: 4, storm: 4, wildfire: 5, overall: 4.3 },
  India: { flood: 4, drought: 5, heatwave: 5, seaLevel: 3, storm: 4, wildfire: 2, overall: 4.2 },
  Pakistan: { flood: 5, drought: 5, heatwave: 5, seaLevel: 2, storm: 3, wildfire: 1, overall: 4.0 },
  Thailand: { flood: 5, drought: 4, heatwave: 4, seaLevel: 3, storm: 4, wildfire: 2, overall: 4.0 },
  Myanmar: { flood: 5, drought: 4, heatwave: 4, seaLevel: 3, storm: 5, wildfire: 2, overall: 4.2 },
  
  // Medium-High Risk
  USA: { flood: 3, drought: 4, heatwave: 4, seaLevel: 3, storm: 4, wildfire: 4, overall: 3.7 },
  China: { flood: 4, drought: 4, heatwave: 4, seaLevel: 3, storm: 3, wildfire: 2, overall: 3.5 },
  Brazil: { flood: 4, drought: 5, heatwave: 4, seaLevel: 2, storm: 2, wildfire: 4, overall: 3.7 },
  Australia: { flood: 3, drought: 5, heatwave: 5, seaLevel: 3, storm: 3, wildfire: 5, overall: 4.2 },
  Mexico: { flood: 3, drought: 4, heatwave: 4, seaLevel: 3, storm: 4, wildfire: 3, overall: 3.5 },
  Egypt: { flood: 2, drought: 5, heatwave: 5, seaLevel: 4, storm: 2, wildfire: 1, overall: 3.5 },
  Turkey: { flood: 3, drought: 4, heatwave: 4, seaLevel: 2, storm: 3, wildfire: 4, overall: 3.5 },
  
  // Turkey (Türkiye) - Detailed regional breakdown
  'Turkey-Istanbul': { flood: 4, drought: 3, heatwave: 4, seaLevel: 3, storm: 3, wildfire: 2, overall: 3.3 },
  'Turkey-Izmir': { flood: 3, drought: 4, heatwave: 5, seaLevel: 3, storm: 3, wildfire: 4, overall: 3.7 },
  'Turkey-Ankara': { flood: 2, drought: 4, heatwave: 4, seaLevel: 1, storm: 2, wildfire: 3, overall: 2.8 },
  'Turkey-Antalya': { flood: 3, drought: 4, heatwave: 5, seaLevel: 2, storm: 3, wildfire: 5, overall: 3.8 },
  
  // Medium Risk
  Japan: { flood: 4, drought: 2, heatwave: 3, seaLevel: 3, storm: 5, wildfire: 1, overall: 3.5 },
  'South Korea': { flood: 4, drought: 2, heatwave: 3, seaLevel: 2, storm: 4, wildfire: 2, overall: 3.0 },
  Italy: { flood: 3, drought: 4, heatwave: 4, seaLevel: 2, storm: 2, wildfire: 3, overall: 3.2 },
  Spain: { flood: 3, drought: 5, heatwave: 5, seaLevel: 2, storm: 2, wildfire: 4, overall: 3.8 },
  France: { flood: 3, drought: 3, heatwave: 4, seaLevel: 2, storm: 3, wildfire: 3, overall: 3.0 },
  Greece: { flood: 3, drought: 5, heatwave: 5, seaLevel: 2, storm: 2, wildfire: 5, overall: 3.8 },
  Portugal: { flood: 2, drought: 5, heatwave: 5, seaLevel: 2, storm: 2, wildfire: 5, overall: 3.8 },
  
  // Low-Medium Risk
  UK: { flood: 3, drought: 2, heatwave: 2, seaLevel: 3, storm: 3, wildfire: 1, overall: 2.5 },
  Germany: { flood: 3, drought: 3, heatwave: 3, seaLevel: 2, storm: 2, wildfire: 2, overall: 2.7 },
  Canada: { flood: 3, drought: 3, heatwave: 2, seaLevel: 2, storm: 2, wildfire: 4, overall: 2.8 },
  Russia: { flood: 3, drought: 3, heatwave: 3, seaLevel: 1, storm: 2, wildfire: 4, overall: 2.8 },
  Poland: { flood: 3, drought: 3, heatwave: 3, seaLevel: 1, storm: 2, wildfire: 2, overall: 2.5 },
  
  // Low Risk
  Sweden: { flood: 2, drought: 2, heatwave: 1, seaLevel: 2, storm: 2, wildfire: 2, overall: 2.0 },
  Norway: { flood: 2, drought: 1, heatwave: 1, seaLevel: 2, storm: 2, wildfire: 1, overall: 1.7 },
  Finland: { flood: 2, drought: 1, heatwave: 1, seaLevel: 2, storm: 2, wildfire: 2, overall: 1.8 },
  Denmark: { flood: 3, drought: 2, heatwave: 2, seaLevel: 3, storm: 3, wildfire: 1, overall: 2.5 },
  Switzerland: { flood: 2, drought: 2, heatwave: 2, seaLevel: 1, storm: 1, wildfire: 2, overall: 1.8 },
  Austria: { flood: 3, drought: 2, heatwave: 3, seaLevel: 1, storm: 2, wildfire: 2, overall: 2.3 },
  
  // Default fallback (Global Average)
  DEFAULT: { flood: 3, drought: 3, heatwave: 3, seaLevel: 2, storm: 3, wildfire: 2, overall: 2.8 }
};

/**
 * RCP Scenario Multipliers
 * Future risk increase under different emissions scenarios
 * 2030, 2050, 2070, 2100
 */
const RCP_SCENARIO_MULTIPLIERS = {
  'RCP2.6': {
    // Low emissions (Paris Agreement 1.5-2°C)
    2030: { flood: 1.15, drought: 1.20, heatwave: 1.30, seaLevel: 1.10, storm: 1.15, wildfire: 1.25 },
    2050: { flood: 1.30, drought: 1.40, heatwave: 1.60, seaLevel: 1.25, storm: 1.30, wildfire: 1.50 },
    2070: { flood: 1.35, drought: 1.45, heatwave: 1.70, seaLevel: 1.40, storm: 1.35, wildfire: 1.60 },
    2100: { flood: 1.40, drought: 1.50, heatwave: 1.75, seaLevel: 1.60, storm: 1.40, wildfire: 1.65 }
  },
  'RCP4.5': {
    // Moderate emissions (~2.5°C)
    2030: { flood: 1.20, drought: 1.30, heatwave: 1.40, seaLevel: 1.15, storm: 1.20, wildfire: 1.35 },
    2050: { flood: 1.50, drought: 1.70, heatwave: 2.00, seaLevel: 1.50, storm: 1.50, wildfire: 1.80 },
    2070: { flood: 1.80, drought: 2.10, heatwave: 2.50, seaLevel: 1.85, storm: 1.80, wildfire: 2.20 },
    2100: { flood: 2.00, drought: 2.30, heatwave: 2.80, seaLevel: 2.30, storm: 2.00, wildfire: 2.50 }
  },
  'RCP8.5': {
    // High emissions (Business as usual, >4°C)
    2030: { flood: 1.25, drought: 1.40, heatwave: 1.50, seaLevel: 1.20, storm: 1.25, wildfire: 1.45 },
    2050: { flood: 1.80, drought: 2.20, heatwave: 2.50, seaLevel: 1.80, storm: 1.80, wildfire: 2.30 },
    2070: { flood: 2.50, drought: 3.00, heatwave: 3.50, seaLevel: 2.70, storm: 2.50, wildfire: 3.20 },
    2100: { flood: 3.50, drought: 4.00, heatwave: 5.00, seaLevel: 4.00, storm: 3.50, wildfire: 4.50 }
  }
};

/**
 * Sector-Specific Vulnerability Factors
 * How exposed different sectors are to each hazard type
 */
const SECTOR_VULNERABILITY = {
  energy: {
    flood: 0.9,
    drought: 0.7,  // Hydropower, cooling water
    heatwave: 0.8,  // Infrastructure stress
    seaLevel: 0.6,  // Coastal facilities
    storm: 0.9,
    wildfire: 0.7
  },
  automotive: {
    flood: 0.8,
    drought: 0.3,
    heatwave: 0.6,
    seaLevel: 0.4,
    storm: 0.7,
    wildfire: 0.6
  },
  steel: {
    flood: 0.9,
    drought: 0.6,  // Cooling water
    heatwave: 0.7,
    seaLevel: 0.5,
    storm: 0.8,
    wildfire: 0.5
  },
  cement: {
    flood: 0.8,
    drought: 0.5,
    heatwave: 0.7,
    seaLevel: 0.4,
    storm: 0.7,
    wildfire: 0.6
  },
  aviation: {
    flood: 0.7,
    drought: 0.4,
    heatwave: 0.9,  // Flight operations
    seaLevel: 0.8,  // Coastal airports
    storm: 1.0,  // Critical
    wildfire: 0.5
  },
  realestate: {
    flood: 1.0,  // Critical
    drought: 0.5,
    heatwave: 0.8,
    seaLevel: 1.0,  // Critical for coastal
    storm: 0.9,
    wildfire: 0.9
  },
  finance: {
    flood: 0.7,  // Portfolio exposure
    drought: 0.5,
    heatwave: 0.5,
    seaLevel: 0.6,
    storm: 0.6,
    wildfire: 0.5
  },
  agriculture: {
    flood: 1.0,
    drought: 1.0,  // Critical
    heatwave: 1.0,  // Critical
    seaLevel: 0.7,
    storm: 0.9,
    wildfire: 0.8
  },
  default: {
    flood: 0.7,
    drought: 0.6,
    heatwave: 0.7,
    seaLevel: 0.5,
    storm: 0.7,
    wildfire: 0.6
  }
};

/**
 * Calculate baseline physical risk for a location
 * @param {string} country - Country name
 * @param {string} city - Optional city/region
 * @returns {object} - Risk scores by hazard type
 */
export const calculateBaselineRisk = (country, city = null) => {
  // Try exact match first
  let locationKey = city ? `${country}-${city}` : country;
  let riskProfile = COUNTRY_RISK_BASELINE[locationKey];
  
  // Fallback to country
  if (!riskProfile && city) {
    riskProfile = COUNTRY_RISK_BASELINE[country];
  }
  
  // Fallback to default
  if (!riskProfile) {
    riskProfile = COUNTRY_RISK_BASELINE.DEFAULT;
  }
  
  return {
    location: locationKey,
    baseline: { ...riskProfile },
    dataSource: riskProfile === COUNTRY_RISK_BASELINE.DEFAULT ? 'Global Average' : 'Country-Specific'
  };
};

/**
 * Calculate future physical risk under RCP scenario
 * @param {object} baselineRisk - Baseline risk scores
 * @param {string} scenario - RCP scenario (RCP2.6, RCP4.5, RCP8.5)
 * @param {number} year - Target year (2030, 2050, 2070, 2100)
 * @returns {object} - Future risk scores
 */
export const calculateFutureRisk = (baselineRisk, scenario = 'RCP4.5', year = 2050) => {
  // Find closest available year
  const availableYears = [2030, 2050, 2070, 2100];
  const closestYear = availableYears.reduce((prev, curr) => 
    Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
  );
  
  const multipliers = RCP_SCENARIO_MULTIPLIERS[scenario]?.[closestYear] || 
                     RCP_SCENARIO_MULTIPLIERS['RCP4.5'][2050];
  
  const futureRisk = {};
  const hazards = ['flood', 'drought', 'heatwave', 'seaLevel', 'storm', 'wildfire'];
  
  hazards.forEach(hazard => {
    const baseValue = baselineRisk.baseline[hazard];
    const multiplier = multipliers[hazard];
    futureRisk[hazard] = Math.min(5, baseValue * multiplier); // Cap at 5
  });
  
  // Calculate overall future risk
  futureRisk.overall = hazards.reduce((sum, h) => sum + futureRisk[h], 0) / hazards.length;
  
  return {
    scenario,
    year: closestYear,
    actualYear: year,
    risk: futureRisk,
    increase: {
      flood: ((futureRisk.flood - baselineRisk.baseline.flood) / baselineRisk.baseline.flood * 100).toFixed(1),
      drought: ((futureRisk.drought - baselineRisk.baseline.drought) / baselineRisk.baseline.drought * 100).toFixed(1),
      heatwave: ((futureRisk.heatwave - baselineRisk.baseline.heatwave) / baselineRisk.baseline.heatwave * 100).toFixed(1),
      seaLevel: ((futureRisk.seaLevel - baselineRisk.baseline.seaLevel) / baselineRisk.baseline.seaLevel * 100).toFixed(1),
      storm: ((futureRisk.storm - baselineRisk.baseline.storm) / baselineRisk.baseline.storm * 100).toFixed(1),
      wildfire: ((futureRisk.wildfire - baselineRisk.baseline.wildfire) / baselineRisk.baseline.wildfire * 100).toFixed(1)
    }
  };
};

/**
 * Calculate sector-adjusted physical risk
 * Applies sector vulnerability factors
 */
export const calculateSectorRisk = (baselineRisk, sector = 'default') => {
  const sectorKey = sector.toLowerCase();
  const vulnerability = SECTOR_VULNERABILITY[sectorKey] || SECTOR_VULNERABILITY.default;
  
  const adjustedRisk = {};
  const hazards = ['flood', 'drought', 'heatwave', 'seaLevel', 'storm', 'wildfire'];
  
  hazards.forEach(hazard => {
    adjustedRisk[hazard] = baselineRisk.baseline[hazard] * vulnerability[hazard];
  });
  
  adjustedRisk.overall = hazards.reduce((sum, h) => sum + adjustedRisk[h], 0) / hazards.length;
  
  return {
    sector,
    adjustedRisk,
    vulnerability,
    materialHazards: hazards
      .map(h => ({ hazard: h, risk: adjustedRisk[h], vulnerability: vulnerability[h] }))
      .filter(h => h.risk >= 3.0)
      .sort((a, b) => b.risk - a.risk)
  };
};

/**
 * Calculate financial impact of physical risks
 * Estimates potential losses as % of revenue/assets
 */
export const calculateFinancialImpact = (riskScores, assetValue, annualRevenue) => {
  // Impact factors (% of revenue/assets at risk per risk level)
  const impactFactors = {
    flood: { 1: 0.01, 2: 0.05, 3: 0.15, 4: 0.30, 5: 0.50 },
    drought: { 1: 0.005, 2: 0.02, 3: 0.08, 4: 0.20, 5: 0.40 },
    heatwave: { 1: 0.005, 2: 0.02, 3: 0.10, 4: 0.25, 5: 0.45 },
    seaLevel: { 1: 0.005, 2: 0.03, 3: 0.12, 4: 0.35, 5: 0.70 },
    storm: { 1: 0.01, 2: 0.05, 3: 0.18, 4: 0.35, 5: 0.60 },
    wildfire: { 1: 0.005, 2: 0.03, 3: 0.15, 4: 0.40, 5: 0.75 }
  };
  
  const impacts = {};
  const hazards = Object.keys(impactFactors);
  
  hazards.forEach(hazard => {
    const riskLevel = Math.round(riskScores[hazard]);
    const impactPercent = impactFactors[hazard][Math.min(5, Math.max(1, riskLevel))];
    
    impacts[hazard] = {
      riskLevel: riskScores[hazard],
      impactPercent: (impactPercent * 100).toFixed(1),
      assetImpact: assetValue * impactPercent,
      revenueImpact: annualRevenue * impactPercent
    };
  });
  
  // Calculate total expected annual loss (probability-weighted)
  const probabilityWeights = { 1: 0.05, 2: 0.15, 3: 0.30, 4: 0.50, 5: 0.70 };
  
  let totalExpectedLoss = 0;
  hazards.forEach(hazard => {
    const riskLevel = Math.round(riskScores[hazard]);
    const probability = probabilityWeights[riskLevel];
    totalExpectedLoss += impacts[hazard].assetImpact * probability;
  });
  
  return {
    byHazard: impacts,
    total: {
      expectedAnnualLoss: Math.round(totalExpectedLoss),
      asPercentOfAssets: ((totalExpectedLoss / assetValue) * 100).toFixed(2),
      asPercentOfRevenue: ((totalExpectedLoss / annualRevenue) * 100).toFixed(2)
    }
  };
};

/**
 * Main Physical Risk Assessment Function
 */
export const assessPhysicalRisk = (companyData) => {
  const country = companyData.country || 'Turkey';
  const city = companyData.city || null;
  const sector = companyData.sector || companyData.pactaSector || 'default';
  const assetValue = parseFloat(companyData.totalAssets || companyData.assetValue || 100000000);
  const annualRevenue = parseFloat(companyData.annualRevenue || 50000000);
  
  // Calculate baseline risk
  const baselineRisk = calculateBaselineRisk(country, city);
  
  // Apply sector adjustments
  const sectorRisk = calculateSectorRisk(baselineRisk, sector);
  
  // Calculate future risks under different scenarios
  const futureRisks = {
    RCP2_6_2030: calculateFutureRisk(baselineRisk, 'RCP2.6', 2030),
    RCP2_6_2050: calculateFutureRisk(baselineRisk, 'RCP2.6', 2050),
    RCP4_5_2030: calculateFutureRisk(baselineRisk, 'RCP4.5', 2030),
    RCP4_5_2050: calculateFutureRisk(baselineRisk, 'RCP4.5', 2050),
    RCP8_5_2030: calculateFutureRisk(baselineRisk, 'RCP8.5', 2030),
    RCP8_5_2050: calculateFutureRisk(baselineRisk, 'RCP8.5', 2050)
  };
  
  // Calculate financial impacts
  const currentImpact = calculateFinancialImpact(sectorRisk.adjustedRisk, assetValue, annualRevenue);
  const futureImpact2050 = calculateFinancialImpact(futureRisks.RCP4_5_2050.risk, assetValue, annualRevenue);
  
  // Generate recommendations
  const recommendations = generatePhysicalRiskRecommendations(sectorRisk, futureRisks, currentImpact);
  
  return {
    location: {
      country,
      city,
      coordinates: companyData.coordinates || null
    },
    baseline: baselineRisk,
    sectorAdjusted: sectorRisk,
    futureProjections: futureRisks,
    financialImpact: {
      current: currentImpact,
      future2050_RCP45: futureImpact2050
    },
    recommendations,
    adaptationPriorities: identifyAdaptationPriorities(sectorRisk, futureRisks),
    calculatedAt: new Date().toISOString()
  };
};

/**
 * Generate physical risk recommendations
 */
const generatePhysicalRiskRecommendations = (sectorRisk, futureRisks, impact) => {
  const recommendations = [];
  
  // Identify critical hazards
  sectorRisk.materialHazards.forEach(hazard => {
    if (hazard.risk >= 4.0) {
      recommendations.push({
        priority: 'Critical',
        hazard: hazard.hazard,
        currentRisk: hazard.risk.toFixed(1),
        action: getHazardSpecificAction(hazard.hazard, 'critical'),
        timeline: 'Immediate (1-2 years)'
      });
    } else if (hazard.risk >= 3.0) {
      recommendations.push({
        priority: 'High',
        hazard: hazard.hazard,
        currentRisk: hazard.risk.toFixed(1),
        action: getHazardSpecificAction(hazard.hazard, 'high'),
        timeline: 'Short-term (2-5 years)'
      });
    }
  });
  
  // Check if risk increasing significantly by 2050
  const rcp45_2050 = futureRisks.RCP4_5_2050;
  const hazards = ['flood', 'drought', 'heatwave', 'seaLevel', 'storm', 'wildfire'];
  
  hazards.forEach(hazard => {
    const increasePercent = parseFloat(rcp45_2050.increase[hazard]);
    if (increasePercent > 100) {
      recommendations.push({
        priority: 'Medium',
        hazard: hazard,
        projectedIncrease: `+${increasePercent}%`,
        action: `Develop long-term adaptation plan for ${hazard} risk (doubling by 2050 under RCP4.5)`,
        timeline: 'Medium-term (5-10 years)'
      });
    }
  });
  
  return recommendations;
};

/**
 * Get hazard-specific adaptation actions
 */
const getHazardSpecificAction = (hazard, priority) => {
  const actions = {
    flood: {
      critical: 'Implement flood protection infrastructure (levees, drainage, waterproofing). Relocate critical assets from flood zones.',
      high: 'Conduct flood vulnerability assessment and develop emergency response plan. Install flood detection systems.'
    },
    drought: {
      critical: 'Implement water efficiency measures and diversify water sources. Develop water recycling systems.',
      high: 'Assess water dependency and develop water management plan. Establish water reserves.'
    },
    heatwave: {
      critical: 'Upgrade cooling infrastructure and implement heat stress protocols. Consider facility relocation.',
      high: 'Install temperature control systems and develop operational adjustments for extreme heat.'
    },
    seaLevel: {
      critical: 'Relocate coastal assets or implement sea wall protection. Develop managed retreat strategy.',
      high: 'Assess long-term viability of coastal operations and develop adaptation roadmap.'
    },
    storm: {
      critical: 'Strengthen building codes and implement storm-proof infrastructure. Develop comprehensive business continuity plan.',
      high: 'Install early warning systems and strengthen supply chain resilience.'
    },
    wildfire: {
      critical: 'Create defensible space around facilities. Install fire suppression systems and develop evacuation plans.',
      high: 'Conduct wildfire risk assessment and implement vegetation management.'
    }
  };
  
  return actions[hazard]?.[priority] || `Develop adaptation plan for ${hazard} risk`;
};

/**
 * Identify top adaptation priorities
 */
const identifyAdaptationPriorities = (sectorRisk, futureRisks) => {
  const priorities = [];
  
  // Current high risks
  sectorRisk.materialHazards.slice(0, 3).forEach((hazard, index) => {
    priorities.push({
      rank: index + 1,
      hazard: hazard.hazard,
      currentRisk: hazard.risk.toFixed(1),
      category: 'Immediate Risk',
      rationale: `High current exposure (${hazard.risk.toFixed(1)}/5) with sector vulnerability factor of ${hazard.vulnerability}`
    });
  });
  
  // Future emerging risks
  const rcp45_2050 = futureRisks.RCP4_5_2050;
  const hazards = ['flood', 'drought', 'heatwave', 'seaLevel', 'storm', 'wildfire'];
  const futureIncreases = hazards.map(h => ({
    hazard: h,
    increase: parseFloat(rcp45_2050.increase[h]),
    futureRisk: rcp45_2050.risk[h]
  })).sort((a, b) => b.increase - a.increase);
  
  futureIncreases.slice(0, 2).forEach((item, index) => {
    if (item.increase > 75) {
      priorities.push({
        rank: priorities.length + 1,
        hazard: item.hazard,
        futureRisk: item.futureRisk.toFixed(1),
        increase: `+${item.increase}%`,
        category: 'Emerging Risk (2050)',
        rationale: `Rapid increase projected (+${item.increase}% by 2050 under RCP4.5)`
      });
    }
  });
  
  return priorities.slice(0, 5);
};

/**
 * Optional: API Integration Hook for Enhanced Accuracy
 * Can be connected to external climate data APIs
 */
export const enhanceWithExternalAPI = async (latitude, longitude, apiKey = null) => {
  // Placeholder for future API integration
  // Potential APIs:
  // - NASA Earth Observations
  // - Copernicus Climate Data Store
  // - World Bank Climate Knowledge Portal
  // - Jupiter Intelligence
  
  return {
    status: 'not_implemented',
    message: 'External API integration is optional. Using static risk matrices.',
    futureEnhancement: {
      recommended: 'NASA POWER API for historical climate data',
      documentation: 'https://power.larc.nasa.gov/docs/services/api/',
      benefit: 'Location-specific historical trends and projections'
    }
  };
};

export default {
  assessPhysicalRisk,
  calculateBaselineRisk,
  calculateFutureRisk,
  calculateSectorRisk,
  calculateFinancialImpact,
  enhanceWithExternalAPI,
  COUNTRY_RISK_BASELINE,
  RCP_SCENARIO_MULTIPLIERS,
  SECTOR_VULNERABILITY
};
