/**
 * Forward-Looking Metrics Calculator
 * Calculates 2030/2040/2050 pathway projections for emissions and climate metrics
 * Based on IEA Net Zero scenarios and sector-specific decarbonization curves
 */

/**
 * IEA Sector Decarbonization Pathways
 * Percentage reduction from 2020 baseline
 */
const SECTOR_DECARBONIZATION_CURVES = {
  NZE2050: {
    // Net Zero by 2050 (1.5°C pathway)
    energy: {
      2025: 15,
      2030: 40,
      2035: 60,
      2040: 75,
      2045: 88,
      2050: 95
    },
    automotive: {
      2025: 20,
      2030: 50,
      2035: 70,
      2040: 85,
      2045: 95,
      2050: 98
    },
    steel: {
      2025: 10,
      2030: 30,
      2035: 50,
      2040: 70,
      2045: 85,
      2050: 95
    },
    cement: {
      2025: 8,
      2030: 25,
      2035: 45,
      2040: 65,
      2045: 80,
      2050: 90
    },
    aviation: {
      2025: 5,
      2030: 15,
      2035: 35,
      2040: 55,
      2045: 75,
      2050: 90
    },
    realEstate: {
      2025: 18,
      2030: 45,
      2035: 65,
      2040: 80,
      2045: 90,
      2050: 98
    },
    default: {
      2025: 12,
      2030: 35,
      2035: 55,
      2040: 70,
      2045: 85,
      2050: 95
    }
  },
  SDS: {
    // Sustainable Development Scenario (Well below 2°C)
    energy: {
      2025: 10,
      2030: 30,
      2035: 45,
      2040: 60,
      2045: 70,
      2050: 80
    },
    automotive: {
      2025: 15,
      2030: 35,
      2035: 55,
      2040: 70,
      2045: 80,
      2050: 85
    },
    steel: {
      2025: 8,
      2030: 20,
      2035: 35,
      2040: 50,
      2045: 65,
      2050: 75
    },
    cement: {
      2025: 5,
      2030: 18,
      2035: 32,
      2040: 48,
      2045: 60,
      2050: 70
    },
    aviation: {
      2025: 3,
      2030: 10,
      2035: 22,
      2040: 38,
      2045: 55,
      2050: 70
    },
    realEstate: {
      2025: 12,
      2030: 32,
      2035: 50,
      2040: 65,
      2045: 75,
      2050: 85
    },
    default: {
      2025: 8,
      2030: 25,
      2035: 40,
      2040: 55,
      2045: 68,
      2050: 78
    }
  },
  STEPS: {
    // Stated Policies Scenario (>2.5°C)
    energy: {
      2025: 5,
      2030: 15,
      2035: 25,
      2040: 35,
      2045: 42,
      2050: 50
    },
    automotive: {
      2025: 8,
      2030: 18,
      2035: 30,
      2040: 42,
      2045: 52,
      2050: 60
    },
    steel: {
      2025: 4,
      2030: 10,
      2035: 18,
      2040: 28,
      2045: 38,
      2050: 48
    },
    cement: {
      2025: 2,
      2030: 8,
      2035: 15,
      2040: 25,
      2045: 35,
      2050: 45
    },
    aviation: {
      2025: 1,
      2030: 5,
      2035: 12,
      2040: 22,
      2045: 32,
      2050: 42
    },
    realEstate: {
      2025: 6,
      2030: 18,
      2035: 30,
      2040: 42,
      2045: 52,
      2050: 60
    },
    default: {
      2025: 4,
      2030: 12,
      2035: 22,
      2040: 32,
      2045: 42,
      2050: 52
    }
  }
};

/**
 * Carbon Budget Allocation (GtCO2)
 * Remaining budget for 1.5°C, 1.8°C, and 2.5°C pathways
 */
const CARBON_BUDGETS = {
  celsius_1_5: {
    total_2020: 400,  // GtCO2 from 2020
    annual_2020: 36.4,
    remaining_2025: 350,
    remaining_2030: 280,
    remaining_2040: 100,
    remaining_2050: 0
  },
  celsius_1_8: {
    total_2020: 650,
    annual_2020: 36.4,
    remaining_2025: 580,
    remaining_2030: 480,
    remaining_2040: 220,
    remaining_2050: 50
  },
  celsius_2_5: {
    total_2020: 1150,
    annual_2020: 36.4,
    remaining_2025: 1050,
    remaining_2030: 920,
    remaining_2040: 580,
    remaining_2050: 320
  }
};

/**
 * Calculate emissions trajectory from current year to 2050
 * Uses exponential decay for realistic transition
 */
export const calculateEmissionsTrajectory = (currentEmissions, targetYear, reductionTarget, sector = 'default', scenario = 'NZE2050') => {
  const currentYear = new Date().getFullYear();
  const baselineYear = 2020;
  
  // Get decarbonization curve for sector and scenario
  const curve = SECTOR_DECARBONIZATION_CURVES[scenario]?.[sector] || 
                SECTOR_DECARBONIZATION_CURVES[scenario]?.default ||
                SECTOR_DECARBONIZATION_CURVES.NZE2050.default;
  
  const trajectory = [];
  const milestones = [currentYear, 2025, 2030, 2035, 2040, 2045, 2050];
  
  milestones.forEach(year => {
    if (year >= currentYear) {
      let reductionPercent = 0;
      
      if (curve[year]) {
        reductionPercent = curve[year];
      } else {
        // Interpolate between known points
        const yearsBefore = Object.keys(curve).filter(y => parseInt(y) < year).map(y => parseInt(y));
        const yearsAfter = Object.keys(curve).filter(y => parseInt(y) > year).map(y => parseInt(y));
        
        if (yearsBefore.length > 0 && yearsAfter.length > 0) {
          const beforeYear = Math.max(...yearsBefore);
          const afterYear = Math.min(...yearsAfter);
          const beforeReduction = curve[beforeYear];
          const afterReduction = curve[afterYear];
          
          // Linear interpolation
          const fraction = (year - beforeYear) / (afterYear - beforeYear);
          reductionPercent = beforeReduction + fraction * (afterReduction - beforeReduction);
        }
      }
      
      const emissions = currentEmissions * (1 - reductionPercent / 100);
      const cumulativeReduction = currentEmissions - emissions;
      
      trajectory.push({
        year,
        emissions: Math.round(emissions),
        reductionPercent: Math.round(reductionPercent * 10) / 10,
        cumulativeReduction: Math.round(cumulativeReduction),
        intensity: null  // Will be calculated if revenue data available
      });
    }
  });
  
  return trajectory;
};

/**
 * Calculate required annual reduction rate
 * Linear vs exponential pathways
 */
export const calculateRequiredReductionRate = (currentEmissions, targetEmissions, currentYear, targetYear) => {
  const years = targetYear - currentYear;
  const totalReduction = currentEmissions - targetEmissions;
  
  // Linear reduction
  const linearAnnualReduction = totalReduction / years;
  const linearAnnualRate = (linearAnnualReduction / currentEmissions) * 100;
  
  // Exponential reduction (more realistic)
  // Formula: future = current * (1 - rate)^years
  const exponentialRate = (1 - Math.pow(targetEmissions / currentEmissions, 1 / years)) * 100;
  
  return {
    linear: {
      annualReduction: Math.round(linearAnnualReduction),
      annualRate: Math.round(linearAnnualRate * 100) / 100,
      feasibility: linearAnnualRate < 3 ? 'Achievable' : linearAnnualRate < 7 ? 'Challenging' : 'Very Ambitious'
    },
    exponential: {
      annualRate: Math.round(exponentialRate * 100) / 100,
      firstYearReduction: Math.round(currentEmissions * exponentialRate / 100),
      feasibility: exponentialRate < 5 ? 'Achievable' : exponentialRate < 10 ? 'Challenging' : 'Very Ambitious'
    },
    recommended: exponentialRate < 15 ? 'exponential' : 'linear'
  };
};

/**
 * Calculate carbon budget alignment
 * Check if company pathway fits within global carbon budget
 */
export const calculateCarbonBudgetAlignment = (emissionsTrajectory, companyMarketShare = 0.001) => {
  const currentYear = new Date().getFullYear();
  
  // Calculate company's cumulative emissions 2020-2050
  let companyCumulativeEmissions = 0;
  emissionsTrajectory.forEach((point, index) => {
    if (index > 0) {
      const years = point.year - emissionsTrajectory[index - 1].year;
      const avgEmissions = (point.emissions + emissionsTrajectory[index - 1].emissions) / 2;
      companyCumulativeEmissions += (avgEmissions * years) / 1000000; // Convert to MtCO2
    }
  });
  
  // Calculate allowed cumulative emissions based on carbon budget
  const budget_1_5 = CARBON_BUDGETS.celsius_1_5;
  const budget_1_8 = CARBON_BUDGETS.celsius_1_8;
  const budget_2_5 = CARBON_BUDGETS.celsius_2_5;
  
  // Company's "fair share" of remaining budget (very simplified)
  const companyAllowedBudget_1_5 = budget_1_5.remaining_2030 * companyMarketShare;
  const companyAllowedBudget_1_8 = budget_1_8.remaining_2030 * companyMarketShare;
  const companyAllowedBudget_2_5 = budget_2_5.remaining_2030 * companyMarketShare;
  
  return {
    companyCumulativeEmissions: Math.round(companyCumulativeEmissions * 10) / 10,
    alignment: {
      celsius_1_5: {
        allowed: companyAllowedBudget_1_5,
        used: companyCumulativeEmissions,
        percentage: Math.round((companyCumulativeEmissions / companyAllowedBudget_1_5) * 100),
        isAligned: companyCumulativeEmissions <= companyAllowedBudget_1_5
      },
      celsius_1_8: {
        allowed: companyAllowedBudget_1_8,
        used: companyCumulativeEmissions,
        percentage: Math.round((companyCumulativeEmissions / companyAllowedBudget_1_8) * 100),
        isAligned: companyCumulativeEmissions <= companyAllowedBudget_1_8
      },
      celsius_2_5: {
        allowed: companyAllowedBudget_2_5,
        used: companyCumulativeEmissions,
        percentage: Math.round((companyCumulativeEmissions / companyAllowedBudget_2_5) * 100),
        isAligned: companyCumulativeEmissions <= companyAllowedBudget_2_5
      }
    }
  };
};

/**
 * Calculate stranded asset risk over time
 * Assets that may lose value due to climate transition
 */
export const calculateStrandedAssetRisk = (assetData, sector) => {
  const risks = [];
  const currentYear = new Date().getFullYear();
  
  // High-carbon asset phase-out timelines
  const phaseOutTimelines = {
    coal: {
      NZE2050: 2030,
      SDS: 2040,
      STEPS: 2050
    },
    oil_gas: {
      NZE2050: 2040,
      SDS: 2045,
      STEPS: 2060
    },
    ice_vehicles: {
      NZE2050: 2035,
      SDS: 2040,
      STEPS: 2060
    },
    inefficient_buildings: {
      NZE2050: 2035,
      SDS: 2040,
      STEPS: 2050
    }
  };
  
  Object.entries(assetData || {}).forEach(([assetType, assetValue]) => {
    const timeline = phaseOutTimelines[assetType];
    if (timeline) {
      const scenarios = ['NZE2050', 'SDS', 'STEPS'];
      const assetRisk = { assetType, value: assetValue, scenarios: {} };
      
      scenarios.forEach(scenario => {
        const phaseOutYear = timeline[scenario];
        const yearsRemaining = phaseOutYear - currentYear;
        
        let riskLevel = 'Low';
        let residualValue = assetValue;
        
        if (yearsRemaining <= 5) {
          riskLevel = 'Critical';
          residualValue = assetValue * 0.2;
        } else if (yearsRemaining <= 10) {
          riskLevel = 'High';
          residualValue = assetValue * 0.5;
        } else if (yearsRemaining <= 20) {
          riskLevel = 'Medium';
          residualValue = assetValue * 0.7;
        }
        
        assetRisk.scenarios[scenario] = {
          phaseOutYear,
          yearsRemaining,
          riskLevel,
          residualValue,
          potentialLoss: assetValue - residualValue
        };
      });
      
      risks.push(assetRisk);
    }
  });
  
  return risks;
};

/**
 * Calculate forward-looking intensity metrics
 * Emissions per unit of production/revenue over time
 */
export const calculateIntensityPathway = (emissionsTrajectory, growthAssumptions) => {
  const intensityPathway = [];
  
  emissionsTrajectory.forEach(point => {
    const year = point.year;
    const currentYear = new Date().getFullYear();
    const yearsSince = year - currentYear;
    
    // Apply growth assumptions
    let productionGrowth = 1;
    let revenueGrowth = 1;
    
    if (growthAssumptions) {
      const annualProductionGrowth = (growthAssumptions.annualProductionGrowth || 0) / 100;
      const annualRevenueGrowth = (growthAssumptions.annualRevenueGrowth || 2) / 100;
      
      productionGrowth = Math.pow(1 + annualProductionGrowth, yearsSince);
      revenueGrowth = Math.pow(1 + annualRevenueGrowth, yearsSince);
    }
    
    const baseProduction = growthAssumptions?.baseProduction || 1000000;
    const baseRevenue = growthAssumptions?.baseRevenue || 100000000;
    
    const futureProduction = baseProduction * productionGrowth;
    const futureRevenue = baseRevenue * revenueGrowth;
    
    intensityPathway.push({
      year,
      emissions: point.emissions,
      production: Math.round(futureProduction),
      revenue: Math.round(futureRevenue),
      productionIntensity: Math.round((point.emissions / futureProduction) * 1000) / 1000,
      revenueIntensity: Math.round((point.emissions / futureRevenue) * 1000000) / 1000,
      decoupling: point.reductionPercent > (growthAssumptions?.annualRevenueGrowth || 0) * (year - currentYear)
    });
  });
  
  return intensityPathway;
};

/**
 * Main Forward-Looking Metrics Calculator
 */
export const calculateForwardMetrics = (formData) => {
  const currentYear = new Date().getFullYear();
  const currentEmissions = parseFloat(formData.scope1Emissions || 0) + 
                          parseFloat(formData.scope2Emissions || 0);
  
  const targetYear = parseInt(formData.netZeroYear || 2050);
  const sector = formData.sector || formData.pactaSector || 'default';
  
  // Calculate trajectories for each scenario
  const trajectories = {
    NZE2050: calculateEmissionsTrajectory(currentEmissions, 2050, 95, sector, 'NZE2050'),
    SDS: calculateEmissionsTrajectory(currentEmissions, 2050, 78, sector, 'SDS'),
    STEPS: calculateEmissionsTrajectory(currentEmissions, 2050, 52, sector, 'STEPS'),
    current: calculateEmissionsTrajectory(currentEmissions, targetYear, 
      parseFloat(formData.emissionReductionTarget2050 || 80), sector, 'NZE2050')
  };
  
  // Calculate required reduction rates
  const targetEmissions = currentEmissions * (1 - (parseFloat(formData.emissionReductionTarget2050 || 80) / 100));
  const reductionRates = calculateRequiredReductionRate(currentEmissions, targetEmissions, currentYear, targetYear);
  
  // Carbon budget alignment
  const marketShare = parseFloat(formData.globalMarketShare || 0.001);
  const budgetAlignment = calculateCarbonBudgetAlignment(trajectories.current, marketShare);
  
  // Intensity pathways
  const growthAssumptions = {
    baseProduction: parseFloat(formData.annualProduction || 1000000),
    baseRevenue: parseFloat(formData.annualRevenue || 100000000),
    annualProductionGrowth: parseFloat(formData.productionGrowthRate || 2),
    annualRevenueGrowth: parseFloat(formData.revenueGrowthRate || 3)
  };
  const intensityPathway = calculateIntensityPathway(trajectories.current, growthAssumptions);
  
  // Stranded asset risk
  const strandedAssets = calculateStrandedAssetRisk(formData.strandedAssetData, sector);
  
  // Gap analysis
  const gapAnalysis = {
    NZE2050_gap: trajectories.current[trajectories.current.length - 1].emissions - 
                 trajectories.NZE2050[trajectories.NZE2050.length - 1].emissions,
    SDS_gap: trajectories.current[trajectories.current.length - 1].emissions - 
             trajectories.SDS[trajectories.SDS.length - 1].emissions,
    STEPS_gap: trajectories.current[trajectories.current.length - 1].emissions - 
               trajectories.STEPS[trajectories.STEPS.length - 1].emissions
  };
  
  // Determine best-fit scenario
  const gaps = [
    { scenario: 'NZE2050', gap: Math.abs(gapAnalysis.NZE2050_gap) },
    { scenario: 'SDS', gap: Math.abs(gapAnalysis.SDS_gap) },
    { scenario: 'STEPS', gap: Math.abs(gapAnalysis.STEPS_gap) }
  ];
  const bestFit = gaps.reduce((best, current) => current.gap < best.gap ? current : best);
  
  return {
    currentEmissions,
    targetYear,
    targetEmissions,
    sector,
    trajectories,
    reductionRates,
    budgetAlignment,
    intensityPathway,
    strandedAssets,
    gapAnalysis,
    bestFitScenario: bestFit.scenario,
    recommendations: generateForwardLookingRecommendations({
      reductionRates,
      budgetAlignment,
      strandedAssets,
      bestFit,
      sector
    }),
    calculatedAt: new Date().toISOString()
  };
};

/**
 * Generate recommendations based on forward-looking analysis
 */
const generateForwardLookingRecommendations = (analysis) => {
  const recommendations = [];
  
  // Reduction rate recommendations
  if (analysis.reductionRates.exponential.feasibility === 'Very Ambitious') {
    recommendations.push({
      priority: 'Critical',
      category: 'Emission Reduction Rate',
      action: 'Implement aggressive decarbonization roadmap',
      description: `Required ${analysis.reductionRates.exponential.annualRate}% annual reduction is very ambitious. Consider breakthrough technologies and operational transformation.`,
      timeline: 'Immediate'
    });
  }
  
  // Carbon budget recommendations
  if (!analysis.budgetAlignment.alignment.celsius_1_5.isAligned) {
    recommendations.push({
      priority: 'High',
      category: 'Carbon Budget',
      action: 'Accelerate near-term emission reductions',
      description: 'Current trajectory exceeds 1.5°C carbon budget. Front-load emission cuts to 2030.',
      timeline: 'Short-term (2025-2030)'
    });
  }
  
  // Stranded asset recommendations
  const criticalAssets = analysis.strandedAssets.filter(asset => 
    asset.scenarios.NZE2050.riskLevel === 'Critical' || asset.scenarios.NZE2050.riskLevel === 'High'
  );
  
  if (criticalAssets.length > 0) {
    recommendations.push({
      priority: 'High',
      category: 'Stranded Assets',
      action: 'Develop asset transition plan',
      description: `${criticalAssets.length} asset categories at high risk. Plan phase-out or retrofit before value loss.`,
      timeline: 'Medium-term (2025-2035)'
    });
  }
  
  // Scenario alignment recommendations
  if (analysis.bestFit.scenario === 'STEPS') {
    recommendations.push({
      priority: 'Medium',
      category: 'Scenario Alignment',
      action: 'Strengthen climate ambition',
      description: 'Current pathway aligns with >2.5°C scenario. Raise targets to align with Paris Agreement goals.',
      timeline: 'Short-term (2024-2027)'
    });
  }
  
  return recommendations;
};

export default {
  calculateForwardMetrics,
  calculateEmissionsTrajectory,
  calculateRequiredReductionRate,
  calculateCarbonBudgetAlignment,
  calculateStrandedAssetRisk,
  calculateIntensityPathway,
  SECTOR_DECARBONIZATION_CURVES,
  CARBON_BUDGETS
};
