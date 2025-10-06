import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

const HomePage = ({ onLogin }) => {
  const { t } = useTranslation();
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#1a1a1a', 
        color: 'white', 
        padding: '20px 0' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0 }}>Datinova & Clymflex - {t('climateRiskPlatform')}</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <LanguageSwitcher />
            <button
              onClick={() => onLogin('login')}
              style={{
                padding: '10px 25px',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {t('login')}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        backgroundColor: '#0066cc',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '48px', marginBottom: '20px' }}>
            {t('welcome')}
          </h2>
          <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.9 }}>
            {t('subtitle')}
          </p>
          <button
            onClick={() => onLogin('demo')}
            style={{
              padding: '15px 40px',
              backgroundColor: 'white',
              color: '#0066cc',
              border: 'none',
              borderRadius: '30px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {t('startAssessment')}
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '36px' }}>
            {t('platformFeatures')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <FeatureCard
              icon="📆"
              title={t('riskAnalysisFeature')}
              description={t('riskAnalysisDesc')}
            />
            <FeatureCard
              icon="📈"
              title={t('tcfdCompliantFeature')}
              description={t('tcfdCompliantDesc')}
            />
            <FeatureCard
              icon="🌍"
              title={t('esgIntegration')}
              description={t('esgIntegrationDesc')}
            />
            <FeatureCard
              icon="📁"
              title={t('detailedReporting')}
              description={t('detailedReportingDesc')}
            />
            <FeatureCard
              icon="🔒"
              title={t('secureData')}
              description={t('secureDataDesc')}
            />
            <FeatureCard
              icon="🤝"
              title={t('sectoralComparison')}
              description={t('sectoralComparisonDesc')}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '36px' }}>
            {t('howItWorks')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            <StepCard number="1" title={t('dataEntry')} description={t('dataEntryDesc')} />
            <StepCard number="2" title={t('riskAnalysisStep')} description={t('riskAnalysisStepDesc')} />
            <StepCard number="3" title={t('reportingStep')} description={t('reportingStepDesc')} />
            <StepCard number="4" title={t('actionPlan')} description={t('actionPlanDesc')} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#1a1a1a', 
        color: 'white', 
        padding: '40px 20px',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p>&copy; 2024 Datinova & Clymflex {t('allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease'
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{ fontSize: '48px', marginBottom: '20px' }}>{icon}</div>
    <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>{title}</h3>
    <p style={{ color: '#666', lineHeight: '1.6' }}>{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#0066cc',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      {number}
    </div>
    <h4 style={{ marginBottom: '10px' }}>{title}</h4>
    <p style={{ color: '#666' }}>{description}</p>
  </div>
);

export default HomePage;