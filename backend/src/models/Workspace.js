const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Workspace = sequelize.define('Workspace', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Workspace name (e.g., Corporate Credit, ESG Team)'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Workspace description and purpose'
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'organizations',
      key: 'id'
    },
    onDelete: 'CASCADE',
    comment: 'Parent organization'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'User who created this workspace'
  },
  
  // Workspace type
  workspaceType: {
    type: DataTypes.ENUM('default', 'client', 'department', 'project'),
    defaultValue: 'default',
    comment: 'Type of workspace for customization'
  },
  
  // Settings
  settings: {
    type: DataTypes.JSON,
    defaultValue: {
      requireApproval: true,
      approvalLevels: 1,
      allowAnalystDelete: false,
      defaultVisibility: 'workspace',
      enableComments: true,
      enableVersioning: false
    },
    comment: 'Workspace-specific settings'
  },
  
  // Features
  enabledFeatures: {
    type: DataTypes.JSON,
    defaultValue: {
      approval_workflow: true,
      credit_scoring: false,
      physical_risk: true,
      scenario_analysis: true,
      peer_analysis: false,
      impact_tracking: false
    },
    comment: 'Features enabled for this workspace'
  },
  
  // Client info (for consultant workspaces)
  clientInfo: {
    type: DataTypes.JSON,
    defaultValue: null,
    comment: 'Client information for consultant workspaces'
  },
  
  // Statistics
  memberCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of members in workspace'
  },
  companyCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of companies in workspace'
  },
  
  // Status
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  archivedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  archivedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'workspaces',
  timestamps: true,
  indexes: [
    { fields: ['organizationId'] },
    { fields: ['createdBy'] },
    { fields: ['isActive'] }
  ]
});

// Workspace Members junction table
const WorkspaceMember = sequelize.define('WorkspaceMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  workspaceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'workspaces',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  role: {
    type: DataTypes.ENUM('viewer', 'analyst', 'manager'),
    defaultValue: 'analyst',
    comment: 'User role within this workspace'
  },
  addedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Who invited this member'
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastAccessedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last time user accessed this workspace'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'workspace_members',
  timestamps: true,
  indexes: [
    { fields: ['workspaceId'] },
    { fields: ['userId'] },
    { fields: ['role'] },
    { unique: true, fields: ['workspaceId', 'userId'] }
  ]
});

// Instance methods
Workspace.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  return values;
};

WorkspaceMember.prototype.hasPermission = function(action) {
  const permissions = {
    viewer: ['read'],
    analyst: ['read', 'create', 'update_own', 'delete_own'],
    manager: ['read', 'create', 'update', 'delete', 'invite', 'remove']
  };
  
  return permissions[this.role]?.includes(action) || false;
};

module.exports = { Workspace, WorkspaceMember };
