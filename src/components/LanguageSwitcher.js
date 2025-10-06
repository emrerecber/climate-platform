import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '6px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease'
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
      }}
    >
      <span style={{ fontSize: '16px' }}>
        {i18n.language === 'tr' ? '🇹🇷' : '🇺🇸'}
      </span>
      <span>
        {i18n.language === 'tr' ? 'TR' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;