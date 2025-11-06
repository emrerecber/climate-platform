/**
 * ECB/IFRS S2 Financial Impact Calculator
 * PD (Probability of Default), LGD (Loss Given Default), ECL (Expected Credit Loss), RWA (Risk-Weighted Assets)
 * 
 * Version: 2.0 ECB-Aligned
 */

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

// Scenario weights (NGFS-aligned)
const SCENARIO_WEIGHTS = {
  orderly: 0.40,
  disorderly: 0.35,
  hothouse: 0.25
};

// λ_market: scenario-dependent LGD uplift
const LAMBDA_MARKET = {
  orderly: 0.00,
  disorderly: 0.05,
  hothouse: 0.10
};

/**
 * Calculate stressed PD using exponential model
 * PD_stressed = PD_base * exp(β1 * RI*)
 * β1 = 0.045 (calibrated parameter)
 */
export const calculatePD_Exponential = (PD_base, RI_star, beta1 = 0.045) => {
  const PD_stressed = PD_base * Math.exp(beta1 * RI_star * 100); // RI* in percentage
  return clamp(PD_stressed, 0, 0.99); // Cap at 99%
};

/**
 * Alternative: Linear PD model
 * PD_lin = PD_base * (1 + η * RI* / 100)
 * η = 4.5
 */
export const calculatePD_Linear = (PD_base, RI_star, eta = 4.5) => {
  const PD_stressed = PD_base * (1 + eta * RI_star);
  return clamp(PD_stressed, 0, 0.99);
};

/**
 * Calculate stressed LGD
 * LGD_new = min(0.95, LGD_base + λ_P * PRS * CollateralVuln + λ_market * Illiquidity)
 * λ_P = 0.50
 */
export const calculateLGD = (
  LGD_base,
  PRS,
  CollateralVuln = 0.5,
  scenario = 'orderly',
  lambda_P = 0.50
) => {
  const lambda_market = LAMBDA_MARKET[scenario] || 0;
  const LGD_new = LGD_base + lambda_P * PRS * CollateralVuln + lambda_market;
  return Math.min(0.95, clamp(LGD_new, LGD_base, 0.95));
};

/**
 * Calculate ECL for a single scenario
 * ECL = PD * LGD * EAD
 */
const calculateECL_Scenario = (PD, LGD, EAD) => {
  return PD * LGD * EAD;
};

/**
 * Calculate scenario-weighted ECL
 * ECL_weighted = Σ(w_scn * PD_scn * LGD_scn * EAD)
 */
export const calculateECL = (
  PD_base,
  LGD_base,
  EAD_usd,
  TRS_adj,
  PRS,
  RI_star,
  CollateralVuln = 0.5
) => {
  // Calculate PD and LGD for each scenario
  const scenarios = ['orderly', 'disorderly', 'hothouse'];
  
  // Scenario-specific RI adjustments (simplified: orderly < base < hothouse)
  const RI_adjustments = {
    orderly: RI_star * 0.85,
    disorderly: RI_star * 1.15,
    hothouse: RI_star * 1.35
  };
  
  let ECL_weighted = 0;
  const scenario_breakdown = {};
  
  scenarios.forEach(scenario => {
    const RI_scn = RI_adjustments[scenario];
    const PD_scn = calculatePD_Exponential(PD_base, RI_scn);
    const LGD_scn = calculateLGD(LGD_base, PRS, CollateralVuln, scenario);
    const ECL_scn = calculateECL_Scenario(PD_scn, LGD_scn, EAD_usd);
    
    ECL_weighted += SCENARIO_WEIGHTS[scenario] * ECL_scn;
    
    scenario_breakdown[scenario] = {
      weight: SCENARIO_WEIGHTS[scenario],
      PD: parseFloat(PD_scn.toFixed(4)),
      LGD: parseFloat(LGD_scn.toFixed(4)),
      ECL_usd: parseFloat(ECL_scn.toFixed(0))
    };
  });
  
  // Baseline ECL (without climate adjustment)
  const ECL_baseline = PD_base * LGD_base * EAD_usd;
  
  return {
    ECL_baseline_usd: parseFloat(ECL_baseline.toFixed(0)),
    ECL_weighted_usd: parseFloat(ECL_weighted.toFixed(0)),
    ECL_increase_usd: parseFloat((ECL_weighted - ECL_baseline).toFixed(0)),
    ECL_increase_pct: ((ECL_weighted / ECL_baseline - 1) * 100).toFixed(1) + '%',
    scenario_breakdown
  };
};

/**
 * Calculate RWA with climate adjustment (ICAAP approach)
 * RWA_climate = EAD * rw_base * (1 + β_climate * RI* * Maturity_Factor)
 * β_climate = 0.30
 * Maturity_Factor = 1 + 0.05 * (tenor_years - 1)
 */
export const calculateRWA = (
  EAD_usd,
  rw_base = 0.75,
  RI_star,
  tenor_years = 8,
  beta_climate = 0.30
) => {
  const Maturity_Factor = 1 + 0.05 * (tenor_years - 1);
  const RWA_base = EAD_usd * rw_base;
  const RWA_climate = EAD_usd * rw_base * (1 + beta_climate * RI_star * Maturity_Factor);
  
  return {
    RWA_base_usd: parseFloat(RWA_base.toFixed(0)),
    RWA_climate_usd: parseFloat(RWA_climate.toFixed(0)),
    RWA_increase_usd: parseFloat((RWA_climate - RWA_base).toFixed(0)),
    RWA_increase_pct: ((RWA_climate / RWA_base - 1) * 100).toFixed(1) + '%',
    maturity_factor: Maturity_Factor.toFixed(2),
    tenor_years
  };
};

/**
 * Main function: Calculate all financial impacts
 */
export const calculateFinancialImpact = (formData, TRS_adj, PRS, RI_star) => {
  const { finance = {} } = formData;
  
  const PD_base = finance.pd_base || 0.03;
  const LGD_base = finance.lgd_base || 0.40;
  const EAD_usd = finance.ead_usd || finance.total_debt_usd || 0;
  const rw_base = finance.rw_base || 0.75;
  const tenor_years = finance.tenor_years || 8;
  const CollateralVuln = finance.collateral_vulnerability || 0.5;
  
  // Calculate ECL
  const ecl_result = calculateECL(
    PD_base,
    LGD_base,
    EAD_usd,
    TRS_adj,
    PRS,
    RI_star,
    CollateralVuln
  );
  
  // Calculate RWA
  const rwa_result = calculateRWA(
    EAD_usd,
    rw_base,
    RI_star,
    tenor_years
  );
  
  return {
    PD_base: PD_base.toFixed(4),
    ...ecl_result.scenario_breakdown,
    LGD_base: LGD_base.toFixed(4),
    ...ecl_result,
    ...rwa_result,
    EAD_usd: EAD_usd.toFixed(0)
  };
};

export default {
  calculateFinancialImpact,
  calculatePD_Exponential,
  calculatePD_Linear,
  calculateLGD,
  calculateECL,
  calculateRWA,
  SCENARIO_WEIGHTS
};
