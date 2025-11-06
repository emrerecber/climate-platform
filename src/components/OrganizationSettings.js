import React, { useState, useEffect } from 'react';
import { organizationAPI, workspaceAPI } from '../services/api';
import WorkspaceManager from './WorkspaceManager';

const OrganizationSettings = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    country: ''
  });

  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [orgRes, workspacesRes] = await Promise.all([
        organizationAPI.getMyOrganization(),
        workspaceAPI.getMyWorkspaces()
      ]);
      
      // Handle response format: { success: true, data: { organization: ... } }
      const org = orgRes.data?.organization || orgRes.organization;
      const workspacesList = workspacesRes.data?.workspaces || workspacesRes.workspaces || [];
      
      setOrganization(org);
      setWorkspaces(workspacesList);
      
      if (org) {
        setFormData({
          name: org.name || '',
          description: org.description || '',
          industry: org.industry || '',
          website: org.website || '',
          country: org.country || ''
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (organization) {
        await organizationAPI.update(organization.id, formData);
        alert('✅ Organization updated successfully!');
        setEditMode(false);
        loadData();
      } else {
        // Create new organization
        await organizationAPI.create(formData);
        alert('✅ Organization created successfully!');
        setEditMode(false);
        loadData();
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    try {
      if (!newWorkspace.name) {
        alert('⚠️ Workspace name is required');
        return;
      }

      if (!organization || !organization.id) {
        alert('❌ Organization not found. Please refresh and try again.');
        return;
      }

      setLoading(true);
      await workspaceAPI.create({
        ...newWorkspace,
        organizationId: organization.id
      });
      
      alert('✅ Workspace created successfully!');
      setShowCreateWorkspace(false);
      setNewWorkspace({ name: '', description: '' });
      loadData();
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !organization) {
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
          <p>Loading organization settings...</p>
        </div>
      </div>
    );
  }

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
            🏢 Organization Settings
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

          {/* Organization Details */}
          <div style={{
            background: '#f8f9fa',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Organization Details</h3>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      if (organization) {
                        setFormData({
                          name: organization.name || '',
                          description: organization.description || '',
                          industry: organization.industry || '',
                          website: organization.website || '',
                          country: organization.country || ''
                        });
                      }
                    }}
                    style={{
                      padding: '8px 16px',
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
                    onClick={handleSave}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      background: loading ? '#ccc' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    💾 Save
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Organization Name *
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '10px', background: 'white', borderRadius: '6px', fontSize: '14px' }}>
                    {formData.name || '-'}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Description
                </label>
                {editMode ? (
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      minHeight: '80px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '10px', background: 'white', borderRadius: '6px', fontSize: '14px' }}>
                    {formData.description || '-'}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                    Industry
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  ) : (
                    <div style={{ padding: '10px', background: 'white', borderRadius: '6px', fontSize: '14px' }}>
                      {formData.industry || '-'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                    Country
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  ) : (
                    <div style={{ padding: '10px', background: 'white', borderRadius: '6px', fontSize: '14px' }}>
                      {formData.country || '-'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Website
                </label>
                {editMode ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '10px', background: 'white', borderRadius: '6px', fontSize: '14px' }}>
                    {formData.website || '-'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Workspaces */}
          {organization && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Workspaces ({workspaces.length})</h3>
                <button
                  onClick={() => setShowCreateWorkspace(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  + New Workspace
                </button>
              </div>

              {showCreateWorkspace && (
                <div style={{
                  background: '#e7f3ff',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <h4 style={{ margin: '0 0 12px 0' }}>Create New Workspace</h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="Workspace Name *"
                      value={newWorkspace.name}
                      onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                      style={{
                        padding: '10px',
                        border: '2px solid #0066cc',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                    <textarea
                      placeholder="Description"
                      value={newWorkspace.description}
                      onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                      style={{
                        padding: '10px',
                        border: '2px solid #0066cc',
                        borderRadius: '6px',
                        fontSize: '14px',
                        minHeight: '60px'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setShowCreateWorkspace(false);
                          setNewWorkspace({ name: '', description: '' });
                        }}
                        style={{
                          padding: '8px 16px',
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
                        onClick={handleCreateWorkspace}
                        disabled={loading}
                        style={{
                          padding: '8px 16px',
                          background: loading ? '#ccc' : '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gap: '12px' }}>
                {workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    style={{
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '16px',
                      background: 'white'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{workspace.name}</h4>
                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                          {workspace.description || 'No description'}
                        </p>
                        <div style={{ fontSize: '13px', color: '#999' }}>
                          👥 {workspace.members?.length || 0} members
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedWorkspace(workspace.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}

                {workspaces.length === 0 && !showCreateWorkspace && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📁</div>
                    <p>No workspaces yet</p>
                    <p style={{ fontSize: '14px' }}>Create your first workspace to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workspace Manager Modal */}
      {selectedWorkspace && (
        <WorkspaceManager 
          workspaceId={selectedWorkspace} 
          onClose={() => {
            setSelectedWorkspace(null);
            loadData(); // Refresh data when closing
          }} 
        />
      )}
    </div>
  );
};

export default OrganizationSettings;
