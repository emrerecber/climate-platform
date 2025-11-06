/**
 * ECB/IFRS S2 Client-Side Validation Utilities
 * 
 * Provides validation and data sanitization for ECB/IFRS S2 form fields
 * before submission to ensure compliance with standard requirements.
 */

/**
 * Clamp a number to a specific range (0-1 for ECB scores)
 * @param {number|string} value - Value to clamp
 * @param {number} min - Minimum allowed value (default: 0)
 * @param {number} max - Maximum allowed value (default: 1)
 * @returns {number} - Clamped value
 */
export function clampValue(value, min = 0, max = 1) {
  const num = parseFloat(value);
  if (isNaN(num)) return min;
  return Math.min(Math.max(num, min), max);
}

/**
 * Validate and clamp all 0-1 scale fields in form data
 * @param {Object} formData - Form data object
 * @returns {Object} - Validated form data
 */
export function validateECBFields(formData) {
  const validated = { ...formData };

  // PCAF Financial Fields (0-1 scale)
  if (validated.probabilityOfDefaultBase !== undefined) {
    validated.probabilityOfDefaultBase = clampValue(validated.probabilityOfDefaultBase, 0, 1);
  }
  if (validated.lossGivenDefaultBase !== undefined) {
    validated.lossGivenDefaultBase = clampValue(validated.lossGivenDefaultBase, 0, 1);
  }
  if (validated.riskWeightBase !== undefined) {
    validated.riskWeightBase = clampValue(validated.riskWeightBase, 0, 1);
  }
  if (validated.collateralVulnerability !== undefined) {
    validated.collateralVulnerability = clampValue(validated.collateralVulnerability, 0, 1);
  }

  // Physical Risk Probability (0-1 scale)
  if (validated.physicalRiskProbability) {
    validated.physicalRiskProbability = {
      heat: clampValue(validated.physicalRiskProbability.heat || 0, 0, 1),
      drought: clampValue(validated.physicalRiskProbability.drought || 0, 0, 1),
      flood: clampValue(validated.physicalRiskProbability.flood || 0, 0, 1),
      coastal: clampValue(validated.physicalRiskProbability.coastal || 0, 0, 1),
      precipitation: clampValue(validated.physicalRiskProbability.precipitation || 0, 0, 1)
    };
  }

  // Adaptive Capacity (0-1 scale)
  if (validated.adaptiveCapacity) {
    validated.adaptiveCapacity = {
      infrastructure: clampValue(validated.adaptiveCapacity.infrastructure || 0, 0, 1),
      financial: clampValue(validated.adaptiveCapacity.financial || 0, 0, 1),
      governance: clampValue(validated.adaptiveCapacity.governance || 0, 0, 1),
      technology: clampValue(validated.adaptiveCapacity.technology || 0, 0, 1)
    };
  }

  // Governance Scoring (0-1 scale)
  if (validated.governanceBoardOversight !== undefined) {
    validated.governanceBoardOversight = clampValue(validated.governanceBoardOversight, 0, 1);
  }
  if (validated.governanceManagementRole !== undefined) {
    validated.governanceManagementRole = clampValue(validated.governanceManagementRole, 0, 1);
  }
  if (validated.governanceIncentives !== undefined) {
    validated.governanceIncentives = clampValue(validated.governanceIncentives, 0, 1);
  }
  if (validated.governanceRnDScore !== undefined) {
    validated.governanceRnDScore = clampValue(validated.governanceRnDScore, 0, 1);
  }

  // Risk Amplifiers/Tags (0-1 scale)
  if (validated.tagWaterDependency !== undefined) {
    validated.tagWaterDependency = clampValue(validated.tagWaterDependency, 0, 1);
  }
  if (validated.tagStrandingRisk !== undefined) {
    validated.tagStrandingRisk = clampValue(validated.tagStrandingRisk, 0, 1);
  }
  if (validated.tagCoastalVulnerability !== undefined) {
    validated.tagCoastalVulnerability = clampValue(validated.tagCoastalVulnerability, 0, 1);
  }
  if (validated.tagSupplyChainExposure !== undefined) {
    validated.tagSupplyChainExposure = clampValue(validated.tagSupplyChainExposure, 0, 1);
  }

  return validated;
}

/**
 * Validate percentage fields (0-100)
 * @param {number|string} value - Percentage value
 * @returns {number} - Clamped percentage
 */
export function validatePercentage(value) {
  return clampValue(value, 0, 100);
}

/**
 * Validate positive numeric fields
 * @param {number|string} value - Numeric value
 * @returns {number} - Non-negative number
 */
export function validatePositiveNumber(value) {
  const num = parseFloat(value);
  return isNaN(num) || num < 0 ? 0 : num;
}

/**
 * Check if all required ECB fields are present
 * @param {Object} formData - Form data object
 * @returns {Object} - { isValid: boolean, missingFields: string[] }
 */
export function validateRequiredECBFields(formData) {
  const requiredFinancialFields = [
    'ebitdaAmount',
    'exposureAtDefault',
    'equityMarketValue'
  ];

  const requiredEmissionsFields = [
    'scope1Emissions',
    'scope2LocationEmissions',
    'scope2MarketEmissions'
  ];

  const missingFields = [];

  // Check financial fields
  requiredFinancialFields.forEach(field => {
    if (!formData[field] || formData[field] === '' || formData[field] === '0') {
      missingFields.push(field);
    }
  });

  // Check emissions fields
  requiredEmissionsFields.forEach(field => {
    if (!formData[field] || formData[field] === '') {
      missingFields.push(field);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Calculate total Scope 3 emissions from 15 categories
 * @param {Object} formData - Form data containing Scope 3 categories
 * @returns {number} - Total Scope 3 emissions
 */
export function calculateTotalScope3(formData) {
  const categories = [
    'cat1_purchasedGoods',
    'cat2_capitalGoods',
    'cat3_fuelEnergy',
    'cat4_upstreamTransport',
    'cat5_waste',
    'cat6_businessTravel',
    'cat7_employeeCommute',
    'cat8_upstreamLeased',
    'cat9_downstreamTransport',
    'cat10_processing',
    'cat11_useOfProducts',
    'cat12_endOfLife',
    'cat13_downstreamLeased',
    'cat14_franchises',
    'cat15_investments'
  ];

  let total = 0;
  categories.forEach(cat => {
    const value = parseFloat(formData[cat]);
    if (!isNaN(value) && value > 0) {
      total += value;
    }
  });

  return total;
}

/**
 * Prepare form data for ECB calculation submission
 * Validates all fields and ensures compliance with ECB/IFRS S2 requirements
 * @param {Object} formData - Raw form data
 * @returns {Object} - Validated and prepared form data
 */
export function prepareECBSubmission(formData) {
  // Validate and clamp all 0-1 fields
  const validated = validateECBFields(formData);

  // Calculate total Scope 3 if categories are provided
  if (!validated.scope3Emissions || validated.scope3Emissions === '0') {
    const totalScope3 = calculateTotalScope3(validated);
    if (totalScope3 > 0) {
      validated.scope3Emissions = totalScope3.toString();
    }
  }

  // Ensure positive numbers for financial fields
  const financialFields = [
    'ebitdaAmount',
    'exposureAtDefault',
    'equityMarketValue',
    'requiredTransitionCapex',
    'complianceCostAnnual',
    'cbamEmbeddedEmissions',
    'cbamExportVolumeUnits',
    'cbamExportValue'
  ];

  financialFields.forEach(field => {
    if (validated[field] !== undefined && validated[field] !== '') {
      validated[field] = validatePositiveNumber(validated[field]);
    }
  });

  // Add metadata flag
  validated.metadata = {
    ...validated.metadata,
    ECB_IFRS_S2_COMPATIBLE: true,
    validationTimestamp: new Date().toISOString()
  };

  return validated;
}

export default {
  clampValue,
  validateECBFields,
  validatePercentage,
  validatePositiveNumber,
  validateRequiredECBFields,
  calculateTotalScope3,
  prepareECBSubmission
};
