import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { useTranslation } from 'react-i18next';

const Portfolio = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [sortBy, setSortBy] = useState('musteriIsmi');

  // Benzersiz sektörleri al
  const sectors = [...new Set(portfolioData.map(item => item.sektor))];

  // Filtreleme ve sıralama
  const filteredData = portfolioData
    .filter(item => {
      const matchesSearch = item.musteriIsmi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.naceKodu.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = !selectedSector || item.sektor === selectedSector;
      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      if (sortBy === 'musteriIsmi') return a.musteriIsmi.localeCompare(b.musteriIsmi);
      if (sortBy === 'krediTutari') return b.krediTutari - a.krediTutari;
      if (sortBy === 'transitionRisk') return b.transitionRisk2025 - a.transitionRisk2025;
      return 0;
    });

  const formatCurrency = (amount, currency) => {
    if (amount >= 1000000) {
      return `${currency} ${(amount / 1000000).toFixed(1)}M`;
    }
    return `${currency} ${(amount / 1000).toFixed(0)}K`;
  };

  const getRiskClass = (risk) => {
    if (risk < 1.5) return 'risk-low';
    if (risk < 2.5) return 'risk-medium';
    return 'risk-high';
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('creditPortfolio')}</h1>
        <p className="page-subtitle">{t('totalCompaniesDisplayed', { count: filteredData.length })}</p>
      </div>

      {/* Filtreler */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
              {t('search')}
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="text"
                placeholder={t('searchByCompanyName')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 40px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
              {t('sector')}
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">{t('allSectors')}</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
              {t('sortBy')}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="musteriIsmi">{t('companyName')}</option>
              <option value="krediTutari">{t('creditAmount')}</option>
              <option value="transitionRisk">{t('riskLevel')}</option>
            </select>
          </div>

          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} />
            {t('downloadExcel')}
          </button>
        </div>
      </div>

      {/* Tablo */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>{t('customerNo')}</th>
              <th>{t('companyName')}</th>
              <th>{t('sector')}</th>
              <th>{t('naceCode')}</th>
              <th>{t('creditAmount')}</th>
              <th>{t('creditType')}</th>
              <th>{t('transitionRisk')} (2025)</th>
              <th>{t('transitionRisk')} (2035)</th>
              <th>{t('physicalRisk')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td style={{ fontWeight: '500' }}>{item.musteriIsmi}</td>
                <td>{item.sektor}</td>
                <td>{item.naceKodu}</td>
                <td>{formatCurrency(item.krediTutari, item.krediDovizKodu)}</td>
                <td>{item.krediTuru}</td>
                <td>
                  <span className={getRiskClass(item.transitionRisk2025)}>
                    {item.transitionRisk2025.toFixed(2)}
                  </span>
                </td>
                <td>
                  <span className={getRiskClass(item.transitionRisk2035)}>
                    {item.transitionRisk2035.toFixed(2)}
                  </span>
                </td>
                <td>
                  <span className={getRiskClass(item.physicalRisk)}>
                    {item.physicalRisk.toFixed(2)}
                  </span>
                </td>
                <td>
                  <Link 
                    to={`/company/${item.id}`} 
                    className="btn btn-primary"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      padding: '6px 12px',
                      fontSize: '13px'
                    }}
                  >
                    <Eye size={14} />
                    {t('details')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;