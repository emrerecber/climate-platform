import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useTranslation } from 'react-i18next';
// Chart.js imports and registrations
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';

import './App.css';
import RiskCalculator from './utils/riskCalculator';
import EnhancedRiskCalculator from './utils/enhancedRiskCalculator';
import FinancialProducts from './utils/financialProducts';
import FinancialAnalysis from './utils/financialAnalysis';
import RiskReport from './components/RiskReport';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import PACTADataForm from './components/PACTADataForm';
import LanguageSwitcher from './components/LanguageSwitcher';
import FinancialDataForm from './components/FinancialDataForm';
import FinancialReport from './components/FinancialReport';
import PortfolioOptimization from './components/pages/PortfolioOptimization';
import RegulatoryReports from './components/pages/RegulatoryReports';
import PACTAAnalysis from './components/pages/PACTAAnalysis';
import EnhancedRiskAnalysis from './components/EnhancedRiskAnalysis';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

// Genişletilmiş veri seti - Excel'deki tüm şirketler
const portfolioData = [
  { id: 442279, name: "TÜRKİYE İŞ BANKASI", sector: "finance", loan: 9000000, currency: "EUR", transitionRisk: 1.22, physicalRisk: 2.19, riskCategory: "Medium" },
  { id: 442280, name: "GARANTİ BANKASI", sector: "finance", loan: 4050000, currency: "EUR", transitionRisk: 1.22, physicalRisk: 2.19, riskCategory: "Medium" },
  { id: 442281, name: "AKBANK", sector: "finance", loan: 4500000, currency: "EUR", transitionRisk: 1.86, physicalRisk: 2.19, riskCategory: "Medium" },
  { id: 442282, name: "ZİRAAT BANKASI", sector: "finance", loan: 13500000, currency: "EUR", transitionRisk: 2.04, physicalRisk: 2.19, riskCategory: "Medium" },
  { id: 442283, name: "DENİZBANK", sector: "finance", loan: 37500000, currency: "CNY", transitionRisk: 1.94, physicalRisk: 2.19, riskCategory: "Medium" },
  { id: 442284, name: "ÇANAKKALE OTOYOL", sector: "infrastructure", loan: 31021981, currency: "EUR", transitionRisk: 1.76, physicalRisk: 1.90, riskCategory: "Medium" },
  { id: 442285, name: "TÜPRAŞ", sector: "energy", loan: 250000000, currency: "TRY", transitionRisk: 1.88, physicalRisk: 2.12, riskCategory: "Medium" },
  { id: 442286, name: "SOCAR TURKEY", sector: "energy", loan: 4500000000, currency: "USD", transitionRisk: 2.74, physicalRisk: 2.50, riskCategory: "High" },
  { id: 442287, name: "FORD OTOSAN", sector: "automotive", loan: 8181818, currency: "EUR", transitionRisk: 1.94, physicalRisk: 2.15, riskCategory: "Medium" },
  { id: 442288, name: "ŞİŞECAM", sector: "industry", loan: 4000000, currency: "EUR", transitionRisk: 2.40, physicalRisk: 2.06, riskCategory: "High" },
  { id: 442289, name: "TÜRK TELEKOM", sector: "telecommunications", loan: 17500000, currency: "EUR", transitionRisk: 1.78, physicalRisk: 2.19, riskCategory: "Medium" },
  { id: 442290, name: "CHERY OTOMOBİL", sector: "automotive", loan: 200000000, currency: "TRY", transitionRisk: 1.70, physicalRisk: 2.50, riskCategory: "Medium" },
  { id: 442291, name: "BEKO", sector: "durableGoods", loan: 2500000, currency: "EUR", transitionRisk: 1.63, physicalRisk: 1.97, riskCategory: "Medium" },
  { id: 442292, name: "ENTEK ELEKTRİK", sector: "energy", loan: 295000000, currency: "TRY", transitionRisk: 1.24, physicalRisk: 2.50, riskCategory: "Medium" },
  { id: 442293, name: "KUMPORT", sector: "logistics", loan: 10000000, currency: "USD", transitionRisk: 1.70, physicalRisk: 2.50, riskCategory: "Medium" }
];

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('orderly_2030');
  const [selectedMaturity, setSelectedMaturity] = useState('2030_2039');
  const [selectedProductType, setSelectedProductType] = useState('sme_loan');
  
  // Financial system states
  const [showFinancialForm, setShowFinancialForm] = useState(false);
  const [showFinancialReport, setShowFinancialReport] = useState(false);
  const [financialAnalysisData, setFinancialAnalysisData] = useState(null);
  
  // Enhanced calculators
  const enhancedCalculator = new EnhancedRiskCalculator();
  const financialAnalysis = new FinancialAnalysis();
  const financialProducts = new FinancialProducts(enhancedCalculator);
  const [riskFormData, setRiskFormData] = useState({
    companyName: '',
    sector: '',
    creditAmount: '',
    currency: 'EUR',
    employeeCount: '',
    annualRevenue: '',
    scope1Emissions: '',
    scope2Emissions: '',
    scope3Emissions: '',
    totalEnergyConsumption: '',
    renewableEnergyRatio: '',
    emissionReductionTarget2030: '',
    emissionReductionTarget2050: '',
    tcfdGovernance: '',
    tcfdStrategy: '',
    tcfdRiskManagement: '',
    tcfdMetrics: '',
    climateScenarioAnalysis: '',
    floodRisk: '',
    droughtRisk: '',
    heatWaveRisk: '',
    seaLevelRisk: '',
    stormRisk: '',
    operationalLocations: '',
    criticalAssetsAtRisk: '',
    cbamExposure: '',
    carbonPricingImpact: '',
    technologyRisk: '',
    greenRevenueRatio: '',
    strandedAssetRisk: '',
    euTaxonomyAlignment: '',
    cdpScore: '',
    esgRating: '',
    sustainabilityReport: '',
    netZeroTarget: '',
    scienceBasedTargets: '',
    greenBondIssuance: '',
    // PACTA Analizi alanları
    // Enerji sektörü için
    totalInstalledCapacity: '',
    annualProduction: '',
    coalCapacity: '',
    naturalGasCapacity: '',
    oilCapacity: '',
    hydroCapacity: '',
    windCapacity: '',
    solarCapacity: '',
    nuclearCapacity: '',
    biomassCapacity: '',
    geothermalCapacity: '',
    // Otomotiv sektörü için
    annualTotalProduction: '',
    productionFacilities: '',
    iceProduction: '',
    mhevProduction: '',
    hevProduction: '',
    phevProduction: '',
    bevProduction: '',
    fcevProduction: '',
    // Sanayi/Altyapı sektörü için
    annualProductionCapacity: '',
    capacityUtilization: '',
    energyIntensity: '',
    clinkerRatio: '',
    // Tüm sektörler için ortak
    productionProjection2025: '',
    productionProjection2026: '',
    productionProjection2027: '',
    productionProjection2028: '',
    productionProjection2029: '',
    productionProjection2030: '',
    plannedInvestments: '',
    greenTechInvestmentRatio: '',
    fossilCapacityToClose: '',
    rdBudget: '',
    referenceScenario: '',
    carbonBudgetCompliance: '',
    decarbonizationRoadmap: '',
    domesticFacilities: '',
    internationalFacilities: ''
  });

  const [formData, setFormData] = useState({
    name: '', sector: '', loan: '', currency: 'EUR', transitionRisk: '', physicalRisk: ''
  });

  // Hesaplamalar
  const totalLoan = portfolioData.reduce((sum, item) => sum + item.loan, 0);
  const avgTransitionRisk = portfolioData.reduce((sum, item) => sum + item.transitionRisk, 0) / portfolioData.length;
  const highRiskCount = portfolioData.filter(item => item.riskCategory === 'High').length;

  // Sektör dağılımı
  const sectorData = Object.entries(
    portfolioData.reduce((acc, item) => {
      acc[item.sector] = (acc[item.sector] || 0) + 1;
      return acc;
    }, {})
  ).map(([sector, count]) => ({ name: sector, value: count }));

  // Risk trendi (örnek veri)
  const trendData = [
    { month: 'Ocak', risk: 1.85 },
    { month: 'Şubat', risk: 1.82 },
    { month: 'Mart', risk: 1.80 },
    { month: 'Nisan', risk: 1.78 },
    { month: 'Mayıs', risk: 1.75 },
    { month: 'Haziran', risk: 1.73 }
  ];

  const COLORS = ['#0066cc', '#00a86b', '#ffc107', '#dc3545', '#6c757d', '#17a2b8', '#6610f2'];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Yeni kredi eklendi:', formData);
    setShowAddForm(false);
    alert('Kredi başarıyla eklendi!');
  };

  const getRiskColor = (risk) => {
    if (risk < 1.5) return '#28a745';
    if (risk < 2.5) return '#ffc107';
    return '#dc3545';
  };

  const submitForm = () => {
    // Mevcut hesaplama (geriye uyumluluk için)
    const scores = RiskCalculator.calculateRiskScores(riskFormData);
    
    // Yeni gelişmiş hesaplama
    const enhancedResults = enhancedCalculator.calculateEnhancedRisk(
      riskFormData, 
      selectedScenario, 
      selectedMaturity
    );
    
    // Finansal ürün spesifik hesaplama
    let productSpecificResults = null;
    if (enhancedResults.success) {
      switch (selectedProductType) {
        case 'sme_loan':
        case 'project_finance':
          productSpecificResults = financialProducts.calculateLoanMetrics(
            riskFormData, enhancedResults.riskIndex, selectedScenario, selectedMaturity
          );
          break;
        case 'syndicated':
          productSpecificResults = financialProducts.calculateSyndicatedLoanMetrics(
            riskFormData, enhancedResults.riskIndex, 'hold', 100
          );
          break;
        case 'bond':
          productSpecificResults = financialProducts.calculateBondMetrics(
            riskFormData, enhancedResults.riskIndex, 'banking_book'
          );
          break;
        case 'equity':
          productSpecificResults = financialProducts.calculateEquityMetrics(
            riskFormData, enhancedResults.riskIndex
          );
          break;
        case 'exim':
          productSpecificResults = financialProducts.calculateEximMetrics(
            riskFormData, enhancedResults.riskIndex, 'post_shipment'
          );
          break;
        case 'guarantee':
          productSpecificResults = financialProducts.calculateGuaranteeMetrics(
            riskFormData, enhancedResults.riskIndex, 0.7, 0.2
          );
          break;
        default:
          productSpecificResults = financialProducts.calculateLoanMetrics(
            riskFormData, enhancedResults.riskIndex, selectedScenario, selectedMaturity
          );
      }
    }
    
    setReportData({ 
      company: riskFormData, 
      scores,
      enhanced: enhancedResults,
      productSpecific: productSpecificResults,
      settings: {
        scenario: selectedScenario,
        maturity: selectedMaturity,
        productType: selectedProductType
      }
    });
    setShowReport(true);
  };

  const handleLogin = (userType, userData) => {
    setCurrentUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleFormChange = (field, value) => {
    setRiskFormData({ ...riskFormData, [field]: value });
  };

  const handleFinancialFormSubmit = (data) => {
    const analysisResult = financialAnalysis.generateComprehensiveAnalysis(data);
    setFinancialAnalysisData(analysisResult);
    setShowFinancialForm(false);
    setShowFinancialReport(true);
  };

  const handleFinancialFormCancel = () => {
    setShowFinancialForm(false);
  };

  const handleFinancialReportClose = () => {
    setShowFinancialReport(false);
    setFinancialAnalysisData(null);
  };

  const handleExportPDF = async () => {
    if (!financialAnalysisData) {
      alert('No financial data available for export');
      return;
    }
    
    try {
      const { exportFinancialReportToPDF } = await import('./utils/exportUtils');
      const result = await exportFinancialReportToPDF(financialAnalysisData, financialAnalysisData.entityInfo.name);
      
      if (result.success) {
        alert(`PDF exported successfully as: ${result.fileName}`);
      } else {
        alert(`PDF export failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('PDF export failed. Please try again.');
    }
  };

  const handleExportExcel = async () => {
    if (!financialAnalysisData) {
      alert('No financial data available for export');
      return;
    }
    
    try {
      const { exportFinancialReportToExcel } = await import('./utils/exportUtils');
      const result = exportFinancialReportToExcel(financialAnalysisData, financialAnalysisData.entityInfo.name);
      
      if (result.success) {
        alert(`Excel file exported successfully as: ${result.fileName}`);
      } else {
        alert(`Excel export failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Excel export failed. Please try again.');
    }
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      // Enhanced dashboard data calculations
      const dashboardMetrics = {
        totalPortfolioValue: totalLoan,
        portfolioGrowth: 8.5, // YoY growth percentage
        avgCarbonIntensity: portfolioData.reduce((sum, c) => sum + (c.transitionRisk * 45), 0) / portfolioData.length,
        climateVaR: totalLoan * 0.125, // Climate Value at Risk
        esgScore: portfolioData.reduce((sum, c) => sum + (c.transitionRisk < 1.5 ? 85 : c.transitionRisk < 2.5 ? 65 : 45), 0) / portfolioData.length,
        greenFinanceRatio: 28.5, // Percentage of green financing
        tcfdCompliance: 78.5, // TCFD compliance percentage
        netZeroProgress: 34.2 // Progress towards net zero targets
      };
      
      // Monthly performance data
      const monthlyPerformanceData = [
        { month: 'Jan', portfolio: 25.8, benchmark: 24.2, carbon: 145.2 },
        { month: 'Feb', portfolio: 26.2, benchmark: 24.6, carbon: 142.1 },
        { month: 'Mar', portfolio: 25.9, benchmark: 24.1, carbon: 138.9 },
        { month: 'Apr', portfolio: 26.8, benchmark: 25.2, carbon: 135.7 },
        { month: 'May', portfolio: 27.1, benchmark: 25.8, carbon: 132.4 },
        { month: 'Jun', portfolio: 27.5, benchmark: 26.0, carbon: 129.6 }
      ];
      
      // ESG breakdown data
      const esgBreakdownData = [
        { component: 'Environmental', current: 72, target: 85, color: '#10b981' },
        { component: 'Social', current: 68, target: 80, color: '#3b82f6' },
        { component: 'Governance', current: 81, target: 90, color: '#8b5cf6' }
      ];
      
      // Risk alerts and notifications
      const riskAlerts = [
        { type: 'high', message: 'SOCAR Turkey risk seviyesi artış gösteriyor', priority: 1, date: '2024-10-06' },
        { type: 'medium', message: 'Enerji sektöründe karbon fiyat risk artışı', priority: 2, date: '2024-10-05' },
        { type: 'info', message: 'TÜPRAŞ ESG skoru iyileştirme gösterdi', priority: 3, date: '2024-10-04' },
        { type: 'medium', message: 'İstanbul bölgesinde sel riski uyarısı', priority: 2, date: '2024-10-03' }
      ];
      
      // Upcoming regulatory deadlines
      const regulatoryDeadlines = [
        { regulation: 'TCFD Annual Report', deadline: '2024-12-31', status: 'pending', daysLeft: 85 },
        { regulation: 'EU Taxonomy Disclosure', deadline: '2024-11-15', status: 'in-progress', daysLeft: 39 },
        { regulation: 'SFDR Quarterly Report', deadline: '2024-10-31', status: 'pending', daysLeft: 24 },
        { regulation: 'Carbon Footprint Assessment', deadline: '2024-12-15', status: 'planning', daysLeft: 69 }
      ];
      
      return (
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ marginBottom: '8px', color: '#1e40af' }}>📈 {t('climateRiskPlatform')}</h1>
            <p style={{ color: '#666' }}>{t('lastUpdate')}: {new Date().toLocaleDateString('tr-TR')} • Real-time data with advanced analytics</p>
          </div>
          
          {/* Enhanced Key Performance Indicators */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px', marginBottom: '30px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #5b5ce6 0%, #4338ca 100%)', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>{t('totalPortfolio')}</h3>
                <p style={{ margin: '10px 0 5px 0', fontSize: '28px', fontWeight: 'bold' }}>
                  €{(dashboardMetrics.totalPortfolioValue / 1000000000).toFixed(1)}B
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
                  <span>15 {t('companies')}</span>
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>↑{dashboardMetrics.portfolioGrowth}%</span>
                </div>
              </div>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: 0.1 }}>💼</div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>ESG Skoru</h3>
                <p style={{ margin: '10px 0 5px 0', fontSize: '28px', fontWeight: 'bold' }}>
                  {dashboardMetrics.esgScore.toFixed(0)}
                </p>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Portföy Ortalaması</div>
              </div>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: 0.1 }}>🌱</div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>Climate VaR</h3>
                <p style={{ margin: '10px 0 5px 0', fontSize: '28px', fontWeight: 'bold' }}>
                  €{(dashboardMetrics.climateVaR / 1000000000).toFixed(1)}B
                </p>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Risk Altındaki Değer</div>
              </div>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: 0.1 }}>⚠️</div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>Karbon Yoğunluğu</h3>
                <p style={{ margin: '10px 0 5px 0', fontSize: '28px', fontWeight: 'bold' }}>
                  {dashboardMetrics.avgCarbonIntensity.toFixed(0)}
                </p>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>tCO₂/€M</div>
              </div>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: 0.1 }}>🌫️</div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>Yeşil Finans</h3>
                <p style={{ margin: '10px 0 5px 0', fontSize: '28px', fontWeight: 'bold' }}>
                  {dashboardMetrics.greenFinanceRatio.toFixed(1)}%
                </p>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Portföy Oranı</div>
              </div>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: 0.1 }}>🌍</div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9, fontWeight: '600' }}>Net Zero İlerleme</h3>
                <p style={{ margin: '10px 0 5px 0', fontSize: '28px', fontWeight: 'bold' }}>
                  {dashboardMetrics.netZeroProgress.toFixed(1)}%
                </p>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>2050 Hedefine</div>
              </div>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: 0.1 }}>🎯</div>
            </div>
          </div>

          {/* Risk Alerts Section */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#374151' }}>🚨 Risk Uyarıları & Bildirimler</h3>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span style={{ padding: '4px 8px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                  {riskAlerts.filter(a => a.type === 'high').length} Yüksek
                </span>
                <span style={{ padding: '4px 8px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                  {riskAlerts.filter(a => a.type === 'medium').length} Orta
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              {riskAlerts.slice(0, 4).map((alert, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  backgroundColor: alert.type === 'high' ? '#fef2f2' : alert.type === 'medium' ? '#fffbeb' : '#f0f9ff',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${alert.type === 'high' ? '#ef4444' : alert.type === 'medium' ? '#f59e0b' : '#3b82f6'}`,
                  fontSize: '14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <span style={{ flex: 1, lineHeight: '1.4' }}>{alert.message}</span>
                    <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '10px' }}>{alert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Dashboard */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#374151' }}>📈 Portföy Performans Trendi</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="portfolio" stroke="#5b5ce6" strokeWidth={3} name="Portföy Getiri (%)" dot={{ fill: '#5b5ce6', strokeWidth: 2, r: 6 }} />
                  <Line yAxisId="left" type="monotone" dataKey="benchmark" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" name="Benchmark (%)" />
                  <Line yAxisId="right" type="monotone" dataKey="carbon" stroke="#ef4444" strokeWidth={2} name="Karbon Yoğunluk" dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '14px', color: '#475569' }}>
                📊 Portföy son 6 ayda benchmark'tan %5.8 daha iyi performans gösterirken karbon yoğunluk %11.2 azaldı.
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#374151' }}>📋 Düzenleyici Takvim</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {regulatoryDeadlines.map((deadline, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    backgroundColor: deadline.daysLeft <= 30 ? '#fef2f2' : deadline.daysLeft <= 60 ? '#fffbeb' : '#f0fdf4',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${deadline.daysLeft <= 30 ? '#ef4444' : deadline.daysLeft <= 60 ? '#f59e0b' : '#22c55e'}`
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{deadline.regulation}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                      <span>{deadline.deadline}</span>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: deadline.daysLeft <= 30 ? '#dc2626' : deadline.daysLeft <= 60 ? '#d97706' : '#16a34a'
                      }}>
                        {deadline.daysLeft} gün
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Sütunlu Bölüm */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '20px', marginBottom: '30px' }}>
            {/* Sol - Kredi Dağılımı */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>{t('creditDistribution')}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '20px' }}>
                {sectorData.slice(0, 4).map((sector, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: COLORS[idx] }}></div>
                      <span style={{ fontSize: '14px' }}>{sector.name}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{sector.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Orta - Harita */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>{t('riskMap')}</h3>
              <div style={{ 
                height: '300px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Basit Türkiye haritası görseli */}
                <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>🗺️</div>
                    <h4 style={{ margin: '0 0 10px 0' }}>{t('geographicRiskDistribution')}</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '10px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
                      <strong>İstanbul:</strong> 8 şirket
                    </div>
                    <div style={{ padding: '10px', backgroundColor: '#fef3c7', borderRadius: '4px' }}>
                      <strong>Ankara:</strong> 4 şirket
                    </div>
                    <div style={{ padding: '10px', backgroundColor: '#dbeafe', borderRadius: '4px' }}>
                      <strong>İzmir:</strong> 2 şirket
                    </div>
                    <div style={{ padding: '10px', backgroundColor: '#d1fae5', borderRadius: '4px' }}>
                      <strong>Kocaeli:</strong> 1 şirket
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ - Risk Özeti */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>{t('riskDistribution')}</h3>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '14px' }}>{t('lowRisk')}</span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>20%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '20%', backgroundColor: '#22c55e' }}></div>
                  </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '14px' }}>{t('mediumRisk')}</span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>65%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '65%', backgroundColor: '#f59e0b' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '14px' }}>{t('highRisk')}</span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>15%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '15%', backgroundColor: '#ef4444' }}></div>
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>{t('totalRiskScore')}</h4>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b' }}>6.5</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{t('outOf10')}</div>
              </div>
            </div>
          </div>

          {/* Alt Grafikler */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Risk Trendi */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>{t('riskTrend6Months')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#5b5ce6" 
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sektörel Risk */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>{t('sectorRiskAverage')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData.map(sector => {
                  const sectorCompanies = portfolioData.filter(c => c.sector === sector.name);
                  const avgRisk = sectorCompanies.reduce((sum, c) => sum + c.transitionRisk, 0) / sectorCompanies.length || 0;
                  return { name: sector.name, risk: avgRisk.toFixed(2) };
                })}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="risk" fill="#5b5ce6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'portfolio') {
      // Filtreleme için state'leri buraya taşıdık
      const filteredPortfolio = portfolioData.filter(company => {
        return company.name.toLowerCase().includes('');
      });
      
      const sectorStats = Object.entries(portfolioData.reduce((acc, company) => {
        if (!acc[company.sector]) {
          acc[company.sector] = { count: 0, totalLoan: 0, avgRisk: 0 };
        }
        acc[company.sector].count++;
        acc[company.sector].totalLoan += company.loan;
        acc[company.sector].avgRisk += company.transitionRisk;
        return acc;
      }, {})).map(([sector, stats]) => ({
        sector,
        count: stats.count,
        totalLoan: stats.totalLoan,
        avgRisk: (stats.avgRisk / stats.count).toFixed(2)
      }));

      return (
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ marginBottom: '8px' }}>{t('creditPortfolio')}</h1>
            <p style={{ color: '#666' }}>{t('totalCompaniesDisplayed', { count: portfolioData.length })}</p>
          </div>

          {/* Filtreler ve Arama */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px 200px', gap: '15px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>{t('search')}</label>
                <input
                  type="text"
                  placeholder={t('searchByCompanyName')}
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>{t('sectorFilter')}</label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="all">{t('allSectors')}</option>
                  {sectorStats.map(stat => (
                    <option key={stat.sector} value={stat.sector}>{stat.sector} ({stat.count})</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#5b5ce6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
{t('addNewCredit')}
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
{t('downloadExcel')}
              </button>
            </div>
          </div>

          {/* Sektör Özet Kartları */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            {sectorStats.slice(0, 4).map((stat, idx) => (
              <div key={idx} style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderLeft: `4px solid ${COLORS[idx]}`
              }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1f2937' }}>{stat.sector}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{t('companyCount')}</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold' }}>{stat.count}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{t('avgRisk')}</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: getRiskColor(stat.avgRisk) }}>
                      {stat.avgRisk}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Önceki form kodu aynı kalacak */}
          {showAddForm && (
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
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                width: '500px',
                maxHeight: '80vh',
                overflow: 'auto'
              }}>
                <h2 style={{ marginBottom: '20px' }}>{t('addNewCredit')}</h2>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('companyName')}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
{t('cancel')}
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
{t('save')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tablo */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>{t('company')}</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>{t('sector')}</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>{t('credit')}</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>{t('transitionRisk')}</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>{t('physicalRisk')}</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.map(company => (
                  <tr 
                    key={company.id} 
                    style={{ 
                      borderBottom: '1px solid #dee2e6',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    onClick={() => {
                      setSelectedCompany(company);
                      setActiveTab('companyDetail');
                    }}
                  >
                    <td style={{ padding: '12px', fontWeight: '500' }}>{company.name}</td>
                    <td style={{ padding: '12px' }}>{company.sector}</td>
                    <td style={{ padding: '12px' }}>
                      {company.currency} {(company.loan / 1000000).toFixed(1)}M
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        backgroundColor: getRiskColor(company.transitionRisk) + '20',
                        color: getRiskColor(company.transitionRisk),
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}>
                        {company.transitionRisk.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        backgroundColor: getRiskColor(company.physicalRisk) + '20',
                        color: getRiskColor(company.physicalRisk),
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}>
                        {company.physicalRisk.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: company.riskCategory === 'High' ? '#f8d7da' : '#d4edda',
                        color: company.riskCategory === 'High' ? '#721c24' : '#155724'
                      }}>
                        {company.riskCategory}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'analysis') {
      return <EnhancedRiskAnalysis />;
    }

    if (activeTab === 'analysis_old') {
      // Enhanced heat map with additional risk metrics
      const heatMapData = portfolioData.map(company => {
        const totalRisk = ((company.transitionRisk + company.physicalRisk) / 2).toFixed(2);
        const riskAdjustedLoan = company.loan * parseFloat(totalRisk);
        const carbonIntensity = company.transitionRisk * 45; // Simulated carbon intensity
        const climateVaR = riskAdjustedLoan * 0.15; // Climate Value at Risk estimate
        
        return {
          name: company.name,
          sector: company.sector,
          transitionRisk: company.transitionRisk,
          physicalRisk: company.physicalRisk,
          totalRisk,
          loan: company.loan,
          riskAdjustedLoan,
          carbonIntensity: carbonIntensity.toFixed(1),
          climateVaR: climateVaR,
          esgScore: company.transitionRisk < 1.5 ? 85 : company.transitionRisk < 2.5 ? 65 : 45,
          tcfdCompliance: company.transitionRisk < 2 ? 'High' : company.transitionRisk < 2.5 ? 'Medium' : 'Low',
          stranded: company.transitionRisk > 2.5 ? 'High Risk' : 'Low Risk'
        };
      }).sort((a, b) => b.totalRisk - a.totalRisk);

      // Enhanced sector summary with additional metrics
      const sectorSummary = Object.entries(portfolioData.reduce((acc, company) => {
        if (!acc[company.sector]) {
          acc[company.sector] = {
            count: 0,
            totalLoan: 0,
            avgTransition: 0,
            avgPhysical: 0,
            companies: [],
            totalCarbon: 0,
            totalVaR: 0
          };
        }
        const companyData = heatMapData.find(h => h.name === company.name);
        acc[company.sector].count++;
        acc[company.sector].totalLoan += company.loan;
        acc[company.sector].avgTransition += company.transitionRisk;
        acc[company.sector].avgPhysical += company.physicalRisk;
        acc[company.sector].companies.push(company.name);
        acc[company.sector].totalCarbon += parseFloat(companyData.carbonIntensity);
        acc[company.sector].totalVaR += companyData.climateVaR;
        return acc;
      }, {})).map(([sector, data]) => ({
        sector,
        count: data.count,
        totalLoan: data.totalLoan,
        avgTransition: (data.avgTransition / data.count).toFixed(2),
        avgPhysical: (data.avgPhysical / data.count).toFixed(2),
        avgTotal: ((data.avgTransition + data.avgPhysical) / (2 * data.count)).toFixed(2),
        companies: data.companies,
        avgCarbon: (data.totalCarbon / data.count).toFixed(1),
        totalVaR: data.totalVaR,
        riskWeight: ((data.avgTransition + data.avgPhysical) / 2 * data.totalLoan / 1000000000).toFixed(2)
      }));
      
      // Risk trend simulation data
      const riskTrendData = [
        { year: '2020', portfolio: 2.15, transition: 1.95, physical: 2.35, benchmark: 2.25 },
        { year: '2021', portfolio: 2.08, transition: 1.88, physical: 2.28, benchmark: 2.20 },
        { year: '2022', portfolio: 2.02, transition: 1.82, physical: 2.22, benchmark: 2.15 },
        { year: '2023', portfolio: 1.96, transition: 1.75, physical: 2.17, benchmark: 2.10 },
        { year: '2024', portfolio: 1.91, transition: 1.70, physical: 2.12, benchmark: 2.05 },
        { year: '2025P', portfolio: 1.85, transition: 1.65, physical: 2.05, benchmark: 2.00 }
      ];
      
      // Climate scenario analysis
      const scenarioAnalysis = [
        { scenario: 'Current Policies (3°C)', riskMultiplier: 1.0, portfolioImpact: 0, description: 'Baseline scenario' },
        { scenario: 'Stated Policies (2.5°C)', riskMultiplier: 1.15, portfolioImpact: -2.8, description: 'Mild transition stress' },
        { scenario: 'Below 2°C Scenario', riskMultiplier: 1.35, portfolioImpact: -8.5, description: 'Moderate transition stress' },
        { scenario: 'Net Zero 2050 (1.5°C)', riskMultiplier: 1.65, portfolioImpact: -15.2, description: 'Severe transition stress' }
      ];
      
      // Geographic risk distribution
      const geoRiskData = [
        { region: 'İstanbul', companies: 8, avgRisk: 1.95, physicalRisk: 'Medium', floodRisk: 'High' },
        { region: 'Ankara', companies: 3, avgRisk: 1.78, physicalRisk: 'Low', floodRisk: 'Low' },
        { region: 'İzmir', companies: 2, avgRisk: 2.12, physicalRisk: 'Medium', floodRisk: 'Medium' },
        { region: 'Bursa', companies: 2, avgRisk: 1.85, physicalRisk: 'Low', floodRisk: 'Medium' }
      ];
      
      // ESG integration metrics
      const esgMetrics = {
        avgScore: heatMapData.reduce((sum, company) => sum + company.esgScore, 0) / heatMapData.length,
        highPerformers: heatMapData.filter(c => c.esgScore >= 80).length,
        lowPerformers: heatMapData.filter(c => c.esgScore < 50).length,
        tcfdCompliant: heatMapData.filter(c => c.tcfdCompliance === 'High').length,
        strandedAssets: heatMapData.filter(c => c.stranded === 'High Risk').reduce((sum, c) => sum + c.loan, 0)
      };

      return (
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ marginBottom: '8px', color: '#dc2626' }}>🌡️ {t('riskAnalysis') || 'İklim Risk Analizi'}</h1>
            <p style={{ color: '#666' }}>Kapsamlı iklim riski değerlendirmesi, senaryo analizi ve portföy optimizasyon önerileri</p>
          </div>

          {/* Enhanced Risk Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              border: '1px solid #fecaca'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#991b1b', fontWeight: '600' }}>En Riskli Sektör</h3>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
                {sectorSummary.sort((a, b) => b.avgTotal - a.avgTotal)[0].sector}
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#7f1d1d' }}>
                Ort. Risk: {sectorSummary.sort((a, b) => b.avgTotal - a.avgTotal)[0].avgTotal} • €{(sectorSummary.sort((a, b) => b.avgTotal - a.avgTotal)[0].totalLoan / 1000000000).toFixed(1)}B
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '1px solid #bbf7d0'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#14532d', fontWeight: '600' }}>Climate VaR</h3>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#15803d' }}>
                €{(heatMapData.reduce((sum, c) => sum + c.climateVaR, 0) / 1000000000).toFixed(1)}B
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#14532d' }}>
                Portföyün %{((heatMapData.reduce((sum, c) => sum + c.climateVaR, 0) / totalLoan) * 100).toFixed(1)}'i
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
              border: '1px solid #fde68a'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#713f12', fontWeight: '600' }}>Stranded Assets</h3>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#a16207' }}>
                €{(esgMetrics.strandedAssets / 1000000000).toFixed(1)}B
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#713f12' }}>
                Yüksek geçiş riski
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
              border: '1px solid #93c5fd'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#1e3a8a', fontWeight: '600' }}>ESG Skoru</h3>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#1d4ed8' }}>
                {esgMetrics.avgScore.toFixed(0)}
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#1e3a8a' }}>
                Portföy ortalaması
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
              border: '1px solid #c4b5fd'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4c1d95', fontWeight: '600' }}>TCFD Uyum</h3>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>
                {esgMetrics.tcfdCompliant}
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#4c1d95' }}>
                Yüksek uyumlu şirket
              </p>
            </div>
          </div>

          {/* Risk Trend Analysis */}
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#374151' }}>📈 Risk Trendi ve Benchmark Karşılaştırması</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" />
                <YAxis domain={[1.5, 2.5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="portfolio" stroke="#dc2626" strokeWidth={3} name="Portföy Riski" dot={{ fill: '#dc2626', strokeWidth: 2, r: 6 }} />
                <Line type="monotone" dataKey="transition" stroke="#f59e0b" strokeWidth={2} name="Geçiş Riski" />
                <Line type="monotone" dataKey="physical" stroke="#3b82f6" strokeWidth={2} name="Fiziksel Risk" />
                <Line type="monotone" dataKey="benchmark" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" name="Sektör Benchmark" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '14px', color: '#475569' }}>
              📊 <strong>Analiz:</strong> Portföy risk seviyesi son 5 yılda %12.6 azalmış ve sektör benchmark'ından %6.8 daha iyi performans göstermektedir.
            </div>
          </div>

          {/* Climate Scenario Analysis */}
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#374151' }}>🌍 İklim Senaryosu Analizi</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', borderBottom: '2px solid #e2e8f0' }}>Senaryo</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', borderBottom: '2px solid #e2e8f0' }}>Risk Çarpanı</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', borderBottom: '2px solid #e2e8f0' }}>Portföy Etkisi</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', borderBottom: '2px solid #e2e8f0' }}>Değer Etkisi</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', borderBottom: '2px solid #e2e8f0' }}>Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioAnalysis.map((scenario, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{scenario.scenario}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: scenario.riskMultiplier > 1.3 ? '#dc2626' : scenario.riskMultiplier > 1.1 ? '#f59e0b' : '#16a34a' }}>
                        {scenario.riskMultiplier.toFixed(2)}x
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: scenario.portfolioImpact < -10 ? '#dc2626' : scenario.portfolioImpact < -5 ? '#f59e0b' : '#16a34a' }}>
                        {scenario.portfolioImpact}%
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: scenario.portfolioImpact < -10 ? '#dc2626' : scenario.portfolioImpact < -5 ? '#f59e0b' : '#16a34a' }}>
                        €{((totalLoan * scenario.portfolioImpact) / 100 / 1000000000).toFixed(1)}B
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{scenario.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px', fontSize: '14px', color: '#92400e', borderLeft: '4px solid #f59e0b' }}>
              ⚠️ <strong>Uyarı:</strong> Net Zero 2050 senaryosunda portföy değerinde €{((totalLoan * -15.2) / 100 / 1000000000).toFixed(1)}B potansiyel kayıp öngörülmektedir.
            </div>
          </div>

          {/* Geographic Risk Distribution */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#374151' }}>🗺️ Coğrafi Risk Dağılımı</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {geoRiskData.map((geo, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '16px' }}>{geo.region}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{geo.companies} şirket • Risk: {geo.avgRisk}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: geo.physicalRisk === 'High' ? '#fee2e2' : geo.physicalRisk === 'Medium' ? '#fef3c7' : '#dcfce7',
                        color: geo.physicalRisk === 'High' ? '#991b1b' : geo.physicalRisk === 'Medium' ? '#713f12' : '#14532d'
                      }}>
                        {geo.physicalRisk}
                      </span>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: geo.floodRisk === 'High' ? '#dbeafe' : geo.floodRisk === 'Medium' ? '#e0f2fe' : '#f0f9ff',
                        color: geo.floodRisk === 'High' ? '#1e3a8a' : geo.floodRisk === 'Medium' ? '#0c4a6e' : '#075985'
                      }}>
                        Sel: {geo.floodRisk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#374151' }}>📊 ESG Entegrasyon Metrikleri</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Ortalama ESG Skoru</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '100px', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                      <div style={{ width: `${esgMetrics.avgScore}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>{esgMetrics.avgScore.toFixed(0)}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Yüksek ESG Performansı (≥80)</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{esgMetrics.highPerformers} şirket</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Düşük ESG Performansı (&lt;50)</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>{esgMetrics.lowPerformers} şirket</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>TCFD Yüksek Uyum</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>{esgMetrics.tcfdCompliant} şirket</span>
                </div>
                
                <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px', marginTop: '10px' }}>
                  <div style={{ fontSize: '12px', color: '#15803d', marginBottom: '5px' }}>💡 Öneri</div>
                  <div style={{ fontSize: '14px', color: '#166534' }}>
                    ESG performansı düşük {esgMetrics.lowPerformers} şirkette iyileştirme programı uygulanması önerilir.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Heat Map */}
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>İklim Riski Heat Map</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '4px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Şirket</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Sektör</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Geçiş Riski</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Fiziksel Risk</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Toplam Risk</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Kredi Büyüklüğü</th>
                  </tr>
                </thead>
                <tbody>
                  {heatMapData.map((company, idx) => (
                    <tr key={idx}>
                      <td style={{ 
                        padding: '12px', 
                        backgroundColor: '#f9fafb',
                        fontWeight: '500',
                        borderRadius: '4px 0 0 4px'
                      }}>
                        {company.name}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center',
                        backgroundColor: '#f3f4f6'
                      }}>
                        {company.sector}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center',
                        backgroundColor: company.transitionRisk > 2.5 ? '#fee2e2' : 
                                       company.transitionRisk > 1.5 ? '#fef3c7' : '#dcfce7',
                        color: company.transitionRisk > 2.5 ? '#991b1b' : 
                               company.transitionRisk > 1.5 ? '#713f12' : '#14532d',
                        fontWeight: 'bold'
                      }}>
                        {company.transitionRisk}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center',
                        backgroundColor: company.physicalRisk > 2.5 ? '#fee2e2' : 
                                       company.physicalRisk > 1.5 ? '#fef3c7' : '#dcfce7',
                        color: company.physicalRisk > 2.5 ? '#991b1b' : 
                               company.physicalRisk > 1.5 ? '#713f12' : '#14532d',
                        fontWeight: 'bold'
                      }}>
                        {company.physicalRisk}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center',
                        backgroundColor: company.totalRisk > 2.5 ? '#dc2626' : 
                                       company.totalRisk > 1.5 ? '#f59e0b' : '#22c55e',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}>
                        {company.totalRisk}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0 4px 4px 0'
                      }}>
                        <div style={{
                          width: `${Math.min(100, (company.loan / 1000000000) * 20)}px`,
                          height: '20px',
                          backgroundColor: '#6366f1',
                          borderRadius: '4px',
                          margin: '0 auto'
                        }}></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sektörel Analiz */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Sektörel Risk Karşılaştırması</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sectorSummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="sector" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgTransition" name="Geçiş Riski" fill="#ef4444" />
                  <Bar dataKey="avgPhysical" name="Fiziksel Risk" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Risk-Kredi Matrisi</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart 
                    data={sectorSummary}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis dataKey="sector" type="category" />
                    <Tooltip 
                      formatter={(value) => `€${(value / 1000000).toFixed(0)}M`}
                    />
                    <Bar dataKey="totalLoan" name="Toplam Kredi" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'companyDetail' && selectedCompany) {
      // Şirket için örnek detaylı veriler
      const companyMetrics = {
        carbonIntensity: selectedCompany.transitionRisk * 45,
        waterUsage: Math.random() * 1000000,
        wasteGeneration: Math.random() * 50000,
        renewableEnergy: Math.max(5, Math.min(95, 100 - selectedCompany.transitionRisk * 20)),
        esgScore: selectedCompany.transitionRisk < 1.5 ? 'A' : selectedCompany.transitionRisk < 2.5 ? 'B' : 'C',
        climateTarget: '2050 Net Zero',
        cdpScore: selectedCompany.transitionRisk < 2 ? 'B' : 'C'
      };

      // Risk trend verisi
      const riskTrendData = [
        { year: '2020', transition: selectedCompany.transitionRisk * 1.2, physical: selectedCompany.physicalRisk * 0.8 },
        { year: '2021', transition: selectedCompany.transitionRisk * 1.15, physical: selectedCompany.physicalRisk * 0.85 },
        { year: '2022', transition: selectedCompany.transitionRisk * 1.1, physical: selectedCompany.physicalRisk * 0.9 },
        { year: '2023', transition: selectedCompany.transitionRisk * 1.05, physical: selectedCompany.physicalRisk * 0.95 },
        { year: '2024', transition: selectedCompany.transitionRisk, physical: selectedCompany.physicalRisk },
        { year: '2025', transition: selectedCompany.transitionRisk * 0.95, physical: selectedCompany.physicalRisk * 1.05 }
      ];

      return (
        <div>
          {/* Üst Navigasyon */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('portfolio')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ← Portföye Dön
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                📊 Excel Rapor
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                📄 PDF İndir
              </button>
            </div>
          </div>

          {/* Şirket Başlık Kartı */}
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '30px',
            borderRadius: '16px',
            marginBottom: '30px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 'bold'
                }}>
                  {selectedCompany.name.charAt(0)}
                </div>
                <div>
                  <h1 style={{ margin: '0 0 5px 0', fontSize: '28px' }}>{selectedCompany.name}</h1>
                  <p style={{ margin: 0, opacity: 0.9 }}>{selectedCompany.sector} Sektörü • ID: {selectedCompany.id}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', opacity: 0.8, fontSize: '14px' }}>Kredi Tutarı</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                    {selectedCompany.currency} {(selectedCompany.loan / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', opacity: 0.8, fontSize: '14px' }}>Risk Kategorisi</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                    {selectedCompany.riskCategory === 'High' ? 'Yüksek' : 'Orta'}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', opacity: 0.8, fontSize: '14px' }}>İklim Hedefi</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{companyMetrics.climateTarget}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', opacity: 0.8, fontSize: '14px' }}>ESG Skoru</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{companyMetrics.esgScore}</p>
                </div>
              </div>
            </div>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
          </div>

          {/* Ana Metrikler */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div style={{ 
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderTop: '4px solid #6366f1'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>CDP Skoru</h3>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1' }}>
                    {companyMetrics.cdpScore}
                  </div>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                    İklim değişikliği
                  </p>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#e0e7ff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🏆
                </div>
              </div>
            </div>
          </div>

          {/* Detaylı Analiz Bölümü */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' }}>
            {/* Sol - Risk Trend Grafiği */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Risk Gelişimi (2020-2025)</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="transition" 
                    name="Geçiş Riski" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="physical" 
                    name="Fiziksel Risk" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sağ - Çevresel Metrikler */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Çevresel Göstergeler</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Karbon Yoğunluğu</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{companyMetrics.carbonIntensity.toFixed(0)} tCO₂</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min(100, companyMetrics.carbonIntensity / 2)}%`, 
                      backgroundColor: '#ef4444',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{t('waterUsage')}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{(companyMetrics.waterUsage / 1000).toFixed(0)}K m³</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min(100, companyMetrics.waterUsage / 10000)}%`, 
                      backgroundColor: '#3b82f6',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{t('wasteGeneration')}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{(companyMetrics.wasteGeneration / 1000).toFixed(0)} ton</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min(100, companyMetrics.wasteGeneration / 500)}%`, 
                      backgroundColor: '#f59e0b',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                </div>

                <div style={{
                  marginTop: '20px',
                  padding: '20px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{t('totalClimateScore')}</h4>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#6366f1' }}>
                    {((5 - avgTransitionRisk) * 20).toFixed(0)}/100
                  </div>
                  <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                    {t('sectorRanking')}: 3/15
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alt Bölüm - Risk Faktörleri ve Öneriler */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Risk Faktörleri */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>{t('riskFactorsOpportunities')}</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', color: '#dc2626', marginBottom: '12px', fontWeight: '600' }}>
                  🔴 {t('highRiskAreas')}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px', fontSize: '14px' }}>
                    • {t('carbonTaxCosts')}: €45M/yıl
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px', fontSize: '14px' }}>
                    • {t('fossilFuelDependency')}: %65 enerji
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px', fontSize: '14px' }}>
                    • {t('techTransformationCapex')}: €120M
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', color: '#f59e0b', marginBottom: '12px', fontWeight: '600' }}>
                  🟡 {t('mediumLevelRisks')}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', fontSize: '14px' }}>
                    • {t('supplyChainEmissions')}
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', fontSize: '14px' }}>
                    • {t('waterStressRisk')}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', color: '#10b981', marginBottom: '12px', fontWeight: '600' }}>
                  🟢 {t('strengthsOpportunities')}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '12px', backgroundColor: '#d1fae5', borderRadius: '8px', fontSize: '14px' }}>
                    • {t('netZeroCommitment')}
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#d1fae5', borderRadius: '8px', fontSize: '14px' }}>
                    • {t('greenBondIssuance')}: €500M
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#d1fae5', borderRadius: '8px', fontSize: '14px' }}>
                    • {t('rdInvestments')} €25M
                  </div>
                </div>
              </div>
            </div>

            {/* Aksiyon Planı */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>{t('recommendedActionPlan')}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ 
                  padding: '20px',
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  borderRadius: '10px',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e40af' }}>
                    🚀 {t('urgent0_6months')}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                    <li>{t('tcfdReportingStart')}</li>
                    <li>{t('energyEfficiencyAudit')}</li>
                    <li>{t('carbonFootprintMeasurement')}</li>
                  </ul>
                </div>

                <div style={{ 
                  padding: '20px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  borderRadius: '10px',
                  borderLeft: '4px solid #f59e0b'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#92400e' }}>
                    ⏱️ {t('shortTerm6_24months')}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                    <li>{t('renewableEnergyTransition')}</li>
                    <li>{t('iso14001Certification')}</li>
                    <li>{t('supplierEmissionProgram')}</li>
                  </ul>
                </div>

                <div style={{ 
                  padding: '20px',
                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                  borderRadius: '10px',
                  borderLeft: '4px solid #10b981'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#065f46' }}>
                    📈 {t('longTerm2_5years')}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                    <li>{t('carbonNeutralFacilities')}</li>
                    <li>{t('circularEconomyModel')}</li>
                    <li>{t('netZeroRoadmapImplementation')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* TCFD Uyumluluk ve Emisyon Verileri */}
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>{t('tcfdComplianceEmissions')}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              {/* TCFD Skorboard */}
              <div>
                <h4 style={{ fontSize: '16px', marginBottom: '15px', color: '#1f2937' }}>{t('tcfdComplianceStatus')}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '15px', backgroundColor: selectedCompany.sector === 'Finans' ? '#d1fae5' : '#fef3c7', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>{t('governance')}</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedCompany.sector === 'Finans' ? '✔' : '◐'}</div>
                  </div>
                  <div style={{ padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>{t('strategy')}</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>◐</div>
                  </div>
                  <div style={{ padding: '15px', backgroundColor: selectedCompany.sector === 'Enerji' ? '#fee2e2' : '#fef3c7', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>{t('riskManagement')}</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedCompany.sector === 'Enerji' ? '○' : '◐'}</div>
                  </div>
                  <div style={{ padding: '15px', backgroundColor: '#d1fae5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>{t('metrics')}</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>✔</div>
                  </div>
                </div>
              </div>

              {/* Emisyon Dağılımı */}
              <div>
                <h4 style={{ fontSize: '16px', marginBottom: '15px', color: '#1f2937' }}>{t('ghgEmissionDistribution')}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '14px' }}>{t('scope1Direct')}</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {(selectedCompany.loan / 100000).toFixed(0)}
                      </span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '20%', backgroundColor: '#ef4444' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '14px' }}>{t('scope2Energy')}</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {(selectedCompany.loan / 50000).toFixed(0)}
                      </span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '30%', backgroundColor: '#f59e0b' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '14px' }}>Scope 3 (Dolaylı)</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {selectedCompany.sector === 'Finans' ? 'Finanse edilen emisyonlar' : (selectedCompany.loan / 20000).toFixed(0)}
                      </span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '50%', backgroundColor: '#3b82f6' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sektörel Kıyaslama */}
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Sektörel Kıyaslama</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>Sektör Sıralaması</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {selectedCompany.transitionRisk < 2 ? '3' : '8'}/15
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{selectedCompany.sector} sektörü</div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>Sektör Risk Ortalaması</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b' }}>2.15</div>
                <div style={{ fontSize: '12px', color: selectedCompany.transitionRisk < 2.15 ? '#10b981' : '#ef4444' }}>
                  {selectedCompany.transitionRisk < 2.15 ? '↓ Ortalamanın altında' : '↑ Ortalamanın üstünde'}
                </div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>Peer Grubu</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>A-</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Benzer büyüklükte</div>
              </div>
            </div>
          </div>

          {/* Kredi Vade Yapısı */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Kredi Vade Yapısı</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>Kısa Vadeli (&lt; 1 yıl)</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>İşletme kredisi</div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>15%</div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>Orta Vadeli (1-5 yıl)</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Yatırım kredisi</div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>60%</div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>Uzun Vadeli (&gt; 5 yıl)</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Proje finansmanı</div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>25%</div>
                </div>
              </div>
            </div>

            {/* Risk Mitigation */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Risk Azaltma Stratejileri</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: '#e0e7ff', borderRadius: '8px', borderLeft: '4px solid #4f46e5' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Yeşil Kredi Dönüşümü</div>
                  <div style={{ fontSize: '12px', color: '#4b5563' }}>Mevcut kredinin %30'u sürdürülebilir finansmana dönüştürülecek</div>
                </div>
                
                <div style={{ padding: '12px', backgroundColor: '#dcfce7', borderRadius: '8px', borderLeft: '4px solid #22c55e' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Teminat Çeşitlendirme</div>
                  <div style={{ fontSize: '12px', color: '#4b5563' }}>İklim riskine dayanıklı varlıklar portföye ekleniyor</div>
                </div>
                
                <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #fbbf24' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Covenant Güncelleme</div>
                  <div style={{ fontSize: '12px', color: '#4b5563' }}>ESG performans kriterleri kredi sözleşmelerine ekleniyor</div>
                </div>
                
                <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Stres Testi</div>
                  <div style={{ fontSize: '12px', color: '#4b5563' }}>2°C ve 4°C senaryolarında düzenli değerlendirme</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'financialAnalysis') {
      return (
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ marginBottom: '8px' }}>{t('financialAnalysisDashboard')}</h1>
            <p style={{ color: '#666' }}>{t('comprehensiveFinancialAnalysis')}</p>
          </div>

          {/* Financial Dashboard Content */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px dashed #cbd5e1',
              cursor: 'pointer'
            }}
            onClick={() => setShowFinancialForm(true)}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
              <h3 style={{ marginBottom: '10px', color: '#1e293b' }}>{t('newFinancialAnalysis')}</h3>
              <p style={{ color: '#64748b', margin: 0 }}>{t('startFinancialAssessment')}</p>
            </div>

            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '15px', color: '#0ea5e9' }}>47</div>
              <h4 style={{ marginBottom: '5px', color: '#0f172a' }}>{t('totalAnalyses')}</h4>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>{t('thisMonth')}</p>
            </div>

            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '15px', color: '#22c55e' }}>8.4</div>
              <h4 style={{ marginBottom: '5px', color: '#0f172a' }}>{t('avgHealthScore')}</h4>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>/10</p>
            </div>
          </div>

          {/* Recent Analyses Table */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '25px 30px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{t('recentFinancialAnalyses')}</h3>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#64748b'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>📈</div>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>{t('noAnalysesYet')}</p>
                <p style={{ fontSize: '14px', margin: 0 }}>{t('clickNewAnalysisToStart')}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'riskForm') {
      return (
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ marginBottom: '8px' }}>{t('riskAssessmentFormTitle')}</h1>
            <p style={{ color: '#666' }}>{t('tcfdCompliantAnalysisFull')}</p>
          </div>

          {/* İlerleme Göstergesi */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: formStep >= 1 ? '#0066cc' : '#e5e7eb',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontWeight: 'bold'
                }}>1</div>
                <span style={{ fontSize: '12px', color: formStep >= 1 ? '#0066cc' : '#6b7280' }}>{t('companyInfo')}</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: formStep >= 2 ? '#0066cc' : '#e5e7eb',
                  color: formStep >= 2 ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontWeight: 'bold'
                }}>2</div>
                <span style={{ fontSize: '12px', color: formStep >= 2 ? '#0066cc' : '#6b7280' }}>{t('emissionData')}</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: formStep >= 3 ? '#0066cc' : '#e5e7eb',
                  color: formStep >= 3 ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontWeight: 'bold'
                }}>3</div>
                <span style={{ fontSize: '12px', color: formStep >= 3 ? '#0066cc' : '#6b7280' }}>{t('tcfdCompliance')}</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: formStep >= 4 ? '#0066cc' : '#e5e7eb',
                  color: formStep >= 4 ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontWeight: 'bold'
                }}>4</div>
                <span style={{ fontSize: '12px', color: formStep >= 4 ? '#0066cc' : '#6b7280' }}>{t('riskFactors')}</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: formStep >= 5 ? '#0066cc' : '#e5e7eb',
                  color: formStep >= 5 ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontWeight: 'bold'
                }}>5</div>
                <span style={{ fontSize: '12px', color: formStep >= 5 ? '#0066cc' : '#6b7280' }}>{t('esgTargets')}</span>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: formStep >= 6 ? '#0066cc' : '#e5e7eb',
                  color: formStep >= 6 ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontWeight: 'bold'
                }}>6</div>
                <span style={{ fontSize: '12px', color: formStep >= 6 ? '#0066cc' : '#6b7280' }}>{t('pactaAnalysis')}</span>
              </div>
            </div>
          </div>

          {/* Senaryo ve Ürün Seçimi */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '25px', 
            borderRadius: '12px', 
            marginBottom: '25px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#495057' }}>{t('analysisParameters')}</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>{t('climateScenarioLabel')}</label>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <option value="orderly_2030">🌱 {t('orderlyTransition')}</option>
                  <option value="disorderly_2030">⚠️ {t('disorderlyTransition')}</option>
                  <option value="hothouse_2030">🔥 {t('greenhouseWorld')}</option>
                </select>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                  {selectedScenario === 'orderly_2030' && `${t('carbonPrice')}: 150 QAR/tCO₂e`}
                  {selectedScenario === 'disorderly_2030' && `${t('carbonPrice')}: 300 QAR/tCO₂e`}
                  {selectedScenario === 'hothouse_2030' && `${t('carbonPrice')}: 50 QAR/tCO₂e`}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>{t('maturityCategory')}</label>
                <select
                  value={selectedMaturity}
                  onChange={(e) => setSelectedMaturity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <option value="pre_2030">⏰ {t('pre2030')}</option>
                  <option value="2030_2039">📊 {t('year2030_2039')}</option>
                  <option value="post_2040">🎯 {t('post2040')}</option>
                </select>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                  {selectedMaturity === 'pre_2030' && t('climateRiskNotApplied')}
                  {selectedMaturity === '2030_2039' && t('mediumClimateRisk')}
                  {selectedMaturity === 'post_2040' && t('highClimateRisk')}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>{t('financialProduct')}</label>
                <select
                  value={selectedProductType}
                  onChange={(e) => setSelectedProductType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <option value="sme_loan">🏪 {t('smeLoan')}</option>
                  <option value="project_finance">🏭️ {t('projectFinance')}</option>
                  <option value="syndicated">🤝 {t('syndicatedLoan')}</option>
                  <option value="bond">📈 {t('bond')}</option>
                  <option value="equity">📊 {t('equity')}</option>
                  <option value="exim">🌍 {t('eximFinance')}</option>
                  <option value="guarantee">🛡️ {t('guarantee')}</option>
                </select>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                  {t('pdfMethodology')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Form İçeriği */}
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            {formStep === 1 && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>{t('companyInfo')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('companyName')} *</label>
                    <input
                      type="text"
                      value={riskFormData.companyName}
                      onChange={(e) => handleFormChange('companyName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('companyNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('sector')} *</label>
                    <select
                      value={riskFormData.sector}
                      onChange={(e) => handleFormChange('sector', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">{t('selectSector')}</option>
                      <option value="Finans">{t('finance')}</option>
                      <option value="Enerji">{t('energy')}</option>
                      <option value="Sanayi">{t('industry')}</option>
                      <option value="Altyapı">{t('infrastructure')}</option>
                      <option value="Otomotiv">{t('automotive')}</option>
                      <option value="Telekomünikasyon">{t('telecommunications')}</option>
                      <option value="Dayanıklı Tüketim">{t('durableGoods')}</option>
                      <option value="Lojistik">{t('logistics')}</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('creditAmount')} *</label>
                    <input
                      type="number"
                      value={riskFormData.creditAmount}
                      onChange={(e) => handleFormChange('creditAmount', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('creditAmountPlaceholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('currency')}</label>
                    <select
                      value={riskFormData.currency}
                      onChange={(e) => handleFormChange('currency', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="TRY">TRY</option>
                      <option value="GBP">GBP</option>
                      <option value="QAR">QAR</option>
                      <option value="CNY">CNY</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('employeeCount')}</label>
                    <input
                      type="number"
                      value={riskFormData.employeeCount}
                      onChange={(e) => handleFormChange('employeeCount', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('employeeCountPlaceholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('annualRevenue')}</label>
                    <input
                      type="number"
                      value={riskFormData.annualRevenue}
                      onChange={(e) => handleFormChange('annualRevenue', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('annualRevenuePlaceholder')}
                    />
                  </div>
                </div>
              </div>
            )}

            {formStep === 2 && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>{t('emissionData')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      {t('scope1Emissions')} *
                      <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>{t('scope1Description')}</span>
                    </label>
                    <input
                      type="number"
                      value={riskFormData.scope1Emissions}
                      onChange={(e) => handleFormChange('scope1Emissions', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('scope1Placeholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      {t('scope2Emissions')} *
                      <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>{t('scope2Description')}</span>
                    </label>
                    <input
                      type="number"
                      value={riskFormData.scope2Emissions}
                      onChange={(e) => handleFormChange('scope2Emissions', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('scope2Placeholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      {t('scope3Emissions')}
                      <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>{t('scope3Description')}</span>
                    </label>
                    <input
                      type="number"
                      value={riskFormData.scope3Emissions}
                      onChange={(e) => handleFormChange('scope3Emissions', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('scope3Placeholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      {t('renewableEnergyRatio')}
                    </label>
                    <input
                      type="number"
                      value={riskFormData.renewableEnergyRatio}
                      onChange={(e) => handleFormChange('renewableEnergyRatio', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('renewableEnergyPlaceholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      {t('emissionReductionTarget2030')}
                    </label>
                    <input
                      type="number"
                      value={riskFormData.emissionReductionTarget2030}
                      onChange={(e) => handleFormChange('emissionReductionTarget2030', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('emissionTargetPlaceholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      {t('totalEnergyConsumption')}
                    </label>
                    <input
                      type="number"
                      value={riskFormData.totalEnergyConsumption}
                      onChange={(e) => handleFormChange('totalEnergyConsumption', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('totalEnergyPlaceholder')}
                    />
                  </div>
                </div>
              </div>
            )}

            {formStep === 3 && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>{t('tcfdCompliance')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('governance')}</label>
                    <select
                      value={riskFormData.tcfdGovernance}
                      onChange={(e) => handleFormChange('tcfdGovernance', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">{t('selectSector')}</option>
                      <option value="full">{t('fullyCompliant')}</option>
                      <option value="partial">{t('partiallyCompliant')}</option>
                      <option value="none">{t('nonCompliant')}</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('strategy')}</label>
                    <select
                      value={riskFormData.tcfdStrategy}
                      onChange={(e) => handleFormChange('tcfdStrategy', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">{t('selectSector')}</option>
                      <option value="full">{t('fullyCompliant')}</option>
                      <option value="partial">{t('partiallyCompliant')}</option>
                      <option value="none">{t('nonCompliant')}</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('riskManagement')}</label>
                    <select
                      value={riskFormData.tcfdRiskManagement}
                      onChange={(e) => handleFormChange('tcfdRiskManagement', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">{t('selectSector')}</option>
                      <option value="full">{t('fullyCompliant')}</option>
                      <option value="partial">{t('partiallyCompliant')}</option>
                      <option value="none">{t('nonCompliant')}</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('metricsTargets')}</label>
                    <select
                      value={riskFormData.tcfdMetrics}
                      onChange={(e) => handleFormChange('tcfdMetrics', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">{t('selectSector')}</option>
                      <option value="full">{t('fullyCompliant')}</option>
                      <option value="partial">{t('partiallyCompliant')}</option>
                      <option value="none">{t('nonCompliant')}</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      {t('climateScenarioAnalysis')}
                    </label>
                    <select
                      value={riskFormData.climateScenarioAnalysis}
                      onChange={(e) => handleFormChange('climateScenarioAnalysis', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">{t('selectSector')}</option>
                      <option value="yes-both">{t('yesBothScenarios')}</option>
                      <option value="yes-partial">{t('yesPartialScenario')}</option>
                      <option value="no">{t('no')}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formStep === 4 && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>{t('riskFactors')}</h2>
                
                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#374151' }}>{t('physicalRiskFactors')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('floodRisk')}</label>
                    <select
                      value={riskFormData.floodRisk}
                      onChange={(e) => handleFormChange('floodRisk', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">{t('selectSector')}</option>
                      <option value="low">{t('low')}</option>
                      <option value="medium">{t('medium')}</option>
                      <option value="high">{t('high')}</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('droughtRisk')}</label>
                    <select
                      value={riskFormData.droughtRisk}
                      onChange={(e) => handleFormChange('droughtRisk', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">{t('selectSector')}</option>
                      <option value="low">{t('low')}</option>
                      <option value="medium">{t('medium')}</option>
                      <option value="high">{t('high')}</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('heatWaveRisk')}</label>
                    <select
                      value={riskFormData.heatWaveRisk}
                      onChange={(e) => handleFormChange('heatWaveRisk', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">{t('selectSector')}</option>
                      <option value="low">{t('low')}</option>
                      <option value="medium">{t('medium')}</option>
                      <option value="high">{t('high')}</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('criticalLocations')}</label>
                    <input
                      type="text"
                      value={riskFormData.operationalLocations}
                      onChange={(e) => handleFormChange('operationalLocations', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('locationsPlaceholder')}
                    />
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#374151' }}>{t('transitionRiskFactors')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      {t('carbonIntensity')}
                    </label>
                    <input
                      type="number"
                      value={riskFormData.carbonPricingImpact}
                      onChange={(e) => handleFormChange('carbonPricingImpact', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('carbonIntensityPlaceholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('cbamExposure')}</label>
                    <select
                      value={riskFormData.cbamExposure}
                      onChange={(e) => handleFormChange('cbamExposure', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">{t('selectSector')}</option>
                      <option value="none">{t('none')}</option>
                      <option value="low">{t('low')}</option>
                      <option value="medium">{t('medium')}</option>
                      <option value="high">{t('high')}</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      {t('greenRevenueRatio')}
                    </label>
                    <input
                      type="number"
                      value={riskFormData.greenRevenueRatio}
                      onChange={(e) => handleFormChange('greenRevenueRatio', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('greenRevenuePlaceholder')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('euTaxonomyAlignment')}</label>
                    <input
                      type="number"
                      value={riskFormData.euTaxonomyAlignment}
                      onChange={(e) => handleFormChange('euTaxonomyAlignment', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder={t('euTaxonomyPlaceholder')}
                    />
                  </div>
                </div>
              </div>
            )}

            {formStep === 5 && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>{t('esgTargets')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('cdpClimateScore')}</label>
                    <select
                      value={riskFormData.cdpScore}
                      onChange={(e) => handleFormChange('cdpScore', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">{t('selectSector')}</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                </div>

                <div style={{
                  marginTop: '30px',
                  padding: '20px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  borderLeft: '4px solid #6366f1'
                }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>{t('estimatedRiskScores')}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#6b7280' }}>{t('transitionRisk')}</p>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>2.4</div>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#6b7280' }}>{t('physicalRisk')}</p>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>2.1</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formStep === 6 && (
              <div>
                <h2 style={{ marginBottom: '30px' }}>🌍 {t('pactaAnalysis')}</h2>
                
                {/* Sektör Bilgisi */}
                <div style={{
                  backgroundColor: '#e0f2fe',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '25px',
                  border: '1px solid #81d4fa'
                }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>  
                    <strong>{t('selectedSector')}:</strong> {riskFormData.sector || t('sectorNotSelected')} - 
                    {t('parisAgreementAssessment')}
                  </p>
                </div>

                {/* Enerji Sektörü */}
                {riskFormData.sector === 'Enerji' && (
                  <div>
                    {/* Temel Bilgiler */}
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#1f2937' }}>⚡ {t('energyProductionInfo')}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('totalInstalledCapacity')}</label>
                          <input 
                            type="number" 
                            value={riskFormData.totalInstalledCapacity}
                            onChange={(e) => handleFormChange('totalInstalledCapacity', e.target.value)}
                            placeholder={t('totalCapacityPlaceholder')}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('annualProduction')}</label>
                          <input 
                            type="number" 
                            value={riskFormData.annualProduction}
                            onChange={(e) => handleFormChange('annualProduction', e.target.value)}
                            placeholder={t('annualProductionPlaceholder')}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Teknoloji Dağılımı */}
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#1f2937' }}>🏭 {t('technologyDistribution')}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#7c2d12' }}>{t('coal')}</label>
                          <input 
                            type="number" 
                            value={riskFormData.coalCapacity}
                            onChange={(e) => handleFormChange('coalCapacity', e.target.value)}
                            placeholder="MW" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1c1917' }}>{t('naturalGas')}</label>
                          <input 
                            type="number" 
                            value={riskFormData.naturalGasCapacity}
                            onChange={(e) => handleFormChange('naturalGasCapacity', e.target.value)}
                            placeholder="MW" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#451a03' }}>{t('oil')}</label>
                          <input 
                            type="number" 
                            value={riskFormData.oilCapacity}
                            onChange={(e) => handleFormChange('oilCapacity', e.target.value)}
                            placeholder="MW" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1e40af' }}>{t('hydroelectric')}</label>
                          <input 
                            type="number" 
                            value={riskFormData.hydroCapacity}
                            onChange={(e) => handleFormChange('hydroCapacity', e.target.value)}
                            placeholder="MW" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#059669' }}>{t('wind')}</label>
                          <input 
                            type="number" 
                            value={riskFormData.windCapacity}
                            onChange={(e) => handleFormChange('windCapacity', e.target.value)}
                            placeholder="MW" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#ca8a04' }}>{t('solar')}</label>
                          <input 
                            type="number" 
                            value={riskFormData.solarCapacity}
                            onChange={(e) => handleFormChange('solarCapacity', e.target.value)}
                            placeholder="MW" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#7c3aed' }}>{t('nuclear')}</label>
                          <input 
                            type="number" 
                            value={riskFormData.nuclearCapacity}
                            onChange={(e) => handleFormChange('nuclearCapacity', e.target.value)}
                            placeholder="MW" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#15803d' }}>{t('biomass')}</label>
                          <input 
                            type="number" 
                            value={riskFormData.biomassCapacity}
                            onChange={(e) => handleFormChange('biomassCapacity', e.target.value)}
                            placeholder="MW" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#dc2626' }}>{t('geothermal')}</label>
                          <input 
                            type="number" 
                            value={riskFormData.geothermalCapacity}
                            onChange={(e) => handleFormChange('geothermalCapacity', e.target.value)}
                            placeholder="MW" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Otomotiv Sektörü */}
                {riskFormData.sector === 'Otomotiv' && (
                  <div>
                    {/* Temel Bilgiler */}
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#1f2937' }}>🚗 Üretim Bilgileri</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Yıllık Toplam Üretim (adet)</label>
                          <input 
                            type="number" 
                            value={riskFormData.annualTotalProduction}
                            onChange={(e) => handleFormChange('annualTotalProduction', e.target.value)}
                            placeholder="Örn: 500000" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Üretim Tesisi Sayısı</label>
                          <input 
                            type="number" 
                            value={riskFormData.productionFacilities}
                            onChange={(e) => handleFormChange('productionFacilities', e.target.value)}
                            placeholder="Örn: 3" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Araç Tipi Bazında Üretim */}
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#1f2937' }}>🔧 Araç Tipi Bazında Üretim (Adet/Yıl)</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#7c2d12' }}>ICE (İçten Yanmalı)</label>
                          <input 
                            type="number" 
                            value={riskFormData.iceProduction}
                            onChange={(e) => handleFormChange('iceProduction', e.target.value)}
                            placeholder="Adet" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#b45309' }}>MHEV (Hafif Hibrit)</label>
                          <input 
                            type="number" 
                            value={riskFormData.mhevProduction}
                            onChange={(e) => handleFormChange('mhevProduction', e.target.value)}
                            placeholder="Adet" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#0369a1' }}>HEV (Tam Hibrit)</label>
                          <input 
                            type="number" 
                            value={riskFormData.hevProduction}
                            onChange={(e) => handleFormChange('hevProduction', e.target.value)}
                            placeholder="Adet" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1e40af' }}>PHEV (Şarjlı Hibrit)</label>
                          <input 
                            type="number" 
                            value={riskFormData.phevProduction}
                            onChange={(e) => handleFormChange('phevProduction', e.target.value)}
                            placeholder="Adet" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#059669' }}>BEV (Tam Elektrikli)</label>
                          <input 
                            type="number" 
                            value={riskFormData.bevProduction}
                            onChange={(e) => handleFormChange('bevProduction', e.target.value)}
                            placeholder="Adet" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#7c3aed' }}>FCEV (Hidrojen)</label>
                          <input 
                            type="number" 
                            value={riskFormData.fcevProduction}
                            onChange={(e) => handleFormChange('fcevProduction', e.target.value)}
                            placeholder="Adet" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sanayi/Altyapı Sektörü */}
                {(riskFormData.sector === 'Sanayi' || riskFormData.sector === 'Altyapı') && (
                  <div>
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#1f2937' }}>🏭 Üretim Kapasitesi</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Yıllık Üretim Kapasitesi (ton)</label>
                          <input 
                            type="number" 
                            value={riskFormData.annualProductionCapacity}
                            onChange={(e) => handleFormChange('annualProductionCapacity', e.target.value)}
                            placeholder="Örn: 1000000" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kapasite Kullanım Oranı (%)</label>
                          <input 
                            type="number" 
                            value={riskFormData.capacityUtilization}
                            onChange={(e) => handleFormChange('capacityUtilization', e.target.value)}
                            placeholder="Örn: 85" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Enerji Yoğunluğu (GJ/ton)</label>
                          <input 
                            type="number" 
                            value={riskFormData.energyIntensity}
                            onChange={(e) => handleFormChange('energyIntensity', e.target.value)}
                            placeholder="Örn: 3.5" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Klinker Oranı (%) - Çimento için</label>
                          <input 
                            type="number" 
                            value={riskFormData.clinkerRatio}
                            onChange={(e) => handleFormChange('clinkerRatio', e.target.value)}
                            placeholder="Örn: 75" 
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tüm Sektörler İçin Ortak Alanlar */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#1f2937' }}>📈 5 Yıllık Üretim Projeksiyonu (% Değişim)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px' }}>
                    {[2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                      <div key={year}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{year}</label>
                        <input 
                          type="number" 
                          value={riskFormData[`productionProjection${year}`]}
                          onChange={(e) => handleFormChange(`productionProjection${year}`, e.target.value)}
                          placeholder="%" 
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Yatırım ve Stratejik Bilgiler */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#1f2937' }}>💰 Yatırım ve Stratejik Planlama</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Planlanan Yeni Yatırımlar (Milyon €)</label>
                      <input 
                        type="number" 
                        value={riskFormData.plannedInvestments}
                        onChange={(e) => handleFormChange('plannedInvestments', e.target.value)}
                        placeholder="Örn: 250" 
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Yeşil Teknoloji Yatırım Oranı (%)</label>
                      <input 
                        type="number" 
                        value={riskFormData.greenTechInvestmentRatio}
                        onChange={(e) => handleFormChange('greenTechInvestmentRatio', e.target.value)}
                        placeholder="Örn: 40" 
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kapatılacak Fosil Kapasite</label>
                      <input 
                        type="text" 
                        value={riskFormData.fossilCapacityToClose}
                        onChange={(e) => handleFormChange('fossilCapacityToClose', e.target.value)}
                        placeholder="Örn: 500 MW kömür, 2028'e kadar" 
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Ar-Ge Bütçesi (Milyon €/yıl)</label>
                      <input 
                        type="number" 
                        value={riskFormData.rdBudget}
                        onChange={(e) => handleFormChange('rdBudget', e.target.value)}
                        placeholder="Örn: 25" 
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Senaryo ve Uyumluluk */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#1f2937' }}>🎯 Senaryo Uyumluluk</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Referans Senaryo Seçimi</label>
                      <select 
                        value={riskFormData.referenceScenario}
                        onChange={(e) => handleFormChange('referenceScenario', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="">Seçiniz</option>
                        <option value="iea-sds">IEA SDS (2°C)</option>
                        <option value="iea-nze">IEA Net Zero (1.5°C)</option>
                        <option value="ngfs-orderly">NGFS Orderly Transition</option>
                        <option value="ngfs-disorderly">NGFS Disorderly Transition</option>
                        <option value="national-ndc">Ulusal NDC Hedefleri</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Karbon Bütçesi Uyumu</label>
                      <select 
                        value={riskFormData.carbonBudgetCompliance}
                        onChange={(e) => handleFormChange('carbonBudgetCompliance', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="">Seçiniz</option>
                        <option value="compliant">Uyumlu</option>
                        <option value="partially-compliant">Kısmen Uyumlu</option>
                        <option value="non-compliant">Uyumsuz</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Lokasyon Bilgileri */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#1f2937' }}>🌍 Operasyonel Lokasyonlar</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Türkiye içi tesisler</label>
                      <input 
                        type="text" 
                        value={riskFormData.domesticFacilities}
                        onChange={(e) => handleFormChange('domesticFacilities', e.target.value)}
                        placeholder="Örn: İstanbul (Ana üretim), İzmir (R&D), Ankara (İdari)" 
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Yurtdışı tesisler</label>
                      <input 
                        type="text" 
                        value={riskFormData.internationalFacilities}
                        onChange={(e) => handleFormChange('internationalFacilities', e.target.value)}
                        placeholder="Örn: Almanya (Üretim), Çin (Montaj)" 
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Dekarbonizasyon Yol Haritası */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#1f2937' }}>🛣️ Sektörel Dekarbonizasyon Yol Haritası</h3>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Dekarbonizasyon stratejinizi detaylandırın</label>
                    <textarea 
                      value={riskFormData.decarbonizationRoadmap}
                      onChange={(e) => handleFormChange('decarbonizationRoadmap', e.target.value)}
                      placeholder="Örn: 2025'e kadar %30 emisyon azaltımı, 2028'e kadar tüm kömür tesislerinin kapatılması, 2030'a kadar %60 yenilenebilir enerji oranı..." 
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Butonlar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              <button 
                onClick={() => setFormStep(formStep > 1 ? formStep - 1 : 1)} 
                style={buttonStyle}
                disabled={formStep === 1}
              >
                {t('back')}
              </button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {formStep < 5 ? (
                  <button 
                    onClick={() => setFormStep(formStep + 1)}
                    style={{...buttonStyle, backgroundColor: '#0066cc'}}
                  >
                    {t('next')}
                  </button>
                ) : formStep === 5 ? (
                  <>
                    <button 
                      onClick={submitForm}
                      style={{
                        ...buttonStyle, 
                        backgroundColor: '#28a745',
                        fontSize: '16px',
                        fontWeight: '600',
                        padding: '12px 24px'
                      }}
                    >
                      ✓ {t('completeAssessment')}
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('pacta')}
                      style={{
                        ...buttonStyle, 
                        backgroundColor: '#3b82f6',
                        fontSize: '16px',
                        fontWeight: '600',
                        padding: '12px 24px',
                        marginLeft: '10px'
                      }}
                    >
                      📊 {t('continueToPACTA')}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'pacta') {
      return <PACTAAnalysis />;
    }

    if (activeTab === 'portfolioOptimization') {
      return <PortfolioOptimization />;
    }

    if (activeTab === 'regulatoryReports') {
      return <RegulatoryReports />;
    }

    if (activeTab === 'financialProducts') {
      return (
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ marginBottom: '8px', color: '#1e40af' }}>🏦 {t('financialProducts')}</h1>
            <p style={{ color: '#666' }}>{t('financialProductsDescription')}</p>
          </div>
          
          {/* Financial KPIs Dashboard */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#3b82f6', color: 'white', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{t('totalAuM')}</h3>
              <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold' }}>
                €24.8B
              </p>
              <span style={{ fontSize: '12px' }}>{t('annualIncrease')}</span>
            </div>
            
            <div style={{ backgroundColor: '#10b981', color: 'white', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{t('greenPortfolio')}</h3>
              <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold' }}>
                €7.2B
              </p>
              <span style={{ fontSize: '12px' }}>{t('ofTotal')}</span>
            </div>
            
            <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Carbon VaR</h3>
              <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold' }}>
                -2.8%
              </p>
              <span style={{ fontSize: '12px' }}>99% confidence</span>
            </div>
            
            <div style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>TCFD Score</h3>
              <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold' }}>
                A-
              </p>
              <span style={{ fontSize: '12px' }}>CDP Finance</span>
            </div>
          </div>
          
          {/* Financial Products Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
            {/* Loan Portfolio */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#1e40af' }}>💼 {t('loanPortfolio')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{t('corporateLoans')}</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#3b82f6' }}>€15.2B</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>185 {t('activeCustomers')}</div>
                </div>
                
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#f0fdf4', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #22c55e'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{t('greenBonds')}</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#22c55e' }}>€4.8B</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>45 {t('issuances')}</div>
                </div>
                
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#fef3c7', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #f59e0b'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{t('projectFinancing')}</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f59e0b' }}>€2.1B</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>12 {t('largProjects')}</div>
                </div>
                
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#fdf2f8', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #ec4899'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{t('esgFunds')}</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#ec4899' }}>€2.7B</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>8 fon, {t('avgReturn')} %15.2</div>
                </div>
              </div>
            </div>
            
            {/* Risk Analytics */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#dc2626' }}>⚡ {t('riskAnalytics')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Climate VaR (1Y, 99%)</div>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#dc2626', marginBottom: '5px' }}>
                    -€695M
                  </div>
                  <div style={{ fontSize: '12px', color: '#dc2626' }}>{t('ofPortfolio')} -2.8%</div>
                </div>
                
                <div style={{ padding: '15px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                  <h4 style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#991b1b' }}>{t('sectoralRiskDistribution')}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px' }}>{t('energy')}</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#dc2626' }}>-€280M</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px' }}>{t('industry')}</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ea580c' }}>-€195M</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px' }}>{t('transport')}</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f59e0b' }}>-€145M</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px' }}>{t('other')}</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#a3a3a3' }}>-€75M</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '12px', backgroundColor: '#dbeafe', borderRadius: '6px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#1e40af' }}>
                    📈 <strong>{t('stressTest')}:</strong> 2°C {t('scenarioValuation')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Regulatory Compliance */}
          <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#1e293b' }}>📋 {t('regulatoryCompliance')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '15px', color: '#059669' }}>{t('tcfdReportingFull')}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px' }}>{t('governance')}</span>
                  <span style={{ fontSize: '20px', color: '#059669' }}>✓</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px' }}>{t('strategy')}</span>
                  <span style={{ fontSize: '20px', color: '#f59e0b' }}>◐</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px' }}>{t('riskManagement')}</span>
                  <span style={{ fontSize: '20px', color: '#059669' }}>✓</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px' }}>{t('metrics')}</span>
                  <span style={{ fontSize: '20px', color: '#059669' }}>✓</span>
                </div>
              </div>
              
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '15px', color: '#3b82f6' }}>{t('euTaxonomy')}</h4>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>32%</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{t('compliantInvestments')}</div>
                </div>
                <div style={{ fontSize: '12px', marginBottom: '8px' }}>{t('sectoralBreakdown')}:</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  • {t('greenEnergy')}: 18%<br/>
                  • {t('sustainableTransport')}: 8%<br/>
                  • {t('greenBuildings')}: 6%
                </div>
              </div>
              
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '15px', color: '#8b5cf6' }}>SFDR Art. 8/9</h4>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>€4.2B</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{t('art8Funds')}</div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>€800M</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{t('art9Funds')}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>PAI compliance: 95%</div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <button
              style={{
                padding: '20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                textAlign: 'center'
              }}
              onClick={() => setActiveTab('financialAnalysis')}
            >
              📈 {t('financialRiskAssessment')}
            </button>
            
            <button
              style={{
                padding: '20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                textAlign: 'center'
              }}
              onClick={() => setActiveTab('portfolioOptimization')}
            >
              📅 {t('portfolioOptimization')}
            </button>
            
            <button
              style={{
                padding: '20px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                textAlign: 'center'
              }}
              onClick={() => setActiveTab('regulatoryReports')}
            >
              📄 {t('regulatoryReports')}
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  if (currentView === 'home') {
    return <HomePage onLogin={() => setCurrentView('login')} />;
  }

  if (currentView === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', backgroundColor: '#1a1a1a', color: 'white', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2>Datinova & Clymflex</h2>
          <LanguageSwitcher />
        </div>
        <p style={{ opacity: 0.7, marginBottom: '20px' }}>{t('climateRiskPlatform')}</p>
        
        {/* Kullanıcı Bilgisi */}
        {currentUser && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px', opacity: 0.7 }}>{t('welcomeMessage')},</p>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{currentUser.username}</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
              {currentUser.role === 'admin' ? t('admin') : t('customer')}
            </p>
          </div>
        )}
        
        {/* Navigasyon */}
        <nav>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ 
              width: '100%', padding: '12px', marginBottom: '10px',
              backgroundColor: activeTab === 'dashboard' ? '#0066cc' : 'transparent',
              color: 'white', border: 'none', cursor: 'pointer',
              textAlign: 'left', fontSize: '16px', borderRadius: '4px'
            }}
          >
            📆 {t('dashboard')}
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            style={{ 
              width: '100%', padding: '12px', marginBottom: '10px',
              backgroundColor: activeTab === 'portfolio' ? '#0066cc' : 'transparent',
              color: 'white', border: 'none', cursor: 'pointer',
              textAlign: 'left', fontSize: '16px', borderRadius: '4px'
            }}
          >
            💼 {t('portfolio')}
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            style={{ 
              width: '100%', padding: '12px', marginBottom: '10px',
              backgroundColor: activeTab === 'analysis' ? '#0066cc' : 'transparent',
              color: 'white', border: 'none', cursor: 'pointer',
              textAlign: 'left', fontSize: '16px', borderRadius: '4px'
            }}
          >
            📈 {t('riskAnalysis')}
          </button>
          <button 
            onClick={() => setActiveTab('riskForm')}
            style={{ 
              width: '100%', padding: '12px', marginBottom: '10px',
              backgroundColor: activeTab === 'riskForm' ? '#0066cc' : 'transparent',
              color: 'white', border: 'none', cursor: 'pointer',
              textAlign: 'left', fontSize: '16px', borderRadius: '4px'
            }}
          >
            📋 {t('riskAssessmentForm')}
          </button>
          <button 
            onClick={() => setActiveTab('financialAnalysis')}
            style={{ 
              width: '100%', padding: '12px', marginBottom: '10px',
              backgroundColor: activeTab === 'financialAnalysis' ? '#0066cc' : 'transparent',
              color: 'white', border: 'none', cursor: 'pointer',
              textAlign: 'left', fontSize: '16px', borderRadius: '4px'
            }}
          >
            💰 {t('financialAnalysis')}
          </button>
          <button 
            onClick={() => setActiveTab('pacta')}
            style={{ 
              width: '100%', padding: '12px', marginBottom: '10px',
              backgroundColor: activeTab === 'pacta' ? '#0066cc' : 'transparent',
              color: 'white', border: 'none', cursor: 'pointer',
              textAlign: 'left', fontSize: '16px', borderRadius: '4px'
            }}
          >
            📊 {t('pactaAnalysis')}
          </button>
          <button 
            onClick={() => setActiveTab('financialProducts')}
            style={{ 
              width: '100%', padding: '12px',
              backgroundColor: activeTab === 'financialProducts' ? '#0066cc' : 'transparent',
              color: 'white', border: 'none', cursor: 'pointer',
              textAlign: 'left', fontSize: '16px', borderRadius: '4px'
            }}
          >
            🏦 {t('financialProducts')}
          </button>
        </nav>
        
        {/* Çıkış Butonu */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center',
            fontSize: '16px',
            borderRadius: '4px'
          }}
        >
          {t('logout')}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', maxWidth: '1400px' }}>
        {renderContent()}
      </div>
      
      {showReport && reportData && (
        <RiskReport 
          company={reportData.company} 
          scores={reportData.scores}
          enhanced={reportData.enhanced}
          productSpecific={reportData.productSpecific}
          settings={reportData.settings}
          onClose={() => {
            setShowReport(false);
            setReportData(null);
          }}
        />
      )}
      
      {showFinancialForm && (
        <FinancialDataForm 
          onSubmit={handleFinancialFormSubmit}
          onCancel={handleFinancialFormCancel}
        />
      )}
      
      {showFinancialReport && financialAnalysisData && (
        <FinancialReport 
          analysisData={financialAnalysisData}
          onClose={handleFinancialReportClose}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
        />
      )}
    </div>
  );
}

export default App;