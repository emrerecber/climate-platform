import React, { useState, useEffect } from 'react';
import { assessmentAPI } from '../services/api';
import { useToast } from './Toast';
import './AssessmentHistory.css';

const AssessmentHistory = ({ onClose, onViewAssessment }) => {
  const toast = useToast();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    sector: '',
    status: '',
    search: ''
  });
  const [stats, setStats] = useState(null);

  // Load assessments on mount
  useEffect(() => {
    loadAssessments();
    loadStats();
  }, []);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const response = await assessmentAPI.getAll(filter);
      setAssessments(response.data.assessments || []);
    } catch (error) {
      console.error('Error loading assessments:', error);
      toast.showError('Failed to load assessments: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await assessmentAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    loadAssessments();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await assessmentAPI.delete(id);
      toast.showSuccess('Assessment deleted successfully');
      loadAssessments();
      loadStats();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.showError('Failed to delete assessment: ' + error.message);
    }
  };

  const handleView = (assessment) => {
    if (onViewAssessment) {
      onViewAssessment(assessment);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { label: 'Completed', color: '#10b981' },
      in_progress: { label: 'In Progress', color: '#f59e0b' },
      draft: { label: 'Draft', color: '#6b7280' }
    };
    const badge = badges[status] || badges.draft;
    return (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: badge.color + '20',
          color: badge.color
        }}
      >
        {badge.label}
      </span>
    );
  };

  const filteredAssessments = assessments.filter(a => {
    if (filter.sector && a.sector !== filter.sector) return false;
    if (filter.status && a.status !== filter.status) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        a.companyName?.toLowerCase().includes(searchLower) ||
        a.sector?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="assessment-history-overlay">
      <div className="assessment-history-modal">
        {/* Header */}
        <div className="assessment-history-header">
          <div>
            <h2>📊 Assessment History</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '8px 0 0 0' }}>
              View and manage your saved climate risk assessments
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0',
              width: '32px',
              height: '32px'
            }}
          >
            ×
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="assessment-stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total || 0}</div>
              <div className="stat-label">Total Assessments</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.completed || 0}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.inProgress || 0}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.draft || 0}</div>
              <div className="stat-label">Drafts</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="assessment-filters">
          <input
            type="text"
            placeholder="🔍 Search by company name..."
            value={filter.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <select
            value={filter.sector}
            onChange={(e) => handleFilterChange('sector', e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="">All Sectors</option>
            <option value="Enerji">Enerji</option>
            <option value="Otomotiv">Otomotiv</option>
            <option value="Çelik">Çelik</option>
            <option value="Çimento">Çimento</option>
            <option value="Havacılık">Havacılık</option>
            <option value="Gayrimenkul">Gayrimenkul</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={filter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="draft">Draft</option>
          </select>
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </div>

        {/* Assessment List */}
        <div className="assessment-list-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Loading assessments...
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                No assessments found
              </div>
              <div style={{ fontSize: '14px' }}>
                Create your first assessment to see it here
              </div>
            </div>
          ) : (
            <div className="assessment-list">
              {filteredAssessments.map(assessment => (
                <div key={assessment.id} className="assessment-card">
                  <div className="assessment-card-header">
                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1f2937' }}>
                        {assessment.companyName || 'Unnamed Company'}
                      </h3>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#6b7280' }}>
                        <span>🏢 {assessment.sector || 'Unknown'}</span>
                        <span>📅 {formatDate(assessment.createdAt)}</span>
                      </div>
                    </div>
                    {getStatusBadge(assessment.status)}
                  </div>

                  <div className="assessment-card-body">
                    <div className="assessment-metrics">
                      {assessment.results?.financialAnalysis && (
                        <div className="metric">
                          <span className="metric-label">Total Income</span>
                          <span className="metric-value">
                            {assessment.results.financialAnalysis.summary?.totalIncome?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                      )}
                      {assessment.results?.pacta && (
                        <div className="metric">
                          <span className="metric-label">PACTA</span>
                          <span className="metric-value">
                            {assessment.results.pacta.sector || 'N/A'}
                          </span>
                        </div>
                      )}
                      {assessment.results?.tcfd && (
                        <div className="metric">
                          <span className="metric-label">TCFD Score</span>
                          <span className="metric-value">
                            {assessment.results.tcfd.overallScore?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="assessment-card-footer">
                    <button
                      onClick={() => handleView(assessment)}
                      style={{
                        flex: 1,
                        padding: '8px 16px',
                        backgroundColor: '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      View Results
                    </button>
                    <button
                      onClick={() => handleDelete(assessment.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="assessment-history-footer">
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentHistory;
