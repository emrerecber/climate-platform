/**
 * ECB/IFRS S2 Compatible Physical Risk Calculator
 * P-S-A Formula: PCRS_h = 0.5*P + 0.3*S - 0.2*A
 * 
 * P = Probability (hazard likelihood)
 * S = Sensitivity (sector/asset vulnerability)
 * A = Adaptive Capacity (resilience measures)
 * 
 * Version: 2.0 ECB-Aligned
 * Last Updated: 2025-11-03
 */

// Sector sensitivity factors for each hazard
const SECTOR_SENSITIVITY = {
  'Enerji': {
    heat: 0.80,
    drought: 0.75,  // Cooling water dependency
    flood: 0.85,
    coastal: 0.70,
    precip: 0.65
  },
  'Oil&Gas': {
    heat: 0.75,
    drought: 0.60,
    flood: 0.90,
    coastal: 0.85,
    precip: 0.70
  },
  'Çimento': {
    heat: 0.70,
    drought: 0.50,
    flood: 0.75,
    coastal: 0.40,
    precip: 0.60
  },
  'Çelik': {
    heat: 0.75,
    drought: 0.65,  // Cooling water
    flood: 0.85,
    coastal: 0.50,
    precip: 0.65
  },
  'Otomotiv': {
    heat: 0.60,
    drought: 0.35,
    flood: 0.75,
    coastal: 0.45,
    precip: 0.55
  },
  'Gayrimenkul': {
    heat: 0.80,
    drought: 0.50,
    flood: 1.00,  // Maximum vulnerability
    coastal: 1.00,
    precip: 0.85
  },
  'Havacılık': {
    heat: 0.90,  // Flight operations critical
    drought: 0.40,
    flood: 0.70,
    coastal: 0.80,
    precip: 0.85
  },
  'Finans': {
    heat: 0.50,
    drought: 0.40,
    flood: 0.65,
    coastal: 0.60,
    precip: 0.50
  },
  'Tarım': {
    heat: 1.00,  // Maximum
    drought: 1.00,
    flood: 0.95,
    coastal: 0.70,
    precip: 0.95
  },
  'default': {
    heat: 0.65,
    drought: 0.55,
    flood: 0.70,
    coastal: 0.55,
    precip: 0.60
  }
};

// Aqueduct water stress multipliers (sector-dependent)
const WATER_STRESS_BETA = {
  'Enerji': 0.15,      // High water dependency
  'Oil&Gas': 0.12,
  'Çimento': 0.10,
  'Çelik': 0.13,
  'Tarım': 0.20,       // Maximum dependency
  'Otomotiv': 0.08,
  'Gayrimenkul': 0.05,
  'Havacılık': 0.03,
  'Finans': 0.02,
  'default': 0.08
};

/**
 * Utility: Clamp value between 0 and 1
 */
const clamp = (value, min = 0, max = 1) => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Calculate Adaptive Capacity (A)
 * A = 0.35*infrastructure + 0.25*financial + 0.20*governance + 0.20*technology
 */
const calculateAdaptiveCapacity = (adaptive_capacity = {}) => {
  const {
    infrastructure = 0.5,  // Default medium capacity
    financial = 0.5,
    governance = 0.5,
    technology = 0.5
  } = adaptive_capacity;
  
  const A = 
    0.35 * clamp(infrastructure) +
    0.25 * clamp(financial) +
    0.20 * clamp(governance) +
    0.20 * clamp(technology);
  
  return {
    A: clamp(A),
    components: {
      infrastructure: clamp(infrastructure),
      financial: clamp(financial),
      governance: clamp(governance),
      technology: clamp(technology)
    },
    weights: {
      infrastructure: 0.35,
      financial: 0.25,
      governance: 0.20,
      technology: 0.20
    }
  };
};

/**
 * Calculate PCRS for a single hazard
 * PCRS_h = 0.5*P + 0.3*S - 0.2*A
 * 
 * Apply water stress multiplier for drought/heat if applicable
 */
const calculatePCRS_Hazard = (hazard_name, probability, sensitivity, A, sector, apply_water_beta = false) => {
  const P = clamp(probability);
  const S = clamp(sensitivity);
  
  // Base formula
  let PCRS_h = 0.5 * P + 0.3 * S - 0.2 * A;
  PCRS_h = clamp(PCRS_h, 0, 1);
  
  // Apply Aqueduct water stress multiplier for water-related hazards
  if (apply_water_beta && (hazard_name === 'drought' || hazard_name === 'heat')) {
    const beta = WATER_STRESS_BETA[sector] || WATER_STRESS_BETA.default;
    PCRS_h = clamp(PCRS_h * (1 + beta));
  }
  
  return {
    hazard: hazard_name,
    PCRS_h: parseFloat(PCRS_h.toFixed(4)),
    P,
    S,
    A,
    water_stress_applied: apply_water_beta && (hazard_name === 'drought' || hazard_name === 'heat')
  };
};

/**
 * Calculate PRS (Physical Risk Score)
 * Conservative approach: PRS = max(PCRS_h) across all hazards
 * Alternative: Sector-weighted average
 */
const calculatePRS = (hazard_scores, approach = 'conservative') => {
  if (!hazard_scores || hazard_scores.length === 0) {
    return {
      PRS: 0,
      approach: 'none',
      dominant_hazard: null
    };
  }
  
  let PRS;
  let dominant_hazard = null;
  
  if (approach === 'conservative') {
    // Take maximum PCRS across all hazards
    const max_hazard = hazard_scores.reduce((max, h) => 
      h.PCRS_h > max.PCRS_h ? h : max
    );
    PRS = max_hazard.PCRS_h;
    dominant_hazard = max_hazard.hazard;
  } else {
    // Weighted average (equal weights for now)
    const sum = hazard_scores.reduce((acc, h) => acc + h.PCRS_h, 0);
    PRS = sum / hazard_scores.length;
    dominant_hazard = 'weighted_average';
  }
  
  return {
    PRS: clamp(PRS),
    approach,
    dominant_hazard,
    all_hazards: hazard_scores.map(h => ({
      hazard: h.hazard,
      score: h.PCRS_h
    }))
  };
};

/**
 * Calculate financial impact of physical risks
 * Based on PRS and asset/revenue exposure
 */
const calculatePhysicalFinancialImpact = (PRS, asset_value_usd, annual_revenue_usd) => {
  // Impact factors based on PRS level
  // Low (0-0.3): 1-5% impact
  // Medium (0.3-0.6): 5-15% impact
  // High (0.6-1.0): 15-50% impact
  
  let asset_impact_pct, revenue_impact_pct;
  
  if (PRS < 0.30) {
    asset_impact_pct = 0.01 + PRS * 0.13; // 1-5%
    revenue_impact_pct = 0.01 + PRS * 0.10; // 1-4%
  } else if (PRS < 0.60) {
    asset_impact_pct = 0.05 + (PRS - 0.30) * 0.33; // 5-15%
    revenue_impact_pct = 0.04 + (PRS - 0.30) * 0.27; // 4-12%
  } else {
    asset_impact_pct = 0.15 + (PRS - 0.60) * 0.88; // 15-50%
    revenue_impact_pct = 0.12 + (PRS - 0.60) * 0.70; // 12-40%
  }
  
  const expected_asset_loss = asset_value_usd * asset_impact_pct;
  const expected_revenue_loss = annual_revenue_usd * revenue_impact_pct;
  
  return {
    expected_annual_loss_usd: expected_asset_loss + expected_revenue_loss * 0.15, // 15% margin
    asset_impact: {
      percentage: (asset_impact_pct * 100).toFixed(2),
      value_usd: expected_asset_loss.toFixed(0)
    },
    revenue_impact: {
      percentage: (revenue_impact_pct * 100).toFixed(2),
      value_usd: expected_revenue_loss.toFixed(0)
    }
  };
};

/**
 * Main Physical Risk Assessment Function
 * ECB-Aligned P-S-A Model
 */
export const assessPhysicalRisk = (formData) => {
  const {
    company = {},
    finance = {},
    physical = {},
    emissions = {}
  } = formData;
  
  const sector = company.sector || 'default';
  const asset_value = finance.total_assets_usd || finance.total_debt_usd || 100000000;
  const revenue = finance.revenue_usd || 50000000;
  
  // Get sensitivity factors for sector
  const sensitivity_factors = SECTOR_SENSITIVITY[sector] || SECTOR_SENSITIVITY.default;
  
  // Calculate Adaptive Capacity (same across all hazards)
  const adaptive_capacity_result = calculateAdaptiveCapacity(physical.adaptive_capacity);
  const A = adaptive_capacity_result.A;
  
  // Define hazards to assess
  const hazards = ['heat', 'drought', 'flood', 'coastal', 'precip'];
  const hazard_scores = [];
  
  hazards.forEach(hazard => {
    const probability = (physical.probability && physical.probability[hazard]) || 0.5; // Default medium
    const sensitivity = sensitivity_factors[hazard];
    
    // Apply water stress beta for drought/heat
    const apply_water_beta = (hazard === 'drought' || hazard === 'heat');
    
    const pcrs = calculatePCRS_Hazard(
      hazard,
      probability,
      sensitivity,
      A,
      sector,
      apply_water_beta
    );
    
    hazard_scores.push(pcrs);
  });
  
  // Calculate overall PRS (conservative approach by default)
  const prs_result = calculatePRS(hazard_scores, 'conservative');
  
  // Calculate financial impact
  const financial_impact = calculatePhysicalFinancialImpact(
    prs_result.PRS,
    asset_value,
    revenue
  );
  
  // Data quality flags
  const data_quality_flags = [];
  if (!physical.probability || Object.keys(physical.probability).length === 0) {
    data_quality_flags.push('Missing hazard probability data - using defaults');
  }
  if (!physical.adaptive_capacity || Object.keys(physical.adaptive_capacity).length === 0) {
    data_quality_flags.push('Missing adaptive capacity data - using defaults');
  }
  
  return {
    PRS: prs_result.PRS,
    PRS_class: prs_result.PRS < 0.30 ? 'Low' : prs_result.PRS < 0.60 ? 'Medium' : 'High',
    dominant_hazard: prs_result.dominant_hazard,
    hazard_breakdown: hazard_scores,
    adaptive_capacity: adaptive_capacity_result,
    financial_impact,
    sector,
    water_stress_beta: WATER_STRESS_BETA[sector] || WATER_STRESS_BETA.default,
    data_quality_flags
  };
};

/**
 * Calculate scenario-based future PRS
 * Under different RCP scenarios and time horizons
 */
export const calculateFuturePRS = (current_prs_result, scenario = 'RCP4.5', year = 2050) => {
  // RCP multipliers (from existing physicalRiskCalculator.js)
  const RCP_MULTIPLIERS = {
    'RCP2.6': {
      2030: 1.20,
      2050: 1.40,
      2070: 1.50
    },
    'RCP4.5': {
      2030: 1.30,
      2050: 1.70,
      2070: 2.00
    },
    'RCP8.5': {
      2030: 1.40,
      2050: 2.20,
      2070: 3.00
    }
  };
  
  const closest_year = year <= 2030 ? 2030 : year <= 2050 ? 2050 : 2070;
  const multiplier = RCP_MULTIPLIERS[scenario]?.[closest_year] || 1.5;
  
  const future_PRS = clamp(current_prs_result.PRS * multiplier);
  const increase_pct = ((future_PRS - current_prs_result.PRS) / current_prs_result.PRS * 100).toFixed(1);
  
  return {
    scenario,
    year: closest_year,
    current_PRS: current_prs_result.PRS,
    future_PRS,
    increase_pct: increase_pct + '%',
    multiplier
  };
};

export default {
  assessPhysicalRisk,
  calculateFuturePRS,
  calculateAdaptiveCapacity,
  calculatePCRS_Hazard,
  SECTOR_SENSITIVITY,
  WATER_STRESS_BETA
};
