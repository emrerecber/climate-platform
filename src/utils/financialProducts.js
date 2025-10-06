// Financial Products Module - PDF dökümanının Step F implementasyonu
// Product-specific financial translation for different instruments

class FinancialProducts {
  constructor(enhancedCalculator) {
    this.calculator = enhancedCalculator;
  }

  // STEP F.1: SME/Corporate Loans & Project Finance
  calculateLoanMetrics(formData, riskIndex, scenario = 'orderly_2030', maturityCategory = '2030_2039') {
    const exposure = this.calculator.mapPortfolio(formData);
    const stresses = this.calculator.mapToFinancialStresses(riskIndex.ri_adjusted);
    
    // Climate maturity multiplier
    const maturityMultipliers = {
      'pre_2030': 0,      // No climate risk applied
      '2030_2039': 1.2,   // Expectation of climate risk
      'post_2040': 1.4    // Expectation of rising climate risk
    };
    const maturityMultiplier = maturityMultipliers[maturityCategory] || 1;
    
    // PD calculation
    const pd_new = exposure.pd_base * (1 + this.calculator.params.eta_PD * riskIndex.ri_adjusted * maturityMultiplier);
    
    // LGD calculation with collateral vulnerability
    const collateralVuln = this.getCollateralVulnerability(formData);
    const physicalRisk = this.calculator.calculatePhysicalRisk(formData, scenario);
    const lgd_new = Math.min(0.95, exposure.lgd_base + 
      this.calculator.params.lambda_LGD * physicalRisk.prs_new * collateralVuln);
    
    // ECL calculation (12-month or lifetime per IFRS 9)
    const ecl_12m = exposure.ead * pd_new * lgd_new;
    const ecl_lifetime = ecl_12m * 2.5; // Approximation for lifetime ECL
    
    // DSCR calculation for project finance
    const baseEBITDA = (parseFloat(formData.annualRevenue) || 100) * 1000000 * 0.15;
    const ebitdaShock = stresses.ebitda_shock_pct / 100;
    const adjustedEBITDA = baseEBITDA * (1 + ebitdaShock);
    const assumedDebtService = baseEBITDA * 0.4; // 40% of EBITDA as debt service
    const dscr_new = adjustedEBITDA / assumedDebtService;
    const dscr_base = baseEBITDA / assumedDebtService;

    return {
      productType: 'SME/Corporate Loan',
      exposure: {
        ead: exposure.ead,
        currency: exposure.currency,
        sector: formData.sector,
        maturity: maturityCategory
      },
      creditMetrics: {
        pd_base: parseFloat(exposure.pd_base.toFixed(4)),
        pd_new: parseFloat(pd_new.toFixed(4)),
        pd_uplift_pct: parseFloat(((pd_new / exposure.pd_base - 1) * 100).toFixed(2)),
        
        lgd_base: parseFloat(exposure.lgd_base.toFixed(3)),
        lgd_new: parseFloat(lgd_new.toFixed(3)),
        lgd_uplift_pct: parseFloat(((lgd_new / exposure.lgd_base - 1) * 100).toFixed(2)),
        
        collateralVulnerability: collateralVuln
      },
      expectedLoss: {
        ecl_12m_qar: parseFloat(ecl_12m.toFixed(0)),
        ecl_lifetime_qar: parseFloat(ecl_lifetime.toFixed(0)),
        ecl_12m_bps: parseFloat((ecl_12m / exposure.ead * 10000).toFixed(1)),
        ecl_lifetime_bps: parseFloat((ecl_lifetime / exposure.ead * 10000).toFixed(1))
      },
      projectFinance: {
        dscr_base: parseFloat(dscr_base.toFixed(2)),
        dscr_new: parseFloat(dscr_new.toFixed(2)),
        dscr_headroom_pct: parseFloat(((dscr_new - 1.2) / 1.2 * 100).toFixed(1)), // 1.2 as covenant threshold
        covenantRisk: dscr_new < 1.2 ? 'HIGH' : dscr_new < 1.35 ? 'MEDIUM' : 'LOW'
      },
      stresses,
      maturityAdjustment: {
        category: maturityCategory,
        multiplier: maturityMultiplier,
        description: this.getMaturityDescription(maturityCategory)
      }
    };
  }

  // STEP F.2: Syndicated Loans
  calculateSyndicatedLoanMetrics(formData, riskIndex, bookPosition = 'hold', sharePercent = 100) {
    const loanMetrics = this.calculateLoanMetrics(formData, riskIndex);
    
    if (bookPosition === 'hold') {
      // Hold book: treat like regular loans, scaled by bank's share
      const adjustedEAD = loanMetrics.exposure.ead * (sharePercent / 100);
      
      return {
        ...loanMetrics,
        productType: 'Syndicated Loan (Hold Book)',
        exposure: {
          ...loanMetrics.exposure,
          ead_total: loanMetrics.exposure.ead,
          ead_share: adjustedEAD,
          share_percent: sharePercent
        },
        expectedLoss: {
          ecl_12m_qar: parseFloat((loanMetrics.expectedLoss.ecl_12m_qar * sharePercent / 100).toFixed(0)),
          ecl_lifetime_qar: parseFloat((loanMetrics.expectedLoss.ecl_lifetime_qar * sharePercent / 100).toFixed(0)),
          ecl_12m_bps: loanMetrics.expectedLoss.ecl_12m_bps,
          ecl_lifetime_bps: loanMetrics.expectedLoss.ecl_lifetime_bps
        }
      };
    } else {
      // Underwriting pipeline: mark-to-market approach
      const stresses = this.calculator.mapToFinancialStresses(riskIndex.ri_adjusted);
      const spreadShock = stresses.spread_shock_bps;
      const duration = 3.5; // Assumed duration for pricing
      const markToMarketChange = -duration * spreadShock / 10000; // Convert bps to decimal
      
      return {
        productType: 'Syndicated Loan (Underwriting Pipeline)',
        exposure: loanMetrics.exposure,
        markToMarket: {
          spread_shock_bps: spreadShock,
          duration_years: duration,
          price_change_pct: parseFloat((markToMarketChange * 100).toFixed(2)),
          value_impact_qar: parseFloat((loanMetrics.exposure.ead * markToMarketChange).toFixed(0))
        },
        stresses,
        pipelineRisk: {
          category: Math.abs(markToMarketChange) < 0.02 ? 'LOW' : 
                   Math.abs(markToMarketChange) < 0.05 ? 'MEDIUM' : 'HIGH',
          description: `${Math.abs(markToMarketChange * 100).toFixed(1)}% potential price impact`
        }
      };
    }
  }

  // STEP F.3: Bonds (Banking Book/Treasury)
  calculateBondMetrics(formData, riskIndex, bookType = 'banking_book') {
    const exposure = this.calculator.mapPortfolio(formData);
    const stresses = this.calculator.mapToFinancialStresses(riskIndex.ri_adjusted);
    
    // Yield/Spread shock
    const yieldShock = stresses.spread_shock_bps;
    const modifiedDuration = this.estimateModifiedDuration(formData);
    const priceChange = -modifiedDuration * yieldShock / 10000;
    const valueImpact = exposure.ead * priceChange;
    
    // Optional credit lens for corporate bonds
    const pd_issuer = this.estimateIssuerPD(formData, riskIndex);
    const lgd_bond = 0.4; // Typical bond LGD
    const el_bond = exposure.ead * pd_issuer * lgd_bond;

    return {
      productType: `Bond (${bookType.replace('_', ' ').toTitleCase()})`,
      exposure: {
        ead: exposure.ead,
        currency: exposure.currency,
        issuer_sector: formData.sector,
        estimated_maturity: this.estimateBondMaturity(formData)
      },
      marketRisk: {
        yield_shock_bps: yieldShock,
        modified_duration: parseFloat(modifiedDuration.toFixed(2)),
        price_change_pct: parseFloat((priceChange * 100).toFixed(2)),
        value_impact_qar: parseFloat(valueImpact.toFixed(0))
      },
      creditRisk: {
        pd_issuer: parseFloat(pd_issuer.toFixed(4)),
        lgd_bond: lgd_bond,
        expected_loss_qar: parseFloat(el_bond.toFixed(0)),
        expected_loss_bps: parseFloat((el_bond / exposure.ead * 10000).toFixed(1))
      },
      stresses,
      riskAssessment: {
        marketRisk: Math.abs(priceChange) < 0.03 ? 'LOW' : 
                   Math.abs(priceChange) < 0.07 ? 'MEDIUM' : 'HIGH',
        creditRisk: pd_issuer < 0.02 ? 'LOW' : pd_issuer < 0.05 ? 'MEDIUM' : 'HIGH'
      }
    };
  }

  // STEP F.4: Equities and Convertibles
  calculateEquityMetrics(formData, riskIndex) {
    const exposure = this.calculator.mapPortfolio(formData);
    const stresses = this.calculator.mapToFinancialStresses(riskIndex.ri_adjusted);
    
    // Direct value impact
    const eta_eq = 0.4; // Equity sensitivity parameter
    const directValueImpact = -eta_eq * riskIndex.ri_adjusted * exposure.ead;
    
    // Gordon growth re-pricing
    const dividendYield = 0.035; // Assumed 3.5% dividend yield
    const riskFreeRate = 0.04; // Assumed 4% risk-free rate
    const delta = 0.2; // Additional risk premium parameter
    const growthRate = 0.025; // Assumed 2.5% growth
    
    const baseRequiredReturn = riskFreeRate + 0.06; // Base equity risk premium
    const adjustedRequiredReturn = baseRequiredReturn + delta * riskIndex.ri_adjusted;
    const basePrice = (dividendYield * exposure.ead) / (baseRequiredReturn - growthRate);
    const adjustedPrice = (dividendYield * exposure.ead) / (adjustedRequiredReturn - growthRate);
    const gordonValueImpact = adjustedPrice - basePrice;

    return {
      productType: 'Equity/Convertible',
      exposure: {
        ead: exposure.ead,
        currency: exposure.currency,
        sector: formData.sector,
        holding_type: 'Strategic Investment'
      },
      valuationImpact: {
        direct_method: {
          impact_qar: parseFloat(directValueImpact.toFixed(0)),
          impact_pct: parseFloat((directValueImpact / exposure.ead * 100).toFixed(2))
        },
        gordon_growth: {
          base_required_return: parseFloat((baseRequiredReturn * 100).toFixed(2)),
          adjusted_required_return: parseFloat((adjustedRequiredReturn * 100).toFixed(2)),
          impact_qar: parseFloat(gordonValueImpact.toFixed(0)),
          impact_pct: parseFloat((gordonValueImpact / exposure.ead * 100).toFixed(2))
        },
        recommended_approach: Math.abs(gordonValueImpact) > Math.abs(directValueImpact) ? 
                            'Gordon Growth Model' : 'Direct Impact Method'
      },
      riskMetrics: {
        climate_beta: parseFloat((eta_eq * riskIndex.ri_adjusted).toFixed(3)),
        risk_premium_adjustment_bps: parseFloat((delta * riskIndex.ri_adjusted * 10000).toFixed(0)),
        volatility_increase_est: parseFloat((riskIndex.ri_adjusted * 0.15 * 100).toFixed(1)) + '%'
      },
      stresses
    };
  }

  // STEP F.5: EXIM and Trade Finance
  calculateEximMetrics(formData, riskIndex, productSubtype = 'post_shipment') {
    const exposure = this.calculator.mapPortfolio(formData);
    const baseMetrics = this.calculateLoanMetrics(formData, riskIndex);
    
    // Country risk multiplier using ND-GAIN index from PDF
    const buyerCountry = formData.buyerCountry || 'TR';
    const ndGainIndex = this.getNDGainIndex(buyerCountry);
    const countryRiskIndex = 1 - ndGainIndex; // Higher ND-GAIN = lower risk
    const kappa = 0.3; // Country risk sensitivity
    
    // Adjusted PD for buyer/country risk
    const pd_buyer_adj = exposure.pd_base * (1 + kappa * countryRiskIndex);
    
    // LGD adjustment for logistics/port flood sensitivity
    const logisticsRisk = this.getLogisticsRisk(formData);
    const physicalAnalysis = this.calculator.calculatePhysicalRisk(formData);
    const lgd_adj = Math.min(0.95, exposure.lgd_base * (1 + 0.2 * logisticsRisk * physicalAnalysis.prs_new));
    
    // Final expected loss
    const el_exim = exposure.ead * pd_buyer_adj * lgd_adj;

    return {
      productType: `EXIM/Trade Finance (${productSubtype.replace('_', ' ').toTitleCase()})`,
      exposure: {
        ead: exposure.ead,
        currency: exposure.currency,
        exporter_sector: formData.sector,
        buyer_country: buyerCountry,
        product_subtype: productSubtype
      },
      countryRisk: {
        buyer_country: buyerCountry,
        nd_gain_index: parseFloat(ndGainIndex.toFixed(3)),
        country_risk_index: parseFloat(countryRiskIndex.toFixed(3)),
        risk_multiplier: parseFloat((1 + kappa * countryRiskIndex).toFixed(3))
      },
      creditMetrics: {
        pd_base: parseFloat(exposure.pd_base.toFixed(4)),
        pd_buyer_adj: parseFloat(pd_buyer_adj.toFixed(4)),
        pd_country_uplift_pct: parseFloat(((pd_buyer_adj / exposure.pd_base - 1) * 100).toFixed(2)),
        
        lgd_base: parseFloat(exposure.lgd_base.toFixed(3)),
        lgd_adj: parseFloat(lgd_adj.toFixed(3)),
        logistics_risk_factor: logisticsRisk
      },
      expectedLoss: {
        el_qar: parseFloat(el_exim.toFixed(0)),
        el_bps: parseFloat((el_exim / exposure.ead * 10000).toFixed(1)),
        country_contribution_pct: parseFloat((kappa * countryRiskIndex / (1 + kappa * countryRiskIndex) * 100).toFixed(1)),
        physical_contribution_pct: parseFloat((0.2 * logisticsRisk * physicalAnalysis.prs_new * 100).toFixed(1))
      },
      tradeFinanceSpecific: {
        supply_chain_disruption_risk: this.getSupplyChainRisk(formData, buyerCountry),
        port_flood_sensitivity: logisticsRisk > 0.5 ? 'HIGH' : logisticsRisk > 0.3 ? 'MEDIUM' : 'LOW',
        fx_climate_correlation: this.getFXClimateCorrelation(exposure.currency, buyerCountry)
      }
    };
  }

  // STEP F.6: Guarantees (Al-Dhameen and others)
  calculateGuaranteeMetrics(formData, riskIndex, guaranteeRate = 0.7, ccf = 0.2) {
    const facilityLimit = parseFloat(formData.creditAmount) || 1000000;
    const ead_guarantee = facilityLimit * ccf; // Convert off-BS to EAD
    
    // Calculate borrower ECL as if it were a loan
    const borrowerMetrics = this.calculateLoanMetrics(formData, riskIndex);
    const ecl_borrower = borrowerMetrics.expectedLoss.ecl_12m_qar;
    
    // Expected Guarantee Loss
    const egl = guaranteeRate * ecl_borrower;
    
    // Stress call probability - increases with risk
    const baseCallProbability = 0.15; // 15% base probability
    const stressedCallProbability = baseCallProbability * (1 + 0.5 * riskIndex.ri_adjusted);

    return {
      productType: 'Guarantee Program',
      guarantee: {
        facility_limit: facilityLimit,
        ead_guarantee: parseFloat(ead_guarantee.toFixed(0)),
        guarantee_rate: guaranteeRate,
        ccf: ccf
      },
      borrowerRisk: {
        pd_new: borrowerMetrics.creditMetrics.pd_new,
        lgd_new: borrowerMetrics.creditMetrics.lgd_new,
        ecl_borrower: parseFloat(ecl_borrower.toFixed(0))
      },
      guaranteeExposure: {
        egl_qar: parseFloat(egl.toFixed(0)),
        egl_pct_of_limit: parseFloat((egl / facilityLimit * 100).toFixed(3)),
        call_probability_base: parseFloat((baseCallProbability * 100).toFixed(1)),
        call_probability_stressed: parseFloat((stressedCallProbability * 100).toFixed(1)),
        call_probability_uplift: parseFloat(((stressedCallProbability - baseCallProbability) * 100).toFixed(1))
      },
      riskAssessment: {
        program_risk: egl / facilityLimit < 0.01 ? 'LOW' : 
                     egl / facilityLimit < 0.03 ? 'MEDIUM' : 'HIGH',
        call_risk: stressedCallProbability < 0.2 ? 'LOW' : 
                  stressedCallProbability < 0.35 ? 'MEDIUM' : 'HIGH'
      },
      stresses: this.calculator.mapToFinancialStresses(riskIndex.ri_adjusted)
    };
  }

  // Utility methods
  getCollateralVulnerability(formData) {
    let vulnerability = 0.3; // Base vulnerability
    
    // Sector-based adjustments
    const sectorVulnerabilities = {
      'Enerji': 0.7,
      'Altyapı': 0.8,
      'Otomotiv': 0.5,
      'Sanayi': 0.6,
      'Finans': 0.2
    };
    vulnerability = sectorVulnerabilities[formData.sector] || vulnerability;
    
    // Location-based adjustments
    if (formData.operationalLocations) {
      if (formData.operationalLocations.includes('coastal')) vulnerability += 0.2;
      if (formData.operationalLocations.includes('floodplain')) vulnerability += 0.15;
    }
    
    // Physical risk adjustments
    if (formData.floodRisk === 'high') vulnerability += 0.1;
    if (formData.droughtRisk === 'high') vulnerability += 0.08;
    
    return Math.min(1.0, vulnerability);
  }

  getMaturityDescription(category) {
    const descriptions = {
      'pre_2030': 'No climate risk applied - maturity before significant climate impacts',
      '2030_2039': 'Moderate climate risk - transition period with policy implementation',
      'post_2040': 'High climate risk - full impact of climate policies and physical changes'
    };
    return descriptions[category] || 'Standard climate risk assessment';
  }

  estimateModifiedDuration(formData) {
    // Simple duration estimation based on sector and typical bond characteristics
    const sectorDurations = {
      'Finans': 4.2,
      'Enerji': 6.8,
      'Sanayi': 5.5,
      'Altyapı': 8.2,
      'Otomotiv': 4.8
    };
    return sectorDurations[formData.sector] || 5.0;
  }

  estimateIssuerPD(formData, riskIndex) {
    // Base PD estimation for bond issuer
    const basePD = 0.02; // 2% base
    return basePD * (1 + 0.8 * riskIndex.ri_adjusted);
  }

  estimateBondMaturity(formData) {
    const sectorMaturities = {
      'Finans': '3-5 years',
      'Enerji': '7-10 years', 
      'Sanayi': '5-7 years',
      'Altyapı': '10-15 years',
      'Otomotiv': '3-7 years'
    };
    return sectorMaturities[formData.sector] || '5-7 years';
  }

  getNDGainIndex(countryCode) {
    // Sample ND-GAIN indices from the PDF appendix
    const ndGainIndices = {
      'NO': 0.2320, 'FI': 0.2520, 'CH': 0.2710, 'DK': 0.2730,
      'SE': 0.2890, 'SG': 0.2920, 'NZ': 0.3000, 'GB': 0.3010,
      'DE': 0.3040, 'AU': 0.3080, 'CA': 0.3150, 'IS': 0.3160,
      'TR': 0.4610, 'QA': 0.4200, 'SA': 0.4210, 'AE': 0.4010,
      'CN': 0.4190, 'IN': 0.5650, 'BR': 0.5280, 'MX': 0.5420,
      'ZA': 0.5340, 'RU': 0.4340, 'ID': 0.5410, 'MY': 0.4460
    };
    return ndGainIndices[countryCode] || 0.5; // Default to medium risk
  }

  getLogisticsRisk(formData) {
    let risk = 0.3; // Base logistics risk
    
    // Port/coastal operations
    if (formData.operationalLocations) {
      if (formData.operationalLocations.includes('port')) risk += 0.3;
      if (formData.operationalLocations.includes('coastal')) risk += 0.2;
    }
    
    // Sector-specific logistics dependencies
    if (['Lojistik', 'Otomotiv', 'Sanayi'].includes(formData.sector)) {
      risk += 0.2;
    }
    
    return Math.min(1.0, risk);
  }

  getSupplyChainRisk(formData, buyerCountry) {
    const countryRiskLevels = {
      'TR': 'MEDIUM', 'QA': 'LOW', 'SA': 'MEDIUM', 'AE': 'LOW',
      'CN': 'MEDIUM', 'IN': 'HIGH', 'BD': 'HIGH', 'VN': 'MEDIUM',
      'DE': 'LOW', 'NL': 'LOW', 'US': 'LOW'
    };
    return countryRiskLevels[buyerCountry] || 'MEDIUM';
  }

  getFXClimateCorrelation(currency, country) {
    // Simplified FX-climate risk correlation
    const highRiskCurrencies = ['TRY', 'BRL', 'ZAR', 'INR'];
    const lowRiskCurrencies = ['USD', 'EUR', 'CHF', 'JPY'];
    
    if (highRiskCurrencies.includes(currency)) return 'HIGH';
    if (lowRiskCurrencies.includes(currency)) return 'LOW';
    return 'MEDIUM';
  }
}

// String helper
String.prototype.toTitleCase = function() {
  return this.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export default FinancialProducts;