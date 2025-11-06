/**
 * PACTA (Paris Agreement Capital Transition Assessment) Calculator
 * Calculates climate alignment scores for 6 sectors: Energy, Automotive, Steel, Cement, Aviation, Real Estate
 * 
 * Based on IEA Net Zero by 2050 scenario (NZE2050), Sustainable Development Scenario (SDS), 
 * and Stated Policies Scenario (STEPS)
 */

/**
 * PACTA Benchmarks for Energy Sector
 * Source: IEA Net Zero by 2050 Roadmap
 */
const ENERGY_BENCHMARKS = {
  NZE2050: {
    renewableShare2030: 60,  // % of total capacity
    coalPhaseOut: 2030,      // year
    renewableShare2050: 90
  },
  SDS: {
    renewableShare2030: 50,
    coalPhaseOut: 2040,
    renewableShare2050: 75
  },
  STEPS: {
    renewableShare2030: 35,
    coalPhaseOut: 2050,
    renewableShare2050: 50
  }
};

/**
 * PACTA Benchmarks for Automotive Sector
 * Source: IEA Global EV Outlook
 */
const AUTOMOTIVE_BENCHMARKS = {
  NZE2050: {
    evShare2030: 60,         // % of total production
    icePhaseOut: 2035,       // year
    evShare2050: 100
  },
  SDS: {
    evShare2030: 45,
    icePhaseOut: 2040,
    evShare2050: 85
  },
  STEPS: {
    evShare2030: 25,
    icePhaseOut: 2060,
    evShare2050: 60
  }
};

/**
 * PACTA Benchmarks for Steel Sector
 * Source: IEA Iron and Steel Technology Roadmap
 */
const STEEL_BENCHMARKS = {
  NZE2050: {
    carbonIntensity2030: 1.3,  // tCO2/ton steel
    lowCarbonShare2030: 30,    // % (EAF, DRI, H2)
    carbonIntensity2050: 0.2
  },
  SDS: {
    carbonIntensity2030: 1.5,
    lowCarbonShare2030: 20,
    carbonIntensity2050: 0.5
  },
  STEPS: {
    carbonIntensity2030: 1.7,
    lowCarbonShare2030: 15,
    carbonIntensity2050: 1.0
  }
};

/**
 * PACTA Benchmarks for Cement Sector
 * Source: IEA Cement Technology Roadmap
 */
const CEMENT_BENCHMARKS = {
  NZE2050: {
    carbonIntensity2030: 0.50,  // tCO2/ton cement
    clinkerRatio2030: 65,       // %
    carbonIntensity2050: 0.10
  },
  SDS: {
    carbonIntensity2030: 0.55,
    clinkerRatio2030: 70,
    carbonIntensity2050: 0.25
  },
  STEPS: {
    carbonIntensity2030: 0.60,
    clinkerRatio2030: 75,
    carbonIntensity2050: 0.50
  }
};

/**
 * PACTA Benchmarks for Aviation Sector
 * Source: IATA Net Zero Roadmap
 */
const AVIATION_BENCHMARKS = {
  NZE2050: {
    safShare2030: 10,        // % of total fuel
    efficiencyImprovement2030: 20,  // % vs 2019
    safShare2050: 65
  },
  SDS: {
    safShare2030: 6,
    efficiencyImprovement2030: 15,
    safShare2050: 45
  },
  STEPS: {
    safShare2030: 2,
    efficiencyImprovement2030: 10,
    safShare2050: 20
  }
};

/**
 * PACTA Benchmarks for Real Estate Sector
 * Source: IEA Buildings Roadmap
 */
const REALESTATE_BENCHMARKS = {
  NZE2050: {
    emissionsIntensity2030: 25,  // kgCO2/m2/year
    renovationRate2030: 3.5,     // % per year
    emissionsIntensity2050: 0
  },
  SDS: {
    emissionsIntensity2030: 35,
    renovationRate2030: 2.5,
    emissionsIntensity2050: 10
  },
  STEPS: {
    emissionsIntensity2030: 45,
    renovationRate2030: 1.5,
    emissionsIntensity2050: 30
  }
};

/**
 * Calculate PACTA alignment for Energy sector
 * @param {Object} data - Energy sector data from form
 * @returns {Object} - Alignment scores and analysis
 */
export const calculateEnergyAlignment = (data) => {
  // Calculate current renewable share
  const totalCapacity = parseFloat(data.totalInstalledCapacityMW || 0);
  if (totalCapacity === 0) {
    return { error: 'Total capacity cannot be zero' };
  }

  const renewableCapacity = 
    parseFloat(data.windCapacityMW || 0) +
    parseFloat(data.solarCapacityMW || 0) +
    parseFloat(data.hydroCapacityMW || 0) +
    parseFloat(data.biomassCapacityMW || 0) +
    parseFloat(data.geothermalCapacityMW || 0);

  const currentRenewableShare = (renewableCapacity / totalCapacity) * 100;
  const target2030 = parseFloat(data.renewableTarget2030 || 0);
  const coalPhaseoutYear = data.coalPhaseoutDate ? new Date(data.coalPhaseoutDate).getFullYear() : null;

  // Calculate alignment scores
  const alignmentNZE = calculateScenarioAlignment(
    currentRenewableShare,
    target2030,
    ENERGY_BENCHMARKS.NZE2050.renewableShare2030,
    coalPhaseoutYear,
    ENERGY_BENCHMARKS.NZE2050.coalPhaseOut
  );

  const alignmentSDS = calculateScenarioAlignment(
    currentRenewableShare,
    target2030,
    ENERGY_BENCHMARKS.SDS.renewableShare2030,
    coalPhaseoutYear,
    ENERGY_BENCHMARKS.SDS.coalPhaseOut
  );

  const alignmentSTEPS = calculateScenarioAlignment(
    currentRenewableShare,
    target2030,
    ENERGY_BENCHMARKS.STEPS.renewableShare2030,
    coalPhaseoutYear,
    ENERGY_BENCHMARKS.STEPS.coalPhaseOut
  );

  // Determine best fit scenario
  const scenarios = [
    { name: 'Net Zero by 2050', score: alignmentNZE, temperature: '1.5°C' },
    { name: 'Sustainable Development', score: alignmentSDS, temperature: '1.8°C' },
    { name: 'Stated Policies', score: alignmentSTEPS, temperature: '2.5°C' }
  ];

  const bestScenario = scenarios.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return {
    sector: 'Energy',
    currentRenewableShare: currentRenewableShare.toFixed(2),
    target2030: target2030,
    coalPhaseoutYear: coalPhaseoutYear || 'Not set',
    alignmentScores: {
      NZE2050: alignmentNZE.toFixed(1),
      SDS: alignmentSDS.toFixed(1),
      STEPS: alignmentSTEPS.toFixed(1)
    },
    bestFitScenario: bestScenario.name,
    temperatureAlignment: bestScenario.temperature,
    overallScore: bestScenario.score.toFixed(1),
    recommendations: generateEnergyRecommendations(currentRenewableShare, target2030, coalPhaseoutYear)
  };
};

/**
 * Calculate PACTA alignment for Automotive sector
 * @param {Object} data - Automotive sector data from form
 * @returns {Object} - Alignment scores and analysis
 */
export const calculateAutomotiveAlignment = (data) => {
  const totalProduction = parseFloat(data.annualTotalProduction || 0);
  if (totalProduction === 0) {
    return { error: 'Total production cannot be zero' };
  }

  const evProduction = 
    parseFloat(data.bevProduction || 0) +
    parseFloat(data.phevProduction || 0) +
    parseFloat(data.fcevProduction || 0);

  const currentEVShare = (evProduction / totalProduction) * 100;
  const target2030 = parseFloat(data.evProductionTarget2030 || 0);

  // Calculate alignment scores
  const alignmentNZE = calculateLinearAlignment(
    currentEVShare,
    target2030,
    AUTOMOTIVE_BENCHMARKS.NZE2050.evShare2030
  );

  const alignmentSDS = calculateLinearAlignment(
    currentEVShare,
    target2030,
    AUTOMOTIVE_BENCHMARKS.SDS.evShare2030
  );

  const alignmentSTEPS = calculateLinearAlignment(
    currentEVShare,
    target2030,
    AUTOMOTIVE_BENCHMARKS.STEPS.evShare2030
  );

  const scenarios = [
    { name: 'Net Zero by 2050', score: alignmentNZE, temperature: '1.5°C' },
    { name: 'Sustainable Development', score: alignmentSDS, temperature: '1.8°C' },
    { name: 'Stated Policies', score: alignmentSTEPS, temperature: '2.5°C' }
  ];

  const bestScenario = scenarios.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return {
    sector: 'Automotive',
    currentEVShare: currentEVShare.toFixed(2),
    target2030: target2030,
    alignmentScores: {
      NZE2050: alignmentNZE.toFixed(1),
      SDS: alignmentSDS.toFixed(1),
      STEPS: alignmentSTEPS.toFixed(1)
    },
    bestFitScenario: bestScenario.name,
    temperatureAlignment: bestScenario.temperature,
    overallScore: bestScenario.score.toFixed(1),
    recommendations: generateAutomotiveRecommendations(currentEVShare, target2030)
  };
};

/**
 * Calculate PACTA alignment for Steel sector
 * @param {Object} data - Steel sector data from form
 * @returns {Object} - Alignment scores and analysis
 */
export const calculateSteelAlignment = (data) => {
  const carbonIntensity = parseFloat(data.steelCarbonIntensity || 0);
  const lowCarbonShare = 
    parseFloat(data.eafProductionShare || 0) +
    parseFloat(data.driProductionShare || 0) +
    parseFloat(data.hydrogenSteelShare || 0);
  const target2030 = parseFloat(data.lowCarbonSteelTarget2030 || 0);

  // Calculate alignment based on carbon intensity
  const alignmentNZE = calculateIntensityAlignment(
    carbonIntensity,
    STEEL_BENCHMARKS.NZE2050.carbonIntensity2030,
    lowCarbonShare,
    STEEL_BENCHMARKS.NZE2050.lowCarbonShare2030
  );

  const alignmentSDS = calculateIntensityAlignment(
    carbonIntensity,
    STEEL_BENCHMARKS.SDS.carbonIntensity2030,
    lowCarbonShare,
    STEEL_BENCHMARKS.SDS.lowCarbonShare2030
  );

  const alignmentSTEPS = calculateIntensityAlignment(
    carbonIntensity,
    STEEL_BENCHMARKS.STEPS.carbonIntensity2030,
    lowCarbonShare,
    STEEL_BENCHMARKS.STEPS.lowCarbonShare2030
  );

  const scenarios = [
    { name: 'Net Zero by 2050', score: alignmentNZE, temperature: '1.5°C' },
    { name: 'Sustainable Development', score: alignmentSDS, temperature: '1.8°C' },
    { name: 'Stated Policies', score: alignmentSTEPS, temperature: '2.5°C' }
  ];

  const bestScenario = scenarios.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return {
    sector: 'Steel',
    currentCarbonIntensity: carbonIntensity.toFixed(2),
    currentLowCarbonShare: lowCarbonShare.toFixed(2),
    target2030: target2030,
    alignmentScores: {
      NZE2050: alignmentNZE.toFixed(1),
      SDS: alignmentSDS.toFixed(1),
      STEPS: alignmentSTEPS.toFixed(1)
    },
    bestFitScenario: bestScenario.name,
    temperatureAlignment: bestScenario.temperature,
    overallScore: bestScenario.score.toFixed(1),
    recommendations: generateSteelRecommendations(carbonIntensity, lowCarbonShare, target2030)
  };
};

/**
 * Calculate PACTA alignment for Cement sector
 * @param {Object} data - Cement sector data from form
 * @returns {Object} - Alignment scores and analysis
 */
export const calculateCementAlignment = (data) => {
  const carbonIntensity = parseFloat(data.cementCarbonIntensity || 0);
  const clinkerRatio = parseFloat(data.clinkerRatio || 0);
  const target = parseFloat(data.clinkerSubstitutionTarget || 0);

  const alignmentNZE = calculateIntensityAlignment(
    carbonIntensity,
    CEMENT_BENCHMARKS.NZE2050.carbonIntensity2030,
    clinkerRatio,
    CEMENT_BENCHMARKS.NZE2050.clinkerRatio2030
  );

  const alignmentSDS = calculateIntensityAlignment(
    carbonIntensity,
    CEMENT_BENCHMARKS.SDS.carbonIntensity2030,
    clinkerRatio,
    CEMENT_BENCHMARKS.SDS.clinkerRatio2030
  );

  const alignmentSTEPS = calculateIntensityAlignment(
    carbonIntensity,
    CEMENT_BENCHMARKS.STEPS.carbonIntensity2030,
    clinkerRatio,
    CEMENT_BENCHMARKS.STEPS.clinkerRatio2030
  );

  const scenarios = [
    { name: 'Net Zero by 2050', score: alignmentNZE, temperature: '1.5°C' },
    { name: 'Sustainable Development', score: alignmentSDS, temperature: '1.8°C' },
    { name: 'Stated Policies', score: alignmentSTEPS, temperature: '2.5°C' }
  ];

  const bestScenario = scenarios.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return {
    sector: 'Cement',
    currentCarbonIntensity: carbonIntensity.toFixed(2),
    currentClinkerRatio: clinkerRatio.toFixed(2),
    clinkerSubstitutionTarget: target,
    alignmentScores: {
      NZE2050: alignmentNZE.toFixed(1),
      SDS: alignmentSDS.toFixed(1),
      STEPS: alignmentSTEPS.toFixed(1)
    },
    bestFitScenario: bestScenario.name,
    temperatureAlignment: bestScenario.temperature,
    overallScore: bestScenario.score.toFixed(1),
    recommendations: generateCementRecommendations(carbonIntensity, clinkerRatio)
  };
};

/**
 * Calculate PACTA alignment for Aviation sector
 * @param {Object} data - Aviation sector data from form
 * @returns {Object} - Alignment scores and analysis
 */
export const calculateAviationAlignment = (data) => {
  const currentSAF = parseFloat(data.safUsage || 0);
  const target2030 = parseFloat(data.safTarget2030 || 0);

  const alignmentNZE = calculateLinearAlignment(
    currentSAF,
    target2030,
    AVIATION_BENCHMARKS.NZE2050.safShare2030
  );

  const alignmentSDS = calculateLinearAlignment(
    currentSAF,
    target2030,
    AVIATION_BENCHMARKS.SDS.safShare2030
  );

  const alignmentSTEPS = calculateLinearAlignment(
    currentSAF,
    target2030,
    AVIATION_BENCHMARKS.STEPS.safShare2030
  );

  const scenarios = [
    { name: 'Net Zero by 2050', score: alignmentNZE, temperature: '1.5°C' },
    { name: 'Sustainable Development', score: alignmentSDS, temperature: '1.8°C' },
    { name: 'Stated Policies', score: alignmentSTEPS, temperature: '2.5°C' }
  ];

  const bestScenario = scenarios.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return {
    sector: 'Aviation',
    currentSAFUsage: currentSAF.toFixed(2),
    target2030: target2030,
    fleetSize: data.fleetSize,
    averageFleetAge: data.averageFleetAge,
    alignmentScores: {
      NZE2050: alignmentNZE.toFixed(1),
      SDS: alignmentSDS.toFixed(1),
      STEPS: alignmentSTEPS.toFixed(1)
    },
    bestFitScenario: bestScenario.name,
    temperatureAlignment: bestScenario.temperature,
    overallScore: bestScenario.score.toFixed(1),
    recommendations: generateAviationRecommendations(currentSAF, target2030)
  };
};

/**
 * Calculate PACTA alignment for Real Estate sector
 * @param {Object} data - Real Estate sector data from form
 * @returns {Object} - Alignment scores and analysis
 */
export const calculateRealEstateAlignment = (data) => {
  const emissionsIntensity = parseFloat(data.buildingEmissionsIntensity || 0);
  const renewableHeating = parseFloat(data.renewableHeatingShare || 0);

  const alignmentNZE = calculateIntensityAlignment(
    emissionsIntensity,
    REALESTATE_BENCHMARKS.NZE2050.emissionsIntensity2030,
    renewableHeating,
    50  // Target 50% renewable heating for NZE
  );

  const alignmentSDS = calculateIntensityAlignment(
    emissionsIntensity,
    REALESTATE_BENCHMARKS.SDS.emissionsIntensity2030,
    renewableHeating,
    35
  );

  const alignmentSTEPS = calculateIntensityAlignment(
    emissionsIntensity,
    REALESTATE_BENCHMARKS.STEPS.emissionsIntensity2030,
    renewableHeating,
    20
  );

  const scenarios = [
    { name: 'Net Zero by 2050', score: alignmentNZE, temperature: '1.5°C' },
    { name: 'Sustainable Development', score: alignmentSDS, temperature: '1.8°C' },
    { name: 'Stated Policies', score: alignmentSTEPS, temperature: '2.5°C' }
  ];

  const bestScenario = scenarios.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return {
    sector: 'Real Estate',
    currentEmissionsIntensity: emissionsIntensity.toFixed(2),
    energyRating: data.energyEfficiencyRating,
    renewableHeatingShare: renewableHeating.toFixed(2),
    alignmentScores: {
      NZE2050: alignmentNZE.toFixed(1),
      SDS: alignmentSDS.toFixed(1),
      STEPS: alignmentSTEPS.toFixed(1)
    },
    bestFitScenario: bestScenario.name,
    temperatureAlignment: bestScenario.temperature,
    overallScore: bestScenario.score.toFixed(1),
    recommendations: generateRealEstateRecommendations(emissionsIntensity, data.energyEfficiencyRating)
  };
};

// ========== Helper Functions ==========

/**
 * Calculate alignment score for scenario with current state, target, and benchmark
 */
const calculateScenarioAlignment = (current, target, benchmark, coalYear, benchmarkCoalYear) => {
  // Weight: 70% for target alignment, 30% for coal phase-out
  const targetScore = calculateLinearAlignment(current, target, benchmark);
  
  let coalScore = 50; // Default neutral score
  if (coalYear && benchmarkCoalYear) {
    if (coalYear <= benchmarkCoalYear) {
      coalScore = 100;
    } else {
      const yearsDifference = coalYear - benchmarkCoalYear;
      coalScore = Math.max(0, 100 - (yearsDifference * 5)); // -5 points per year delay
    }
  }

  return (targetScore * 0.7) + (coalScore * 0.3);
};

/**
 * Calculate linear alignment between current, target and benchmark
 */
const calculateLinearAlignment = (current, target, benchmark) => {
  const targetGap = Math.abs(target - benchmark);
  const currentGap = Math.abs(current - benchmark);
  
  if (targetGap === 0) return 100; // Perfect alignment
  if (target >= benchmark) return 100; // Exceeds benchmark
  
  // Score based on how close target is to benchmark
  const score = Math.max(0, 100 - (targetGap / benchmark * 100));
  
  return score;
};

/**
 * Calculate alignment based on carbon intensity metrics
 */
const calculateIntensityAlignment = (currentIntensity, benchmarkIntensity, currentShare, benchmarkShare) => {
  // Lower intensity is better, so invert the calculation
  const intensityScore = currentIntensity <= benchmarkIntensity 
    ? 100 
    : Math.max(0, 100 - ((currentIntensity - benchmarkIntensity) / benchmarkIntensity * 100));
  
  const shareScore = calculateLinearAlignment(currentShare, currentShare, benchmarkShare);
  
  return (intensityScore * 0.6) + (shareScore * 0.4);
};

// ========== Recommendation Generators ==========

const generateEnergyRecommendations = (current, target, coalYear) => {
  const recommendations = [];
  
  if (current < 30) {
    recommendations.push('Significantly increase renewable energy capacity through wind and solar investments');
  }
  if (target < 50) {
    recommendations.push('Set more ambitious 2030 renewable energy targets (minimum 50% for SDS alignment)');
  }
  if (!coalYear || coalYear > 2040) {
    recommendations.push('Establish concrete coal phase-out timeline before 2040');
  }
  recommendations.push('Implement energy storage solutions to support renewable integration');
  
  return recommendations;
};

const generateAutomotiveRecommendations = (current, target) => {
  const recommendations = [];
  
  if (current < 15) {
    recommendations.push('Accelerate EV production ramp-up through platform electrification');
  }
  if (target < 45) {
    recommendations.push('Increase 2030 EV production target to at least 45% for SDS alignment');
  }
  recommendations.push('Invest in battery manufacturing and supply chain development');
  recommendations.push('Phase out ICE plant capacity and retrofit for EV production');
  
  return recommendations;
};

const generateSteelRecommendations = (intensity, share, target) => {
  const recommendations = [];
  
  if (intensity > 1.5) {
    recommendations.push('Reduce carbon intensity through energy efficiency improvements');
  }
  if (share < 30) {
    recommendations.push('Increase electric arc furnace (EAF) production capacity');
    recommendations.push('Invest in hydrogen-based direct reduced iron (H-DRI) technology');
  }
  if (target < 30) {
    recommendations.push('Set target for at least 30% low-carbon steel by 2030');
  }
  recommendations.push('Implement carbon capture and storage (CCS) for blast furnaces');
  
  return recommendations;
};

const generateCementRecommendations = (intensity, clinkerRatio) => {
  const recommendations = [];
  
  if (intensity > 0.6) {
    recommendations.push('Reduce carbon intensity through alternative fuels and energy efficiency');
  }
  if (clinkerRatio > 70) {
    recommendations.push('Increase clinker substitution with supplementary cementitious materials (SCMs)');
    recommendations.push('Use fly ash, slag, or calcined clay to reduce clinker ratio below 70%');
  }
  recommendations.push('Invest in carbon capture technology for cement plants');
  
  return recommendations;
};

const generateAviationRecommendations = (current, target) => {
  const recommendations = [];
  
  if (current < 1) {
    recommendations.push('Begin sustainable aviation fuel (SAF) procurement and usage');
  }
  if (target < 10) {
    recommendations.push('Set 2030 SAF target of at least 10% for NZE alignment');
  }
  recommendations.push('Invest in fleet modernization with more fuel-efficient aircraft');
  recommendations.push('Participate in SAF production partnerships or purchase agreements');
  
  return recommendations;
};

const generateRealEstateRecommendations = (intensity, rating) => {
  const recommendations = [];
  
  if (intensity > 40) {
    recommendations.push('Implement comprehensive energy retrofit program for buildings');
  }
  if (!rating || rating > 'C') {
    recommendations.push('Upgrade building energy efficiency to achieve at least C rating');
  }
  recommendations.push('Install solar panels and renewable heating systems');
  recommendations.push('Improve insulation and install energy-efficient HVAC systems');
  
  return recommendations;
};

/**
 * Main PACTA calculation function - routes to sector-specific calculator
 * @param {Object} formData - Complete form data including sector selection
 * @returns {Object} - PACTA alignment results
 */
export const calculatePACTA = (formData) => {
  if (!formData.pactaSector) {
    return { error: 'No PACTA sector selected' };
  }

  switch(formData.pactaSector) {
    case 'energy':
      return calculateEnergyAlignment(formData);
    case 'automotive':
      return calculateAutomotiveAlignment(formData);
    case 'steel':
      return calculateSteelAlignment(formData);
    case 'cement':
      return calculateCementAlignment(formData);
    case 'aviation':
      return calculateAviationAlignment(formData);
    case 'realestate':
      return calculateRealEstateAlignment(formData);
    default:
      return { error: 'Invalid PACTA sector' };
  }
};

export default {
  calculatePACTA,
  calculateEnergyAlignment,
  calculateAutomotiveAlignment,
  calculateSteelAlignment,
  calculateCementAlignment,
  calculateAviationAlignment,
  calculateRealEstateAlignment
};
