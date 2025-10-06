import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertTriangle, TrendingUp, Shield, Activity } from 'lucide-react';
import { sectorRiskData } from '../data/portfolio';
import { useTranslation } from 'react-i18next';

const RiskAssessment = () => {
  const { t } = useTranslation();
  // Sektör risk verileri
  const sectorBarData = Object.entries(sectorRiskData).map(([sector, risks]) => ({
    sector,
    transition: risks.transition,
    physical: risks.physical,
    market: risks.market
  }));

  // Radar chart için veri
  const radarData = Object.entries(sectorRiskData).map(([sector, risks]) => ({
    sector,
    ...risks
  }));

  // Risk kriterleri açıklamaları
  const riskCriteria = [
    {
      icon: AlertTriangle,
      title: 'Geçiş Riski',
      description: 'Düşük karbonlu ekonomiye geçiş sürecinde ortaya çıkan politika, teknoloji ve piyasa riskleri',
      factors: [
        'Karbon fiyatlandırması ve emisyon düzenlemeleri',
        'Teknolojik değişim ve yenilikler',
        'Pazar tercihleri ve talep değişimleri',
        'İtibar ve paydaş beklentileri'
      ]
    },
    {
      icon: Shield,
      title: 'Fiziksel Risk',
      description: 'İklim değişikliğinin fiziksel etkilerinden kaynaklanan operasyonel ve finansal riskler',
      factors: [
        'Aşırı hava olayları (sel, fırtına, sıcak hava)',
        'Kronik değişimler (deniz seviyesi, kuraklık)',
        'Su stresi ve kaynak kıtlığı',
        'Tedarik zinciri kesintileri'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Piyasa Riski',
      description: 'İklim değişikliğinin piyasa dinamikleri üzerindeki etkileri',
      factors: [
        'Emtia fiyat volatilitesi',
        'Enerji maliyetleri',
        'Sigorta primi artışları',
        'Varlık değer kayıpları'
      ]
    },
    {
      icon: Activity,
      title: 'Likidite Riski',
      description: 'İklim olaylarının likidite ve finansman koşulları üzerindeki etkileri',
      factors: [
        'Kredi erişim zorluğu',
        'Teminat değer kayıpları',
        'Operasyonel nakit akışı bozulması',
        'Acil finansman ihtiyaçları'
      ]
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('riskAssessment')}</h1>
        <p className="page-subtitle">{t('sectoralClimateRiskAnalysis')}</p>
      </div>

      {/* Risk Kriterleri */}
      <div className="grid grid-2" style={{ marginBottom: '32px' }}>
        {riskCriteria.map((criterion, index) => {
          const Icon = criterion.icon;
          return (
            <div key={index} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <Icon size={32} color="#0066cc" />
                <h3 style={{ margin: 0 }}>{criterion.title}</h3>
              </div>
              <p style={{ color: '#666', marginBottom: '16px' }}>{criterion.description}</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {criterion.factors.map((factor, idx) => (
                  <li key={idx} style={{ 
                    padding: '8px 0', 
                    borderBottom: '1px solid #eee',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#0066cc' }}>•</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Sektörel Risk Grafikleri */}
      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Sektörel Risk Karşılaştırması</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sectorBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sector" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="transition" name="Geçiş Riski" fill="#0066cc" />
              <Bar dataKey="physical" name="Fiziksel Risk" fill="#00a86b" />
              <Bar dataKey="market" name="Piyasa Riski" fill="#ffc107" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Risk Profili Radar Grafiği</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData.slice(0, 5)}>
              <PolarGrid />
              <PolarAngleAxis dataKey="sector" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Geçiş" dataKey="transition" stroke="#0066cc" fill="#0066cc" fillOpacity={0.3} />
              <Radar name="Fiziksel" dataKey="physical" stroke="#00a86b" fill="#00a86b" fillOpacity={0.3} />
              <Radar name="Piyasa" dataKey="market" stroke="#ffc107" fill="#ffc107" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Matrisi */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Risk Değerlendirme Matrisi</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Sektör</th>
              <th>Geçiş Riski</th>
              <th>Fiziksel Risk</th>
              <th>Piyasa Riski</th>
              <th>İtibar Riski</th>
              <th>Likidite Riski</th>
              <th>Toplam Risk Skoru</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(sectorRiskData).map(([sector, risks]) => {
              const totalRisk = (risks.transition + risks.physical + risks.market + risks.reputation + risks.liquidity) / 5;
              return (
                <tr key={sector}>
                  <td style={{ fontWeight: '500' }}>{sector}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '60px',
                        height: '8px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${risks.transition}%`,
                          height: '100%',
                          backgroundColor: risks.transition > 40 ? '#dc3545' : risks.transition > 25 ? '#ffc107' : '#28a745'
                        }}></div>
                      </div>
                      <span>{risks.transition}%</span>
                    </div>
                  </td>
                  <td>{risks.physical}%</td>
                  <td>{risks.market}%</td>
                  <td>{risks.reputation}%</td>
                  <td>{risks.liquidity}%</td>
                  <td>
                    <span className={totalRisk > 40 ? 'risk-high' : totalRisk > 25 ? 'risk-medium' : 'risk-low'}>
                      {totalRisk.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskAssessment;