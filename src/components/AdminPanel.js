import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useToast } from './Toast';

const AdminPanel = ({ onClose, currentUser }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('users'); // users, organizations, stats
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        await loadUsers();
      } else if (activeTab === 'organizations') {
        await loadOrganizations();
      } else if (activeTab === 'stats') {
        await loadStats();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.showError('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setUsers(data || []);
  };

  const loadOrganizations = async () => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setOrganizations(data || []);
  };

  const loadStats = async () => {
    // Get counts from all tables
    const [usersRes, companiesRes, assessmentsRes] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('assessments').select('*', { count: 'exact', head: true })
    ]);

    setStats({
      totalUsers: usersRes.count || 0,
      totalCompanies: companiesRes.count || 0,
      totalAssessments: assessmentsRes.count || 0
    });
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.showSuccess(`User role updated to ${newRole}`);
      loadUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.showError('Failed to update role: ' + error.message);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast.showSuccess(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
      loadUsers();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.showError('Failed to update status: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their data.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.showSuccess('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.showError('Failed to delete user: ' + error.message);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return '#dc3545';
      case 'manager': return '#ffc107';
      case 'analyst': return '#667eea';
      case 'auditor': return '#6c757d';
      default: return '#28a745';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '1400px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#1f2937' }}>
              ⚙️ Admin Panel
            </h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
              Manage users, organizations, and system settings
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

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {['users', 'organizations', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                background: activeTab === tab ? '#667eea' : '#f3f4f6',
                color: activeTab === tab ? 'white' : '#4b5563',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'users' && '👥 Users'}
              {tab === 'organizations' && '🏢 Organizations'}
              {tab === 'stats' && '📊 Statistics'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              <p style={{ color: '#6b7280' }}>Loading...</p>
            </div>
          ) : (
            <>
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#1f2937' }}>
                      User Management ({users.length} users)
                    </h3>
                  </div>

                  <div style={{
                    display: 'grid',
                    gap: '16px'
                  }}>
                    {users.map(user => (
                      <div
                        key={user.id}
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '20px',
                          background: user.is_active ? 'white' : '#f9fafb'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                              <h4 style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>
                                {user.first_name} {user.last_name}
                              </h4>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                backgroundColor: getRoleBadgeColor(user.role) + '20',
                                color: getRoleBadgeColor(user.role)
                              }}>
                                {user.role.toUpperCase()}
                              </span>
                              {!user.is_active && (
                                <span style={{
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: '#fee',
                                  color: '#c00'
                                }}>
                                  INACTIVE
                                </span>
                              )}
                            </div>
                            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                              📧 {user.email}
                            </p>
                            {user.customer_profile && (
                              <p style={{ margin: '4px 0', fontSize: '13px', color: '#9ca3af' }}>
                                Profile: {user.customer_profile.replace('_', ' ')}
                              </p>
                            )}
                            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                              Joined: {new Date(user.created_at).toLocaleDateString('tr-TR')}
                            </p>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            {/* Change Role */}
                            {editingUser === user.id ? (
                              <select
                                value={user.role}
                                onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                style={{
                                  padding: '8px 12px',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  fontSize: '14px',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="viewer">Viewer</option>
                                <option value="analyst">Analyst</option>
                                <option value="auditor">Auditor</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : (
                              <button
                                onClick={() => setEditingUser(user.id)}
                                style={{
                                  padding: '8px 16px',
                                  background: '#667eea',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                              >
                                Change Role
                              </button>
                            )}

                            {/* Toggle Active/Inactive */}
                            <button
                              onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                              style={{
                                padding: '8px 16px',
                                background: user.is_active ? '#fbbf24' : '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              {user.is_active ? 'Deactivate' : 'Activate'}
                            </button>

                            {/* Delete (only if not current user) */}
                            {user.id !== currentUser?.id && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                style={{
                                  padding: '8px 16px',
                                  background: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizations Tab */}
              {activeTab === 'organizations' && (
                <div>
                  <h3 style={{ marginBottom: '24px', fontSize: '18px', color: '#1f2937' }}>
                    Organizations ({organizations.length})
                  </h3>
                  {organizations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
                      <p>No organizations yet</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {organizations.map(org => (
                        <div
                          key={org.id}
                          style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '20px'
                          }}
                        >
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1f2937' }}>
                            {org.name}
                          </h4>
                          {org.industry && (
                            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                              Industry: {org.industry}
                            </p>
                          )}
                          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                            Created: {new Date(org.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && stats && (
                <div>
                  <h3 style={{ marginBottom: '24px', fontSize: '18px', color: '#1f2937' }}>
                    System Statistics
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '30px',
                      borderRadius: '12px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px' }}>
                        {stats.totalUsers}
                      </div>
                      <div style={{ fontSize: '16px', opacity: 0.9 }}>Total Users</div>
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      padding: '30px',
                      borderRadius: '12px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px' }}>
                        {stats.totalCompanies}
                      </div>
                      <div style={{ fontSize: '16px', opacity: 0.9 }}>Total Companies</div>
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      padding: '30px',
                      borderRadius: '12px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px' }}>
                        {stats.totalAssessments}
                      </div>
                      <div style={{ fontSize: '16px', opacity: 0.9 }}>Total Assessments</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
