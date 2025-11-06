import React, { useState, useEffect } from 'react';
import { companyAPI } from '../services/api';
import { addNotification } from './NotificationCenter';

const ApprovalQueue = ({ onClose }) => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getPending();
      setPending(response.data.companies);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      const company = pending.find(c => c.id === id);
      await companyAPI.approve(id);
      
      // Send notification to assessment owner
      if (company && company.userId) {
        addNotification(company.userId, {
          type: 'approved',
          title: 'Assessment Approved',
          message: `Your assessment "${company.companyName}" has been approved!`
        });
      }
      
      alert('✅ Company approved!');
      loadPending(); // Refresh list
    } catch (err) {
      alert('❌ Failed to approve: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      const company = pending.find(c => c.id === id);
      await companyAPI.reject(id, rejectReason);
      
      // Send notification to assessment owner
      if (company && company.userId) {
        addNotification(company.userId, {
          type: 'rejected',
          title: 'Assessment Rejected',
          message: `Your assessment "${company.companyName}" was rejected. Reason: ${rejectReason}`
        });
      }
      
      alert('❌ Company rejected');
      setShowRejectModal(null);
      setRejectReason('');
      loadPending(); // Refresh list
    } catch (err) {
      alert('❌ Failed to reject: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px'
        }}>
          <p>Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        overflowY: 'auto'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
              📋 Approval Queue
            </h2>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '24px', overflowY: 'auto' }}>
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

            {pending.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <p style={{ fontSize: '18px' }}>No pending approvals</p>
                <p style={{ fontSize: '14px' }}>All assessments are up to date!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pending.map((company) => (
                  <div
                    key={company.id}
                    style={{
                      border: '2px solid #ffc107',
                      borderRadius: '8px',
                      padding: '20px',
                      background: '#fffbf0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#333' }}>
                          {company.companyName}
                        </h3>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                          <span style={{
                            padding: '4px 12px',
                            background: '#e7f3ff',
                            color: '#2196F3',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {company.sector}
                          </span>
                          <span style={{ fontSize: '14px', color: '#666' }}>
                            📍 {company.country}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>
                          Submitted: {new Date(company.updatedAt).toLocaleString()}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleApprove(company.id)}
                          disabled={actionLoading === company.id}
                          style={{
                            padding: '10px 20px',
                            background: actionLoading === company.id ? '#ccc' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: actionLoading === company.id ? 'not-allowed' : 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          {actionLoading === company.id ? '...' : '✅ Approve'}
                        </button>
                        <button
                          onClick={() => setShowRejectModal(company.id)}
                          disabled={actionLoading === company.id}
                          style={{
                            padding: '10px 20px',
                            background: actionLoading === company.id ? '#ccc' : '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: actionLoading === company.id ? 'not-allowed' : 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h3 style={{ marginTop: 0 }}>Reject Assessment</h3>
            <p style={{ color: '#666' }}>Please provide a reason for rejection:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '16px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                style={{
                  padding: '10px 20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason.trim()}
                style={{
                  padding: '10px 20px',
                  background: rejectReason.trim() ? '#dc3545' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: rejectReason.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApprovalQueue;
