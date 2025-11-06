/**
 * CBAM (Carbon Border Adjustment Mechanism) Calculator
 * EU Carbon Border Tax Calculator
 * 
 * Version: 1.0
 * Last Updated: 2025-11-03
 */

/**
 * Calculate CBAM Cost
 * CBAM_Cost = Embedded_Emissions × (EU_Price - Origin_Price) × Export_Volume
 * 
 * @param {number} embedded_emissions_tco2 - Carbon content per unit
 * @param {number} eu_price - EU ETS carbon price (USD/tCO2)
 * @param {number} origin_price - Origin country carbon price (USD/tCO2)
 * @param {number} export_volume_units - Number of units exported to EU
 * @returns {object} CBAM cost breakdown
 */
export const calculateCBAMCost = (
  embedded_emissions_tco2,
  eu_price = 85,
  origin_price = 20,
  export_volume_units
) => {
  const price_differential = eu_price - origin_price;
  const cbam_cost_per_unit = embedded_emissions_tco2 * price_differential;
  const total_cbam_cost = cbam_cost_per_unit * export_volume_units;
  
  return {
    embedded_emissions_tco2,
    eu_carbon_price_usd: eu_price,
    origin_carbon_price_usd: origin_price,
    price_differential_usd: price_differential,
    export_volume_units,
    cbam_cost_per_unit_usd: parseFloat(cbam_cost_per_unit.toFixed(2)),
    total_cbam_cost_usd: parseFloat(total_cbam_cost.toFixed(0)),
    as_pct_of_export_value: null // To be calculated if export value provided
  };
};

/**
 * Calculate CBAM as percentage of export value
 */
export const calculateCBAMImpact = (cbam_cost_usd, export_value_usd) => {
  if (export_value_usd === 0) {
    return {
      cbam_as_pct_export_value: 'N/A',
      materiality: 'Unknown'
    };
  }
  
  const percentage = (cbam_cost_usd / export_value_usd) * 100;
  
  let materiality;
  if (percentage < 2) materiality = 'Low';
  else if (percentage < 5) materiality = 'Medium';
  else materiality = 'High';
  
  return {
    cbam_as_pct_export_value: percentage.toFixed(2) + '%',
    materiality,
    export_value_usd,
    cbam_cost_usd
  };
};

/**
 * Main CBAM calculation from formData
 */
export const calculateCBAM = (formData) => {
  const { cbam = {}, finance = {} } = formData;
  
  if (!cbam.embedded_emissions_tco2 || !cbam.export_volume_units) {
    return {
      applicable: false,
      reason: 'No CBAM data provided or no EU exports'
    };
  }
  
  const cost_result = calculateCBAMCost(
    cbam.embedded_emissions_tco2 || 0,
    cbam.eu_price || 85,
    cbam.origin_price || 20,
    cbam.export_volume_units || 0
  );
  
  const impact_result = calculateCBAMImpact(
    cost_result.total_cbam_cost_usd,
    cbam.export_value_usd || finance.revenue_usd * 0.30 // Assume 30% exports if not specified
  );
  
  return {
    applicable: true,
    ...cost_result,
    impact: impact_result,
    recommendations: generateCBAMRecommendations(impact_result.materiality)
  };
};

/**
 * Generate CBAM mitigation recommendations
 */
const generateCBAMRecommendations = (materiality) => {
  const recommendations = [];
  
  if (materiality === 'High') {
    recommendations.push({
      priority: 'Critical',
      action: 'Reduce product carbon intensity',
      description: 'CBAM cost >5% of export value threatens competitiveness'
    });
    recommendations.push({
      priority: 'High',
      action: 'Explore alternative markets or production locations',
      description: 'Consider shifting production to regions with carbon pricing'
    });
  } else if (materiality === 'Medium') {
    recommendations.push({
      priority: 'Medium',
      action: 'Monitor CBAM developments and optimize carbon efficiency',
      description: 'CBAM cost 2-5% of export value requires attention'
    });
  }
  
  recommendations.push({
    priority: 'Low',
    action: 'Maintain accurate carbon accounting',
    description: 'Ensure embedded emissions data is auditable for CBAM compliance'
  });
  
  return recommendations;
};

export default {
  calculateCBAM,
  calculateCBAMCost,
  calculateCBAMImpact
};
