import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useTranslation } from 'react-i18next';

const RegulatoryReports = () => {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState('tcfd');
  const [reportingPeriod, setReportingPeriod] = useState('2024');
  
  // Handle report download
  const handleDownloadReport = () => {
    generateRegulatoryReport(selectedReport, reportingPeriod);
  };
  
  // Handle email sending
  const handleSendEmail = () => {
    const recipient = prompt(t('enterEmailPrompt'));
    if (recipient && validateEmail(recipient)) {
      // Simulate email sending
      alert(`${getReportTitle(selectedReport)} ${t('reportGeneratedMessage')} ${recipient}...\n\n${t('emailSentSuccess')}`);
    } else if (recipient) {
      alert(t('validEmailError'));
    }
  };
  
  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Get report title
  const getReportTitle = (reportType) => {
    switch (reportType) {
      case 'tcfd': return 'TCFD - Task Force on Climate';
      case 'taxonomy': return 'EU Taxonomy - Environmental';
      case 'sfdr': return 'SFDR - Sustainable Finance';
      case 'csrd': return 'CSRD - Corporate Sustainability';
      default: return 'Regulatory Report';
    }
  };
  
  // Generate regulatory report
  const generateRegulatoryReport = async (reportType, period) => {
    try {
      // Dynamic import to avoid loading jsPDF unless needed
      const jsPDF = (await import('jspdf')).default;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;
      
      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(139, 92, 246);
      pdf.text(getReportTitle(reportType), pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
      
      pdf.setFontSize(14);
      pdf.setTextColor(102, 102, 102);
      pdf.text(`Reporting Period: ${period}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;
      
      // Report content based on type
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      
      if (reportType === 'tcfd') {
        generateTCFDReportContent(pdf, yPosition);
      } else if (reportType === 'taxonomy') {
        generateTaxonomyReportContent(pdf, yPosition);
      } else if (reportType === 'sfdr') {
        generateSFDRReportContent(pdf, yPosition);
      } else {
        pdf.text('Report content will be generated based on selected type.', 20, yPosition);
      }
      
      // Save PDF
      const fileName = `${reportType.toUpperCase()}_Report_${period}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      alert(`${getReportTitle(reportType)} ${t('reportGeneratedMessage')}: ${fileName}`);
      
    } catch (error) {
      console.error('Report generation error:', error);
      alert(t('reportGenerationError'));
    }
  };
  
  // TCFD report content
  const generateTCFDReportContent = (pdf, startY) => {
    let yPosition = startY;
    
    // Overall scores
    pdf.setFontSize(16);
    pdf.setTextColor(59, 130, 246);
    pdf.text('TCFD Compliance Overview', 20, yPosition);
    yPosition += 12;
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const pillars = [
      { name: 'Governance', data: tcfdData.governance },
      { name: 'Strategy', data: tcfdData.strategy },
      { name: 'Risk Management', data: tcfdData.riskManagement },
      { name: 'Metrics & Targets', data: tcfdData.metrics }
    ];
    
    pillars.forEach((pillar) => {
      pdf.text(`${pillar.name}: ${pillar.data.score}% (${pillar.data.status})`, 25, yPosition);
      yPosition += 8;
    });
    
    yPosition += 10;
    
    // Detailed requirements
    pdf.setFontSize(14);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Detailed Requirements Analysis', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    
    Object.entries(tcfdData).forEach(([pillarKey, pillar]) => {
      pdf.text(`${pillarKey.toUpperCase()}:`, 25, yPosition);
      yPosition += 6;
      
      pillar.items.forEach((item) => {
        pdf.text(`  • ${item.requirement}: ${item.status} (${item.score}%)`, 30, yPosition);
        yPosition += 5;
      });
      
      yPosition += 5;
    });
  };
  
  // Taxonomy report content
  const generateTaxonomyReportContent = (pdf, startY) => {
    let yPosition = startY;
    
    pdf.setFontSize(16);
    pdf.setTextColor(59, 130, 246);
    pdf.text('EU Taxonomy Alignment Report', 20, yPosition);
    yPosition += 12;
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    pdf.text(`Total Eligible Activities: ${taxonomyData.eligible}%`, 25, yPosition);
    yPosition += 8;
    pdf.text(`Total Aligned Activities: ${taxonomyData.aligned}%`, 25, yPosition);
    yPosition += 8;
    pdf.text(`Not Aligned Activities: ${taxonomyData.notAligned}%`, 25, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(14);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Activity Breakdown', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    
    taxonomyData.breakdown.forEach((activity) => {
      pdf.text(`${activity.activity}:`, 25, yPosition);
      yPosition += 5;
      pdf.text(`  Volume: ${activity.volume}`, 30, yPosition);
      yPosition += 5;
      pdf.text(`  Eligible: ${activity.eligible}% | Aligned: ${activity.aligned}%`, 30, yPosition);
      yPosition += 8;
    });
  };
  
  // SFDR report content
  const generateSFDRReportContent = (pdf, startY) => {
    let yPosition = startY;
    
    pdf.setFontSize(16);
    pdf.setTextColor(59, 130, 246);
    pdf.text('SFDR Sustainable Finance Report', 20, yPosition);
    yPosition += 12;
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    // Fund classification
    pdf.text(`Article 6: ${sfdrData.article6.percentage}% (${sfdrData.article6.volume})`, 25, yPosition);
    yPosition += 8;
    pdf.text(`Article 8: ${sfdrData.article8.percentage}% (${sfdrData.article8.volume})`, 25, yPosition);
    yPosition += 8;
    pdf.text(`Article 9: ${sfdrData.article9.percentage}% (${sfdrData.article9.volume})`, 25, yPosition);
    yPosition += 15;
    
    // PAI indicators
    pdf.setFontSize(14);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Principal Adverse Impact Indicators', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    
    pdf.text(`Scope 1 Emissions: ${sfdrData.pai.scope1}M tCO₂e`, 25, yPosition);
    yPosition += 6;
    pdf.text(`Scope 2 Emissions: ${sfdrData.pai.scope2}M tCO₂e`, 25, yPosition);
    yPosition += 6;
    pdf.text(`Water Usage: ${sfdrData.pai.waterUsage}ML`, 25, yPosition);
    yPosition += 6;
    pdf.text(`Board Gender Diversity: ${sfdrData.pai.boardGenderDiversity}%`, 25, yPosition);
    yPosition += 6;
  };

  // TCFD Compliance Data
  const tcfdData = {
    governance: {
      score: 85,
      status: 'Compliant',
      items: [
        { requirement: 'Board climate oversight', status: 'Complete', score: 100 },
        { requirement: 'Management assessment', status: 'Complete', score: 90 },
        { requirement: 'Risk committee structure', status: 'Partial', score: 75 },
        { requirement: 'Reporting processes', status: 'Complete', score: 85 }
      ]
    },
    strategy: {
      score: 72,
      status: 'Partial',
      items: [
        { requirement: 'Climate scenarios analysis', status: 'Complete', score: 85 },
        { requirement: 'Business impact assessment', status: 'Partial', score: 70 },
        { requirement: 'Strategic planning integration', status: 'Partial', score: 60 },
        { requirement: 'Financial planning alignment', status: 'Complete', score: 80 }
      ]
    },
    riskManagement: {
      score: 88,
      status: 'Compliant',
      items: [
        { requirement: 'Risk identification process', status: 'Complete', score: 95 },
        { requirement: 'Risk assessment methodology', status: 'Complete', score: 90 },
        { requirement: 'Risk integration', status: 'Complete', score: 85 },
        { requirement: 'Risk monitoring', status: 'Partial', score: 75 }
      ]
    },
    metrics: {
      score: 91,
      status: 'Compliant',
      items: [
        { requirement: 'GHG emissions reporting', status: 'Complete', score: 95 },
        { requirement: 'Climate-related metrics', status: 'Complete', score: 90 },
        { requirement: 'Targets disclosure', status: 'Complete', score: 90 },
        { requirement: 'Historical data', status: 'Partial', score: 85 }
      ]
    }
  };

  // EU Taxonomy Data
  const taxonomyData = {
    eligible: 45,
    aligned: 32,
    notAligned: 13,
    breakdown: [
      { activity: 'Renewable Energy', eligible: 85, aligned: 78, volume: '€4.2B' },
      { activity: 'Energy Efficiency', eligible: 60, aligned: 45, volume: '€2.1B' },
      { activity: 'Clean Transportation', eligible: 40, aligned: 35, volume: '€1.8B' },
      { activity: 'Green Buildings', eligible: 55, aligned: 48, volume: '€1.5B' },
      { activity: 'Water Management', eligible: 35, aligned: 25, volume: '€0.8B' },
      { activity: 'Circular Economy', eligible: 30, aligned: 20, volume: '€0.6B' }
    ]
  };

  // SFDR Data
  const sfdrData = {
    article8: { volume: '€4.2B', percentage: 42 },
    article9: { volume: '€0.8B', percentage: 8 },
    article6: { volume: '€5.0B', percentage: 50 },
    pai: {
      scope1: 145.2,
      scope2: 89.7,
      scope3: 2156.8,
      waterUsage: 125.3,
      wasteGeneration: 89.1,
      biodiversityImpact: 'Medium',
      socialViolations: 2,
      boardGenderDiversity: 38.5
    }
  };

  // Regulatory Timeline
  const timeline = [
    { date: '2024-01-15', regulation: 'TCFD Report', status: 'Submitted', score: 84 },
    { date: '2024-02-28', regulation: 'EU Taxonomy Report', status: 'Submitted', score: 78 },
    { date: '2024-03-31', regulation: 'SFDR Annual Report', status: 'Submitted', score: 86 },
    { date: '2024-06-30', regulation: 'CSRD Interim Report', status: 'Due', score: 0 },
    { date: '2024-09-30', regulation: 'Carbon Accounting', status: 'Planned', score: 0 },
    { date: '2024-12-31', regulation: 'Annual Sustainability', status: 'Planned', score: 0 }
  ];

  const renderTCFDReport = () => {
    const pillars = [
      { name: 'Governance', data: tcfdData.governance, color: '#3b82f6' },
      { name: 'Strategy', data: tcfdData.strategy, color: '#f59e0b' },
      { name: 'Risk Mgmt', data: tcfdData.riskManagement, color: '#10b981' },
      { name: 'Metrics', data: tcfdData.metrics, color: '#8b5cf6' }
    ];

    return (
      <div>
        {/* TCFD Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          {pillars.map((pillar) => (
            <div key={pillar.name} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <h4 style={{ marginBottom: '15px', color: pillar.color }}>{pillar.name}</h4>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: pillar.color, marginBottom: '10px' }}>
                {pillar.data.score}%
              </div>
              <div style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: pillar.data.status === 'Compliant' ? '#dcfce7' : '#fef3c7',
                color: pillar.data.status === 'Compliant' ? '#16a34a' : '#d97706'
              }}>
                {pillar.data.status}
              </div>
            </div>
          ))}
        </div>

        {/* TCFD Details */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>📋 TCFD Detaylı Uyumluluk Analizi</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Pillar</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Requirement</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(tcfdData).map(([pillarKey, pillar]) =>
                  pillar.items.map((item, index) => (
                    <tr key={`${pillarKey}-${index}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      {index === 0 && (
                        <td rowSpan={pillar.items.length} style={{
                          padding: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          verticalAlign: 'top',
                          borderRight: '1px solid #e2e8f0'
                        }}>
                          {pillarKey.charAt(0).toUpperCase() + pillarKey.slice(1)}
                        </td>
                      )}
                      <td style={{ padding: '12px', fontSize: '14px' }}>{item.requirement}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: item.status === 'Complete' ? '#dcfce7' : '#fef3c7',
                          color: item.status === 'Complete' ? '#16a34a' : '#d97706'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                        {item.score}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTaxonomyReport = () => {
    const taxonomyOverview = [
      { name: 'Aligned', value: taxonomyData.aligned, color: '#10b981' },
      { name: 'Eligible not Aligned', value: taxonomyData.notAligned, color: '#f59e0b' },
      { name: 'Not Eligible', value: 100 - taxonomyData.eligible, color: '#64748b' }
    ];

    return (
      <div>
        {/* Taxonomy Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '20px', color: '#3b82f6' }}>🇪🇺 EU Taxonomy Alignment</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taxonomyOverview}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taxonomyOverview.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>📊 Activity Breakdown</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taxonomyData.breakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="activity" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="eligible" name="Eligible %" fill="#f59e0b" />
                  <Bar dataKey="aligned" name="Aligned %" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Activity Details */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>📈 Activity-Level Analysis</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Economic Activity</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Volume</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Eligible %</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Aligned %</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Gap</th>
                </tr>
              </thead>
              <tbody>
                {taxonomyData.breakdown.map((activity, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{activity.activity}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>{activity.volume}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>{activity.eligible}%</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>{activity.aligned}%</td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'center', 
                      fontSize: '14px', 
                      fontWeight: 'bold',
                      color: activity.eligible - activity.aligned <= 5 ? '#16a34a' : '#dc2626'
                    }}>
                      {activity.eligible - activity.aligned}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSFDRReport = () => {
    const sfdrBreakdown = [
      { name: 'Article 6', value: sfdrData.article6.percentage, color: '#64748b', volume: sfdrData.article6.volume },
      { name: 'Article 8', value: sfdrData.article8.percentage, color: '#f59e0b', volume: sfdrData.article8.volume },
      { name: 'Article 9', value: sfdrData.article9.percentage, color: '#10b981', volume: sfdrData.article9.volume }
    ];

    return (
      <div>
        {/* SFDR Classification */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '20px', color: '#8b5cf6' }}>📊 SFDR Classification</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sfdrBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value, volume}) => `${name}: ${value}% (${volume})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sfdrBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>🎯 Fund Classification Goals</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '8px',
                borderLeft: '4px solid #10b981'
              }}>
                <div style={{ fontSize: '12px', color: '#16a34a', marginBottom: '5px' }}>Article 9 Target</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>15%</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Current: 8% (Gap: 7%)</div>
              </div>
              
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#fef3c7', 
                borderRadius: '8px',
                borderLeft: '4px solid #f59e0b'
              }}>
                <div style={{ fontSize: '12px', color: '#d97706', marginBottom: '5px' }}>Article 8 Target</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>60%</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Current: 42% (Gap: 18%)</div>
              </div>
              
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#f1f5f9', 
                borderRadius: '8px',
                borderLeft: '4px solid #64748b'
              }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Article 6 Target</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#64748b' }}>25%</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Current: 50% (Over by 25%)</div>
              </div>
            </div>
          </div>
        </div>

        {/* PAI Indicators */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>⚠️ Principal Adverse Impact (PAI) Indicators</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626', marginBottom: '5px' }}>
                {sfdrData.pai.scope1}M
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Scope 1 tCO₂e</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d97706', marginBottom: '5px' }}>
                {sfdrData.pai.scope2}M
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Scope 2 tCO₂e</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', marginBottom: '5px' }}>
                {sfdrData.pai.waterUsage}ML
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Water Usage</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f3e8ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '5px' }}>
                {sfdrData.pai.boardGenderDiversity}%
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Board Gender Diversity</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '8px', color: '#8b5cf6' }}>📄 {t('regulatoryReports') || 'Regulatory Reports'}</h1>
        <p style={{ color: '#666' }}>{t('regulatoryReportsDesc')}</p>
      </div>

      {/* Report Selection and Period */}
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '25px', 
        borderRadius: '12px', 
        marginBottom: '30px',
        border: '1px solid #e2e8f0' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                {t('selectReportType')}
              </label>
              <select 
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              >
                <option value="tcfd">TCFD - Task Force on Climate</option>
                <option value="taxonomy">EU Taxonomy - Environmental</option>
                <option value="sfdr">SFDR - Sustainable Finance</option>
                <option value="csrd">CSRD - Corporate Sustainability</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                {t('reportingPeriod')}
              </label>
              <select 
                value={reportingPeriod}
                onChange={(e) => setReportingPeriod(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="q4-2024">Q4 2024</option>
                <option value="q3-2024">Q3 2024</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleDownloadReport}
              style={{
                padding: '10px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              📄 {t('downloadReport')}
            </button>
            <button 
              onClick={handleSendEmail}
              style={{
                padding: '10px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              📧 {t('sendByEmail')}
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div>
        {selectedReport === 'tcfd' && renderTCFDReport()}
        {selectedReport === 'taxonomy' && renderTaxonomyReport()}
        {selectedReport === 'sfdr' && renderSFDRReport()}
      </div>

      {/* Regulatory Timeline */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginTop: '30px' }}>
        <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>📅 Düzenleyici Takvim</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {timeline.map((item, index) => (
            <div key={index} style={{
              padding: '15px',
              backgroundColor: item.status === 'Submitted' ? '#f0fdf4' : item.status === 'Due' ? '#fef3c7' : '#f8fafc',
              borderRadius: '8px',
              borderLeft: `4px solid ${item.status === 'Submitted' ? '#10b981' : item.status === 'Due' ? '#f59e0b' : '#64748b'}`
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>{item.date}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>{item.regulation}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: item.status === 'Submitted' ? '#dcfce7' : item.status === 'Due' ? '#fef3c7' : '#f1f5f9',
                  color: item.status === 'Submitted' ? '#16a34a' : item.status === 'Due' ? '#d97706' : '#64748b'
                }}>
                  {item.status}
                </span>
                {item.score > 0 && (
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.score}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegulatoryReports;