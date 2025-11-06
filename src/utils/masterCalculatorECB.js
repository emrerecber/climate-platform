/**
 * MASTER CLIMATE RISK CALCULATOR
 * ECB/IFRS S2 Compatible - Complete Integration
 * 
 * Integrates:
 * - TRS (7-Factor Transition Risk with PACTA)
 * - PRS (P-S-A Physical Risk)
 * - RI* (Combined Risk Index with amplifiers)
 * - Financial Impact (PD/LGD/ECL/RWA)
 * - PCAF Financed Emissions
 * - Governance Scoring
 * 
 * Version: 2.0
 * Last Updated: 2025-11-03
 */

import { calculateTRS } from './transitionRiskCalculatorECB.js';
import { assessPhysicalRisk } from './physicalRiskCalculatorECB.js';
import { calculateFinancialImpact } from './financialImpactCalculator.js';
import { calculatePCAF } from './pcafCalculator.js';

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

// ECB/IFRS S2 Compliance Flag
export const ECB_IFRS_S2_COMPATIBLE = true;

// Risk classification thresholds
const RISK_THRESHOLDS = {
  Low: 0.30,
  Medium: 0.60
};

/**
 * Classify risk score
 */
const classifyRisk = (score) => {
  if (score < RISK_THRESHOLDS.Low) return 'Low';
  if (score < RISK_THRESHOLDS.Medium) return 'Medium';
  return 'High';
};

/**
 * Calculate RI* (Combined Risk Index with amplifiers)
 * RI = wT * TRS_adj + wP * PRS
 * RI* = RI * (1 + amplifiers)
 * 
 * Amplifiers (α):
 * - water_dep: 0.15
 * - stranding: 0.25
 * - coastal_vuln: 0.18
 * - supply_chain: 0.10
 */
const calculateRI_Star = (TRS_adj, PRS, tags = {}, sector = 'default') => {
  // Sector-specific weights
  const sectorWeights = {
    'Enerji': { wT: 0.70, wP: 0.30 },
    'Oil&Gas': { wT: 0.75, wP: 0.25 },
    'Çimento': { wT: 0.70, wP: 0.30 },
    'Çelik': { wT: 0.65, wP: 0.35 },
    'Gayrimenkul': { wT: 0.40, wP: 0.60 },
    'Tarım': { wT: 0.50, wP: 0.50 },
    'default': { wT: 0.60, wP: 0.40 }
  };
  
  const weights = sectorWeights[sector] || sectorWeights.default;
  
  // Base RI
  const RI = weights.wT * TRS_adj + weights.wP * PRS;
  
  // Amplifiers
  const alpha_water = 0.15;
  const alpha_stranding = 0.25;
  const alpha_coastal = 0.18;
  const alpha_supply = 0.10;
  
  const amplifier_sum = 
    alpha_water * (tags.water_dep || 0) +
    alpha_stranding * (tags.stranding || 0) +
    alpha_coastal * (tags.coastal_vuln || 0) +
    alpha_supply * (tags.supply_chain || 0);
  
  const RI_star = RI * (1 + amplifier_sum);
  
  return {
    RI: clamp(RI),
    RI_star: clamp(RI_star),
    weights,
    amplifiers: {
      water_dep: tags.water_dep || 0,
      stranding: tags.stranding || 0,
      coastal_vuln: tags.coastal_vuln || 0,
      supply_chain: tags.supply_chain || 0,
      total_uplift: amplifier_sum
    }
  };
};

/**
 * Calculate Governance Score
 * governance_score = 0.4*board + 0.3*management + 0.3*incentives
 */
const calculateGovernanceScore = (governance = {}) => {
  const board = governance.board_oversight || 0;
  const management = governance.management_role || 0;
  const incentives = governance.incentives || 0;
  
  const score = 0.4 * board + 0.3 * management + 0.3 * incentives;
  
  return {
    governance_score: clamp(score),
    components: {
      board_oversight: board,
      management_role: management,
      incentives
    },
    weights: {
      board: 0.4,
      management: 0.3,
      incentives: 0.3
    },
    classification: score >= 0.70 ? 'Strong' : score >= 0.50 ? 'Adequate' : 'Weak'
  };
};

/**
 * Calculate emissions intensity metrics
 */
const calculateIntensityMetrics = (emissions, finance, company) => {
  const { scope1_tco2 = 0, scope2_tco2 = 0, scope2_market_tco2 = 0, scope3 = {} } = emissions;
  const scope2_final = scope2_market_tco2 || scope2_tco2;
  const scope3_total = Object.values(scope3).reduce((a, b) => a + b, 0);
  
  const total_emissions = scope1_tco2 + scope2_final + scope3_total;
  const revenue_usd = finance.revenue_usd || 0;
  const employees = company.employees || 1;
  
  return {
    revenue_intensity_tco2_per_m_usd: revenue_usd > 0 ? (total_emissions / (revenue_usd / 1e6)).toFixed(2) : 'N/A',
    employee_intensity_tco2_per_employee: (total_emissions / employees).toFixed(2),
    scope1_intensity: revenue_usd > 0 ? (scope1_tco2 / (revenue_usd / 1e6)).toFixed(2) : 'N/A'
  };
};

/**
 * Generate data quality flags
 */
const generateDataQualityFlags = (formData) => {
  const flags = [];
  const { emissions = {}, finance = {}, physical = {}, pacta = {}, governance = {} } = formData;
  
  if (!emissions.scope1_tco2 || emissions.scope1_tco2 === 0) {
    flags.push('Missing Scope 1 emissions data');
  }
  if (!emissions.scope2_tco2 && !emissions.scope2_market_tco2) {
    flags.push('Missing Scope 2 emissions data');
  }
  if (!emissions.scope3 || Object.keys(emissions.scope3).length === 0) {
    flags.push('Missing Scope 3 emissions data');
  }
  if (!finance.revenue_usd || finance.revenue_usd === 0) {
    flags.push('Missing revenue data');
  }
  if (!finance.ebitda_usd) {
    flags.push('EBITDA estimated from revenue (15% margin assumption)');
  }
  if (!physical.probability || Object.keys(physical.probability).length === 0) {
    flags.push('Missing physical hazard probability data - using defaults');
  }
  if (!physical.adaptive_capacity || Object.keys(physical.adaptive_capacity).length === 0) {
    flags.push('Missing adaptive capacity data - using defaults');
  }
  if (!pacta.mix_pct || Object.keys(pacta.mix_pct).length === 0) {
    flags.push('Missing PACTA technology mix data');
  }
  if (governance.board_oversight === undefined || governance.management_role === undefined) {
    flags.push('Missing governance data - using defaults');
  }
  
  return flags;
};

/**
 * Generate assumptions list
 */
const generateAssumptions = (formData) => {
  const assumptions = [];
  const { finance = {}, scenario = {}, physical = {} } = formData;
  
  if (!finance.ebitda_usd) {
    assumptions.push('EBITDA assumed as 15% of revenue');
  }
  if (!scenario.carbon_price_usd_t) {
    assumptions.push('Carbon price assumed at $75/tCO2e (NGFS Orderly 2030)');
  }
  if (!scenario.energy_price_delta) {
    assumptions.push('Energy price increase assumed at 10%');
  }
  if (!scenario.sector_output_delta) {
    assumptions.push('Sector output change assumed at -5%');
  }
  if (!physical.adaptive_capacity || Object.keys(physical.adaptive_capacity).length === 0) {
    assumptions.push('Adaptive capacity components assumed at 0.5 (medium level)');
  }
  if (!finance.pd_base) {
    assumptions.push('Baseline PD assumed at 3%');
  }
  if (!finance.lgd_base) {
    assumptions.push('Baseline LGD assumed at 40%');
  }
  
  assumptions.push('Scenario weights: Orderly 40%, Disorderly 35%, Hot-House 25%');
  assumptions.push('Risk classification: Low <0.30, Medium 0.30-0.60, High >0.60');
  
  return assumptions;
};

/**
 * MASTER CALCULATION FUNCTION
 * Main entry point for all climate risk calculations
 */
export const calculateClimateRisk = (formData) => {
  // Validate input
  if (!formData || !formData.company) {
    throw new Error('Invalid input: company data required');
  }
  
  const sector = formData.company.sector || 'default';
  
  // 1. Calculate TRS (Transition Risk)
  const trs_result = calculateTRS(formData);
  
  // 2. Calculate PRS (Physical Risk)
  const prs_result = assessPhysicalRisk(formData);
  
  // 3. Calculate RI and RI* (Combined Risk Index)
  const ri_result = calculateRI_Star(
    trs_result.TRS_adj,
    prs_result.PRS,
    formData.tags || {},
    sector
  );
  
  // 4. Calculate Financial Impact (PD/LGD/ECL/RWA)
  const financial_result = calculateFinancialImpact(
    formData,
    trs_result.TRS_adj,
    prs_result.PRS,
    ri_result.RI_star
  );
  
  // 5. Calculate PCAF Financed Emissions
  const pcaf_result = calculatePCAF(formData);
  
  // 6. Calculate Governance Score
  const governance_result = calculateGovernanceScore(formData.governance);
  
  // 7. Calculate Intensity Metrics
  const intensity_metrics = calculateIntensityMetrics(
    formData.emissions || {},
    formData.finance || {},
    formData.company || {}
  );
  
  // 8. Generate Data Quality Flags
  const data_quality_flags = generateDataQualityFlags(formData);
  
  // 9. Generate Assumptions
  const assumptions = generateAssumptions(formData);
  
  // 10. Compile Output Schema (ECB/IFRS S2 Format)
  const output = {
    metadata: {
      ECB_IFRS_S2_COMPATIBLE: true,
      calculation_timestamp: new Date().toISOString(),
      version: '2.0',
      company_name: formData.company.name || 'Unknown',
      sector: sector,
      country: formData.company.country || 'Unknown'
    },
    scores: {
      TRS: trs_result.TRS,
      TRS_adj: trs_result.TRS_adj,
      PRS: prs_result.PRS,
      RI: ri_result.RI,
      RI_star: ri_result.RI_star,
      class: classifyRisk(ri_result.RI_star),
      governance_score: governance_result.governance_score,
      governance_class: governance_result.classification
    },
    transition_risk: {
      ...trs_result,
      dominant_factor: Object.entries(trs_result.factors)
        .reduce((max, [key, val]) => val.value > max.value ? val : max, { value: 0 }).factor
    },
    physical_risk: {
      ...prs_result
    },
    combined_risk: {
      ...ri_result
    },
    financial: {
      ...financial_result
    },
    emissions_reporting: {
      scope1: formData.emissions?.scope1_tco2 || 0,
      scope2_location: formData.emissions?.scope2_location_tco2 || 0,
      scope2_market: formData.emissions?.scope2_market_tco2 || 0,
      scope3_total: formData.emissions?.scope3 ? 
        Object.values(formData.emissions.scope3).reduce((a, b) => a + b, 0) : 0,
      intensity_metrics,
      financed: pcaf_result
    },
    governance: governance_result,
    notes: {
      assumptions,
      data_quality_flags,
      data_quality_score: pcaf_result.data_quality_score
    }
  };
  
  return output;
};

export default {
  calculateClimateRisk,
  ECB_IFRS_S2_COMPATIBLE
};
