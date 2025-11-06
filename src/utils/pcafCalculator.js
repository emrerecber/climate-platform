/**
 * PCAF (Partnership for Carbon Accounting Financials) Calculator
 * Financed Emissions Methodology
 * 
 * Version: 2.0 ECB/IFRS S2 Aligned
 */

/**
 * Calculate Attribution Factor
 * Attribution = Outstanding Amount / EVIC
 * EVIC = Equity Market Value + Total Debt
 */
export const calculateAttribution = (outstanding_amount_usd, equity_market_value_usd, total_debt_usd) => {
  const EVIC = equity_market_value_usd + total_debt_usd;
  
  if (EVIC === 0) {
    return {
      attribution: 0,
      EVIC_usd: 0,
      data_quality: 'Poor - EVIC is zero'
    };
  }
  
  const attribution = outstanding_amount_usd / EVIC;
  
  return {
    attribution: Math.min(1.0, attribution), // Cap at 100%
    EVIC_usd: EVIC,
    outstanding_amount_usd,
    equity_market_value_usd,
    total_debt_usd
  };
};

/**
 * Calculate Financed Emissions
 * Financed_S1 = Borrower_S1 * Attribution
 * Financed_S2 = Borrower_S2 * Attribution
 * Financed_S3 = Borrower_S3 * Attribution (optional)
 */
export const calculateFinancedEmissions = (
  scope1_tco2,
  scope2_tco2,
  scope3_tco2,
  attribution
) => {
  const financed_s1 = scope1_tco2 * attribution;
  const financed_s2 = scope2_tco2 * attribution;
  const financed_s3 = scope3_tco2 * attribution;
  const financed_total = financed_s1 + financed_s2 + financed_s3;
  
  return {
    financed_s1: parseFloat(financed_s1.toFixed(2)),
    financed_s2: parseFloat(financed_s2.toFixed(2)),
    financed_s3: parseFloat(financed_s3.toFixed(2)),
    financed_total: parseFloat(financed_total.toFixed(2))
  };
};

/**
 * Calculate Portfolio Carbon Footprint (PCF)
 * PCF = Financed Emissions / Outstanding Amount (tCO2e per USD million)
 */
export const calculatePortfolioCarbonFootprint = (financed_total_tco2, outstanding_amount_usd) => {
  if (outstanding_amount_usd === 0) {
    return {
      pcf_tco2_per_usd_m: 0,
      data_quality: 'Poor - Outstanding amount is zero'
    };
  }
  
  const pcf = financed_total_tco2 / (outstanding_amount_usd / 1e6);
  
  return {
    pcf_tco2_per_usd_m: parseFloat(pcf.toFixed(2)),
    financed_total_tco2,
    outstanding_amount_usd
  };
};

/**
 * Calculate Weighted Average Carbon Intensity (WACI)
 * WACI = Σ(Investment Value_i / Total Portfolio Value) × Carbon Intensity_i
 * Carbon Intensity = Total Emissions / Revenue (tCO2e per USD million revenue)
 */
export const calculateWACI = (portfolio_assets) => {
  if (!portfolio_assets || portfolio_assets.length === 0) {
    return {
      waci_tco2_per_usd_m_revenue: 0,
      data_quality: 'No portfolio data'
    };
  }
  
  const total_portfolio_value = portfolio_assets.reduce((sum, asset) => sum + asset.outstanding_amount_usd, 0);
  
  if (total_portfolio_value === 0) {
    return {
      waci_tco2_per_usd_m_revenue: 0,
      data_quality: 'Portfolio value is zero'
    };
  }
  
  let waci_sum = 0;
  
  portfolio_assets.forEach(asset => {
    const weight = asset.outstanding_amount_usd / total_portfolio_value;
    const carbon_intensity = (asset.scope1_tco2 + asset.scope2_tco2) / (asset.revenue_usd / 1e6);
    waci_sum += weight * carbon_intensity;
  });
  
  return {
    waci_tco2_per_usd_m_revenue: parseFloat(waci_sum.toFixed(2)),
    total_portfolio_value_usd: total_portfolio_value,
    number_of_assets: portfolio_assets.length
  };
};

/**
 * Main PCAF Calculation
 */
export const calculatePCAF = (formData) => {
  const { finance = {}, emissions = {}, company = {} } = formData;
  
  // Attribution
  const attribution_result = calculateAttribution(
    finance.ead_usd || finance.total_debt_usd || 0,
    finance.equity_market_value_usd || 0,
    finance.total_debt_usd || 0
  );
  
  // Financed emissions
  const scope1 = emissions.scope1_tco2 || 0;
  const scope2 = emissions.scope2_market_tco2 || emissions.scope2_location_tco2 || emissions.scope2_tco2 || 0;
  const scope3_total = emissions.scope3 ? Object.values(emissions.scope3).reduce((a, b) => a + b, 0) : 0;
  
  const financed_emissions = calculateFinancedEmissions(
    scope1,
    scope2,
    scope3_total,
    attribution_result.attribution
  );
  
  // Portfolio Carbon Footprint
  const pcf_result = calculatePortfolioCarbonFootprint(
    financed_emissions.financed_total,
    attribution_result.outstanding_amount_usd
  );
  
  return {
    attribution: attribution_result,
    financed_emissions,
    portfolio_carbon_footprint: pcf_result,
    borrower_emissions: {
      scope1,
      scope2,
      scope3: scope3_total,
      total: scope1 + scope2 + scope3_total
    },
    data_quality_score: calculateDataQualityScore(formData)
  };
};

/**
 * PCAF Data Quality Score (1-5 scale)
 * 1 = Highest quality (audited, reported)
 * 5 = Lowest quality (estimated, proxied)
 */
const calculateDataQualityScore = (formData) => {
  const { emissions = {}, finance = {} } = formData;
  
  let score = 1; // Start with best
  
  // Check emissions data
  if (!emissions.scope1_tco2 || emissions.scope1_tco2 === 0) score += 1;
  if (!emissions.scope2_tco2) score += 0.5;
  if (!emissions.scope3 || Object.keys(emissions.scope3).length === 0) score += 1;
  
  // Check financial data
  if (!finance.equity_market_value_usd) score += 0.5;
  if (!finance.revenue_usd) score += 0.5;
  
  return Math.min(5, Math.round(score));
};

export default {
  calculatePCAF,
  calculateAttribution,
  calculateFinancedEmissions,
  calculatePortfolioCarbonFootprint,
  calculateWACI
};
