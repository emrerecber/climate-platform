/**
 * Form Validation Utility
 * Validates PACTA and TCFD form data for completeness and correctness
 */

/**
 * Validate PACTA sector data based on selected sector
 * @param {Object} formData - Complete form data
 * @returns {Object} - { isValid: boolean, errors: Array<string> }
 */
export const validatePACTAData = (formData) => {
  const errors = [];
  
  if (!formData.pactaSector) {
    errors.push('PACTA sector selection is required');
    return { isValid: false, errors };
  }

  switch(formData.pactaSector) {
    case 'energy':
      if (!formData.totalInstalledCapacityMW) errors.push('Total installed capacity is required for Energy sector');
      if (!formData.renewableTarget2030) errors.push('Renewable energy target for 2030 is required');
      
      // Capacity sum validation
      const totalCapacity = parseFloat(formData.totalInstalledCapacityMW || 0);
      const sumCapacity = 
        parseFloat(formData.coalCapacityMW || 0) +
        parseFloat(formData.gasCapacityMW || 0) +
        parseFloat(formData.oilCapacityMW || 0) +
        parseFloat(formData.windCapacityMW || 0) +
        parseFloat(formData.solarCapacityMW || 0) +
        parseFloat(formData.hydroCapacityMW || 0) +
        parseFloat(formData.biomassCapacityMW || 0) +
        parseFloat(formData.geothermalCapacityMW || 0) +
        parseFloat(formData.nuclearCapacityMW || 0);
      
      if (Math.abs(totalCapacity - sumCapacity) > totalCapacity * 0.05) {
        errors.push('Individual capacity breakdown should sum to total installed capacity (±5% tolerance)');
      }
      break;

    case 'automotive':
      if (!formData.annualTotalProduction) errors.push('Annual total production is required for Automotive sector');
      if (!formData.evProductionTarget2030) errors.push('EV production target for 2030 is required');
      
      // Production sum validation
      const totalProduction = parseFloat(formData.annualTotalProduction || 0);
      const sumProduction = 
        parseFloat(formData.iceProduction || 0) +
        parseFloat(formData.hybridProduction || 0) +
        parseFloat(formData.bevProduction || 0) +
        parseFloat(formData.phevProduction || 0) +
        parseFloat(formData.fcevProduction || 0);
      
      if (Math.abs(totalProduction - sumProduction) > totalProduction * 0.05) {
        errors.push('Individual vehicle production should sum to total production (±5% tolerance)');
      }
      break;

    case 'steel':
      if (!formData.annualSteelProduction) errors.push('Annual steel production is required for Steel sector');
      if (!formData.steelCarbonIntensity) errors.push('Carbon intensity is required for Steel sector');
      
      // Production method share validation
      const totalShare = 
        parseFloat(formData.bofProductionShare || 0) +
        parseFloat(formData.eafProductionShare || 0) +
        parseFloat(formData.driProductionShare || 0) +
        parseFloat(formData.hydrogenSteelShare || 0);
      
      if (totalShare > 0 && Math.abs(totalShare - 100) > 5) {
        errors.push('Production method shares should sum to 100% (±5% tolerance)');
      }
      break;

    case 'cement':
      if (!formData.annualCementProduction) errors.push('Annual cement production is required for Cement sector');
      if (!formData.cementCarbonIntensity) errors.push('Carbon intensity is required for Cement sector');
      break;

    case 'aviation':
      if (!formData.fleetSize) errors.push('Fleet size is required for Aviation sector');
      if (!formData.safTarget2030) errors.push('SAF target for 2030 is required for Aviation sector');
      break;

    case 'realestate':
      if (!formData.totalBuildingArea) errors.push('Total building area is required for Real Estate sector');
      if (!formData.energyEfficiencyRating) errors.push('Energy efficiency rating is required for Real Estate sector');
      break;

    default:
      errors.push('Invalid PACTA sector selected');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate TCFD data for all four pillars
 * @param {Object} formData - Complete form data
 * @returns {Object} - { isValid: boolean, errors: Array<string> }
 */
export const validateTCFDData = (formData) => {
  const errors = [];

  // Governance validation
  if (!formData.hasClimateExpertOnBoard) {
    errors.push('TCFD Governance: Climate expert on board status is required');
  }
  if (!formData.boardClimateDiscussionFrequency) {
    errors.push('TCFD Governance: Board discussion frequency is required');
  }

  // Strategy validation
  if (!formData.climateRiskTimeHorizons.short || 
      !formData.climateRiskTimeHorizons.medium || 
      !formData.climateRiskTimeHorizons.long) {
    errors.push('TCFD Strategy: All time horizons (short, medium, long) must be defined');
  }

  // Validate time horizon logical progression
  const short = parseFloat(formData.climateRiskTimeHorizons.short || 0);
  const medium = parseFloat(formData.climateRiskTimeHorizons.medium || 0);
  const long = parseFloat(formData.climateRiskTimeHorizons.long || 0);

  if (short >= medium || medium >= long) {
    errors.push('TCFD Strategy: Time horizons must be in increasing order (short < medium < long)');
  }

  // Risk Management validation
  if (!formData.riskAssessmentFrequency) {
    errors.push('TCFD Risk Management: Risk assessment frequency is required');
  }
  if (!formData.integrationWithERM) {
    errors.push('TCFD Risk Management: Integration with ERM status is required');
  }

  // Metrics & Targets validation
  if (!formData.scope2Emissions) {
    errors.push('TCFD Metrics: Scope 2 emissions data is required');
  }
  if (!formData.scope3Emissions) {
    errors.push('TCFD Metrics: Scope 3 emissions data is required');
  }
  if (!formData.emissionsBaseYear) {
    errors.push('TCFD Metrics: Emissions base year is required');
  }
  if (!formData.hasNetZeroCommitment) {
    errors.push('TCFD Metrics: Net-zero commitment status is required');
  }

  // If net-zero committed, validate target year
  if (formData.hasNetZeroCommitment === 'yes' && !formData.netZeroYear) {
    errors.push('TCFD Metrics: Net-zero year is required when commitment is made');
  }

  // Validate net-zero year is in the future
  if (formData.netZeroYear) {
    const targetYear = parseInt(formData.netZeroYear);
    const currentYear = new Date().getFullYear();
    if (targetYear < currentYear) {
      errors.push('TCFD Metrics: Net-zero target year must be in the future');
    }
  }

  // Validate emission reduction target
  if (formData.emissionReductionTarget) {
    const target = parseFloat(formData.emissionReductionTarget);
    if (target < 0 || target > 100) {
      errors.push('TCFD Metrics: Emission reduction target must be between 0-100%');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate all form data (existing fields + PACTA + TCFD)
 * @param {Object} formData - Complete form data
 * @returns {Object} - { isValid: boolean, errors: Array<string>, warnings: Array<string> }
 */
export const validateAllFormData = (formData) => {
  const errors = [];
  const warnings = [];

  // Basic required fields
  if (!formData.entityName) errors.push('Entity name is required');
  if (!formData.entityType) errors.push('Entity type is required');
  if (!formData.currency) errors.push('Currency is required');

  // Geographic data
  if (!formData.facilityLatitude) errors.push('Facility latitude is required');
  if (!formData.facilityLongitude) errors.push('Facility longitude is required');
  if (!formData.physicalAddress) errors.push('Physical address is required');
  if (!formData.city) errors.push('City is required');

  // Validate latitude/longitude ranges
  const lat = parseFloat(formData.facilityLatitude);
  const lon = parseFloat(formData.facilityLongitude);
  if (lat && (lat < -90 || lat > 90)) {
    errors.push('Latitude must be between -90 and 90');
  }
  if (lon && (lon < -180 || lon > 180)) {
    errors.push('Longitude must be between -180 and 180');
  }

  // Financial data warnings (not errors, as these might be legitimately zero)
  if (!formData.annualRevenue && !formData.monthlyIncome) {
    warnings.push('Consider adding revenue/income data for better analysis');
  }

  // PACTA validation
  if (formData.pactaSector) {
    const pactaValidation = validatePACTAData(formData);
    errors.push(...pactaValidation.errors);
  } else {
    warnings.push('PACTA sector data is recommended for climate alignment analysis');
  }

  // TCFD validation
  const hasAnyTCFDData = 
    formData.hasClimateExpertOnBoard || 
    formData.scope2Emissions || 
    formData.scope3Emissions;
  
  if (hasAnyTCFDData) {
    const tcfdValidation = validateTCFDData(formData);
    errors.push(...tcfdValidation.errors);
  } else {
    warnings.push('TCFD governance and metrics data is recommended for comprehensive climate risk assessment');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate specific step data
 * @param {number} stepNumber - Step number (1-12)
 * @param {Object} formData - Complete form data
 * @returns {Object} - { isValid: boolean, errors: Array<string> }
 */
export const validateStep = (stepNumber, formData) => {
  const errors = [];

  switch(stepNumber) {
    case 1: // Personal/Company Info
      if (!formData.entityName) errors.push('Entity name is required');
      if (!formData.entityType) errors.push('Entity type is required');
      if (!formData.currency) errors.push('Currency is required');
      break;

    case 2: // Geographic Location
      if (!formData.facilityLatitude) errors.push('Facility latitude is required');
      if (!formData.facilityLongitude) errors.push('Facility longitude is required');
      if (!formData.physicalAddress) errors.push('Physical address is required');
      if (!formData.city) errors.push('City is required');
      break;

    case 11: // PACTA Data
      if (formData.pactaSector) {
        const pactaValidation = validatePACTAData(formData);
        errors.push(...pactaValidation.errors);
      }
      break;

    case 12: // TCFD Data
      const hasAnyTCFDData = 
        formData.hasClimateExpertOnBoard || 
        formData.scope2Emissions || 
        formData.scope3Emissions;
      
      if (hasAnyTCFDData) {
        const tcfdValidation = validateTCFDData(formData);
        errors.push(...tcfdValidation.errors);
      }
      break;

    default:
      // Other steps don't have strict validation for now
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get completion percentage for PACTA data
 * @param {Object} formData - Complete form data
 * @returns {number} - Completion percentage (0-100)
 */
export const getPACTACompletionPercentage = (formData) => {
  if (!formData.pactaSector) return 0;

  let requiredFields = [];
  
  switch(formData.pactaSector) {
    case 'energy':
      requiredFields = [
        'totalInstalledCapacityMW', 'coalCapacityMW', 'gasCapacityMW',
        'windCapacityMW', 'solarCapacityMW', 'hydroCapacityMW',
        'renewableTarget2030', 'coalPhaseoutDate'
      ];
      break;
    case 'automotive':
      requiredFields = [
        'annualTotalProduction', 'iceProduction', 'bevProduction',
        'phevProduction', 'evProductionTarget2030', 'batteryCapacityGWh'
      ];
      break;
    case 'steel':
      requiredFields = [
        'annualSteelProduction', 'bofProductionShare', 'eafProductionShare',
        'steelCarbonIntensity', 'lowCarbonSteelTarget2030', 'ccsImplementation'
      ];
      break;
    case 'cement':
      requiredFields = [
        'annualCementProduction', 'clinkerRatio', 'alternativeFuelsShare',
        'cementCarbonIntensity', 'clinkerSubstitutionTarget'
      ];
      break;
    case 'aviation':
      requiredFields = [
        'annualPassengerKm', 'fleetSize', 'averageFleetAge',
        'safUsage', 'safTarget2030'
      ];
      break;
    case 'realestate':
      requiredFields = [
        'totalBuildingArea', 'averageBuildingAge', 'energyEfficiencyRating',
        'buildingEmissionsIntensity', 'renewableHeatingShare'
      ];
      break;
    default:
      return 0;
  }

  const filledFields = requiredFields.filter(field => formData[field]).length;
  return Math.round((filledFields / requiredFields.length) * 100);
};

/**
 * Get completion percentage for TCFD data
 * @param {Object} formData - Complete form data
 * @returns {number} - Completion percentage (0-100)
 */
export const getTCFDCompletionPercentage = (formData) => {
  const requiredFields = [
    // Governance
    'hasClimateExpertOnBoard', 'boardClimateDiscussionFrequency',
    'hasClimateRiskCommittee', 'climateKPIsInExecutiveComp',
    
    // Strategy
    'climateRiskTimeHorizons.short', 'climateRiskTimeHorizons.medium', 'climateRiskTimeHorizons.long',
    
    // Risk Management
    'riskAssessmentFrequency', 'integrationWithERM',
    
    // Metrics & Targets
    'scope2Emissions', 'scope3Emissions', 'emissionsBaseYear',
    'hasNetZeroCommitment', 'sbtiValidated', 'emissionReductionTarget',
    'renewableEnergyShare'
  ];

  let filledCount = 0;
  
  requiredFields.forEach(field => {
    if (field.includes('.')) {
      const parts = field.split('.');
      if (formData[parts[0]] && formData[parts[0]][parts[1]]) filledCount++;
    } else {
      if (formData[field]) filledCount++;
    }
  });

  return Math.round((filledCount / requiredFields.length) * 100);
};

export default {
  validatePACTAData,
  validateTCFDData,
  validateAllFormData,
  validateStep,
  getPACTACompletionPercentage,
  getTCFDCompletionPercentage
};
