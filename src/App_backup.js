import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './App.css';

// Genişletilmiş veri seti - Excel'deki tüm şirketler
const portfolioData = [
  { id: 442279, name: "TÜRKİYE İŞ BANKASI", sector: "Finans", loan: 9000000, currency: "EUR", transitionRisk: 1.22, physicalRisk: 2.19, riskCategory: "Medium" },
  { id: 442280, name: "GARANTİ BANKASI", sector: "Finans", loan: 4050000, currency: "EUR", transitionRisk: 1.22, physicalRisk: 2.19, riskCategory: "Medium" },
  { id: 442281, name: "AKBANK", sector: "Finans", loan: 4500000, currency: "EUR", transitionRisk: 1.86, physicalRisk: 2.19, riskCategory: "Medium" },
  { id: 442282, name: "ZİRAAT BANKASI", sector: "Finans", loan: 13500000, currency: "EUR", transitionRisk: 2.04, physicalRisk: 2.19, riskCategory: "Medium" },
  { id: 442283, name: "DENİZBANK", sector: "Finans", loan: 37500000, currency: "CNY", transitionRisk: 1.94, physicalRisk: 2.19, riskCategory: "Medium" },
  { id: 442284, name: "ÇANAKKALE OTOYOL", sector: "Altyapı", loan: 31021981, currency: "EUR", transitionRisk: 1.76, physicalRisk: 1.90, riskCategory: "Medium" },
  { id: 442285, name: "TÜPRAŞ", sector: "Enerji", loan: 250000000, currency: "TRY", transitionRisk: 1.88, physicalRisk: 2.12, riskCategory: "Medium" },
  { id: 442286, name: "SOCAR TURKEY", sector: "Enerji", loan: 4500000000, currency: "USD", transitionRisk: 2.74, physicalRisk: 2.50, riskCategory: "High" },
  { id: 442287, name: "FORD OTOSAN", sector: "Otomotiv", loan: 8181818, currency: "EUR", transitionRisk: 1.94, physicalRisk: 2.15, riskCategory: "Medium" },
  { id: 442288, name: "ŞİŞECAM", sector: "Sanayi", loan: 4000000, currency: "EUR", transitionRisk: 2.40, physicalRisk: 2.06, riskCategory: "High" },
  { id: 442289, name: "TÜRK TELEKOM", sector: "Telekomünikasyon", loan: 17500000, currency: "EUR", transitionRisk: 1.78, physicalRisk: 2.19, riskCategory: "Medium" },
  { id: 442290, name: "CHERY OTOMOBİL", sector: "Otomotiv", loan: 200000000, currency: "TRY", transitionRisk: 1.70, physicalRisk: 2.50, riskCategory: "Medium" },
  { id: 442291, name: "BEKO", sector: "Dayanıklı Tüketim", loan: 2500000, currency: "EUR", transitionRisk: 1.63, physicalRisk: 1.97, riskCategory: "Medium" },
  { id: 442292, name: "ENTEK ELEKTRİK", sector: "Enerji", loan: 295000000, currency: "TRY", transitionRisk: 1.24, physicalRisk: 2.50, riskCategory: "Medium" },
  { id: 442293, name: "KUMPORT", sector: "Lojistik", loan: 10000000, currency: "USD", transitionRisk: 1.70, physicalRisk: 2.50, riskCategory: "Medium" }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formStep, setFormStep] = useState(1);
const [riskFormData, setRiskFormData] = useState({
  // Şirket Bilgileri
  companyName: '',
  sector: '',
  creditAmount: '',
  currency: 'EUR',
  employeeCount: '',
  annualRevenue: '',
  
  // Emisyon Verileri
  scope1Emissions: '',
  scope2Emissions: '',
  scope3Emissions: '',
  totalEnergyConsumption: '',
  renewableEnergyRatio: '',
  emissionReductionTarget2030: '',
  emissionReductionTarget2050: '',
  
  // TCFD Uyumluluk
  tcfdGovernance: '',
  tcfdStrategy: '',
  tcfdRiskManagement: '',
  tcfdMetrics: '',
  climateScenarioAnalysis: '',
  
  // Fiziksel Riskler
  floodRisk: '',
  droughtRisk: '',
  heatWaveRisk: '',
  seaLevelRisk: '',
  stormRisk: '',
  operationalLocations: '',
  criticalAssetsAtRisk: '',
  
  // Geçiş Riskleri
  cbamExposure: '',
  carbonPricingImpact: '',
  technologyRisk: '',
  greenRevenueRatio: '',
  strandedAssetRisk: '',
  euTaxonomyAlignment: '',
  
  // ESG/Sürdürülebilirlik
  cdpScore: '',
  esgRating: '',
  sustainabilityReport: '',
  netZeroTarget: '',
  scienceBasedTargets: '',
  greenBondIssuance: ''
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

  const renderContent = () => {
    if (activeTab === 'dashboard') {
  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '8px' }}>İklim Risk Analizi Platformu</h1>
        <p style={{ color: '#666' }}>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
      </div>
      
      {/* Ana Göstergeler */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#5b5ce6', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Toplam Portföy</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>
            €{(totalLoan / 1000000000).toFixed(1)}B
          </p>
          <span style={{ fontSize: '12px' }}>15 Şirket</span>
        </div>
        
        <div style={{ backgroundColor: '#22c55e', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Düşük Risk</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>
            {portfolioData.filter(c => c.transitionRisk < 1.5).length}
          </p>
          <span style={{ fontSize: '12px' }}>Şirket</span>
        </div>
        
        <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Orta Risk</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>
            {portfolioData.filter(c => c.transitionRisk >= 1.5 && c.transitionRisk < 2.5).length}
          </p>
          <span style={{ fontSize: '12px' }}>Şirket</span>
        </div>
        
        <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Yüksek Risk</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>{highRiskCount}</p>
          <span style={{ fontSize: '12px' }}>Şirket</span>
        </div>
        
        <div style={{ backgroundColor: '#06b6d4', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Ort. Risk Skoru</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>
            {avgTransitionRisk.toFixed(2)}
          </p>
          <span style={{ fontSize: '12px' }}>Geçiş Riski</span>
        </div>
      </div>

      {/* 3 Sütunlu Bölüm */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Sol - Kredi Dağılımı */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Kredi Dağılımı</h3>
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
          <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Risk Haritası</h3>
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
                <h4 style={{ margin: '0 0 10px 0' }}>Coğrafi Risk Dağılımı</h4>
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
          <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Risk Dağılımı</h3>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px' }}>Düşük Risk</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>20%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '20%', backgroundColor: '#22c55e' }}></div>
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px' }}>Orta Risk</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>65%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '65%', backgroundColor: '#f59e0b' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px' }}>Yüksek Risk</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>15%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '15%', backgroundColor: '#ef4444' }}></div>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Toplam Risk Skoru</h4>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b' }}>6.5</div>
            <div style={{ fontSize: '12px', color: '#666' }}>10 üzerinden</div>
          </div>
        </div>
      </div>

      {/* Alt Grafikler */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Risk Trendi */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Risk Trendi (6 Aylık)</h3>
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
          <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Sektörel Risk Ortalaması</h3>
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
        <h1 style={{ marginBottom: '8px' }}>Kredi Portföyü</h1>
        <p style={{ color: '#666' }}>Toplam {portfolioData.length} şirket görüntüleniyor</p>
      </div>

      {/* Filtreler ve Arama */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px 200px', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Arama</label>
            <input
              type="text"
              placeholder="Şirket adı ile ara..."
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
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Sektör Filtresi</label>
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
              <option value="all">Tüm Sektörler</option>
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
            + Yeni Kredi
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
            📥 Excel İndir
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
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Şirket Sayısı</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold' }}>{stat.count}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Ort. Risk</p>
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
            <h2 style={{ marginBottom: '20px' }}>Yeni Kredi Ekle</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Şirket Adı</label>
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
                  İptal
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
                  Kaydet
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
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Şirket</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Sektör</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Kredi</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Geçiş Riski</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Fiziksel Risk</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Durum</th>
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
  // Heat map için veri hazırlama
  const heatMapData = portfolioData.map(company => ({
    name: company.name,
    sector: company.sector,
    transitionRisk: company.transitionRisk,
    physicalRisk: company.physicalRisk,
    totalRisk: ((company.transitionRisk + company.physicalRisk) / 2).toFixed(2),
    loan: company.loan
  })).sort((a, b) => b.totalRisk - a.totalRisk);

  // Sektörel özet
  const sectorSummary = Object.entries(portfolioData.reduce((acc, company) => {
    if (!acc[company.sector]) {
      acc[company.sector] = {
        count: 0,
        totalLoan: 0,
        avgTransition: 0,
        avgPhysical: 0,
        companies: []
      };
    }
    acc[company.sector].count++;
    acc[company.sector].totalLoan += company.loan;
    acc[company.sector].avgTransition += company.transitionRisk;
    acc[company.sector].avgPhysical += company.physicalRisk;
    acc[company.sector].companies.push(company.name);
    return acc;
  }, {})).map(([sector, data]) => ({
    sector,
    count: data.count,
    totalLoan: data.totalLoan,
    avgTransition: (data.avgTransition / data.count).toFixed(2),
    avgPhysical: (data.avgPhysical / data.count).toFixed(2),
    avgTotal: ((data.avgTransition + data.avgPhysical) / (2 * data.count)).toFixed(2),
    companies: data.companies
  }));

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '8px' }}>Risk Analizi</h1>
        <p style={{ color: '#666' }}>İklim riski heat map ve sektörel analiz</p>
      </div>

      {/* Risk Özet Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#991b1b' }}>En Riskli Sektör</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
            {sectorSummary.sort((a, b) => b.avgTotal - a.avgTotal)[0].sector}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#7f1d1d' }}>
            Ort. Risk: {sectorSummary.sort((a, b) => b.avgTotal - a.avgTotal)[0].avgTotal}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#14532d' }}>En Güvenli Sektör</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#15803d' }}>
            {sectorSummary.sort((a, b) => a.avgTotal - b.avgTotal)[0].sector}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#14532d' }}>
            Ort. Risk: {sectorSummary.sort((a, b) => a.avgTotal - b.avgTotal)[0].avgTotal}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#713f12' }}>Risk Altındaki Kredi</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#a16207' }}>
            €{(portfolioData.filter(c => c.riskCategory === 'High').reduce((sum, c) => sum + c.loan, 0) / 1000000000).toFixed(1)}B
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#713f12' }}>
            Toplam portföyün %{((portfolioData.filter(c => c.riskCategory === 'High').reduce((sum, c) => sum + c.loan, 0) / totalLoan) * 100).toFixed(0)}'ı
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4c1d95' }}>Risk Dağılımı</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '20%', backgroundColor: '#22c55e' }}></div>
                <div style={{ width: '65%', backgroundColor: '#fbbf24' }}></div>
                <div style={{ width: '15%', backgroundColor: '#ef4444' }}></div>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#4c1d95' }}>20/65/15</span>
          </div>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#4c1d95' }}>
            Düşük/Orta/Yüksek
          </p>
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
          borderTop: '4px solid #ef4444'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Geçiş Riski</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: getRiskColor(selectedCompany.transitionRisk) }}>
                {selectedCompany.transitionRisk.toFixed(2)}
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                Sektör Ort: {avgTransitionRisk.toFixed(2)}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fee2e2',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              📊
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderTop: '4px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Fiziksel Risk</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: getRiskColor(selectedCompany.physicalRisk) }}>
                {selectedCompany.physicalRisk.toFixed(2)}
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                İklim olayları riski
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🌡️
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderTop: '4px solid #10b981'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Yenilenebilir Enerji</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                {companyMetrics.renewableEnergy.toFixed(0)}%
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                2025 hedefi: 50%
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#d1fae5',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⚡
            </div>
          </div>
        </div>

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
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Su Kullanımı</span>
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
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Atık Üretimi</span>
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
              <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Toplam İklim Skoru</h4>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#6366f1' }}>
                {((5 - avgTransitionRisk) * 20).toFixed(0)}/100
              </div>
              <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                Sektör sıralaması: 3/15
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Bölüm - Risk Faktörleri ve Öneriler */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Risk Faktörleri */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Risk Faktörleri & Fırsatlar</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', color: '#dc2626', marginBottom: '12px', fontWeight: '600' }}>
              🔴 Yüksek Risk Alanları
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px', fontSize: '14px' }}>
                • Karbon vergisi maliyetleri (CBAM): €45M/yıl
              </div>
              <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px', fontSize: '14px' }}>
                • Fosil yakıt bağımlılığı: %65 enerji
              </div>
              <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px', fontSize: '14px' }}>
                • Teknolojik dönüşüm CAPEX: €120M
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', color: '#f59e0b', marginBottom: '12px', fontWeight: '600' }}>
              🟡 Orta Seviye Riskler
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', fontSize: '14px' }}>
                • Tedarik zinciri emisyonları
              </div>
              <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', fontSize: '14px' }}>
                • Su stresi riski (İstanbul bölgesi)
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', color: '#10b981', marginBottom: '12px', fontWeight: '600' }}>
              🟢 Güçlü Yönler & Fırsatlar
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '12px', backgroundColor: '#d1fae5', borderRadius: '8px', fontSize: '14px' }}>
                • 2050 Net-Zero taahhüdü
              </div>
              <div style={{ padding: '12px', backgroundColor: '#d1fae5', borderRadius: '8px', fontSize: '14px' }}>
                • Yeşil tahvil ihracı: €500M
              </div>
              <div style={{ padding: '12px', backgroundColor: '#d1fae5', borderRadius: '8px', fontSize: '14px' }}>
                • R&D yatırımları: Yıllık €25M
              </div>
            </div>
          </div>
        </div>

        {/* Aksiyon Planı */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Önerilen Aksiyon Planı</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ 
              padding: '20px',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              borderRadius: '10px',
              borderLeft: '4px solid #3b82f6'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e40af' }}>
                🚀 Acil (0-6 ay)
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                <li>TCFD raporlaması başlatılması</li>
                <li>Enerji verimliliği denetimi</li>
                <li>Karbon ayak izi ölçümü (Scope 1-2-3)</li>
              </ul>
            </div>

            <div style={{ 
              padding: '20px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '10px',
              borderLeft: '4px solid #f59e0b'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#92400e' }}>
                ⏱️ Kısa Vade (6-24 ay)
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                <li>%30 yenilenebilir enerji geçişi</li>
                <li>ISO 14001 sertifikasyonu</li>
                <li>Tedarikçi emisyon programı</li>
              </ul>
            </div>

            <div style={{ 
              padding: '20px',
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              borderRadius: '10px',
              borderLeft: '4px solid #10b981'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#065f46' }}>
                📈 Uzun Vade (2-5 yıl)
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                <li>Karbon nötr üretim tesisleri</li>
                <li>Döngüsel ekonomi modeli</li>
                <li>Net-Zero yol haritası implementasyonu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* TCFD Uyumluluk ve Emisyon Verileri */}
<div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
  <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>TCFD Uyumluluk & Emisyon Profili</h3>
  
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
    {/* TCFD Skorboard */}
    <div>
      <h4 style={{ fontSize: '16px', marginBottom: '15px', color: '#1f2937' }}>TCFD Uyumluluk Durumu</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ padding: '15px', backgroundColor: selectedCompany.sector === 'Finans' ? '#d1fae5' : '#fef3c7', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Yönetişim</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedCompany.sector === 'Finans' ? '✓' : '◐'}</div>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Strateji</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>◐</div>
        </div>
        <div style={{ padding: '15px', backgroundColor: selectedCompany.sector === 'Enerji' ? '#fee2e2' : '#fef3c7', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Risk Yönetimi</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedCompany.sector === 'Enerji' ? '○' : '◐'}</div>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#d1fae5', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Metrikler</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>✓</div>
        </div>
      </div>
    </div>

    {/* Emisyon Dağılımı */}
    <div>
      <h4 style={{ fontSize: '16px', marginBottom: '15px', color: '#1f2937' }}>GHG Emisyon Dağılımı (tCO₂e)</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '14px' }}>Scope 1 (Doğrudan)</span>
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
            <span style={{ fontSize: '14px' }}>Scope 2 (Enerji)</span>
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
<button 
  onClick={() => setActiveTab('riskForm')}
  style={{ 
    width: '100%', padding: '12px', marginTop: '10px',
    backgroundColor: activeTab === 'riskForm' ? '#0066cc' : 'transparent',
    color: 'white', border: 'none', cursor: 'pointer',
    textAlign: 'left', fontSize: '16px', borderRadius: '4px'
  }}
>
  📋 Risk Değerlendirme Formu
</button>
if (activeTab === 'riskForm') {
  const handleFormChange = (field, value) => {
    setRiskFormData({ ...riskFormData, [field]: value });
  };

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '8px' }}>İklim Risk Değerlendirme Formu</h1>
        <p style={{ color: '#666' }}>Şirket bilgilerini girin</p>
      </div>

      {/* İlerleme Göstergesi */}
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
      <span style={{ fontSize: '12px', color: formStep >= 1 ? '#0066cc' : '#6b7280' }}>Şirket Bilgileri</span>
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
      <span style={{ fontSize: '12px', color: formStep >= 2 ? '#0066cc' : '#6b7280' }}>Emisyon Verileri</span>
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
      <span style={{ fontSize: '12px', color: formStep >= 3 ? '#0066cc' : '#6b7280' }}>TCFD Uyumluluk</span>
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
      <span style={{ fontSize: '12px', color: formStep >= 4 ? '#0066cc' : '#6b7280' }}>Fiziksel Riskler</span>
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
      <span style={{ fontSize: '12px', color: formStep >= 5 ? '#0066cc' : '#6b7280' }}>Geçiş Riskleri & ESG</span>
    </div>
  </div>
</div>

      {/* Form İçeriği */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {formStep === 1 && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Şirket Bilgileri</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Şirket Adı *</label>
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
                  placeholder="Örn: Türkiye İş Bankası"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Sektör *</label>
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
                  <option value="">Seçiniz</option>
                  <option value="Finans">Finans</option>
                  <option value="Enerji">Enerji</option>
                  <option value="Sanayi">Sanayi</option>
                  <option value="Altyapı">Altyapı</option>
                  <option value="Otomotiv">Otomotiv</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kredi Tutarı *</label>
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
                  placeholder="Örn: 10000000"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Para Birimi</label>
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
                  <option value="CNY">CNY</option>
                </select>
              </div>
            </div>
          </div>
        )}

{formStep === 2 && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Emisyon Verileri</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Scope 1 Emisyonları (tCO₂e/yıl)
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
                  placeholder="Doğrudan emisyonlar"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Scope 2 Emisyonları (tCO₂e/yıl)
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
                  placeholder="Enerji kaynaklı emisyonlar"
                />
              </div>
            </div>
          </div>
        )}
           <option value="">Seçiniz</option>
                  <option value="low">Düşük (0-50 tCO2)</option>
                  <option value="medium">Orta (50-200 tCO2)</option>
                  <option value="high">Yüksek (200+ tCO2)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  TCFD Raporlaması Yapıyor mu?
                </label>
                <select
                  value={riskFormData.tcfdReporting}
                  onChange={(e) => handleFormChange('tcfdReporting', e.target.value)}
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
                  <option value="yes">Evet</option>
                  <option value="no">Hayır</option>
                  <option value="partial">Kısmen</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Butonlar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
          <button
            onClick={() => setFormStep(Math.max(1, formStep - 1))}
            disabled={formStep === 1}
            style={{
              padding: '12px 24px',
              backgroundColor: formStep === 1 ? '#e5e7eb' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: formStep === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Önceki
          </button>
          
          {formStep < 2 ? (
            <button
              onClick={() => setFormStep(formStep + 1)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Sonraki →
            </button>
          ) : (
            <button
              onClick={() => alert('Form başarıyla gönderildi!')}
              style={{
                padding: '12px 32px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ✓ Formu Gönder
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
    return null;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', backgroundColor: '#1a1a1a', color: 'white', padding: '20px' }}>
        <h2>Bank of China Turkey</h2>
        <p style={{ opacity: 0.7, marginBottom: '40px' }}>İklim Risk Platformu</p>
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
            📊 Dashboard
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
            💼 Kredi Portföyü
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            style={{ 
              width: '100%', padding: '12px',
              backgroundColor: activeTab === 'analysis' ? '#0066cc' : 'transparent',
              color: 'white', border: 'none', cursor: 'pointer',
              textAlign: 'left', fontSize: '16px', borderRadius: '4px'
            }}
          >
            📈 Risk Analizi
          </button>
          <button 
  onClick={() => setActiveTab('riskForm')}
  style={{ 
    width: '100%', padding: '12px', marginTop: '10px',
    backgroundColor: activeTab === 'riskForm' ? '#0066cc' : 'transparent',
    color: 'white', border: 'none', cursor: 'pointer',
    textAlign: 'left', fontSize: '16px', borderRadius: '4px'
  }}
>
  📋 Risk Değerlendirme Formu
</button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', maxWidth: '1400px' }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;