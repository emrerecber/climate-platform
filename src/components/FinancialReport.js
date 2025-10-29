import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';

const FinancialReport = ({ analysisData, onClose, onExportPDF, onExportExcel }) => {
  const { t } = useTranslation();
  const [activeReportType, setActiveReportType] = useState('summary');

  if (!analysisData || !analysisData.success) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{t('errorGeneratingReport')}</h2>
        <p>{analysisData?.errors?.join(', ') || t('unknownError')}</p>
        <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px' }}>
          {t('close')}
        </button>
      </div>
    );
  }

  const { entityInfo, summary, ratios, healthScore, portfolioAnalysis, cashFlowAnalysis, recommendations } = analysisData;

  const COLORS = ['#0066cc', '#00a86b', '#ffc107', '#dc3545', '#6c757d', '#17a2b8', '#6610f2'];

  // Prepare data for charts
  const assetAllocationData = [
    { name: t('cashAndEquivalents'), value: parseFloat(analysisData.summary.totalAssets) > 0 ? 20 : 0 },
    { name: t('investments'), value: portfolioAnalysis.totalValue },
    { name: t('realEstate'), value: parseFloat(analysisData.summary.totalAssets) > 0 ? 30 : 0 },
    { name: t('other'), value: parseFloat(analysisData.summary.totalAssets) > 0 ? 25 : 0 }
  ].filter(item => item.value > 0);

  const incomeExpenseData = [
    { name: t('income'), amount: summary.totalIncome, type: 'income' },
    { name: t('expenses'), amount: summary.totalExpenses, type: 'expense' }
  ];

  const portfolioAllocationData = portfolioAnalysis.totalValue > 0 ? [
    { name: t('stocks'), value: portfolioAnalysis.allocation.stocks, amount: (portfolioAnalysis.totalValue * portfolioAnalysis.allocation.stocks / 100) },
    { name: t('bonds'), value: portfolioAnalysis.allocation.bonds, amount: (portfolioAnalysis.totalValue * portfolioAnalysis.allocation.bonds / 100) },
    { name: t('mutualFunds'), value: portfolioAnalysis.allocation.mutualFunds, amount: (portfolioAnalysis.totalValue * portfolioAnalysis.allocation.mutualFunds / 100) },
    { name: t('crypto'), value: portfolioAnalysis.allocation.crypto, amount: (portfolioAnalysis.totalValue * portfolioAnalysis.allocation.crypto / 100) }
  ].filter(item => item.value > 0) : [];

  const financialHealthData = [
    { name: t('liquidity'), value: healthScore.breakdown.liquidity ? (healthScore.breakdown.liquidity * 100) : 0, fullMark: 100 },
    { name: t('debtManagement'), value: healthScore.breakdown.debtManagement ? (100 - healthScore.breakdown.debtManagement * 100) : 100, fullMark: 100 },
    { name: t('profitability'), value: healthScore.breakdown.profitability ? (healthScore.breakdown.profitability * 100) : 0, fullMark: 100 },
    { name: t('savings'), value: healthScore.breakdown.savings ? (healthScore.breakdown.savings * 100) : 0, fullMark: 100 }
  ];

  const cashFlowTrendData = [
    { month: t('jan'), income: cashFlowAnalysis.monthlyIncome * 0.9, expenses: cashFlowAnalysis.monthlyExpenses * 0.95 },
    { month: t('feb'), income: cashFlowAnalysis.monthlyIncome * 0.95, expenses: cashFlowAnalysis.monthlyExpenses * 0.98 },
    { month: t('mar'), income: cashFlowAnalysis.monthlyIncome * 1.1, expenses: cashFlowAnalysis.monthlyExpenses * 1.02 },
    { month: t('apr'), income: cashFlowAnalysis.monthlyIncome * 1.05, expenses: cashFlowAnalysis.monthlyExpenses * 0.97 },
    { month: t('may'), income: cashFlowAnalysis.monthlyIncome * 0.98, expenses: cashFlowAnalysis.monthlyExpenses * 1.05 },
    { month: t('jun'), income: cashFlowAnalysis.monthlyIncome, expenses: cashFlowAnalysis.monthlyExpenses }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: summary.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#fbbf24';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const renderSummaryReport = () => (
    <div>
      {/* Entity Overview */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '30px',
        borderRadius: '16px',
        marginBottom: '30px',
        color: 'white'
      }}>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '28px' }}>{entityInfo.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <p style={{ margin: '0 0 5px 0', opacity: 0.8 }}>{t('entityType')}</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{t(entityInfo.type)}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 5px 0', opacity: 0.8 }}>{t('currency')}</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{entityInfo.currency}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 5px 0', opacity: 0.8 }}>{t('reportDate')}</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{
          backgroundColor: '#10b981',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>{t('netWorth')}</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {formatCurrency(summary.netWorth)}
          </p>
        </div>

        <div style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>{t('totalAssets')}</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {formatCurrency(summary.totalAssets)}
          </p>
        </div>

        <div style={{
          backgroundColor: '#f59e0b',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>{t('totalLiabilities')}</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {formatCurrency(summary.totalLiabilities)}
          </p>
        </div>

        <div style={{
          backgroundColor: getHealthScoreColor(healthScore.score),
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>{t('financialHealthScore')}</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {healthScore.score}/100 ({healthScore.grade})
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Income vs Expenses */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>{t('incomeVsExpenses')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Allocation */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>{t('assetAllocation')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetAllocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {assetAllocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Health Radar */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>{t('financialHealthBreakdown')}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={financialHealthData}>
            <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="value" />
            <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Insights */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ marginBottom: '20px' }}>{t('quickInsights')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4 style={{ color: '#10b981', marginBottom: '10px' }}>{t('strengths')}</h4>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {healthScore.score >= 70 && <li>{t('strongFinancialHealth')}</li>}
              {ratios.profitMargin > 0.1 && <li>{t('goodProfitability')}</li>}
              {ratios.liquidityRatio > 0.5 && <li>{t('adequateLiquidity')}</li>}
              {portfolioAnalysis.diversification === 'Well Diversified' && <li>{t('wellDiversifiedPortfolio')}</li>}
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#ef4444', marginBottom: '10px' }}>{t('areasForImprovement')}</h4>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {ratios.debtToAssetRatio > 0.5 && <li>{t('highDebtLevel')}</li>}
              {cashFlowAnalysis.emergencyFundStatus === 'Insufficient' && <li>{t('insufficientEmergencyFund')}</li>}
              {portfolioAnalysis.totalValue === 0 && <li>{t('noInvestmentPortfolio')}</li>}
              {ratios.savingsRate < 0.1 && <li>{t('lowSavingsRate')}</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailedReport = () => (
    <div>
      {/* Financial Ratios Table */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>{t('financialRatios')}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>{t('ratio')}</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>{t('value')}</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>{t('benchmark')}</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{t('liquidityRatio')}</td>
              <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatPercentage(ratios.liquidityRatio)}</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>≥ 50%</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  backgroundColor: ratios.liquidityRatio >= 0.5 ? '#d1fae5' : '#fee2e2',
                  color: ratios.liquidityRatio >= 0.5 ? '#065f46' : '#991b1b'
                }}>
                  {ratios.liquidityRatio >= 0.5 ? t('good') : t('needsImprovement')}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{t('debtToAssetRatio')}</td>
              <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatPercentage(ratios.debtToAssetRatio)}</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>≤ 30%</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  backgroundColor: ratios.debtToAssetRatio <= 0.3 ? '#d1fae5' : '#fee2e2',
                  color: ratios.debtToAssetRatio <= 0.3 ? '#065f46' : '#991b1b'
                }}>
                  {ratios.debtToAssetRatio <= 0.3 ? t('excellent') : t('caution')}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{t('profitMargin')}</td>
              <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatPercentage(ratios.profitMargin)}</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>≥ 10%</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  backgroundColor: ratios.profitMargin >= 0.1 ? '#d1fae5' : ratios.profitMargin >= 0 ? '#fef3c7' : '#fee2e2',
                  color: ratios.profitMargin >= 0.1 ? '#065f46' : ratios.profitMargin >= 0 ? '#92400e' : '#991b1b'
                }}>
                  {ratios.profitMargin >= 0.1 ? t('good') : ratios.profitMargin >= 0 ? t('fair') : t('poor')}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{t('savingsRate')}</td>
              <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatPercentage(ratios.savingsRate)}</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>≥ 20%</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  backgroundColor: ratios.savingsRate >= 0.2 ? '#d1fae5' : ratios.savingsRate >= 0.1 ? '#fef3c7' : '#fee2e2',
                  color: ratios.savingsRate >= 0.2 ? '#065f46' : ratios.savingsRate >= 0.1 ? '#92400e' : '#991b1b'
                }}>
                  {ratios.savingsRate >= 0.2 ? t('excellent') : ratios.savingsRate >= 0.1 ? t('good') : t('needsImprovement')}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cash Flow Analysis */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>{t('cashFlowAnalysis')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '25px' }}>
          <div>
            <h4 style={{ marginBottom: '15px' }}>{t('monthlyCashFlow')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                <span>{t('income')}</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>{formatCurrency(cashFlowAnalysis.monthlyIncome)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                <span>{t('expenses')}</span>
                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{formatCurrency(cashFlowAnalysis.monthlyExpenses)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#e5e7eb', borderRadius: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>{t('netFlow')}</span>
                <span style={{ 
                  fontWeight: 'bold', 
                  color: cashFlowAnalysis.monthlyNetFlow > 0 ? '#10b981' : '#ef4444' 
                }}>
                  {formatCurrency(cashFlowAnalysis.monthlyNetFlow)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '15px' }}>{t('emergencyFund')}</h4>
            <div style={{
              padding: '20px',
              backgroundColor: 
                cashFlowAnalysis.emergencyFundStatus === 'Excellent' ? '#d1fae5' :
                cashFlowAnalysis.emergencyFundStatus === 'Good' ? '#fef3c7' : '#fee2e2',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
                {cashFlowAnalysis.emergencyFundMonths.toFixed(1)}
              </div>
              <div style={{ marginBottom: '8px' }}>{t('monthsOfExpenses')}</div>
              <div style={{ 
                fontWeight: 'bold',
                color: 
                  cashFlowAnalysis.emergencyFundStatus === 'Excellent' ? '#065f46' :
                  cashFlowAnalysis.emergencyFundStatus === 'Good' ? '#92400e' : '#991b1b'
              }}>
                {t(cashFlowAnalysis.emergencyFundStatus.toLowerCase())}
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Trend */}
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cashFlowTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Investment Portfolio Analysis */}
      {portfolioAnalysis.totalValue > 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '20px' }}>{t('investmentPortfolioAnalysis')}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <h4 style={{ marginBottom: '15px' }}>{t('portfolioOverview')}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t('totalValue')}</span>
                  <span style={{ fontWeight: 'bold' }}>{formatCurrency(portfolioAnalysis.totalValue)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t('diversification')}</span>
                  <span style={{ fontWeight: 'bold' }}>{t(portfolioAnalysis.diversification.toLowerCase().replace(' ', ''))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t('riskLevel')}</span>
                  <span style={{ fontWeight: 'bold' }}>{t(portfolioAnalysis.riskLevel.toLowerCase().replace(' ', ''))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t('riskScore')}</span>
                  <span style={{ fontWeight: 'bold' }}>{portfolioAnalysis.riskScore}/100</span>
                </div>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>{t('portfolioAllocation')}</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={portfolioAllocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {portfolioAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [formatCurrency(props.payload.amount), name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRecommendationsReport = () => (
    <div>
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ marginBottom: '20px' }}>{t('personalizedRecommendations')}</h3>
        
        {recommendations.map((rec, index) => (
          <div key={index} style={{
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '12px',
            borderLeft: `4px solid ${
              rec.priority === 'High' ? '#ef4444' :
              rec.priority === 'Medium' ? '#f59e0b' : '#10b981'
            }`,
            backgroundColor: 
              rec.priority === 'High' ? '#fef2f2' :
              rec.priority === 'Medium' ? '#fffbeb' : '#f0fdf4'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, color: '#1f2937' }}>{t(rec.category.toLowerCase().replace(' ', ''))}</h4>
              <span style={{
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: 
                  rec.priority === 'High' ? '#ef4444' :
                  rec.priority === 'Medium' ? '#f59e0b' : '#10b981',
                color: 'white'
              }}>
                {t(rec.priority.toLowerCase())} {t('priority')}
              </span>
            </div>
            <p style={{ margin: '0 0 10px 0', color: '#6b7280', lineHeight: '1.6' }}>
              {rec.message}
            </p>
            <p style={{ margin: 0, fontWeight: '500', color: '#374151' }}>
              <strong>{t('recommendedAction')}:</strong> {rec.action}
            </p>
          </div>
        ))}
        
        {recommendations.length === 0 && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#f0fdf4',
            borderRadius: '12px',
            border: '1px solid #d1fae5'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
            <h4 style={{ color: '#065f46', marginBottom: '10px' }}>{t('excellentFinancialHealth')}</h4>
            <p style={{ color: '#047857', margin: 0 }}>{t('keepUpGoodWork')}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#f9fafb',
        borderRadius: '16px',
        width: '95%',
        maxWidth: '1200px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 30px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
              {t('financialAnalysisReport')}
            </h1>
            <p style={{ margin: 0, opacity: 0.9 }}>
              {entityInfo.name} - {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onExportPDF}
              style={{
                padding: '10px 16px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📄 PDF
            </button>
            <button
              onClick={onExportExcel}
              style={{
                padding: '10px 16px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📊 Excel
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '10px 16px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Report Navigation */}
        <div style={{
          padding: '20px 30px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: 'white'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { key: 'summary', label: t('summaryReport') },
              { key: 'detailed', label: t('detailedAnalysis') },
              { key: 'recommendations', label: t('recommendations') }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveReportType(tab.key)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: activeReportType === tab.key ? '#3b82f6' : '#f3f4f6',
                  color: activeReportType === tab.key ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeReportType === tab.key ? '600' : '400'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '30px'
        }}>
          {activeReportType === 'summary' && renderSummaryReport()}
          {activeReportType === 'detailed' && renderDetailedReport()}
          {activeReportType === 'recommendations' && renderRecommendationsReport()}
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;