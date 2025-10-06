import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Users, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { portfolioData, sectorRiskData } from '../data/portfolio';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  // Portföy özet hesaplamaları
  const totalLoans = portfolioData.reduce((sum, item) => sum + item.krediTutari, 0);
  const totalCompanies = portfolioData.length;
  const highRiskCount = portfolioData.filter(item => item.riskCategory === 'High').length;
  const avgTransitionRisk = portfolioData.reduce((sum, item) => sum + item.transitionRisk2025, 0) / portfolioData.length;

  // Sektör dağılımı
  const sectorDistribution = portfolioData.reduce((acc, item) => {
    acc[item.sektor] = (acc[item.sektor] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(sectorDistribution).map(([sector, count]) => ({
    name: sector,
    value: count
  }));

  // Risk dağılımı
  const riskDistribution = [
    { risk: t('lowRisk'), count: portfolioData.filter(item => item.transitionRisk2025 < 1.5).length },
    { risk: t('mediumRisk'), count: portfolioData.filter(item => item.transitionRisk2025 >= 1.5 && item.transitionRisk2025 < 2.5).length },
    { risk: t('highRisk'), count: portfolioData.filter(item => item.transitionRisk2025 >= 2.5).length }
  ];

  const COLORS = ['#0066cc', '#00a86b', '#ffc107', '#dc3545', '#6c757d', '#17a2b8', '#6610f2', '#e83e8c'];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t('dashboard')}</h1>
        <p className="page-subtitle">{t('climateRiskPortfolioSummary')}</p>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <Users className="stat-icon" size={24} color="#0066cc" />
          <div className="stat-label">{t('totalCompanies')}</div>
          <div className="stat-value">{totalCompanies}</div>
          <div className="stat-change positive">
            <ArrowUpRight size={16} />
            <span>{t('newAdditions', '3 yeni')}</span>
          </div>
        </div>

        <div className="stat-card">
          <TrendingUp className="stat-icon" size={24} color="#00a86b" />
          <div className="stat-label">{t('totalCredit')}</div>
          <div className="stat-value">€{(totalLoans / 1000000).toFixed(1)}M</div>
          <div className="stat-change positive">
            <ArrowUpRight size={16} />
            <span>%12</span>
          </div>
        </div>

        <div className="stat-card">
          <Activity className="stat-icon" size={24} color="#ffc107" />
          <div className="stat-label">{t('avgTransitionRisk')}</div>
          <div className="stat-value">{avgTransitionRisk.toFixed(2)}</div>
          <div className="stat-change negative">
            <ArrowDownRight size={16} />
            <span>%5</span>
          </div>
        </div>

        <div className="stat-card">
          <AlertTriangle className="stat-icon" size={24} color="#dc3545" />
          <div className="stat-label">{t('highRiskLabel')}</div>
          <div className="stat-value">{highRiskCount}</div>
          <div className="stat-change">
            <span>{t('companies')}</span>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>{t('sectorDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>{t('riskDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="risk" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0066cc" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* En Riskli Şirketler */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>{t('highestRiskCompanies')}</h3>
        <table className="table">
          <thead>
            <tr>
              <th>{t('company')}</th>
              <th>{t('sector')}</th>
              <th>{t('creditAmount')}</th>
              <th>{t('transitionRisk')}</th>
              <th>{t('riskCategory')}</th>
              <th>{t('details')}</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData
              .sort((a, b) => b.transitionRisk2025 - a.transitionRisk2025)
              .slice(0, 5)
              .map(company => (
                <tr key={company.id}>
                  <td>{company.musteriIsmi}</td>
                  <td>{company.sektor}</td>
                  <td>{company.krediDovizKodu} {(company.krediTutari / 1000000).toFixed(1)}M</td>
                  <td>{company.transitionRisk2025.toFixed(2)}</td>
                  <td>
                    <span className={`risk-${company.riskCategory.toLowerCase()}`}>
                      {company.riskCategory}
                    </span>
                  </td>
                  <td>
                    <Link to={`/company/${company.id}`} className="btn btn-primary">
                      {t('view')}
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

export default Dashboard;