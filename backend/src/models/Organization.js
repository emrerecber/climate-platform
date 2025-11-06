const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Organization name (e.g., ABC Bank, XYZ Asset Management)'
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: 'Email domain for automatic user assignment (e.g., abc-bank.com)'
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Industry sector'
  },
  customerProfile: {
    type: DataTypes.ENUM('bank', 'asset_manager', 'corporate', 'consultant', 'other'),
    defaultValue: 'other',
    comment: 'Organization type for feature customization'
  },
  subscriptionPlan: {
    type: DataTypes.ENUM('free', 'professional', 'business', 'enterprise', 'consultant'),
    defaultValue: 'professional',
    comment: 'Subscription tier'
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('trial', 'active', 'past_due', 'canceled', 'suspended'),
    defaultValue: 'trial',
    comment: 'Current subscription status'
  },
  trialEndsAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Trial period end date'
  },
  subscriptionStartedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  subscriptionEndsAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Limits based on subscription
  maxUsers: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    comment: 'Maximum number of users allowed'
  },
  maxWorkspaces: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Maximum number of workspaces allowed'
  },
  maxAssessmentsPerYear: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    comment: 'Maximum assessments per year'
  },
  
  // Usage tracking
  currentUsers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Current number of active users'
  },
  currentWorkspaces: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Current number of workspaces'
  },
  assessmentsThisYear: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Assessments created this year'
  },
  
  // Features enabled
  features: {
    type: DataTypes.JSON,
    defaultValue: {
      portfolioAggregation: false,
      benchmarking: false,
      whiteLabelReports: false,
      apiAccess: false,
      advancedAnalytics: false,
      approvalWorkflow: true,
      multipleWorkspaces: false
    },
    comment: 'Enabled features based on subscription'
  },
  
  // Profile-specific settings
  settings: {
    type: DataTypes.JSON,
    defaultValue: {
      requireApproval: true,
      approvalLevels: 1,
      defaultVisibility: 'workspace',
      allowSelfApprove: false,
      enableNotifications: true
    },
    comment: 'Organization-wide settings'
  },
  
  // Branding (for white-label)
  branding: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Logo, colors, custom domain for white-label'
  },
  
  // Contact & billing
  billingEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  billingAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  taxId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'VAT/Tax ID'
  },
  
  // Admin contact
  adminUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Primary admin user'
  },
  
  // Status
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  suspendedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  suspendedReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Metadata
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Internal notes about organization'
  }
}, {
  tableName: 'organizations',
  timestamps: true,
  indexes: [
    { fields: ['domain'] },
    { fields: ['subscriptionPlan'] },
    { fields: ['subscriptionStatus'] },
    { fields: ['isActive'] }
  ]
});

// Instance methods
Organization.prototype.canAddUser = function() {
  return this.currentUsers < this.maxUsers;
};

Organization.prototype.canAddWorkspace = function() {
  return this.currentWorkspaces < this.maxWorkspaces;
};

Organization.prototype.canCreateAssessment = function() {
  return this.assessmentsThisYear < this.maxAssessmentsPerYear;
};

Organization.prototype.hasFeature = function(featureName) {
  return this.features[featureName] === true;
};

Organization.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.notes; // Don't expose internal notes
  return values;
};

module.exports = Organization;
