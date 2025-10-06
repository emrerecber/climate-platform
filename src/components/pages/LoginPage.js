import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

const LoginPage = ({ onLogin, onBack }) => {
  const { t } = useTranslation();
  const [userType, setUserType] = useState('customer'); // 'customer' or 'admin'
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Basit doğrulama - gerçek uygulamada API çağrısı yapılır
    if (userType === 'admin' && credentials.username === 'admin' && credentials.password === 'admin123') {
      onLogin('admin', { username: 'admin', role: 'admin' });
    } else if (userType === 'customer' && credentials.username && credentials.password) {
      onLogin('customer', { username: credentials.username, role: 'customer' });
    } else {
      setError(t('invalidCredentials'));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
        width: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '10px' }}>{t('climateRiskPlatform')}</h2>
          <p style={{ color: '#666' }}>Datinova & Clymflex</p>
        </div>

        {/* User Type Selector */}
        <div style={{ display: 'flex', marginBottom: '30px' }}>
          <button
            onClick={() => setUserType('customer')}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: userType === 'customer' ? '#0066cc' : '#f0f0f0',
              color: userType === 'customer' ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px 0 0 5px',
              cursor: 'pointer'
            }}
          >
            {t('customerLogin')}
          </button>
          <button
            onClick={() => setUserType('admin')}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: userType === 'admin' ? '#0066cc' : '#f0f0f0',
              color: userType === 'admin' ? 'white' : '#333',
              border: 'none',
              borderRadius: '0 5px 5px 0',
              cursor: 'pointer'
            }}
          >
            {t('adminLogin')}
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c00',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              {t('username')}
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              placeholder={userType === 'admin' ? 'admin' : 'Kullanıcı adınız'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              {t('password')}
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              placeholder={userType === 'admin' ? 'admin123' : 'Şifreniz'}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {t('loginButton')}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a 
            onClick={onBack}
            style={{ color: '#0066cc', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {t('backToHome')}
          </a>
        </div>

        {userType === 'admin' && (
          <div style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f0f8ff',
            borderRadius: '5px',
            fontSize: '12px',
            color: '#666'
          }}>
            {t('testCredentials')}: {t('username')}: <strong>admin</strong>, {t('password')}: <strong>admin123</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;