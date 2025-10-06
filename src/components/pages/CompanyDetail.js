import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building, MapPin, AlertTriangle, Shield, FileText, TrendingUp } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { portfolioData } from '../data/portfolio';
import { useTranslation } from 'react-i18next';

const CompanyDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const company = portfolioData.find(item => item.id === parseInt(id));

  if (!company) {
    return (
      <div>
        <Link to="/portfolio" className="btn btn-primary" style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} />
          {t('back')}
        </Link>
        <div className="card">
          <h2>{t('companyNotFound')}</h2>
        </div>
      </div>
    );
  }

  // Risk radar verileri
  const riskRadarData = [
    { criteria: t('carbonIntensity'), value: company.transitionRisk2025 * 30 },
    { criteria: t('technologyReadiness'), value: 100 - (company.transitionRisk2025 * 25) },
    { criteria: t('policyCompliance'), value: 100 - (company.transitionRisk2025 * 35) },
    { criteria: t('physicalResilience'), value: 100 - (company.physicalRisk * 30) },
    { criteria: t('financialFlexibility'), value: 85 },
    { criteria: t('esgScore'), value: 75 }
  ];

  // Projeksiyon verileri
  const projectionData = [
    { year: '2024', transition: company.transitionRisk2025, physical: company.physicalRisk },
    { year: '2025', transition: company.transitionRisk2025, physical: company.physicalRisk },
    { year: '2030', transition: (company.transitionRisk2025 + company.transitionRisk2035) / 2, physical: company.physicalRisk * 1.1 },
    { year: '2035', transition: company.transitionRisk2035, physical: company.physicalRisk * 1.2 },
    { year: '2040', transition: company.transitionRisk2035 * 0.9, physical: company.physicalRisk * 1.3 }
  ];

  // Risk değerlendirme detayları (şirkete özel)
  const getRiskAssessmentDetails = () => {
    const details = {
      'TÜPRAŞ': {
        strengths: [
          '2050 Net-Zero hedefi belirlenmiş',
          'SAF (Sürdürülebilir Havacılık Yakıtı) mühendislik çalışmaları tamamlandı',
          'Biyoyakıt ve hidrojen pilot tesisleri kurulu',
          'CDP Skoru "B" - üst-orta seviye iklim yönetimi'
        ],
        risks: [
          'Yüksek Scope 1 emisyonları (rafineri prosesleri)',
          'AB ETS/CBAM baskısı altında',
          'Fosil yakıt talebinde beklenen düşüş',
          'Yüksek dönüşüm CAPEX gereksinimi'
        ],
        recommendations: [
          'SAF üretim kapasitesini hızla artırın',
          'Yeşil hidrojen yatırımlarını ölçeklendirin',
          'Petrokimya entegrasyonunu güçlendirin',
          'Karbon yakalama teknolojilerine yatırım yapın'
        ]
      },
      'SOCAR TURKEY ENERJİ': {
        strengths: [
          '2030\'a kadar %30 emisyon azaltma hedefi',
          'CCUS (Karbon Yakalama) pilot projeleri',
          'Güçlü devlet desteği ve garantileri',
          'Petrokimya portföyünde çeşitlendirme'
        ],
        risks: [
          'Çok yüksek karbon yoğunluğu',
          'Düşük ACT skoru (0.6/20)',
          'Fosil yakıt gelirlerine bağımlılık',
          'AB karbon düzenlemelerinden yüksek etkilenme'
        ],
        recommendations: [
          'Yenilenebilir enerji portföyü oluşturun',
          'CCUS yatırımlarını hızlandırın',
          'Yeşil finansman kaynaklarına erişimi artırın',
          'Scope 3 emisyonları için tedarik zinciri dönüşümü'
        ]
      },
      'ŞİŞECAM A.Ş.': {
        strengths: [
          'Enerji verimliliği projeleri başlatıldı',
          'Geri dönüşüm oranlarında sektör lideri',
          'ISO 14001 sertifikası mevcut',
          'Güneş ve rüzgar enerjisi yatırımları'
        ],
        risks: [
          'Enerji yoğun üretim süreçleri',
          'AB ETS/CBAM kapsamında yüksek maliyet',
          'CDP skoru düşük (B-)',
          'Fosil yakıtlı fırın bağımlılığı'
        ],
        recommendations: [
          'Elektrikli fırın dönüşümünü hızlandırın',
          'Yeşil enerji PPA anlaşmaları yapın',
          'Karbon nötr cam üretimi için AR-GE yatırımları',
          'Döngüsel ekonomi stratejisini güçlendirin'
        ]
      }
    };

    return details[company.musteriIsmi] || {
      strengths: [
        'İklim risk farkındalığı mevcut',
        'Sektörel ortalamaya yakın performans',
        'Temel sürdürülebilirlik yapıları kurulu',
        'Risk azaltma planları geliştirilmeye başlandı'
      ],
      risks: [
        'Detaylı iklim stratejisi eksikliği',
        'Emisyon azaltma hedefleri net değil',
        'Fiziksel risk değerlendirmesi yetersiz',
        'İklim finansmanı stratejisi belirsiz'
      ],
      recommendations: [
        'TCFD uyumlu raporlama başlatın',
        'Bilime dayalı hedefler (SBTi) belirleyin',
        'Fiziksel risk değerlendirmesi yapın',
        'Yeşil finansman fırsatlarını değerlendirin'
      ]
    };
  };

  const assessment = getRiskAssessmentDetails();

  return (
    <div>
      <Link to="/portfolio" className="btn btn-primary" style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={16} />
        {t('backToPortfolio')}
      </Link>

      {/* Şirket Başlığı */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{company.musteriIsmi}</h1>
            <div style={{ display: 'flex', gap: '24px', color: '#666', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={16} />
                <span>{company.sektor}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} />
                <span>NACE: {company.naceKodu}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} />
                <span>Türkiye</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>
              {company.krediDovizKodu} {(company.krediTutari / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>{company.krediTuru}</div>
          </div>
        </div>
      </div>

      {/* Risk Özeti */}
      <div className="grid grid-3" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <TrendingUp size={24} color="#0066cc" />
            <span className="stat-label">{t('transitionRisk')} (2025)</span>
          </div>
          <div className="stat-value">{company.transitionRisk2025.toFixed(2)}</div>
          <div className={`risk-${company.transitionRisk2025 < 1.5 ? 'low' : company.transitionRisk2025 < 2.5 ? 'medium' : 'high'}`}>
            {company.transitionRisk2025 < 1.5 ? t('lowRisk') : company.transitionRisk2025 < 2.5 ? t('mediumRisk') : t('highRisk')}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <AlertTriangle size={24} color="#ffc107" />
            <span className="stat-label">{t('transitionRisk')} (2035)</span>
          </div>
          <div className="stat-value">{company.transitionRisk2035.toFixed(2)}</div>
          <div className={`risk-${company.transitionRisk2035 < 1.5 ? 'low' : company.transitionRisk2035 < 2.5 ? 'medium' : 'high'}`}>
            {company.transitionRisk2035 < 1.5 ? t('lowRisk') : company.transitionRisk2035 < 2.5 ? t('mediumRisk') : t('highRisk')}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Shield size={24} color="#28a745" />
            <span className="stat-label">{t('physicalRisk')}</span>
          </div>
          <div className="stat-value">{company.physicalRisk.toFixed(2)}</div>
          <div className={`risk-${company.physicalRisk < 2.0 ? 'low' : company.physicalRisk < 2.5 ? 'medium' : 'high'}`}>
            {company.physicalRisk < 2.0 ? t('lowRisk') : company.physicalRisk < 2.5 ? t('mediumRisk') : t('highRisk')}
          </div>
        </div>
      </div>

      {/* Risk Profili ve Projeksiyonlar */}
      <div className="grid grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>{t('riskProfile')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={riskRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="criteria" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name={t('riskScore')} dataKey="value" stroke="#0066cc" fill="#0066cc" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>{t('riskProjections')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="transition" stroke="#0066cc" name={t('transitionRisk')} strokeWidth={2} />
              <Line type="monotone" dataKey="physical" stroke="#dc3545" name={t('physicalRisk')} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detaylı Değerlendirme */}
      <div className="grid grid-3" style={{ marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px', color: '#28a745' }}>{t('strengths')}</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {assessment.strengths.map((item, index) => (
              <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                <span style={{ color: '#28a745', marginRight: '8px' }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', color: '#dc3545' }}>{t('riskAreas')}</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {assessment.risks.map((item, index) => (
              <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                <span style={{ color: '#dc3545', marginRight: '8px' }}>⚠</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', color: '#0066cc' }}>{t('recommendations')}</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {assessment.recommendations.map((item, index) => (
              <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                <span style={{ color: '#0066cc', marginRight: '8px' }}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;