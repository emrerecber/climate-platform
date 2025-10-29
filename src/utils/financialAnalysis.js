class FinancialAnalysis {
  constructor() {
    this.currencyRates = {
      'TRY': 1,
      'USD': 29.8,
      'EUR': 32.1,
      'GBP': 37.5
    };
  }

  // Convert amounts to base currency (TRY)
  convertToBaseCurrency(amount, fromCurrency) {
    if (!amount || isNaN(amount)) return 0;
    return parseFloat(amount) * this.currencyRates[fromCurrency];
  }

  // Validate financial data
  validateFinancialData(data) {
    const errors = [];
    const warnings = [];

    // Required fields validation
    if (!data.entityName) {
      errors.push('Entity name is required');
    }

    if (!data.currency) {
      errors.push('Currency is required');
    }

    // Financial logic validations
    const totalAssets = this.calculateTotalAssets(data);
    const totalLiabilities = this.calculateTotalLiabilities(data);
    
    if (totalLiabilities > totalAssets * 2) {
      warnings.push('High debt-to-asset ratio detected (>200%)');
    }

    const monthlyIncome = parseFloat(data.monthlyIncome) || 0;
    const monthlyExpenses = parseFloat(data.monthlyExpenses) || 0;
    
    if (monthlyExpenses > monthlyIncome && monthlyIncome > 0) {
      warnings.push('Monthly expenses exceed monthly income');
    }

    // Data consistency checks
    const annualRevenue = parseFloat(data.annualRevenue) || 0;
    const calculatedAnnual = monthlyIncome * 12;
    
    if (annualRevenue > 0 && calculatedAnnual > 0 && Math.abs(annualRevenue - calculatedAnnual) > calculatedAnnual * 0.2) {
      warnings.push('Annual revenue and monthly income data seem inconsistent');
    }

    return { errors, warnings, isValid: errors.length === 0 };
  }

  // Calculate total assets
  calculateTotalAssets(data) {
    const assets = [
      'cashAndEquivalents',
      'bankDeposits',
      'investments',
      'realEstate',
      'equipment',
      'inventory',
      'accountsReceivable',
      'stocks',
      'bonds',
      'mutualFunds',
      'cryptoCurrency',
      'commodities'
    ];

    return assets.reduce((total, asset) => {
      return total + (parseFloat(data[asset]) || 0);
    }, 0);
  }

  // Calculate total liabilities
  calculateTotalLiabilities(data) {
    const liabilities = [
      'shortTermLoans',
      'longTermLoans',
      'accountsPayable',
      'taxLiabilities'
    ];

    return liabilities.reduce((total, liability) => {
      return total + (parseFloat(data[liability]) || 0);
    }, 0);
  }

  // Calculate net worth
  calculateNetWorth(data) {
    return this.calculateTotalAssets(data) - this.calculateTotalLiabilities(data);
  }

  // Calculate total income
  calculateTotalIncome(data) {
    const monthlyIncome = parseFloat(data.monthlyIncome) || 0;
    const annualRevenue = parseFloat(data.annualRevenue) || 0;
    const operatingIncome = parseFloat(data.operatingIncome) || 0;
    const investmentIncome = parseFloat(data.investmentIncome) || 0;

    // Use the highest available income figure
    const estimatedAnnualIncome = Math.max(
      monthlyIncome * 12,
      annualRevenue,
      operatingIncome + investmentIncome
    );

    return estimatedAnnualIncome;
  }

  // Calculate total expenses
  calculateTotalExpenses(data) {
    const monthlyExpenses = parseFloat(data.monthlyExpenses) || 0;
    const operatingExpenses = parseFloat(data.operatingExpenses) || 0;
    const administrativeExpenses = parseFloat(data.administrativeExpenses) || 0;
    const marketingExpenses = parseFloat(data.marketingExpenses) || 0;
    const financialExpenses = parseFloat(data.financialExpenses) || 0;

    const totalOperatingExpenses = operatingExpenses + administrativeExpenses + 
                                   marketingExpenses + financialExpenses;

    // Use the highest available expense figure
    return Math.max(monthlyExpenses * 12, totalOperatingExpenses);
  }

  // Calculate key financial ratios
  calculateFinancialRatios(data) {
    const totalAssets = this.calculateTotalAssets(data);
    const totalLiabilities = this.calculateTotalLiabilities(data);
    const netWorth = this.calculateNetWorth(data);
    const totalIncome = this.calculateTotalIncome(data);
    const totalExpenses = this.calculateTotalExpenses(data);
    const cashAndEquivalents = parseFloat(data.cashAndEquivalents) || 0;

    return {
      // Liquidity Ratios
      liquidityRatio: totalLiabilities > 0 ? (cashAndEquivalents + parseFloat(data.bankDeposits || 0)) / totalLiabilities : null,
      
      // Leverage Ratios
      debtToAssetRatio: totalAssets > 0 ? totalLiabilities / totalAssets : null,
      debtToEquityRatio: netWorth > 0 ? totalLiabilities / netWorth : null,
      
      // Profitability Ratios
      profitMargin: totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : null,
      returnOnAssets: totalAssets > 0 && totalIncome > 0 ? (totalIncome - totalExpenses) / totalAssets : null,
      returnOnEquity: netWorth > 0 && totalIncome > 0 ? (totalIncome - totalExpenses) / netWorth : null,
      
      // Coverage Ratios
      expenseRatio: totalIncome > 0 ? totalExpenses / totalIncome : null,
      savingsRate: totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : null
    };
  }

  // Generate financial health score
  calculateFinancialHealthScore(data) {
    const ratios = this.calculateFinancialRatios(data);
    let score = 0;
    let maxScore = 0;

    // Liquidity Score (25 points)
    maxScore += 25;
    if (ratios.liquidityRatio !== null) {
      if (ratios.liquidityRatio >= 1) score += 25;
      else if (ratios.liquidityRatio >= 0.5) score += 15;
      else if (ratios.liquidityRatio >= 0.25) score += 10;
      else score += 5;
    }

    // Debt Management Score (25 points)
    maxScore += 25;
    if (ratios.debtToAssetRatio !== null) {
      if (ratios.debtToAssetRatio <= 0.3) score += 25;
      else if (ratios.debtToAssetRatio <= 0.5) score += 20;
      else if (ratios.debtToAssetRatio <= 0.7) score += 15;
      else if (ratios.debtToAssetRatio <= 0.9) score += 10;
      else score += 5;
    }

    // Profitability Score (25 points)
    maxScore += 25;
    if (ratios.profitMargin !== null) {
      if (ratios.profitMargin >= 0.2) score += 25;
      else if (ratios.profitMargin >= 0.1) score += 20;
      else if (ratios.profitMargin >= 0.05) score += 15;
      else if (ratios.profitMargin >= 0) score += 10;
      else score += 5;
    }

    // Savings Score (25 points)
    maxScore += 25;
    if (ratios.savingsRate !== null) {
      if (ratios.savingsRate >= 0.3) score += 25;
      else if (ratios.savingsRate >= 0.2) score += 20;
      else if (ratios.savingsRate >= 0.1) score += 15;
      else if (ratios.savingsRate >= 0.05) score += 10;
      else score += 5;
    }

    return {
      score: Math.round((score / maxScore) * 100),
      grade: this.getFinancialGrade((score / maxScore) * 100),
      breakdown: {
        liquidity: ratios.liquidityRatio,
        debtManagement: ratios.debtToAssetRatio,
        profitability: ratios.profitMargin,
        savings: ratios.savingsRate
      }
    };
  }

  // Get financial grade
  getFinancialGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C+';
    if (score >= 40) return 'C';
    if (score >= 30) return 'D+';
    if (score >= 20) return 'D';
    return 'F';
  }

  // Generate investment portfolio analysis
  analyzeInvestmentPortfolio(data) {
    const stocks = parseFloat(data.stocks) || 0;
    const bonds = parseFloat(data.bonds) || 0;
    const mutualFunds = parseFloat(data.mutualFunds) || 0;
    const crypto = parseFloat(data.cryptoCurrency) || 0;
    const commodities = parseFloat(data.commodities) || 0;

    const totalInvestments = stocks + bonds + mutualFunds + crypto + commodities;

    if (totalInvestments === 0) {
      return {
        totalValue: 0,
        diversification: 'No investments',
        riskLevel: 'N/A',
        recommendations: ['Consider starting an investment portfolio']
      };
    }

    const allocation = {
      stocks: (stocks / totalInvestments) * 100,
      bonds: (bonds / totalInvestments) * 100,
      mutualFunds: (mutualFunds / totalInvestments) * 100,
      crypto: (crypto / totalInvestments) * 100,
      commodities: (commodities / totalInvestments) * 100
    };

    // Calculate risk level based on allocation
    const riskScore = (allocation.stocks * 0.8) + (allocation.crypto * 1.0) + 
                     (allocation.commodities * 0.7) + (allocation.mutualFunds * 0.6) + 
                     (allocation.bonds * 0.2);

    let riskLevel, recommendations = [];
    
    if (riskScore >= 70) {
      riskLevel = 'High Risk';
      recommendations.push('Consider diversifying into safer investments');
    } else if (riskScore >= 40) {
      riskLevel = 'Moderate Risk';
      recommendations.push('Well-balanced portfolio for moderate growth');
    } else {
      riskLevel = 'Low Risk';
      recommendations.push('Consider adding growth investments for better returns');
    }

    // Diversification analysis
    const nonZeroAssets = Object.values(allocation).filter(val => val > 0).length;
    let diversification;
    
    if (nonZeroAssets >= 4) diversification = 'Well Diversified';
    else if (nonZeroAssets >= 3) diversification = 'Moderately Diversified';
    else if (nonZeroAssets >= 2) diversification = 'Somewhat Diversified';
    else diversification = 'Not Diversified';

    if (allocation.stocks > 70) {
      recommendations.push('Stock allocation seems high - consider diversification');
    }
    if (allocation.crypto > 20) {
      recommendations.push('Cryptocurrency allocation is high - high volatility risk');
    }
    if (allocation.bonds < 10 && riskScore > 50) {
      recommendations.push('Consider adding bonds for stability');
    }

    return {
      totalValue: totalInvestments,
      allocation,
      diversification,
      riskLevel,
      riskScore: Math.round(riskScore),
      recommendations
    };
  }

  // Generate cash flow analysis
  analyzeCashFlow(data) {
    const totalIncome = this.calculateTotalIncome(data);
    const totalExpenses = this.calculateTotalExpenses(data);
    const netCashFlow = totalIncome - totalExpenses;

    const monthlyIncome = parseFloat(data.monthlyIncome) || 0;
    const monthlyExpenses = parseFloat(data.monthlyExpenses) || 0;
    const monthlyNetFlow = monthlyIncome - monthlyExpenses;

    const cashAndEquivalents = parseFloat(data.cashAndEquivalents) || 0;
    const bankDeposits = parseFloat(data.bankDeposits) || 0;
    const liquidAssets = cashAndEquivalents + bankDeposits;

    // Emergency fund analysis
    const monthsOfExpensesCovered = monthlyExpenses > 0 ? liquidAssets / monthlyExpenses : 0;
    
    let emergencyFundStatus;
    if (monthsOfExpensesCovered >= 6) emergencyFundStatus = 'Excellent';
    else if (monthsOfExpensesCovered >= 3) emergencyFundStatus = 'Good';
    else if (monthsOfExpensesCovered >= 1) emergencyFundStatus = 'Adequate';
    else emergencyFundStatus = 'Insufficient';

    return {
      annualIncome: totalIncome,
      annualExpenses: totalExpenses,
      annualNetFlow: netCashFlow,
      monthlyIncome,
      monthlyExpenses,
      monthlyNetFlow,
      liquidAssets,
      emergencyFundMonths: monthsOfExpensesCovered,
      emergencyFundStatus,
      cashFlowHealth: netCashFlow > 0 ? 'Positive' : netCashFlow === 0 ? 'Neutral' : 'Negative'
    };
  }

  // Generate comprehensive financial analysis
  generateComprehensiveAnalysis(data) {
    const validation = this.validateFinancialData(data);
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        warnings: validation.warnings
      };
    }

    const ratios = this.calculateFinancialRatios(data);
    const healthScore = this.calculateFinancialHealthScore(data);
    const portfolioAnalysis = this.analyzeInvestmentPortfolio(data);
    const cashFlowAnalysis = this.analyzeCashFlow(data);

    const summary = {
      totalAssets: this.calculateTotalAssets(data),
      totalLiabilities: this.calculateTotalLiabilities(data),
      netWorth: this.calculateNetWorth(data),
      totalIncome: this.calculateTotalIncome(data),
      totalExpenses: this.calculateTotalExpenses(data),
      currency: data.currency
    };

    // Generate recommendations based on analysis
    const recommendations = this.generateRecommendations(ratios, healthScore, portfolioAnalysis, cashFlowAnalysis);

    return {
      success: true,
      warnings: validation.warnings,
      entityInfo: {
        name: data.entityName,
        type: data.entityType,
        currency: data.currency
      },
      summary,
      ratios,
      healthScore,
      portfolioAnalysis,
      cashFlowAnalysis,
      recommendations
    };
  }

  // Generate personalized recommendations
  generateRecommendations(ratios, healthScore, portfolioAnalysis, cashFlowAnalysis) {
    const recommendations = [];

    // Liquidity recommendations
    if (ratios.liquidityRatio !== null && ratios.liquidityRatio < 0.5) {
      recommendations.push({
        category: 'Liquidity',
        priority: 'High',
        message: 'Consider building up cash reserves to improve liquidity',
        action: 'Increase emergency fund to cover 3-6 months of expenses'
      });
    }

    // Debt management recommendations
    if (ratios.debtToAssetRatio !== null && ratios.debtToAssetRatio > 0.7) {
      recommendations.push({
        category: 'Debt Management',
        priority: 'High',
        message: 'High debt-to-asset ratio detected',
        action: 'Consider debt reduction strategies and avoid taking on new debt'
      });
    }

    // Profitability recommendations
    if (ratios.profitMargin !== null && ratios.profitMargin < 0.1) {
      recommendations.push({
        category: 'Profitability',
        priority: 'Medium',
        message: 'Low profit margin',
        action: 'Review expenses and explore income improvement opportunities'
      });
    }

    // Investment recommendations
    if (portfolioAnalysis.totalValue === 0) {
      recommendations.push({
        category: 'Investment',
        priority: 'Medium',
        message: 'No investment portfolio detected',
        action: 'Consider starting with low-risk investments like mutual funds'
      });
    }

    // Cash flow recommendations
    if (cashFlowAnalysis.cashFlowHealth === 'Negative') {
      recommendations.push({
        category: 'Cash Flow',
        priority: 'High',
        message: 'Negative cash flow detected',
        action: 'Urgent: Review and reduce expenses, increase income sources'
      });
    }

    // Emergency fund recommendations
    if (cashFlowAnalysis.emergencyFundStatus === 'Insufficient') {
      recommendations.push({
        category: 'Emergency Fund',
        priority: 'High',
        message: 'Insufficient emergency fund',
        action: 'Build emergency fund to cover 3-6 months of expenses'
      });
    }

    // Overall health recommendations
    if (healthScore.score < 50) {
      recommendations.push({
        category: 'Overall Health',
        priority: 'High',
        message: 'Overall financial health needs improvement',
        action: 'Focus on debt reduction, expense management, and building savings'
      });
    }

    return recommendations;
  }

  // Format currency for display
  formatCurrency(amount, currency = 'TRY') {
    const formatter = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  }

  // Format percentage for display
  formatPercentage(value, decimals = 1) {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return `${(value * 100).toFixed(decimals)}%`;
  }

  // Format number for display
  formatNumber(value, decimals = 0) {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }
}

export default FinancialAnalysis;