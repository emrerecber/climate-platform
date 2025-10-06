import React, { useState, useMemo } from 'react';

const CountryRiskDashboard = ({ selectedCountries = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'ndGainIndex', direction: 'asc' });
  const [filterRisk, setFilterRisk] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // PDF sayfa 20-23'teki ND-GAIN Country Index verisi
  const countryData = [
    { code: 'NO', name: 'Norway', ndGainIndex: 0.2320, region: 'Europe', riskLevel: 'Very Low' },
    { code: 'FI', name: 'Finland', ndGainIndex: 0.2520, region: 'Europe', riskLevel: 'Very Low' },
    { code: 'CH', name: 'Switzerland', ndGainIndex: 0.2710, region: 'Europe', riskLevel: 'Very Low' },
    { code: 'DK', name: 'Denmark', ndGainIndex: 0.2730, region: 'Europe', riskLevel: 'Very Low' },
    { code: 'SE', name: 'Sweden', ndGainIndex: 0.2890, region: 'Europe', riskLevel: 'Very Low' },
    { code: 'SG', name: 'Singapore', ndGainIndex: 0.2920, region: 'Asia', riskLevel: 'Very Low' },
    { code: 'NZ', name: 'New Zealand', ndGainIndex: 0.3000, region: 'Oceania', riskLevel: 'Low' },
    { code: 'GB', name: 'United Kingdom', ndGainIndex: 0.3010, region: 'Europe', riskLevel: 'Low' },
    { code: 'DE', name: 'Germany', ndGainIndex: 0.3040, region: 'Europe', riskLevel: 'Low' },
    { code: 'AU', name: 'Australia', ndGainIndex: 0.3080, region: 'Oceania', riskLevel: 'Low' },
    { code: 'CA', name: 'Canada', ndGainIndex: 0.3150, region: 'North America', riskLevel: 'Low' },
    { code: 'IS', name: 'Iceland', ndGainIndex: 0.3160, region: 'Europe', riskLevel: 'Low' },
    { code: 'KR', name: 'Republic of Korea', ndGainIndex: 0.3260, region: 'Asia', riskLevel: 'Low' },
    { code: 'FR', name: 'France', ndGainIndex: 0.3280, region: 'Europe', riskLevel: 'Low' },
    { code: 'NL', name: 'Netherlands', ndGainIndex: 0.3330, region: 'Europe', riskLevel: 'Low' },
    { code: 'US', name: 'United States', ndGainIndex: 0.3350, region: 'North America', riskLevel: 'Low' },
    { code: 'JP', name: 'Japan', ndGainIndex: 0.3460, region: 'Asia', riskLevel: 'Low' },
    { code: 'AE', name: 'United Arab Emirates', ndGainIndex: 0.4010, region: 'Middle East', riskLevel: 'Medium' },
    { code: 'CN', name: 'China', ndGainIndex: 0.4190, region: 'Asia', riskLevel: 'Medium' },
    { code: 'QA', name: 'Qatar', ndGainIndex: 0.4200, region: 'Middle East', riskLevel: 'Medium' },
    { code: 'SA', name: 'Saudi Arabia', ndGainIndex: 0.4210, region: 'Middle East', riskLevel: 'Medium' },
    { code: 'RU', name: 'Russian Federation', ndGainIndex: 0.4340, region: 'Europe', riskLevel: 'Medium' },
    { code: 'MY', name: 'Malaysia', ndGainIndex: 0.4460, region: 'Asia', riskLevel: 'Medium' },
    { code: 'TR', name: 'Turkey', ndGainIndex: 0.4610, region: 'Europe', riskLevel: 'Medium' },
    { code: 'MK', name: 'Macedonia', ndGainIndex: 0.4750, region: 'Europe', riskLevel: 'Medium' },
    { code: 'OM', name: 'Oman', ndGainIndex: 0.4770, region: 'Middle East', riskLevel: 'Medium' },
    { code: 'BR', name: 'Brazil', ndGainIndex: 0.5280, region: 'South America', riskLevel: 'High' },
    { code: 'ZA', name: 'South Africa', ndGainIndex: 0.5340, region: 'Africa', riskLevel: 'High' },
    { code: 'ID', name: 'Indonesia', ndGainIndex: 0.5410, region: 'Asia', riskLevel: 'High' },
    { code: 'MX', name: 'Mexico', ndGainIndex: 0.5420, region: 'North America', riskLevel: 'High' },
    { code: 'IN', name: 'India', ndGainIndex: 0.5650, region: 'Asia', riskLevel: 'High' },
    { code: 'TG', name: 'Togo', ndGainIndex: 0.5890, region: 'Africa', riskLevel: 'Very High' },
    { code: 'GT', name: 'Guatemala', ndGainIndex: 0.5900, region: 'Central America', riskLevel: 'Very High' },
    { code: 'ZM', name: 'Zambia', ndGainIndex: 0.5940, region: 'Africa', riskLevel: 'Very High' },
    { code: 'KP', name: 'North Korea', ndGainIndex: 0.5940, region: 'Asia', riskLevel: 'Very High' },
    { code: 'MH', name: 'Marshall Islands', ndGainIndex: 0.5950, region: 'Oceania', riskLevel: 'Very High' },
    { code: 'SN', name: 'Senegal', ndGainIndex: 0.5960, region: 'Africa', riskLevel: 'Very High' },
    { code: 'CI', name: "Côte d'Ivoire", ndGainIndex: 0.5970, region: 'Africa', riskLevel: 'Very High' },
    { code: 'BO', name: 'Bolivia', ndGainIndex: 0.5980, region: 'South America', riskLevel: 'Very High' },
    { code: 'GA', name: 'Gabon', ndGainIndex: 0.6000, region: 'Africa', riskLevel: 'Very High' },
    { code: 'ET', name: 'Ethiopia', ndGainIndex: 0.6130, region: 'Africa', riskLevel: 'Very High' },
    { code: 'TZ', name: 'Tanzania', ndGainIndex: 0.6160, region: 'Africa', riskLevel: 'Very High' },
    { code: 'NG', name: 'Nigeria', ndGainIndex: 0.6290, region: 'Africa', riskLevel: 'Very High' },
    { code: 'BD', name: 'Bangladesh', ndGainIndex: 0.6710, region: 'Asia', riskLevel: 'Very High' },
    { code: 'AF', name: 'Afghanistan', ndGainIndex: 0.6720, region: 'Asia', riskLevel: 'Very High' },
    { code: 'CD', name: 'Dem. Rep. of Congo', ndGainIndex: 0.6730, region: 'Africa', riskLevel: 'Very High' },
    { code: 'SD', name: 'Sudan', ndGainIndex: 0.6980, region: 'Africa', riskLevel: 'Very High' },
    { code: 'ER', name: 'Eritrea', ndGainIndex: 0.7150, region: 'Africa', riskLevel: 'Very High' },
    { code: 'CF', name: 'Central African Rep.', ndGainIndex: 0.7310, region: 'Africa', riskLevel: 'Very High' },
    { code: 'TD', name: 'Chad', ndGainIndex: 0.7500, region: 'Africa', riskLevel: 'Very High' }
  ];

  const getRiskColor = (riskLevel) => {
    const colors = {
      'Very Low': '#22c55e',
      'Low': '#84cc16', 
      'Medium': '#eab308',
      'High': '#f97316',
      'Very High': '#ef4444'
    };
    return colors[riskLevel] || '#6b7280';
  };

  const getRiskMultiplier = (ndGainIndex) => {
    const countryRiskIndex = 1 - ndGainIndex;
    const kappa = 0.3; // PDF'deki country risk sensitivity
    return (1 + kappa * countryRiskIndex).toFixed(3);
  };

  // Filtering and sorting
  const filteredData = useMemo(() => {
    let filtered = countryData;

    // Risk level filter
    if (filterRisk !== 'all') {
      filtered = filtered.filter(country => country.riskLevel === filterRisk);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(country => 
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [countryData, filterRisk, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↗️' : '↘️';
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f1f5f9'
      }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#1e293b' }}>
            🌍 Country Risk Analysis (ND-GAIN Index)
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            PDF Appendix: University of Notre Dame Global Adaptation Initiative
          </p>
        </div>
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '12px 20px',
          borderRadius: '25px',
          border: '2px solid #0ea5e940'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0369a1' }}>
            {filteredData.length} Ülke
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Risk Analizi
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 2fr',
        gap: '15px',
        marginBottom: '25px',
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '10px'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
            Risk Seviyesi
          </label>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="all">Tümü</option>
            <option value="Very Low">Very Low</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Very High">Very High</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
            Sıralama
          </label>
          <select
            onChange={(e) => {
              const [key, direction] = e.target.value.split('|');
              setSortConfig({ key, direction });
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="ndGainIndex|asc">Risk (Düşükten Yükseğe)</option>
            <option value="ndGainIndex|desc">Risk (Yüksekten Düşüğe)</option>
            <option value="name|asc">Ülke Adı (A-Z)</option>
            <option value="name|desc">Ülke Adı (Z-A)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
            Ülke Ara
          </label>
          <input
            type="text"
            placeholder="Ülke adı veya kodu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflow: 'auto', maxHeight: '600px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f5f9', position: 'sticky', top: 0, zIndex: 10 }}>
            <tr>
              <th 
                style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '2px solid #e5e7eb'
                }}
                onClick={() => handleSort('code')}
              >
                Code {getSortIcon('code')}
              </th>
              <th 
                style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '2px solid #e5e7eb'
                }}
                onClick={() => handleSort('name')}
              >
                Country {getSortIcon('name')}
              </th>
              <th 
                style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '2px solid #e5e7eb'
                }}
                onClick={() => handleSort('region')}
              >
                Region {getSortIcon('region')}
              </th>
              <th 
                style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '2px solid #e5e7eb'
                }}
                onClick={() => handleSort('ndGainIndex')}
              >
                ND-GAIN Index {getSortIcon('ndGainIndex')}
              </th>
              <th 
                style={{ 
                  padding: '12px', 
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '2px solid #e5e7eb'
                }}
              >
                Risk Multiplier
              </th>
              <th 
                style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '2px solid #e5e7eb'
                }}
                onClick={() => handleSort('riskLevel')}
              >
                Risk Level {getSortIcon('riskLevel')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((country, index) => (
              <tr 
                key={country.code}
                style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                  transition: 'background-color 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9fafb'}
              >
                <td style={{ 
                  padding: '12px', 
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#1f2937'
                }}>
                  {country.code}
                </td>
                <td style={{ 
                  padding: '12px',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  {country.name}
                </td>
                <td style={{ 
                  padding: '12px',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  {country.region}
                </td>
                <td style={{ 
                  padding: '12px', 
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {country.ndGainIndex.toFixed(4)}
                </td>
                <td style={{ 
                  padding: '12px', 
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#7c3aed'
                }}>
                  {getRiskMultiplier(country.ndGainIndex)}×
                </td>
                <td style={{ 
                  padding: '12px', 
                  textAlign: 'center'
                }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: getRiskColor(country.riskLevel) + '20',
                    color: getRiskColor(country.riskLevel),
                    border: `1px solid ${getRiskColor(country.riskLevel)}40`
                  }}>
                    {country.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3>Sonuç Bulunamadı</h3>
          <p>Filtreleri değiştirmeyi deneyin.</p>
        </div>
      )}

      {/* PDF Reference */}
      <div style={{
        marginTop: '25px',
        backgroundColor: '#f8fafc',
        padding: '12px 16px',
        borderRadius: '8px',
        borderLeft: '4px solid #3b82f6'
      }}>
        <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600' }}>
          📑 PDF Referans: Appendix - ND-GAIN Country Index Rankings
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
          "PD_buyer,adj = PD_buyer × (1 + κ × Country_Risk(PRS_new))" - EXIM Formula
        </div>
      </div>
    </div>
  );
};

export default CountryRiskDashboard;