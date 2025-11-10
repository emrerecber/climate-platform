import React, { useState, useEffect } from 'react';
import { companyAPI, authAPI } from '../services/api';
import ApprovalQueue from './ApprovalQueue';
import OrganizationSettings from './OrganizationSettings';
import NotificationCenter from './NotificationCenter';
import AssessmentHistory from './AssessmentHistory';

const Dashboard = ({ user, onLogout, onSelectCompany }) => {
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApprovalQueue, setShowApprovalQueue] = useState(false);
  const [showOrgSettings, setShowOrgSettings] = useState(false);
  const [showAssessmentHistory, setShowAssessmentHistory] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, rejected, draft

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [companiesRes, statsRes] = await Promise.all([
        companyAPI.getAll(),
        companyAPI.getStats()
      ]);
      
      setCompanies(companiesRes.data.companies);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    onLogout();
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p>Loading your data...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '20px 40px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#667eea', fontSize: '24px' }}>
            🌍 Climate Platform
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Welcome, {user.firstName || user.email}
            </p>
            {user.role && (
              <span style={{
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: 
                  user.role === 'admin' ? '#dc3545' :
                  user.role === 'manager' ? '#ffc107' :
                  user.role === 'analyst' ? '#667eea' :
                  user.role === 'auditor' ? '#6c757d' : '#28a745',
                color: 'white'
              }}>
                {user.role.toUpperCase()}
              </span>
            )}
            {user.customerProfile && user.customerProfile !== 'other' && (
              <span style={{
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: '#e7f3ff',
                color: '#0066cc'
              }}>
                {user.customerProfile === 'asset_manager' ? 'Asset Mgr' : 
                 user.customerProfile.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Notification Center */}
          <NotificationCenter userId={user.id} />
          
          {/* Organization Settings button for Admin/Manager */}
          {(user.role === 'admin' || user.role === 'manager') && (
            <button
              onClick={() => setShowOrgSettings(true)}
              style={{
                padding: '10px 16px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🏢 Organization
            </button>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Enhanced Stats Cards */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '40px'
          }}>
            <div 
              onClick={() => setStatusFilter('all')}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: statusFilter === 'all' ? '0 4px 12px rgba(102,126,234,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: statusFilter === 'all' ? '2px solid #667eea' : '2px solid transparent'
              }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
                {stats.total || 0}
              </div>
              <div style={{ color: '#666', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
                Total
              </div>
            </div>

            <div 
              onClick={() => setStatusFilter('pending_review')}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: statusFilter === 'pending_review' ? '0 4px 12px rgba(255,193,7,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: statusFilter === 'pending_review' ? '2px solid #ffc107' : '2px solid transparent'
              }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107' }}>
                {stats.byStatus?.pending_review || 0}
              </div>
              <div style={{ color: '#666', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
                Pending Review
              </div>
            </div>

            <div 
              onClick={() => setStatusFilter('approved')}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: statusFilter === 'approved' ? '0 4px 12px rgba(40,167,69,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: statusFilter === 'approved' ? '2px solid #28a745' : '2px solid transparent'
              }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#28a745' }}>
                {stats.byStatus?.approved || 0}
              </div>
              <div style={{ color: '#666', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
                Approved
              </div>
            </div>

            <div 
              onClick={() => setStatusFilter('rejected')}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: statusFilter === 'rejected' ? '0 4px 12px rgba(220,53,69,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: statusFilter === 'rejected' ? '2px solid #dc3545' : '2px solid transparent'
              }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#dc3545' }}>
                {stats.byStatus?.rejected || 0}
              </div>
              <div style={{ color: '#666', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
                Rejected
              </div>
            </div>

            <div 
              onClick={() => setStatusFilter('draft')}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: statusFilter === 'draft' ? '0 4px 12px rgba(108,117,125,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: statusFilter === 'draft' ? '2px solid #6c757d' : '2px solid transparent'
              }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#6c757d' }}>
                {stats.byStatus?.draft || 0}
              </div>
              <div style={{ color: '#666', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
                Drafts
              </div>
            </div>
          </div>
        )}

        {/* Companies Section */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{ margin: 0, color: '#333', fontSize: '20px' }}>
              Your Companies
            </h2>
            {/* Only show button if user can create */}
            {(user.role === 'analyst' || user.role === 'manager' || user.role === 'admin') && (
              <button
                onClick={() => {
                  console.log('🟠 New Assessment clicked, onSelectCompany type:', typeof onSelectCompany);
                  if (typeof onSelectCompany === 'function') {
                    onSelectCompany({}); // Empty object for new assessment
                  } else {
                    console.error('❌ onSelectCompany is not a function!', onSelectCompany);
                  }
                }}
                style={{
                  padding: '10px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                + New Assessment
              </button>
            )}
            {user.role === 'viewer' && (
              <span style={{ fontSize: '14px', color: '#999', fontStyle: 'italic' }}>
                🔒 View-only access
              </span>
            )}
            {/* Assessment History button */}
            <button
              onClick={() => setShowAssessmentHistory(true)}
              style={{
                padding: '10px 20px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                marginLeft: '10px'
              }}
            >
              📊 Assessment History
            </button>
            {/* Approval Queue button for Managers/Admins */}
            {(user.role === 'manager' || user.role === 'admin') && (
              <button
                onClick={() => setShowApprovalQueue(true)}
                style={{
                  padding: '10px 20px',
                  background: '#ffc107',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginLeft: '10px'
                }}
              >
                📋 Approval Queue
              </button>
            )}
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: '#f8d7da',
              color: '#721c24',
              borderRadius: '6px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          {/* Filter indicator */}
          {statusFilter !== 'all' && (
            <div style={{
              padding: '12px',
              background: '#e7f3ff',
              borderRadius: '6px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', color: '#0066cc' }}>
                🔍 Filtering by: <strong>{statusFilter.replace('_', ' ').toUpperCase()}</strong>
              </span>
              <button
                onClick={() => setStatusFilter('all')}
                style={{
                  padding: '6px 12px',
                  background: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Clear Filter
              </button>
            </div>
          )}

          {companies.filter(c => statusFilter === 'all' || c.status === statusFilter).length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#999'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>No companies yet</p>
              <p style={{ fontSize: '14px' }}>Click "New Assessment" to get started</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {companies.filter(c => statusFilter === 'all' || c.status === statusFilter).map((company) => {
                // Get border color based on status
                const getBorderColor = () => {
                  if (company.status === 'pending_review') return '#ffc107';
                  if (company.status === 'approved') return '#28a745';
                  if (company.status === 'rejected') return '#dc3545';
                  return '#e0e0e0';
                };

                const getStatusIcon = () => {
                  if (company.status === 'pending_review') return '⏳';
                  if (company.status === 'approved') return '✅';
                  if (company.status === 'rejected') return '❌';
                  if (company.status === 'completed') return '✔️';
                  return '📝';
                };

                return (
                <div
                  key={company.id}
                  onClick={() => onSelectCompany(company)}
                  style={{
                    border: `2px solid ${getBorderColor()}`,
                    borderRadius: '8px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: 'white',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102,126,234,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Status Icon Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '20px'
                  }}>
                    {getStatusIcon()}
                  </div>

                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '18px',
                    color: '#333',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    paddingRight: '35px'
                  }}>
                    {company.companyName}
                  </h3>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: '#e7f3ff',
                      color: '#2196F3',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {company.sector}
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                    📍 {company.city || company.country}
                  </div>
                  
                  {company.revenue && (
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                      💰 ${(company.revenue / 1000000).toFixed(1)}M
                    </div>
                  )}

                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{
                        fontSize: '12px',
                        color: getBorderColor(),
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {company.status.replace('_', ' ')}
                      </span>
                      {company.approvalStatus && company.approvalStatus !== 'not_required' && (
                        <span style={{
                          fontSize: '10px',
                          color: '#999',
                          fontStyle: 'italic'
                        }}>
                          {company.approvedBy ? `By: ${company.approvedBy}` : 'Awaiting review'}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: '#999' }}>
                      {new Date(company.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recently Reviewed - For Managers/Admins */}
        {(user.role === 'manager' || user.role === 'admin') && companies.filter(c => c.status === 'approved' || c.status === 'rejected').length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginTop: '20px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📄 Recently Reviewed
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {companies
                .filter(c => c.status === 'approved' || c.status === 'rejected')
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5)
                .map((company) => (
                  <div
                    key={company.id}
                    onClick={() => onSelectCompany(company)}
                    style={{
                      padding: '16px',
                      border: `1px solid ${company.status === 'approved' ? '#28a745' : '#dc3545'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: company.status === 'approved' ? '#f0fdf4' : '#fef2f2'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: '#333', marginBottom: '4px' }}>
                          {company.status === 'approved' ? '✅' : '❌'} {company.companyName}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            padding: '2px 8px',
                            background: '#e7f3ff',
                            borderRadius: '8px',
                            fontSize: '11px'
                          }}>
                            {company.sector}
                          </span>
                          <span>📍 {company.country}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: company.status === 'approved' ? '#28a745' : '#dc3545',
                          textTransform: 'uppercase'
                        }}>
                          {company.status}
                        </div>
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                          {new Date(company.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {company.rejectedReason && (
                      <div style={{
                        marginTop: '8px',
                        padding: '8px',
                        background: '#fff',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#666',
                        fontStyle: 'italic'
                      }}>
                        Reason: {company.rejectedReason}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {stats?.recent && stats.recent.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginTop: '20px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>
              Recent Activity
            </h3>
            {stats.recent.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  borderBottom: index < stats.recent.length - 1 ? '1px solid #e0e0e0' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>
                    {item.companyName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {item.sector}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approval Queue Modal */}
      {showApprovalQueue && (
        <ApprovalQueue onClose={() => setShowApprovalQueue(false)} />
      )}

      {/* Organization Settings Modal */}
      {showOrgSettings && (
        <OrganizationSettings onClose={() => setShowOrgSettings(false)} />
      )}

      {/* Assessment History Modal */}
      {showAssessmentHistory && (
        <AssessmentHistory 
          onClose={() => setShowAssessmentHistory(false)}
          onViewAssessment={(assessment) => {
            console.log('Viewing assessment:', assessment);
            setShowAssessmentHistory(false);
            // Reload the assessment data into the form
            onSelectCompany({ 
              id: assessment.companyId,
              ...assessment.formData 
            });
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
