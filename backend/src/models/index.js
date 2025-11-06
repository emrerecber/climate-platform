const { sequelize } = require('../config/sequelize');
const User = require('./User');
const Company = require('./Company');
const Organization = require('./Organization');
const { Workspace, WorkspaceMember } = require('./Workspace');

// ====================================
// ASSOCIATIONS
// ====================================

// User <-> Company
User.hasMany(Company, {
  foreignKey: 'userId',
  as: 'companies',
  onDelete: 'CASCADE'
});

Company.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Organization <-> User (owner relationship)
Organization.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner'
});

User.hasMany(Organization, {
  foreignKey: 'ownerId',
  as: 'ownedOrganizations'
});

// Organization <-> User (members)
Organization.hasMany(User, {
  foreignKey: 'organizationId',
  as: 'users'
});

User.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization'
});

// Organization <-> Workspace
Organization.hasMany(Workspace, {
  foreignKey: 'organizationId',
  as: 'workspaces',
  onDelete: 'CASCADE'
});

Workspace.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization'
});

// Workspace <-> Company
Workspace.hasMany(Company, {
  foreignKey: 'workspaceId',
  as: 'companies'
});

Company.belongsTo(Workspace, {
  foreignKey: 'workspaceId',
  as: 'workspace'
});

// User <-> Workspace (Many-to-Many through WorkspaceMember)
User.belongsToMany(Workspace, {
  through: WorkspaceMember,
  foreignKey: 'userId',
  otherKey: 'workspaceId',
  as: 'workspaces'
});

Workspace.belongsToMany(User, {
  through: WorkspaceMember,
  foreignKey: 'workspaceId',
  otherKey: 'userId',
  as: 'members'
});

// Direct access to WorkspaceMember
User.hasMany(WorkspaceMember, {
  foreignKey: 'userId',
  as: 'workspaceMemberships'
});

Workspace.hasMany(WorkspaceMember, {
  foreignKey: 'workspaceId',
  as: 'memberships'
});

WorkspaceMember.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

WorkspaceMember.belongsTo(Workspace, {
  foreignKey: 'workspaceId',
  as: 'workspace'
});

// Sync database (create tables if they don't exist)
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Database synced successfully');
    return true;
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  User,
  Company,
  Organization,
  Workspace,
  WorkspaceMember,
  syncDatabase
};
