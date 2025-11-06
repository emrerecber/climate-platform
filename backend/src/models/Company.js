const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Ownership & Organization
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    comment: 'User who created this company'
  },
  workspaceId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'workspaces',
      key: 'id'
    },
    onDelete: 'SET NULL',
    comment: 'Workspace this company belongs to'
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'organizations',
      key: 'id'
    },
    onDelete: 'SET NULL',
    comment: 'Organization this company belongs to'
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    comment: 'User assigned to this assessment'
  },
  
  // Basic Information
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sector: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Turkey'
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  revenue: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  employees: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  yearFounded: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  // Form Data - Stored as JSONB for flexibility
  formData: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  
  // Calculation Results
  pactaResults: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  tcfdResults: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  financialResults: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  scope3Results: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  forwardMetrics: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  physicalRisk: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  benchmarking: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  
  // Permissions & Workflow
  visibility: {
    type: DataTypes.ENUM('private', 'workspace', 'organization'),
    defaultValue: 'workspace',
    comment: 'Who can view this company'
  },
  status: {
    type: DataTypes.ENUM('draft', 'in_progress', 'pending_review', 'approved', 'rejected', 'completed', 'archived'),
    defaultValue: 'draft',
    comment: 'Assessment status'
  },
  approvalStatus: {
    type: DataTypes.ENUM('not_required', 'pending', 'approved', 'rejected'),
    defaultValue: 'not_required',
    comment: 'Approval workflow status'
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'User who approved'
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectedReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completionPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  lastCalculatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'companies',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['sector']
    },
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Company;
