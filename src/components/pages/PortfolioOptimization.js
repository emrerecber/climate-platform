import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTranslation } from 'react-i18next';

const PortfolioOptimization = () => {
  const { t } = useTranslation();
  const [optimizationScenario, setOptimizationScenario] = useState('esg-balanced');
  const [riskTolerance, setRiskTolerance] = useState('moderate');
  const [optimizationObjective, setOptimizationObjective] = useState('sharpe-ratio');
  const [isOptimizationApplied, setIsOptimizationApplied] = useState(false);
  
  // Handle detailed report generation
  const handleGenerateDetailedReport = () => {
    const reportData = {
      scenario: optimizationScenario,
      riskTolerance,
      objective: optimizationObjective,
      currentPortfolio,
      optimizedPortfolio: optimizedPortfolios[optimizationScenario],
      performanceComparison,
      backtestData,
      currentMetrics: getCurrentPortfolioMetrics(),
      optimizedMetrics: getOptimizedPortfolioMetrics(),
      timestamp: new Date().toISOString()
    };
    
    // Generate and download detailed PDF report
    generatePortfolioOptimizationReport(reportData);
  };
  
  // Handle optimization application
  const handleApplyOptimization = () => {
    if (window.confirm('Bu optimizasyonu uygulamak istediğinizden emin misiniz? Bu işlem portföyünüzü yeniden dengeleyecektir.')) {
      // In a real application, this would connect to backend services
      // For now, we'll simulate the process
      setIsOptimizationApplied(true);
      
      // Show success message
      setTimeout(() => {
        alert(`Optimizasyon başarıyla uygulandı!\n\nYeni portföy dağılımı:\n${getOptimizationSummary()}`);
      }, 1000);
    }
  };
  
  // Generate optimization summary
  const getOptimizationSummary = () => {
    const optimized = optimizedPortfolios[optimizationScenario];
    return optimized
      .filter(item => item.value > 0)
      .map(item => `• ${item.name}: ${item.value}%`)
      .join('\n');
  };
  
  // Generate PDF report function
  const generatePortfolioOptimizationReport = async (data) => {
    try {
      // Dynamic import to avoid loading jsPDF unless needed
      const jsPDF = (await import('jspdf')).default;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;
      
      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(16, 185, 129);
      pdf.text('Portfolio Optimization Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Date and scenario info
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Generated: ${new Date().toLocaleString('tr-TR')}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Scenario: ${data.scenario}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Risk Tolerance: ${data.riskTolerance}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Objective: ${data.objective}`, 20, yPosition);
      yPosition += 15;
      
      // Current vs Optimized comparison
      pdf.setFontSize(16);
      pdf.setTextColor(59, 130, 246);
      pdf.text('Performance Comparison', 20, yPosition);
      yPosition += 12;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      // Performance table
      data.performanceComparison.forEach((row) => {
        pdf.text(row.metric, 25, yPosition);
        pdf.text(row.current, 80, yPosition);
        pdf.text(row.optimized, 120, yPosition);
        pdf.text(row.improvement, 160, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
      
      // Portfolio allocation
      pdf.setFontSize(16);
      pdf.setTextColor(59, 130, 246);
      pdf.text('Optimized Portfolio Allocation', 20, yPosition);
      yPosition += 12;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      data.optimizedPortfolio.filter(item => item.value > 0).forEach((item) => {
        pdf.text(`${item.name}: ${item.value}%`, 25, yPosition);
        yPosition += 6;
      });
      
      // Save PDF
      const fileName = `Portfolio_Optimization_Report_${data.scenario}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      alert(`Detaylı rapor başarıyla oluşturuldu: ${fileName}`);
      
    } catch (error) {
      console.error('Report generation error:', error);
      alert('Rapor oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  // Current portfolio data
  const currentPortfolio = [
    { name: 'Enerji', value: 25, risk: 18, esgScore: 35, color: '#ef4444' },
    { name: 'Teknoloji', value: 20, risk: 22, esgScore: 75, color: '#3b82f6' },
    { name: 'Finans', value: 15, risk: 14, esgScore: 60, color: '#f59e0b' },
    { name: 'Sağlık', value: 12, risk: 10, esgScore: 85, color: '#10b981' },
    { name: 'Sanayi', value: 10, risk: 16, esgScore: 45, color: '#8b5cf6' },
    { name: 'Tüketici', value: 8, risk: 12, esgScore: 55, color: '#ec4899' },
    { name: 'Telekomünikasyon', value: 6, risk: 8, esgScore: 70, color: '#06b6d4' },
    { name: 'Emlak', value: 4, risk: 20, esgScore: 40, color: '#64748b' }
  ];

  // Optimized portfolio scenarios
  const optimizedPortfolios = {
    'esg-balanced': [
      { name: 'Teknoloji', value: 28, risk: 22, esgScore: 75, color: '#3b82f6' },
      { name: 'Sağlık', value: 22, risk: 10, esgScore: 85, color: '#10b981' },
      { name: 'Finans', value: 18, risk: 14, esgScore: 60, color: '#f59e0b' },
      { name: 'Enerji', value: 12, risk: 18, esgScore: 35, color: '#ef4444' },
      { name: 'Telekomünikasyon', value: 10, risk: 8, esgScore: 70, color: '#06b6d4' },
      { name: 'Tüketici', value: 6, risk: 12, esgScore: 55, color: '#ec4899' },
      { name: 'Sanayi', value: 4, risk: 16, esgScore: 45, color: '#8b5cf6' },
      { name: 'Emlak', value: 0, risk: 20, esgScore: 40, color: '#64748b' }
    ],
    'climate-focused': [
      { name: 'Yenilenebilir Enerji', value: 35, risk: 25, esgScore: 90, color: '#22c55e' },
      { name: 'Temiz Teknoloji', value: 25, risk: 28, esgScore: 88, color: '#3b82f6' },
      { name: 'ESG Finans', value: 15, risk: 12, esgScore: 75, color: '#f59e0b' },
      { name: 'Sürdürülebilir Ulaşım', value: 15, risk: 30, esgScore: 85, color: '#10b981' },
      { name: 'Çevreci Emlak', value: 10, risk: 15, esgScore: 80, color: '#06b6d4' },
      { name: 'Enerji', value: 0, risk: 18, esgScore: 35, color: '#ef4444' },
      { name: 'Sanayi', value: 0, risk: 16, esgScore: 45, color: '#8b5cf6' },
      { name: 'Emlak', value: 0, risk: 20, esgScore: 40, color: '#64748b' }
    ],
    'risk-minimized': [
      { name: 'Sağlık', value: 30, risk: 10, esgScore: 85, color: '#10b981' },
      { name: 'Finans', value: 25, risk: 14, esgScore: 60, color: '#f59e0b' },
      { name: 'Tüketici', value: 20, risk: 12, esgScore: 55, color: '#ec4899' },
      { name: 'Teknoloji', value: 15, risk: 22, esgScore: 75, color: '#3b82f6' },
      { name: 'Telekomünikasyon', value: 10, risk: 8, esgScore: 70, color: '#06b6d4' },
      { name: 'Enerji', value: 0, risk: 18, esgScore: 35, color: '#ef4444' },
      { name: 'Sanayi', value: 0, risk: 16, esgScore: 45, color: '#8b5cf6' },
      { name: 'Emlak', value: 0, risk: 20, esgScore: 40, color: '#64748b' }
    ]
  };

  // Performance comparison data
  const performanceComparison = [
    { metric: 'Expected Return', current: '8.2%', optimized: '9.1%', improvement: '+0.9%' },
    { metric: 'Risk (Volatility)', current: '15.8%', optimized: '13.2%', improvement: '-2.6%' },
    { metric: 'Sharpe Ratio', current: '0.52', optimized: '0.69', improvement: '+0.17' },
    { metric: 'ESG Score', current: '58', optimized: '74', improvement: '+16' },
    { metric: 'Climate VaR', current: '-€695M', optimized: '-€420M', improvement: '+€275M' },
    { metric: 'Carbon Intensity', current: '145 tCO₂/€M', optimized: '89 tCO₂/€M', improvement: '-56' }
  ];

  // Historical simulation data
  const backtestData = [
    { year: '2019', current: 100, optimized: 100 },
    { year: '2020', current: 85, optimized: 92 },
    { year: '2021', current: 118, optimized: 125 },
    { year: '2022', current: 108, optimized: 119 },
    { year: '2023', current: 125, optimized: 138 },
    { year: '2024', current: 132, optimized: 149 }
  ];

  const getCurrentPortfolioMetrics = () => {
    const totalValue = currentPortfolio.reduce((sum, item) => sum + item.value, 0);
    const weightedRisk = currentPortfolio.reduce((sum, item) => sum + (item.value / totalValue) * item.risk, 0);
    const weightedESG = currentPortfolio.reduce((sum, item) => sum + (item.value / totalValue) * item.esgScore, 0);
    return { totalValue, weightedRisk: weightedRisk.toFixed(1), weightedESG: weightedESG.toFixed(0) };
  };

  const getOptimizedPortfolioMetrics = () => {
    const portfolio = optimizedPortfolios[optimizationScenario];
    const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0);
    const weightedRisk = portfolio.reduce((sum, item) => sum + (item.value / totalValue) * item.risk, 0);
    const weightedESG = portfolio.reduce((sum, item) => sum + (item.value / totalValue) * item.esgScore, 0);
    return { totalValue, weightedRisk: weightedRisk.toFixed(1), weightedESG: weightedESG.toFixed(0) };
  };

  const currentMetrics = getCurrentPortfolioMetrics();
  const optimizedMetrics = getOptimizedPortfolioMetrics();

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '8px', color: '#10b981' }}>📊 {t('portfolioOptimization') || 'Portfolio Optimization'}</h1>
        <p style={{ color: '#666' }}>ESG ve İklim Risk bazlı portföy optimizasyonu ve yeniden dengeleme</p>
      </div>

      {/* Optimization Controls */}
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '25px', 
        borderRadius: '12px', 
        marginBottom: '30px',
        border: '1px solid #e2e8f0' 
      }}>
        <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>⚙️ Optimizasyon Parametreleri</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Optimizasyon Senaryosu
            </label>
            <select 
              value={optimizationScenario}
              onChange={(e) => setOptimizationScenario(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px'
              }}
            >
              <option value="esg-balanced">ESG Dengeli</option>
              <option value="climate-focused">İklim Odaklı</option>
              <option value="risk-minimized">Risk Minimize</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Risk Toleransı
            </label>
            <select 
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px'
              }}
            >
              <option value="conservative">Muhafazakar</option>
              <option value="moderate">Orta</option>
              <option value="aggressive">Agresif</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Optimizasyon Hedefi
            </label>
            <select 
              value={optimizationObjective}
              onChange={(e) => setOptimizationObjective(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px'
              }}
            >
              <option value="sharpe-ratio">Sharpe Ratio</option>
              <option value="max-return">Maksimum Getiri</option>
              <option value="min-risk">Minimum Risk</option>
              <option value="esg-score">ESG Skoru</option>
              <option value="climate-alignment">İklim Uyumu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Portfolio Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* Current Portfolio */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', color: '#dc2626' }}>📈 Mevcut Portföy</h3>
          <div style={{ height: '300px', marginBottom: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentPortfolio}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, value}) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {currentPortfolio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div style={{ padding: '10px', backgroundColor: '#fef2f2', borderRadius: '6px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>{currentMetrics.weightedRisk}%</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Risk</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#fef3c7', borderRadius: '6px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d97706' }}>{currentMetrics.weightedESG}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>ESG Skoru</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#dbeafe', borderRadius: '6px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>0.52</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Sharpe</div>
            </div>
          </div>
        </div>

        {/* Optimized Portfolio */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', color: '#10b981' }}>🎯 Optimize Edilmiş Portföy</h3>
          <div style={{ height: '300px', marginBottom: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={optimizedPortfolios[optimizationScenario]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, value}) => value > 0 ? `${name}: ${value}%` : ''}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {optimizedPortfolios[optimizationScenario].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div style={{ padding: '10px', backgroundColor: '#dcfce7', borderRadius: '6px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>{optimizedMetrics.weightedRisk}%</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Risk</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#dcfce7', borderRadius: '6px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>{optimizedMetrics.weightedESG}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>ESG Skoru</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#dcfce7', borderRadius: '6px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>0.69</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Sharpe</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Comparison Table */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>📊 Performans Karşılaştırması</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Metrik</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Mevcut Portföy</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Optimize Portföy</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>İyileştirme</th>
              </tr>
            </thead>
            <tbody>
              {performanceComparison.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{row.metric}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>{row.current}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>{row.optimized}</td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    fontSize: '14px', 
                    fontWeight: 'bold',
                    color: row.improvement.includes('+') ? '#16a34a' : '#dc2626'
                  }}>
                    {row.improvement}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Backtest */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>📈 Geçmiş Performans Simülasyonu</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={backtestData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke="#dc2626" 
                strokeWidth={3}
                name="Mevcut Portföy"
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="optimized" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Optimize Portföy"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ 
          backgroundColor: '#f0fdf4', 
          padding: '15px', 
          borderRadius: '8px', 
          marginTop: '20px',
          border: '1px solid #bbf7d0'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#15803d' }}>
            <strong>5 Yıllık Getiri:</strong> Mevcut portföy %32 vs Optimize portföy %49 (+17 puan daha iyi performans)
          </p>
        </div>
      </div>

      {/* Implementation Actions */}
      <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>🎯 Uygulama Önerileri</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '16px', marginBottom: '10px', color: '#dc2626' }}>Azaltılacak Pozisyonlar</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                🔴 Enerji sektörü: -13% (-€3.2B)
              </li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                🔴 Emlak sektörü: -4% (-€1.0B)
              </li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                🔴 Sanayi sektörü: -6% (-€1.5B)
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '16px', marginBottom: '10px', color: '#10b981' }}>Artırılacak Pozisyonlar</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                🟢 Teknoloji sektörü: +8% (+€2.0B)
              </li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                🟢 Sağlık sektörü: +10% (+€2.5B)
              </li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>
                🟢 ESG Finans: +3% (+€0.7B)
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={handleGenerateDetailedReport}
            style={{
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            📊 Detaylı Rapor Oluştur
          </button>
          <button 
            onClick={handleApplyOptimization}
            style={{
              padding: '12px 24px',
              backgroundColor: isOptimizationApplied ? '#16a34a' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isOptimizationApplied ? '✅ Uygulandı' : '⚡ Optimizasyonu Uygula'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOptimization;