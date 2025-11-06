const { Organization, User, Workspace, WorkspaceMember } = require('../models');
const { Op } = require('sequelize');

// Create organization (Admin only)
exports.createOrganization = async (req, res) => {
  try {
    const { name, description, industry, website, country } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Organization name is required' });
    }

    const organization = await Organization.create({
      name,
      description,
      industry,
      website,
      country,
      ownerId: req.user.id
    });

    res.status(201).json({
      message: 'Organization created successfully',
      organization
    });
  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all organizations (Admin only - for platform management)
exports.getAllOrganizations = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const { count, rows: organizations } = await Organization.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Workspace,
          as: 'workspaces',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      organizations,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's organization
exports.getMyOrganization = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Organization,
          as: 'organization',
          include: [
            {
              model: Workspace,
              as: 'workspaces',
              include: [
                {
                  model: User,
                  as: 'members',
                  attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                  through: { attributes: ['role', 'joinedAt'] }
                }
              ]
            }
          ]
        }
      ]
    });

    if (!user.organization) {
      return res.status(404).json({ message: 'No organization found for this user' });
    }

    res.json({ organization: user.organization });
  } catch (error) {
    console.error('Get my organization error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get organization by ID
exports.getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await Organization.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Workspace,
          as: 'workspaces',
          include: [
            {
              model: User,
              as: 'members',
              attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
              through: { attributes: ['role', 'joinedAt'] }
            }
          ]
        }
      ]
    });

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check if user has access (owner, member, or admin)
    const user = await User.findByPk(req.user.id);
    const isMember = organization.workspaces.some(ws => 
      ws.members.some(m => m.id === req.user.id)
    );

    if (organization.ownerId !== req.user.id && !isMember && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ organization });
  } catch (error) {
    console.error('Get organization error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update organization
exports.updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, industry, website, country } = req.body;

    const organization = await Organization.findByPk(id);

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check permissions (owner or admin)
    const user = await User.findByPk(req.user.id);
    if (organization.ownerId !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only organization owner or admin can update' });
    }

    await organization.update({
      name: name || organization.name,
      description,
      industry,
      website,
      country
    });

    res.json({
      message: 'Organization updated successfully',
      organization
    });
  } catch (error) {
    console.error('Update organization error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete organization
exports.deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await Organization.findByPk(id);

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check permissions (owner or admin)
    const user = await User.findByPk(req.user.id);
    if (organization.ownerId !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only organization owner or admin can delete' });
    }

    await organization.destroy();

    res.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Delete organization error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get organization statistics
exports.getOrganizationStats = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await Organization.findByPk(id, {
      include: [
        {
          model: Workspace,
          as: 'workspaces',
          include: [
            {
              model: User,
              as: 'members',
              attributes: ['id']
            }
          ]
        }
      ]
    });

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const stats = {
      totalWorkspaces: organization.workspaces.length,
      totalMembers: organization.workspaces.reduce((sum, ws) => sum + ws.members.length, 0),
      workspaceDetails: organization.workspaces.map(ws => ({
        id: ws.id,
        name: ws.name,
        memberCount: ws.members.length
      }))
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get organization stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
