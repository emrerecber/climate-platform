/**
 * ECB/IFRS S2 Compatible Transition Risk Calculator
 * 7-Factor TRS Model with PACTA Technology Gap Adjustment
 * 
 * Version: 2.0 ECB-Aligned
 * Last Updated: 2025-11-03
 */

// Sector-specific parameters
const SECTOR_PARAMS = {
  'Enerji': { theta: 0.40, pass_through: 0.30, best_intensity: 50, worst_intensity: 800 },
  'Oil&Gas': { theta: 0.40, pass_through: 0.35, best_intensity: 80, worst_intensity: 900 },
  'Çimento': { theta: 0.35, pass_through: 0.25, best_intensity: 400, worst_intensity: 900 },
  'Çelik': { theta: 0.35, pass_through: 0.25, best_intensity: 400, worst_intensity: 2000 },
  'Otomotiv': { theta: 0.30, pass_through: 0.40, best_intensity: 30, worst_intensity: 200 },
  'Gayrimenkul': { theta: 0.20, pass_through: 0.50, best_intensity: 20, worst_intensity: 150 },
  'Havacılık': { theta: 0.30, pass_through: 0.20, best_intensity: 50, worst_intensity: 300 },
  'Finans': { theta: 0.25, pass_through: 0.60, best_intensity: 5, worst_intensity: 50 },
  'default': { theta: 0.25, pass_through: 0.45, best_intensity: 50, worst_intensity: 300 }
};

// PACTA target technology mix (2030 benchmarks)
const PACTA_TARGETS = {
  'Enerji': {
    coal: 0,
    gas: 20,
    oil: 0,
    renewables: 70,
    hydrogen: 5,
    nuclear: 5
  },
  'Otomotiv': {
    ice: 20,
    bev_phev_fcev: 80
  },
  'Çelik': {
    bf_bof: 30,
    eaf: 50,
    h2_dri: 20
  },
  'default': {}
};

/**
 * Utility: Clamp value between 0 and 1
 */
const clamp = (value, min = 0, max = 1) => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Utility: Convert QAR to USD
 */
const qarToUsd = (qar) => {
  return qar / 3.64;
};

/**
 * Utility: Normalize value to 0-1 range
 */
const normalize = (value, min, max) => {
  if (max === min) return 0.5;
  return clamp((value - min) / (max - min));
};

/**
 * Factor 1: Emission Intensity (Scope 1)
 * Normalized against sector best/worst practice
 */
const calculateF1_EmissionIntensity = (scope1_tco2, revenue_usd, sector) => {
  if (!revenue_usd || revenue_usd === 0) return 0.5;
  
  const params = SECTOR_PARAMS[sector] || SECTOR_PARAMS.default;
  const intensity = scope1_tco2 / (revenue_usd / 1e6); // tCO2 per million USD
  
  const f1 = normalize(intensity, params.best_intensity, params.worst_intensity);
  
  return {
    factor: 'f1_emission_intensity',
    value: clamp(f1),
    intensity_tco2_per_m_usd: intensity.toFixed(2),
    benchmark_best: params.best_intensity,
    benchmark_worst: params.worst_intensity
  };
};

/**
 * Factor 2: Indirect Emissions (Scope 2 + 3)
 * Normalized contribution to total carbon footprint
 */
const calculateF2_IndirectEmissions = (scope2_tco2, scope3_total_tco2, scope1_tco2) => {
  const total_emissions = scope1_tco2 + scope2_tco2 + scope3_total_tco2;
  const indirect_emissions = scope2_tco2 + scope3_total_tco2;
  
  if (total_emissions === 0) return { factor: 'f2_indirect_emissions', value: 0 };
  
  const indirect_share = indirect_emissions / total_emissions;
  
  // Higher indirect share = higher transition risk (supply chain dependencies)
  const f2 = normalize(indirect_share, 0.30, 0.85); // 30-85% range
  
  return {
    factor: 'f2_indirect_emissions',
    value: clamp(f2),
    indirect_share_pct: (indirect_share * 100).toFixed(1),
    scope2_tco2,
    scope3_tco2: scope3_total_tco2
  };
};

/**
 * Factor 3: Transformation CapEx
 * Required investment to achieve net-zero relative to EBITDA
 */
const calculateF3_TransformationCapex = (required_capex_usd, ebitda_usd) => {
  if (!ebitda_usd || ebitda_usd === 0) return { factor: 'f3_transformation_capex', value: 0.5 };
  
  const capex_ratio = required_capex_usd / ebitda_usd;
  
  // Threshold: >= 2x EBITDA is high risk (f3 ≈ 0.85)
  // 0-0.5x EBITDA is low risk (f3 ≈ 0.15)
  let f3;
  if (capex_ratio >= 2.0) {
    f3 = 0.85;
  } else if (capex_ratio <= 0.5) {
    f3 = 0.15;
  } else {
    f3 = 0.15 + (capex_ratio - 0.5) * (0.85 - 0.15) / 1.5;
  }
  
  return {
    factor: 'f3_transformation_capex',
    value: clamp(f3),
    capex_ebitda_ratio: capex_ratio.toFixed(2),
    required_capex_usd
  };
};

/**
 * Factor 4: Revenue Shock
 * Impact from carbon pricing, energy costs, and demand shifts
 */
const calculateF4_RevenueShock = (
  revenue_usd,
  sector,
  carbon_price_usd_t,
  energy_price_delta,
  sector_output_delta,
  scope1_tco2,
  energy_use_mwh
) => {
  const params = SECTOR_PARAMS[sector] || SECTOR_PARAMS.default;
  
  // Carbon cost impact
  const carbon_cost = scope1_tco2 * carbon_price_usd_t;
  
  // Energy cost impact (assuming 10% of revenue baseline energy cost)
  const baseline_energy_cost = revenue_usd * 0.10;
  const energy_cost_increase = baseline_energy_cost * energy_price_delta;
  
  // Demand shift impact
  const demand_impact = Math.abs(sector_output_delta) * revenue_usd;
  
  // Total revenue at risk
  const revenue_at_risk = carbon_cost + energy_cost_increase + demand_impact;
  
  // Net impact after pass-through ability
  const net_impact = revenue_at_risk * (1 - params.pass_through);
  
  const f4 = clamp(net_impact / revenue_usd);
  
  return {
    factor: 'f4_revenue_shock',
    value: f4,
    carbon_cost_usd: carbon_cost.toFixed(0),
    energy_cost_increase_usd: energy_cost_increase.toFixed(0),
    demand_impact_usd: demand_impact.toFixed(0),
    revenue_at_risk_usd: revenue_at_risk.toFixed(0),
    net_impact_usd: net_impact.toFixed(0),
    pass_through_rate: params.pass_through
  };
};

/**
 * Factor 5: Compliance/Regulation Cost
 * Including CBAM if applicable
 */
const calculateF5_ComplianceCost = (compliance_cost_usd, cbam_cost_usd, ebitda_usd) => {
  if (!ebitda_usd || ebitda_usd === 0) return { factor: 'f5_compliance_cost', value: 0.5 };
  
  const total_compliance = compliance_cost_usd + cbam_cost_usd;
  const f5 = clamp(total_compliance / ebitda_usd);
  
  return {
    factor: 'f5_compliance_cost',
    value: f5,
    total_compliance_cost_usd: total_compliance.toFixed(0),
    cbam_cost_usd: cbam_cost_usd.toFixed(0),
    as_pct_ebitda: ((total_compliance / ebitda_usd) * 100).toFixed(1)
  };
};

/**
 * Factor 6: Governance Gap
 * Inverse of governance score (lower governance = higher risk)
 */
const calculateF6_Governance = (board_oversight, management_role, incentives) => {
  const gov_score = 0.4 * board_oversight + 0.3 * management_role + 0.3 * incentives;
  const f6 = 1 - clamp(gov_score);
  
  return {
    factor: 'f6_governance',
    value: clamp(f6),
    governance_score: gov_score.toFixed(2),
    board_oversight,
    management_role,
    incentives
  };
};

/**
 * Factor 7: R&D/Innovation Gap
 * Inverse of R&D readiness score
 */
const calculateF7_Innovation = (rnd_score) => {
  const normalized_rnd = clamp(rnd_score); // Assume input is 0-1
  const f7 = 1 - normalized_rnd;
  
  return {
    factor: 'f7_innovation',
    value: clamp(f7),
    rnd_score: rnd_score.toFixed(2)
  };
};

/**
 * Calculate PACTA Technology Gap
 * Returns gap value 0-1 based on deviation from Paris-aligned targets
 */
const calculatePACTAGap = (sector, mix_pct) => {
  const targets = PACTA_TARGETS[sector];
  
  if (!targets || Object.keys(targets).length === 0) {
    return {
      applicable: false,
      gap: 0,
      details: 'PACTA not applicable for this sector'
    };
  }
  
  let total_deviation = 0;
  let count = 0;
  const deviations = {};
  
  Object.keys(targets).forEach(tech => {
    const actual = mix_pct[tech] || 0;
    const target = targets[tech];
    const deviation = Math.abs(actual - target);
    deviations[tech] = {
      actual: actual.toFixed(1),
      target: target.toFixed(1),
      deviation: deviation.toFixed(1)
    };
    total_deviation += deviation;
    count++;
  });
  
  const gap = clamp(total_deviation / 100, 0, 1); // Normalize to 0-1
  
  return {
    applicable: true,
    gap,
    gap_pct: (gap * 100).toFixed(1),
    deviations
  };
};

/**
 * Main TRS Calculator (7-Factor Model)
 */
export const calculateTRS = (formData) => {
  // Extract data from form
  const {
    company = {},
    finance = {},
    emissions = {},
    energy_use = {},
    scenario = {},
    pacta = {},
    cbam = {},
    governance = {},
    tags = {}
  } = formData;
  
  // Convert QAR to USD if needed
  const revenue_usd = finance.revenue_usd || qarToUsd(finance.revenue_qar || 0);
  const ebitda_usd = finance.ebitda_usd || revenue_usd * 0.15; // Assume 15% margin if missing
  
  // Extract emissions
  const scope1 = emissions.scope1_tco2 || 0;
  const scope2 = emissions.scope2_market_tco2 || emissions.scope2_location_tco2 || emissions.scope2_tco2 || 0;
  const scope3_total = emissions.scope3 ? Object.values(emissions.scope3).reduce((a, b) => a + b, 0) : 0;
  
  // Scenario parameters
  const carbon_price = scenario.carbon_price_usd_t || 75;
  const energy_delta = scenario.energy_price_delta || 0.10;
  const output_delta = scenario.sector_output_delta || -0.05;
  
  // CBAM cost
  const cbam_cost = (cbam.embedded_emissions_tco2 || 0) * 
                    ((cbam.eu_price || 85) - (cbam.origin_price || 20)) * 
                    (cbam.export_volume_units || 0);
  
  // Calculate 7 factors
  const f1 = calculateF1_EmissionIntensity(scope1, revenue_usd, company.sector);
  const f2 = calculateF2_IndirectEmissions(scope2, scope3_total, scope1);
  const f3 = calculateF3_TransformationCapex(finance.required_capex_usd || 0, ebitda_usd);
  const f4 = calculateF4_RevenueShock(
    revenue_usd,
    company.sector,
    carbon_price,
    energy_delta,
    output_delta,
    scope1,
    energy_use.electricity_mwh || 0
  );
  const f5 = calculateF5_ComplianceCost(
    finance.compliance_cost_usd || 0,
    cbam_cost,
    ebitda_usd
  );
  const f6 = calculateF6_Governance(
    governance.board_oversight || 0,
    governance.management_role || 0,
    governance.incentives || 0
  );
  const f7 = calculateF7_Innovation(governance.rnd_score || 0.5);
  
  // Default weights
  const weights = {
    w1: 0.15, // Emission intensity
    w2: 0.15, // Indirect emissions
    w3: 0.15, // CapEx
    w4: 0.20, // Revenue shock
    w5: 0.15, // Compliance
    w6: 0.10, // Governance
    w7: 0.10  // Innovation
  };
  
  // Calculate raw TRS
  const TRS_raw = 
    weights.w1 * f1.value +
    weights.w2 * f2.value +
    weights.w3 * f3.value +
    weights.w4 * f4.value +
    weights.w5 * f5.value +
    weights.w6 * f6.value +
    weights.w7 * f7.value;
  
  const TRS = clamp(TRS_raw);
  
  // PACTA adjustment
  const pactaGap = calculatePACTAGap(company.sector, pacta.mix_pct || {});
  const params = SECTOR_PARAMS[company.sector] || SECTOR_PARAMS.default;
  const theta = params.theta;
  
  let TRS_adj = TRS;
  if (pactaGap.applicable) {
    TRS_adj = clamp(TRS * (1 + theta * pactaGap.gap));
  }
  
  return {
    TRS: parseFloat(TRS.toFixed(4)),
    TRS_adj: parseFloat(TRS_adj.toFixed(4)),
    factors: {
      f1_emission_intensity: f1,
      f2_indirect_emissions: f2,
      f3_transformation_capex: f3,
      f4_revenue_shock: f4,
      f5_compliance_cost: f5,
      f6_governance: f6,
      f7_innovation: f7
    },
    weights,
    pacta_adjustment: {
      applicable: pactaGap.applicable,
      gap: pactaGap.gap,
      theta,
      uplift: pactaGap.applicable ? ((TRS_adj - TRS) * 100).toFixed(1) + '%' : 'N/A',
      details: pactaGap.deviations || pactaGap.details
    },
    cbam_cost_usd: cbam_cost.toFixed(0)
  };
};

export default {
  calculateTRS,
  calculatePACTAGap,
  SECTOR_PARAMS,
  PACTA_TARGETS
};
