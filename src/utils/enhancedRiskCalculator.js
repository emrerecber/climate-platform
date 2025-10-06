// Enhanced Risk Calculator - PDF döküman metodolojisine göre
// STEP-by-STEP Implementation of Climate Financial Impact Framework

class EnhancedRiskCalculator {
  constructor() {
    // Calibration Parameters (Step E)
    this.params = {
      eta: 0.3,           // EBITDA shock coefficient
      gamma: 0.25,        // Spread shock coefficient  
      lambda_P: 0.4,      // Physical risk coefficient
      lambda_LGD: 0.3,    // LGD adjustment coefficient
      eta_PD: 0.5,        // PD adjustment coefficient
      w_T: 0.6,           // Transition risk weight
      w_P: 0.4,           // Physical risk weight
      theta: 0.3          // PACTA technology gap multiplier
    };

    // Scenario Data (NGFS v5 example values)
    this.scenarioData = {
      'orderly_2030': {
        carbon_price: 150,      // QAR/tCO2e
        energy_price_delta: 30, // QAR/MWh
        gdp_growth: 0.02,
        sector_deltas: {
          'Finans': -0.02,
          'Enerji': -0.15,
          'Sanayi': -0.08,
          'Otomotiv': -0.12,
          'Altyapı': -0.05
        }
      },
      'disorderly_2030': {
        carbon_price: 300,
        energy_price_delta: 70,
        gdp_growth: -0.01,
        sector_deltas: {
          'Finans': -0.05,
          'Enerji': -0.25,
          'Sanayi': -0.15,
          'Otomotiv': -0.20,
          'Altyapı': -0.08
        }
      },
      'hothouse_2030': {
        carbon_price: 50,
        energy_price_delta: 100,
        gdp_growth: -0.03,
        sector_deltas: {
          'Finans': -0.08,
          'Enerji': -0.10,
          'Sanayi': -0.12,
          'Otomotiv': -0.08,
          'Altyapı': -0.15
        }
      }
    };
  }

  // STEP A: Portfolio Mapping & Horizons
  mapPortfolio(exposure) {
    return {
      counterparty_id: exposure.id || 'unknown',
      facility_id: exposure.facility_id || exposure.id,
      product_type: this.mapProductType(exposure.type),
      ngfs_sector: this.mapNGFSSector(exposure.sector),
      pacta_tech: this.isPACTASector(exposure.sector),
      country_iso: exposure.country || 'QA',
      facility_geocode: exposure.geocode || { lat: 25.3548, lon: 51.1839 },
      currency: exposure.currency || 'QAR',
      ead: exposure.loan || exposure.creditAmount || 0,
      pd_base: exposure.pd_base || 0.03,
      lgd_base: exposure.lgd_base || 0.45
    };
  }

  // STEP B: EBITDA Bridge Calculation (Transition Risk)
  calculateEBITDABridge(formData, scenario = 'orderly_2030') {
    const scenarioParams = this.scenarioData[scenario];
    
    // 1. Carbon Cost
    const scope1Emissions = parseFloat(formData.scope1Emissions) || 0;
    const carbonCost = scope1Emissions * scenarioParams.carbon_price;
    
    // 2. Electricity Cost
    const electricityConsumption = parseFloat(formData.totalEnergyConsumption) || 0;
    const electricityCost = electricityConsumption * scenarioParams.energy_price_delta;
    
    // 3. Demand Impact
    const revenue = parseFloat(formData.annualRevenue) * 1000000; // Million to QAR
    const sectorDelta = scenarioParams.sector_deltas[formData.sector] || 0;
    const passThrough = this.getPassThroughRate(formData.sector);
    const demandImpact = Math.abs(revenue * sectorDelta * (1 - passThrough));
    
    // 4. Total EBITDA Shock
    const totalShock = carbonCost + electricityCost + demandImpact;
    const baseEBITDA = revenue * 0.15; // Assume 15% EBITDA margin
    const shockPercentage = totalShock / baseEBITDA;
    
    // 5. Normalize to TRS (0-1)
    const trs = Math.min(1, Math.max(0, shockPercentage / 0.8)); // Max 80% shock = 1.0 TRS
    
    return {
      carbonCost,
      electricityCost, 
      demandImpact,
      totalShock,
      baseEBITDA,
      shockPercentage: shockPercentage * 100,
      trs: parseFloat(trs.toFixed(3)),
      details: {
        scenario,
        carbonPrice: scenarioParams.carbon_price,
        energyPriceDelta: scenarioParams.energy_price_delta,
        sectorDelta: sectorDelta * 100,
        passThrough: passThrough * 100
      }
    };
  }

  // STEP C: Physical Risk Score Calculation
  calculatePhysicalRisk(formData, scenario = 'orderly_2030') {
    let prs_base = 0;
    
    // Hazard-level scores
    const floodScore = this.getHazardScore(formData.floodRisk, 'flood');
    const droughtScore = this.getHazardScore(formData.droughtRisk, 'drought');  
    const heatScore = this.getHazardScore(formData.heatWaveRisk, 'heat');
    
    // Aggregate (max for single-point-failure, weighted avg for diversified)
    prs_base = Math.max(floodScore, droughtScore, heatScore);
    
    // Water/flood intensifier (Aqueduct)
    const waterStressIndex = 0.65; // Turkey average
    const beta = 0.3;
    const prs_new = prs_base * (1 + beta * waterStressIndex);
    
    return {
      prs_base: parseFloat(prs_base.toFixed(3)),
      prs_new: parseFloat(Math.min(1, prs_new).toFixed(3)),
      hazardBreakdown: {
        flood: floodScore,
        drought: droughtScore,
        heat: heatScore
      },
      waterStressAdjustment: {
        index: waterStressIndex,
        multiplier: (1 + beta * waterStressIndex).toFixed(2)
      }
    };
  }

  // STEP D: PACTA Technology Alignment
  calculatePACTAAlignment(formData) {
    if (!this.isPACTASector(formData.sector)) {
      return { applicable: false };
    }

    let gap = 0; // % misalignment
    
    if (formData.sector === 'Enerji') {
      const totalCapacity = parseFloat(formData.totalInstalledCapacity) || 1;
      const renewableCapacity = this.calculateRenewableCapacity(formData);
      const actualRenewableShare = renewableCapacity / totalCapacity;
      const benchmarkShare = 0.7; // 70% renewable by 2030 in 1.5°C scenario
      
      gap = Math.max(0, (benchmarkShare - actualRenewableShare) / benchmarkShare);
    }
    
    if (formData.sector === 'Otomotiv') {
      const totalProduction = parseFloat(formData.annualTotalProduction) || 1;
      const evProduction = this.calculateEVProduction(formData);
      const actualEVShare = evProduction / totalProduction;
      const benchmarkEVShare = 0.5; // 50% EV by 2030
      
      gap = Math.max(0, (benchmarkEVShare - actualEVShare) / benchmarkEVShare);
    }

    return {
      applicable: true,
      gap: parseFloat(gap.toFixed(3)),
      gapPercentage: parseFloat((gap * 100).toFixed(1)),
      benchmark: this.getPACTABenchmark(formData.sector),
      actual: this.getPACTAActual(formData)
    };
  }

  // STEP E: Risk Index Combination
  calculateRiskIndex(trs, prs, formData) {
    // Basic combination
    const ri = this.params.w_T * trs + this.params.w_P * prs;
    
    // Apply sensitivity tags
    let tagMultiplier = 1;
    const tags = this.getSensitivityTags(formData);
    
    tags.forEach(tag => {
      tagMultiplier += tag.alpha * tag.value;
    });
    
    const ri_adjusted = ri * tagMultiplier;
    
    return {
      ri: parseFloat(ri.toFixed(3)),
      ri_adjusted: parseFloat(Math.min(1, ri_adjusted).toFixed(3)),
      trs,
      prs,
      weights: { transition: this.params.w_T, physical: this.params.w_P },
      sensitivityTags: tags,
      tagMultiplier: parseFloat(tagMultiplier.toFixed(2))
    };
  }

  // STEP E: Financial Stress Mapping
  mapToFinancialStresses(ri_adjusted) {
    const sigmoid = (x) => 1 / (1 + Math.exp(-5 * (x - 0.5))); // S-curve
    const sig_ri = sigmoid(ri_adjusted);
    
    return {
      ebitda_shock_pct: parseFloat((-this.params.eta * sig_ri * 100).toFixed(2)),
      spread_shock_bps: parseFloat((this.params.gamma * sig_ri * 10000).toFixed(0)),
      collateral_haircut_pct: parseFloat((Math.min(95, this.params.lambda_P * ri_adjusted * 100)).toFixed(2))
    };
  }

  // STEP F: Product-Specific Financial Translation
  translateToFinancialMetrics(ri_adjusted, prs, exposure, maturityCategory) {
    const stresses = this.mapToFinancialStresses(ri_adjusted);
    
    // Climate maturity multiplier
    let maturityMultiplier = 1;
    if (maturityCategory === 'pre_2030') maturityMultiplier = 0;
    else if (maturityCategory === '2030_2039') maturityMultiplier = 1.2;  
    else if (maturityCategory === 'post_2040') maturityMultiplier = 1.4;

    // PD and LGD adjustments
    const pd_new = exposure.pd_base * (1 + this.params.eta_PD * ri_adjusted * maturityMultiplier);
    const collateralVuln = this.getCollateralVulnerability(exposure);
    const lgd_new = Math.min(0.95, exposure.lgd_base + this.params.lambda_LGD * prs * collateralVuln);
    
    // ECL calculation
    const ecl = exposure.ead * pd_new * lgd_new;
    
    return {
      pd_base: exposure.pd_base,
      pd_new: parseFloat(pd_new.toFixed(4)),
      pd_uplift_pct: parseFloat(((pd_new / exposure.pd_base - 1) * 100).toFixed(2)),
      
      lgd_base: exposure.lgd_base,
      lgd_new: parseFloat(lgd_new.toFixed(3)),
      lgd_uplift_pct: parseFloat(((lgd_new / exposure.lgd_base - 1) * 100).toFixed(2)),
      
      ecl_qar: parseFloat(ecl.toFixed(0)),
      ecl_bps: parseFloat((ecl / exposure.ead * 10000).toFixed(1)),
      
      maturity_category: maturityCategory,
      maturity_multiplier: maturityMultiplier,
      
      stresses
    };
  }

  // Master calculation method
  calculateEnhancedRisk(formData, scenario = 'orderly_2030', maturityCategory = '2030_2039') {
    try {
      // Step A: Map portfolio
      const exposure = this.mapPortfolio(formData);
      
      // Step B: EBITDA Bridge → TRS
      const transitionAnalysis = this.calculateEBITDABridge(formData, scenario);
      
      // Step C: Physical Risk → PRS  
      const physicalAnalysis = this.calculatePhysicalRisk(formData, scenario);
      
      // Step D: PACTA Alignment
      const pactaAnalysis = this.calculatePACTAAlignment(formData);
      
      // Adjust TRS for PACTA gap
      let trs_adjusted = transitionAnalysis.trs;
      if (pactaAnalysis.applicable) {
        trs_adjusted = transitionAnalysis.trs * (1 + this.params.theta * pactaAnalysis.gap);
        trs_adjusted = Math.min(1, trs_adjusted);
      }
      
      // Step E: Risk Index
      const riskIndex = this.calculateRiskIndex(trs_adjusted, physicalAnalysis.prs_new, formData);
      
      // Step F: Financial Translation
      const financialMetrics = this.translateToFinancialMetrics(
        riskIndex.ri_adjusted, 
        physicalAnalysis.prs_new, 
        exposure, 
        maturityCategory
      );
      
      return {
        success: true,
        scenario,
        exposure,
        transition: {
          ...transitionAnalysis,
          trs_adjusted: parseFloat(trs_adjusted.toFixed(3))
        },
        physical: physicalAnalysis,
        pacta: pactaAnalysis,
        riskIndex,
        financial: financialMetrics,
        summary: {
          totalRisk: parseFloat(((trs_adjusted + physicalAnalysis.prs_new) / 2).toFixed(2)),
          riskCategory: this.getRiskCategory(riskIndex.ri_adjusted),
          expectedLoss: financialMetrics.ecl_qar,
          riskContribution: {
            transition: parseFloat((trs_adjusted * 100).toFixed(1)),
            physical: parseFloat((physicalAnalysis.prs_new * 100).toFixed(1))
          }
        }
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: 'Enhanced risk calculation failed'
      };
    }
  }

  // Utility Methods
  mapProductType(type) {
    const mapping = {
      'sme_loan': 'SME/Corporate Lending',
      'project_finance': 'Project Finance', 
      'syndicated': 'Syndicated Loans',
      'exim': 'EXIM/Trade Finance',
      'guarantee': 'Guarantees',
      'bond': 'Securities'
    };
    return mapping[type] || 'Other';
  }

  mapNGFSSector(sector) {
    const mapping = {
      'Finans': 'Financial Services',
      'Enerji': 'Power',
      'Sanayi': 'Industry', 
      'Otomotiv': 'Transport',
      'Altyapı': 'Buildings & Infrastructure',
      'Telekomünikasyon': 'Other Services',
      'Dayanıklı Tüketim': 'Other Industry',
      'Lojistik': 'Transport'
    };
    return mapping[sector] || 'Other';
  }

  isPACTASector(sector) {
    return ['Enerji', 'Otomotiv', 'Sanayi'].includes(sector);
  }

  getPassThroughRate(sector) {
    const rates = {
      'Finans': 0.8,
      'Enerji': 0.3,
      'Sanayi': 0.4,
      'Otomotiv': 0.2,
      'Altyapı': 0.6,
      'Telekomünikasyon': 0.7,
      'Dayanıklı Tüketim': 0.5,
      'Lojistik': 0.3
    };
    return rates[sector] || 0.4;
  }

  getHazardScore(riskLevel, hazardType) {
    const scores = {
      'low': 0.2,
      'medium': 0.6, 
      'high': 1.0
    };
    return scores[riskLevel] || 0.5;
  }

  calculateRenewableCapacity(formData) {
    return (parseFloat(formData.windCapacity) || 0) +
           (parseFloat(formData.solarCapacity) || 0) +
           (parseFloat(formData.hydroCapacity) || 0) +
           (parseFloat(formData.biomassCapacity) || 0) +
           (parseFloat(formData.geothermalCapacity) || 0);
  }

  calculateEVProduction(formData) {
    return (parseFloat(formData.bevProduction) || 0) +
           (parseFloat(formData.phevProduction) || 0) +
           (parseFloat(formData.fcevProduction) || 0);
  }

  getPACTABenchmark(sector) {
    const benchmarks = {
      'Enerji': { metric: 'Renewable Share', target: '70%', year: '2030' },
      'Otomotiv': { metric: 'EV Share', target: '50%', year: '2030' },
      'Sanayi': { metric: 'Low-Carbon Production', target: '40%', year: '2030' }
    };
    return benchmarks[sector] || null;
  }

  getPACTAActual(formData) {
    if (formData.sector === 'Enerji') {
      const total = parseFloat(formData.totalInstalledCapacity) || 1;
      const renewable = this.calculateRenewableCapacity(formData);
      return { 
        metric: 'Renewable Share', 
        value: parseFloat(((renewable / total) * 100).toFixed(1)) + '%'
      };
    }
    
    if (formData.sector === 'Otomotiv') {
      const total = parseFloat(formData.annualTotalProduction) || 1;
      const ev = this.calculateEVProduction(formData);
      return {
        metric: 'EV Share',
        value: parseFloat(((ev / total) * 100).toFixed(1)) + '%'
      };
    }
    
    return null;
  }

  getSensitivityTags(formData) {
    const tags = [];
    
    // Water dependency
    if (['Enerji', 'Sanayi'].includes(formData.sector)) {
      tags.push({ name: 'Water Dependency', alpha: 0.1, value: 1 });
    }
    
    // Asset stranding risk
    if (formData.sector === 'Enerji' && (parseFloat(formData.coalCapacity) || 0) > 0) {
      tags.push({ name: 'Stranded Assets', alpha: 0.15, value: 1 });
    }
    
    // Collateral vulnerability 
    if (formData.operationalLocations && formData.operationalLocations.includes('coastal')) {
      tags.push({ name: 'Collateral Vulnerability', alpha: 0.12, value: 1 });
    }
    
    return tags;
  }

  getCollateralVulnerability(exposure) {
    // Simple vulnerability assessment
    if (exposure.ngfs_sector === 'Power') return 0.7;
    if (exposure.ngfs_sector === 'Buildings & Infrastructure') return 0.8;
    if (exposure.ngfs_sector === 'Transport') return 0.5;
    return 0.3;
  }

  getRiskCategory(riskIndex) {
    if (riskIndex < 0.3) return 'Low';
    if (riskIndex < 0.7) return 'Medium';
    return 'High';
  }
}

export default EnhancedRiskCalculator;