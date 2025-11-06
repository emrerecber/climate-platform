import React, { useState, useEffect } from 'react';
import { workspaceAPI } from '../services/api';

const WorkspaceManager = ({ workspaceId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [newMember, setNewMember] = useState({
    userId: '',
    role: 'member'
  });

  useEffect(() => {
    loadWorkspace();
  }, [workspaceId]);

  const loadWorkspace = async () => {
    try {
      setLoading(true);
      const response = await workspaceAPI.getById(workspaceId);
      
      // Handle response format: { success: true, data: { workspace: ... } }
      const ws = response.data?.workspace || response.workspace;
      
      setWorkspace(ws);
      setFormData({
        name: ws?.name || '',
        description: ws?.description || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await workspaceAPI.update(workspaceId, formData);
      alert('✅ Workspace updated successfully!');
      setEditMode(false);
      loadWorkspace();
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    try {
      if (!newMember.userId) {
        alert('⚠️ User ID is required');
        return;
      }

      setLoading(true);
      await workspaceAPI.addMember(workspaceId, newMember);
      alert('✅ Member added successfully!');
      setShowAddMember(false);
      setNewMember({ userId: '', role: 'member' });
      loadWorkspace();
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      setLoading(true);
      await workspaceAPI.removeMember(workspaceId, userId);
      alert('✅ Member removed successfully!');
      loadWorkspace();
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, currentRole) => {
    const roles = ['viewer', 'member', 'admin'];
    const currentIndex = roles.indexOf(currentRole);
    const newRole = roles[(currentIndex + 1) % roles.length];

    try {
      setLoading(true);
      await workspaceAPI.updateMemberRole(workspaceId, userId, newRole);
      alert(`✅ Role changed to ${newRole}!`);
      loadWorkspace();
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return '#dc3545';
      case 'member': return '#667eea';
      case 'viewer': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (loading && !workspace) {
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
        zIndex: 1001
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px'
        }}>
          <p>Loading workspace...</p>
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
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1001,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
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
            📁 Workspace Manager
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

          {/* Workspace Details */}
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Workspace Details</h3>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    padding: '6px 12px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  ✏️ Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        name: workspace.name || '',
                        description: workspace.description || ''
                      });
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    style={{
                      padding: '6px 12px',
                      background: loading ? '#ccc' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    💾 Save
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                  Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '8px', background: 'white', borderRadius: '6px', fontSize: '14px' }}>
                    {formData.name}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                  Description
                </label>
                {editMode ? (
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      minHeight: '60px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '8px', background: 'white', borderRadius: '6px', fontSize: '14px' }}>
                    {formData.description || 'No description'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Members */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Members ({workspace?.members?.length || 0})</h3>
              <button
                onClick={() => setShowAddMember(true)}
                style={{
                  padding: '8px 16px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                + Add Member
              </button>
            </div>

            {showAddMember && (
              <div style={{
                background: '#e7f3ff',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Add New Member</h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="User ID or Email"
                    value={newMember.userId}
                    onChange={(e) => setNewMember({ ...newMember, userId: e.target.value })}
                    style={{
                      padding: '8px',
                      border: '2px solid #0066cc',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    style={{
                      padding: '8px',
                      border: '2px solid #0066cc',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setShowAddMember(false);
                        setNewMember({ userId: '', role: 'member' });
                      }}
                      style={{
                        padding: '8px 16px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddMember}
                      disabled={loading}
                      style={{
                        padding: '8px 16px',
                        background: loading ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gap: '10px' }}>
              {workspace?.members?.map((member, index) => {
                // Handle both real backend and mock API member structures
                const memberRole = member.WorkspaceMember?.role || member.role || 'member';
                const memberId = member.id || member.userId;
                const memberName = member.firstName 
                  ? `${member.firstName} ${member.lastName}` 
                  : `User ${memberId.substring(0, 8)}`;
                const memberEmail = member.email || 'No email';
                
                return (
                  <div
                    key={memberId || index}
                    style={{
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '14px',
                      background: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
                        {memberName}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        {memberEmail}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span
                        onClick={() => handleChangeRole(memberId, memberRole)}
                        style={{
                          padding: '4px 12px',
                          background: getRoleBadgeColor(memberRole),
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title="Click to change role"
                      >
                        {memberRole.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleRemoveMember(memberId)}
                        style={{
                          padding: '4px 8px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}

              {(!workspace?.members || workspace.members.length === 0) && !showAddMember && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
                  <p>No members yet</p>
                  <p style={{ fontSize: '14px' }}>Add members to collaborate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceManager;
