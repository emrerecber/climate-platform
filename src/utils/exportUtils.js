import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

// PDF Export Functions
export const exportFinancialReportToPDF = async (analysisData, entityName = 'Financial Report') => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;
    
    // Helper function to add page if needed
    const checkPageBreak = (requiredHeight) => {
      if (yPosition + requiredHeight > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
    };
    
    // Helper function to format currency
    const formatCurrency = (value, currency = 'TRY') => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    };
    
    // Helper function to format percentage
    const formatPercentage = (value) => {
      if (value === null || value === undefined || isNaN(value)) return 'N/A';
      return `${(value * 100).toFixed(1)}%`;
    };
    
    // Set font
    pdf.setFont('helvetica');
    
    // Title
    pdf.setFontSize(24);
    pdf.setTextColor(51, 102, 204); // Blue color
    pdf.text('Financial Analysis Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    // Entity info
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Entity: ${analysisData.entityInfo.name}`, 20, yPosition);
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.text(`Type: ${analysisData.entityInfo.type}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Currency: ${analysisData.entityInfo.currency}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Report Date: ${new Date().toLocaleDateString('tr-TR')}`, 20, yPosition);
    yPosition += 15;
    
    // Key Metrics Section
    checkPageBreak(60);
    pdf.setFontSize(18);
    pdf.setTextColor(51, 102, 204);
    pdf.text('Key Financial Metrics', 20, yPosition);
    yPosition += 12;
    
    // Key metrics table
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const keyMetrics = [
      ['Net Worth', formatCurrency(analysisData.summary.netWorth, analysisData.summary.currency)],
      ['Total Assets', formatCurrency(analysisData.summary.totalAssets, analysisData.summary.currency)],
      ['Total Liabilities', formatCurrency(analysisData.summary.totalLiabilities, analysisData.summary.currency)],
      ['Total Income', formatCurrency(analysisData.summary.totalIncome, analysisData.summary.currency)],
      ['Total Expenses', formatCurrency(analysisData.summary.totalExpenses, analysisData.summary.currency)],
      ['Financial Health Score', `${analysisData.healthScore.score}/100 (${analysisData.healthScore.grade})`]
    ];
    
    keyMetrics.forEach(([label, value]) => {
      pdf.text(label, 25, yPosition);
      pdf.text(value, 120, yPosition);
      yPosition += 8;
    });
    
    yPosition += 10;
    
    // Financial Ratios Section
    checkPageBreak(80);
    pdf.setFontSize(18);
    pdf.setTextColor(51, 102, 204);
    pdf.text('Financial Ratios', 20, yPosition);
    yPosition += 12;
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const ratios = [
      ['Liquidity Ratio', formatPercentage(analysisData.ratios.liquidityRatio)],
      ['Debt to Asset Ratio', formatPercentage(analysisData.ratios.debtToAssetRatio)],
      ['Profit Margin', formatPercentage(analysisData.ratios.profitMargin)],
      ['Savings Rate', formatPercentage(analysisData.ratios.savingsRate)],
      ['Return on Assets', formatPercentage(analysisData.ratios.returnOnAssets)],
      ['Return on Equity', formatPercentage(analysisData.ratios.returnOnEquity)]
    ];
    
    ratios.forEach(([label, value]) => {
      pdf.text(label, 25, yPosition);
      pdf.text(value, 120, yPosition);
      yPosition += 8;
    });
    
    yPosition += 10;
    
    // Cash Flow Analysis Section
    checkPageBreak(60);
    pdf.setFontSize(18);
    pdf.setTextColor(51, 102, 204);
    pdf.text('Cash Flow Analysis', 20, yPosition);
    yPosition += 12;
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const cashFlowData = [
      ['Monthly Income', formatCurrency(analysisData.cashFlowAnalysis.monthlyIncome, analysisData.summary.currency)],
      ['Monthly Expenses', formatCurrency(analysisData.cashFlowAnalysis.monthlyExpenses, analysisData.summary.currency)],
      ['Monthly Net Flow', formatCurrency(analysisData.cashFlowAnalysis.monthlyNetFlow, analysisData.summary.currency)],
      ['Emergency Fund Coverage', `${analysisData.cashFlowAnalysis.emergencyFundMonths.toFixed(1)} months`],
      ['Emergency Fund Status', analysisData.cashFlowAnalysis.emergencyFundStatus]
    ];
    
    cashFlowData.forEach(([label, value]) => {
      pdf.text(label, 25, yPosition);
      pdf.text(value, 120, yPosition);
      yPosition += 8;
    });
    
    yPosition += 10;
    
    // Investment Portfolio Analysis (if applicable)
    if (analysisData.portfolioAnalysis.totalValue > 0) {
      checkPageBreak(60);
      pdf.setFontSize(18);
      pdf.setTextColor(51, 102, 204);
      pdf.text('Investment Portfolio Analysis', 20, yPosition);
      yPosition += 12;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      const portfolioData = [
        ['Total Portfolio Value', formatCurrency(analysisData.portfolioAnalysis.totalValue, analysisData.summary.currency)],
        ['Diversification Level', analysisData.portfolioAnalysis.diversification],
        ['Risk Level', analysisData.portfolioAnalysis.riskLevel],
        ['Risk Score', `${analysisData.portfolioAnalysis.riskScore}/100`],
        ['Stocks Allocation', `${analysisData.portfolioAnalysis.allocation.stocks.toFixed(1)}%`],
        ['Bonds Allocation', `${analysisData.portfolioAnalysis.allocation.bonds.toFixed(1)}%`],
        ['Mutual Funds Allocation', `${analysisData.portfolioAnalysis.allocation.mutualFunds.toFixed(1)}%`],
        ['Crypto Allocation', `${analysisData.portfolioAnalysis.allocation.crypto.toFixed(1)}%`]
      ];
      
      portfolioData.forEach(([label, value]) => {
        pdf.text(label, 25, yPosition);
        pdf.text(value, 120, yPosition);
        yPosition += 8;
      });
    }
    
    // Recommendations Section
    if (analysisData.recommendations.length > 0) {
      checkPageBreak(100);
      pdf.setFontSize(18);
      pdf.setTextColor(51, 102, 204);
      pdf.text('Recommendations', 20, yPosition);
      yPosition += 12;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      analysisData.recommendations.forEach((rec, index) => {
        checkPageBreak(20);
        
        // Priority indicator
        const priorityColor = rec.priority === 'High' ? [239, 68, 68] : 
                             rec.priority === 'Medium' ? [245, 158, 11] : [16, 185, 129];
        
        pdf.setTextColor(...priorityColor);
        pdf.text(`${index + 1}. ${rec.category} (${rec.priority} Priority)`, 25, yPosition);
        yPosition += 6;
        
        pdf.setTextColor(0, 0, 0);
        
        // Message - wrap text if too long
        const messageLines = pdf.splitTextToSize(rec.message, pageWidth - 50);
        messageLines.forEach(line => {
          pdf.text(line, 30, yPosition);
          yPosition += 5;
        });
        
        // Action - wrap text if too long
        pdf.setTextColor(64, 64, 64);
        pdf.text('Action: ', 30, yPosition);
        const actionLines = pdf.splitTextToSize(rec.action, pageWidth - 70);
        actionLines.forEach((line, idx) => {
          pdf.text(line, idx === 0 ? 50 : 30, yPosition);
          yPosition += 5;
        });
        
        yPosition += 5;
      });
    }
    
    // Footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10, { align: 'right' });
      pdf.text(`Generated on ${new Date().toLocaleDateString('tr-TR')} at ${new Date().toLocaleTimeString('tr-TR')}`, 20, pageHeight - 10);
    }
    
    // Save the PDF
    const fileName = `${entityName}_Financial_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return { success: true, fileName };
    
  } catch (error) {
    console.error('PDF Export Error:', error);
    return { success: false, error: error.message };
  }
};

// Excel Export Functions
export const exportFinancialReportToExcel = (analysisData, entityName = 'Financial Report') => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Helper function to format currency for Excel
    const formatCurrencyValue = (value) => {
      return typeof value === 'number' ? value : 0;
    };
    
    // Helper function to format percentage for Excel
    const formatPercentageValue = (value) => {
      if (value === null || value === undefined || isNaN(value)) return 'N/A';
      return (value * 100).toFixed(2) + '%';
    };
    
    // Summary Sheet
    const summaryData = [
      ['Financial Analysis Summary'],
      [''],
      ['Entity Information'],
      ['Name', analysisData.entityInfo.name],
      ['Type', analysisData.entityInfo.type],
      ['Currency', analysisData.entityInfo.currency],
      ['Report Date', new Date().toLocaleDateString('tr-TR')],
      [''],
      ['Key Financial Metrics'],
      ['Net Worth', formatCurrencyValue(analysisData.summary.netWorth)],
      ['Total Assets', formatCurrencyValue(analysisData.summary.totalAssets)],
      ['Total Liabilities', formatCurrencyValue(analysisData.summary.totalLiabilities)],
      ['Total Income', formatCurrencyValue(analysisData.summary.totalIncome)],
      ['Total Expenses', formatCurrencyValue(analysisData.summary.totalExpenses)],
      [''],
      ['Financial Health Score'],
      ['Score', analysisData.healthScore.score],
      ['Grade', analysisData.healthScore.grade]
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Financial Ratios Sheet
    const ratiosData = [
      ['Financial Ratios Analysis'],
      [''],
      ['Ratio Name', 'Value', 'Formatted Value'],
      ['Liquidity Ratio', analysisData.ratios.liquidityRatio, formatPercentageValue(analysisData.ratios.liquidityRatio)],
      ['Debt to Asset Ratio', analysisData.ratios.debtToAssetRatio, formatPercentageValue(analysisData.ratios.debtToAssetRatio)],
      ['Debt to Equity Ratio', analysisData.ratios.debtToEquityRatio, formatPercentageValue(analysisData.ratios.debtToEquityRatio)],
      ['Profit Margin', analysisData.ratios.profitMargin, formatPercentageValue(analysisData.ratios.profitMargin)],
      ['Return on Assets', analysisData.ratios.returnOnAssets, formatPercentageValue(analysisData.ratios.returnOnAssets)],
      ['Return on Equity', analysisData.ratios.returnOnEquity, formatPercentageValue(analysisData.ratios.returnOnEquity)],
      ['Expense Ratio', analysisData.ratios.expenseRatio, formatPercentageValue(analysisData.ratios.expenseRatio)],
      ['Savings Rate', analysisData.ratios.savingsRate, formatPercentageValue(analysisData.ratios.savingsRate)]
    ];
    
    const ratiosSheet = XLSX.utils.aoa_to_sheet(ratiosData);
    XLSX.utils.book_append_sheet(workbook, ratiosSheet, 'Financial Ratios');
    
    // Cash Flow Analysis Sheet
    const cashFlowData = [
      ['Cash Flow Analysis'],
      [''],
      ['Cash Flow Item', 'Amount', 'Status/Period'],
      ['Annual Income', formatCurrencyValue(analysisData.cashFlowAnalysis.annualIncome), ''],
      ['Annual Expenses', formatCurrencyValue(analysisData.cashFlowAnalysis.annualExpenses), ''],
      ['Annual Net Flow', formatCurrencyValue(analysisData.cashFlowAnalysis.annualNetFlow), ''],
      ['Monthly Income', formatCurrencyValue(analysisData.cashFlowAnalysis.monthlyIncome), ''],
      ['Monthly Expenses', formatCurrencyValue(analysisData.cashFlowAnalysis.monthlyExpenses), ''],
      ['Monthly Net Flow', formatCurrencyValue(analysisData.cashFlowAnalysis.monthlyNetFlow), ''],
      ['Liquid Assets', formatCurrencyValue(analysisData.cashFlowAnalysis.liquidAssets), ''],
      ['Emergency Fund Coverage', analysisData.cashFlowAnalysis.emergencyFundMonths.toFixed(1), 'months'],
      ['Emergency Fund Status', analysisData.cashFlowAnalysis.emergencyFundStatus, ''],
      ['Cash Flow Health', analysisData.cashFlowAnalysis.cashFlowHealth, '']
    ];
    
    const cashFlowSheet = XLSX.utils.aoa_to_sheet(cashFlowData);
    XLSX.utils.book_append_sheet(workbook, cashFlowSheet, 'Cash Flow');
    
    // Investment Portfolio Sheet (if applicable)
    if (analysisData.portfolioAnalysis.totalValue > 0) {
      const portfolioData = [
        ['Investment Portfolio Analysis'],
        [''],
        ['Portfolio Overview'],
        ['Total Value', formatCurrencyValue(analysisData.portfolioAnalysis.totalValue)],
        ['Diversification', analysisData.portfolioAnalysis.diversification],
        ['Risk Level', analysisData.portfolioAnalysis.riskLevel],
        ['Risk Score', analysisData.portfolioAnalysis.riskScore],
        [''],
        ['Asset Allocation'],
        ['Asset Type', 'Percentage', 'Amount'],
        ['Stocks', analysisData.portfolioAnalysis.allocation.stocks.toFixed(2) + '%', (analysisData.portfolioAnalysis.totalValue * analysisData.portfolioAnalysis.allocation.stocks / 100).toFixed(0)],
        ['Bonds', analysisData.portfolioAnalysis.allocation.bonds.toFixed(2) + '%', (analysisData.portfolioAnalysis.totalValue * analysisData.portfolioAnalysis.allocation.bonds / 100).toFixed(0)],
        ['Mutual Funds', analysisData.portfolioAnalysis.allocation.mutualFunds.toFixed(2) + '%', (analysisData.portfolioAnalysis.totalValue * analysisData.portfolioAnalysis.allocation.mutualFunds / 100).toFixed(0)],
        ['Cryptocurrency', analysisData.portfolioAnalysis.allocation.crypto.toFixed(2) + '%', (analysisData.portfolioAnalysis.totalValue * analysisData.portfolioAnalysis.allocation.crypto / 100).toFixed(0)]
      ];
      
      const portfolioSheet = XLSX.utils.aoa_to_sheet(portfolioData);
      XLSX.utils.book_append_sheet(workbook, portfolioSheet, 'Portfolio');
    }
    
    // Recommendations Sheet
    if (analysisData.recommendations.length > 0) {
      const recommendationsData = [
        ['Personalized Recommendations'],
        [''],
        ['Priority', 'Category', 'Message', 'Recommended Action']
      ];
      
      analysisData.recommendations.forEach(rec => {
        recommendationsData.push([
          rec.priority,
          rec.category,
          rec.message,
          rec.action
        ]);
      });
      
      const recommendationsSheet = XLSX.utils.aoa_to_sheet(recommendationsData);
      XLSX.utils.book_append_sheet(workbook, recommendationsSheet, 'Recommendations');
    }
    
    // Health Score Breakdown Sheet
    const healthScoreData = [
      ['Financial Health Score Breakdown'],
      [''],
      ['Component', 'Score/Value', 'Status'],
      ['Overall Score', analysisData.healthScore.score, analysisData.healthScore.grade],
      [''],
      ['Breakdown Components'],
      ['Liquidity', formatPercentageValue(analysisData.healthScore.breakdown.liquidity), 
       analysisData.healthScore.breakdown.liquidity >= 0.5 ? 'Good' : 'Needs Improvement'],
      ['Debt Management', formatPercentageValue(analysisData.healthScore.breakdown.debtManagement),
       analysisData.healthScore.breakdown.debtManagement <= 0.3 ? 'Excellent' : 
       analysisData.healthScore.breakdown.debtManagement <= 0.5 ? 'Good' : 'Needs Improvement'],
      ['Profitability', formatPercentageValue(analysisData.healthScore.breakdown.profitability),
       analysisData.healthScore.breakdown.profitability >= 0.1 ? 'Good' : 
       analysisData.healthScore.breakdown.profitability >= 0 ? 'Fair' : 'Poor'],
      ['Savings', formatPercentageValue(analysisData.healthScore.breakdown.savings),
       analysisData.healthScore.breakdown.savings >= 0.2 ? 'Excellent' :
       analysisData.healthScore.breakdown.savings >= 0.1 ? 'Good' : 'Needs Improvement']
    ];
    
    const healthScoreSheet = XLSX.utils.aoa_to_sheet(healthScoreData);
    XLSX.utils.book_append_sheet(workbook, healthScoreSheet, 'Health Score');
    
    // Save the Excel file
    const fileName = `${entityName}_Financial_Analysis_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    return { success: true, fileName };
    
  } catch (error) {
    console.error('Excel Export Error:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to capture specific elements as images for PDF (if needed in future)
export const captureElementAsImage = async (elementId) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing element as image:', error);
    return null;
  }
};

const exportUtils = {
  exportFinancialReportToPDF,
  exportFinancialReportToExcel,
  captureElementAsImage
};

export default exportUtils;
