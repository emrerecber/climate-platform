const { Workspace, Organization, User, WorkspaceMember, Company } = require('../models');
const { Op } = require('sequelize');

// Create workspace
exports.createWorkspace = async (req, res) => {
  try {
    const { name, description, organizationId } = req.body;
    
    if (!name || !organizationId) {
      return res.status(400).json({ message: 'Workspace name and organization ID are required' });
    }

    // Check if organization exists and user has access
    const organization = await Organization.findByPk(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const user = await User.findByPk(req.user.id);
    if (organization.ownerId !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only organization owner or admin can create workspaces' });
    }

    const workspace = await Workspace.create({
      name,
      description,
      organizationId
    });

    // Automatically add creator as admin member
    await WorkspaceMember.create({
      userId: req.user.id,
      workspaceId: workspace.id,
      role: 'admin'
    });

    res.status(201).json({
      message: 'Workspace created successfully',
      workspace
    });
  } catch (error) {
    console.error('Create workspace error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all workspaces for user
exports.getMyWorkspaces = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Workspace,
          as: 'workspaces',
          include: [
            {
              model: Organization,
              as: 'organization',
              attributes: ['id', 'name']
            },
            {
              model: User,
              as: 'members',
              attributes: ['id', 'firstName', 'lastName', 'email'],
              through: { attributes: ['role'] }
            }
          ]
        }
      ]
    });

    res.json({ workspaces: user.workspaces || [] });
  } catch (error) {
    console.error('Get my workspaces error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get workspace by ID
exports.getWorkspaceById = async (req, res) => {
  try {
    const { id } = req.params;

    const workspace = await Workspace.findByPk(id, {
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'ownerId']
        },
        {
          model: User,
          as: 'members',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          through: { attributes: ['role', 'joinedAt'] }
        }
      ]
    });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user has access
    const isMember = workspace.members.some(m => m.id === req.user.id);
    const user = await User.findByPk(req.user.id);
    
    if (!isMember && user.role !== 'admin' && workspace.organization.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ workspace });
  } catch (error) {
    console.error('Get workspace error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update workspace
exports.updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const workspace = await Workspace.findByPk(id, {
      include: [
        {
          model: Organization,
          as: 'organization'
        }
      ]
    });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user is workspace admin or org owner
    const membership = await WorkspaceMember.findOne({
      where: { userId: req.user.id, workspaceId: id }
    });

    const user = await User.findByPk(req.user.id);
    const isWorkspaceAdmin = membership && membership.role === 'admin';
    const isOrgOwner = workspace.organization.ownerId === req.user.id;

    if (!isWorkspaceAdmin && !isOrgOwner && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only workspace admin or organization owner can update' });
    }

    await workspace.update({ name, description });

    res.json({
      message: 'Workspace updated successfully',
      workspace
    });
  } catch (error) {
    console.error('Update workspace error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete workspace
exports.deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    const workspace = await Workspace.findByPk(id, {
      include: [
        {
          model: Organization,
          as: 'organization'
        }
      ]
    });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check permissions
    const user = await User.findByPk(req.user.id);
    const isOrgOwner = workspace.organization.ownerId === req.user.id;

    if (!isOrgOwner && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only organization owner or admin can delete workspace' });
    }

    await workspace.destroy();

    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Delete workspace error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add member to workspace
exports.addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role = 'member' } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if workspace exists
    const workspace = await Workspace.findByPk(id, {
      include: [{ model: Organization, as: 'organization' }]
    });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if user exists
    const userToAdd = await User.findByPk(userId);
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    const membership = await WorkspaceMember.findOne({
      where: { userId: req.user.id, workspaceId: id }
    });

    const currentUser = await User.findByPk(req.user.id);
    const isWorkspaceAdmin = membership && membership.role === 'admin';
    const isOrgOwner = workspace.organization.ownerId === req.user.id;

    if (!isWorkspaceAdmin && !isOrgOwner && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only workspace admin or organization owner can add members' });
    }

    // Check if user is already a member
    const existingMembership = await WorkspaceMember.findOne({
      where: { userId, workspaceId: id }
    });

    if (existingMembership) {
      return res.status(400).json({ message: 'User is already a member of this workspace' });
    }

    // Add member
    await WorkspaceMember.create({
      userId,
      workspaceId: id,
      role
    });

    res.json({ message: 'Member added successfully' });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove member from workspace
exports.removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const workspace = await Workspace.findByPk(id, {
      include: [{ model: Organization, as: 'organization' }]
    });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check permissions
    const membership = await WorkspaceMember.findOne({
      where: { userId: req.user.id, workspaceId: id }
    });

    const currentUser = await User.findByPk(req.user.id);
    const isWorkspaceAdmin = membership && membership.role === 'admin';
    const isOrgOwner = workspace.organization.ownerId === req.user.id;

    if (!isWorkspaceAdmin && !isOrgOwner && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only workspace admin or organization owner can remove members' });
    }

    // Remove member
    const membershipToRemove = await WorkspaceMember.findOne({
      where: { userId, workspaceId: id }
    });

    if (!membershipToRemove) {
      return res.status(404).json({ message: 'Member not found in this workspace' });
    }

    await membershipToRemove.destroy();

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update member role
exports.updateMemberRole = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'member', 'viewer'].includes(role)) {
      return res.status(400).json({ message: 'Valid role is required (admin, member, or viewer)' });
    }

    const workspace = await Workspace.findByPk(id, {
      include: [{ model: Organization, as: 'organization' }]
    });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check permissions
    const membership = await WorkspaceMember.findOne({
      where: { userId: req.user.id, workspaceId: id }
    });

    const currentUser = await User.findByPk(req.user.id);
    const isWorkspaceAdmin = membership && membership.role === 'admin';
    const isOrgOwner = workspace.organization.ownerId === req.user.id;

    if (!isWorkspaceAdmin && !isOrgOwner && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Only workspace admin or organization owner can update member roles' });
    }

    // Update role
    const membershipToUpdate = await WorkspaceMember.findOne({
      where: { userId, workspaceId: id }
    });

    if (!membershipToUpdate) {
      return res.status(404).json({ message: 'Member not found in this workspace' });
    }

    await membershipToUpdate.update({ role });

    res.json({ message: 'Member role updated successfully' });
  } catch (error) {
    console.error('Update member role error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get workspace statistics
exports.getWorkspaceStats = async (req, res) => {
  try {
    const { id } = req.params;

    const workspace = await Workspace.findByPk(id, {
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'role'],
          through: { attributes: ['role'] }
        },
        {
          model: Company,
          as: 'companies',
          attributes: ['id', 'status']
        }
      ]
    });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const stats = {
      totalMembers: workspace.members.length,
      membersByRole: workspace.members.reduce((acc, member) => {
        const role = member.WorkspaceMember.role;
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {}),
      totalCompanies: workspace.companies.length,
      companiesByStatus: workspace.companies.reduce((acc, company) => {
        acc[company.status] = (acc[company.status] || 0) + 1;
        return acc;
      }, {})
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get workspace stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
