import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { portfolioData } from '../data/portfolio';
import { useTranslation } from 'react-i18next';

const Reports = () => {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState('transition');

  // Zaman serisi verileri (örnek)
  const timeSeriesData = [
    { month: t('january'), transition: 1.85, physical: 2.10, combined: 1.97 },
    { month: t('february'), transition: 1.87, physical: 2.12, combined: 1.99 },
    { month: t('march'), transition: 1.83, physical: 2.15, combined: 1.99 },
    { month: t('april'), transition: 1.80, physical: 2.18, combined: 1.99 },
    { month: t('may'), transition: 1.82, physical: 2.20, combined: 2.01 },
    { month: t('june'), transition: 1.78, physical: 2.25, combined: 2.01 },
  ];

  // Rapor türleri
  const reportTypes = [
    {
      id: 'transition',
      title: t('transitionRiskReport'),
      description: t('transitionRiskDesc'),
      icon: TrendingUp,
      color: '#0066cc'
    },
    {
      id: 'physical',
      title: t('physicalRiskReport'),
      description: t('physicalRiskDesc'),
      icon: AlertTriangle,
      color: '#dc3545'
    },
    {
      id: 'tcfd',
      title: t('tcfdComplianceReport'),
      description: t('tcfdComplianceDesc'),
      icon: FileText,
      color: '#00a86b'
    }
  ];

  // Seçili rapor içeriği
  const getReportContent = () => {
    switch (selectedReport) {
      case 'transition':
        return (
          <div>
            <h3 style={{ marginBottom: '20px' }}>Geçiş Riski Özeti</h3>
            <div className="grid grid-3" style={{ marginBottom: '24px' }}>
              <div className="stat-card">
                <div className="stat-label">Ortalama Risk Skoru</div>
                <div className="stat-value">1.80</div>
                <div className="stat-change positive">
                  <span>%5 azalma (yıllık)</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Yüksek Riskli Şirket</div>
                <div className="stat-value">2</div>
                <div className="stat-change">
                  <span>SOCAR, Şişecam</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Risk Azaltma Oranı</div>
                <div className="stat-value">%68</div>
                <div className="stat-change positive">
                  <span>Hedef: %75</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 style={{ marginBottom: '16px' }}>Risk Trendi (6 Aylık)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="transition" stroke="#0066cc" name="Geçiş Riski" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'physical':
        return (
          <div>
            <h3 style={{ marginBottom: '20px' }}>Fiziksel Risk Özeti</h3>
            <div className="grid grid-3" style={{ marginBottom: '24px' }}>
              <div className="stat-card">
                <div className="stat-label">Ortalama Risk Skoru</div>
                <div className="stat-value">2.20</div>
                <div className="stat-change negative">
                  <span>%3 artış (yıllık)</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Risk Altındaki Varlık</div>
                <div className="stat-value">€45M</div>
                <div className="stat-change">
                  <span>Toplam portföyün %12'si</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Sigorta Kapsama</div>
                <div className="stat-value">%82</div>
                <div className="stat-change positive">
                  <span>Yeterli seviye</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 style={{ marginBottom: '16px' }}>Risk Trendi (6 Aylık)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="physical" stroke="#dc3545" fill="#dc3545" fillOpacity={0.3} name="Fiziksel Risk" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'tcfd':
        return (
          <div>
            <h3 style={{ marginBottom: '20px' }}>TCFD Uyum Durumu</h3>
            <div className="card">
              <h4 style={{ marginBottom: '16px' }}>Uyum Kontrol Listesi</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>TCFD Kriteri</th>
                    <th>Durum</th>
                    <th>Tamamlanma</th>
                    <th>Notlar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Yönetişim</td>
                    <td><span className="risk-low">Tamamlandı</span></td>
                    <td>%100</td>
                    <td>İklim risk komitesi kuruldu</td>
                  </tr>
                  <tr>
                    <td>Strateji</td>
                    <td><span className="risk-low">Tamamlandı</span></td>
                    <td>%95</td>
                    <td>2°C senaryo analizi yapıldı</td>
                  </tr>
                  <tr>
                    <td>Risk Yönetimi</td>
                    <td><span className="risk-medium">Devam Ediyor</span></td>
                    <td>%80</td>
                    <td>Risk metriklerinin entegrasyonu sürüyor</td>
                  </tr>
                  <tr>
                    <td>Metrikler ve Hedefler</td>
                    <td><span className="risk-medium">Devam Ediyor</span></td>
                    <td>%75</td>
                    <td>Scope 3 emisyon hesaplaması devam ediyor</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
              <h4 style={{ marginBottom: '16px' }}>Birleşik Risk Trendi</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="combined" stroke="#00a86b" name="Birleşik Risk Skoru" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('reports')}</h1>
        <p className="page-subtitle">{t('reportsSubtitle')}</p>
      </div>

      {/* Rapor Seçimi */}
      <div className="grid grid-3" style={{ marginBottom: '32px' }}>
        {reportTypes.map(report => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className={`card ${selectedReport === report.id ? 'selected-card' : ''}`}
              style={{
                cursor: 'pointer',
                border: selectedReport === report.id ? `2px solid ${report.color}` : '1px solid #e0e0e0',
                transition: 'all 0.2s'
              }}
              onClick={() => setSelectedReport(report.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Icon size={24} color={report.color} />
                <h3 style={{ margin: 0, fontSize: '18px' }}>{report.title}</h3>
              </div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{report.description}</p>
            </div>
          );
        })}
      </div>

      {/* Rapor İçeriği */}
      <div style={{ marginBottom: '24px' }}>
        {getReportContent()}
      </div>

      {/* İndirme Seçenekleri */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>{t('reportDownload')}</h3>
        <div className="grid grid-4">
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} />
            {t('downloadPdf')}
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} />
            {t('downloadExcel')}
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} />
            {t('downloadWord')}
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} />
            {t('schedule')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;