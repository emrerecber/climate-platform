/**
 * Permission Middleware
 * Role-based access control for API endpoints
 */

const { User, Company } = require('../models');

/**
 * Permission Matrix
 */
const PERMISSIONS = {
  viewer: {
    companies: {
      read: true,
      create: false,
      update: false,
      delete: false
    },
    reports: {
      view: true,
      export: true
    }
  },
  analyst: {
    companies: {
      read: true,
      create: true,
      update: 'own', // Can only update own companies
      delete: 'own'  // Can only delete own companies
    },
    reports: {
      view: true,
      export: true
    }
  },
  manager: {
    companies: {
      read: 'workspace', // Can read workspace companies
      create: true,
      update: 'workspace', // Can update workspace companies
      delete: 'workspace'
    },
    reports: {
      view: true,
      export: true
    },
    workspace: {
      inviteMembers: true,
      removeMembers: true,
      changeRoles: true
    }
  },
  admin: {
    companies: {
      read: 'all',
      create: true,
      update: 'all',
      delete: 'all'
    },
    reports: {
      view: true,
      export: true
    },
    workspace: {
      create: true,
      delete: true,
      inviteMembers: true,
      removeMembers: true,
      changeRoles: true
    },
    organization: {
      manageSettings: true,
      manageBilling: true,
      manageUsers: true
    }
  },
  auditor: {
    companies: {
      read: 'all',
      create: false,
      update: false,
      delete: false
    },
    reports: {
      view: true,
      export: true
    }
  }
};

/**
 * Check if user has required role
 */
const requireRole = (allowedRoles) => {
  // Handle both array and spread arguments
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
    }

    next();
  };
};

/**
 * Check if user can perform action on resource
 */
const canPerform = (resource, action) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const permission = PERMISSIONS[user.role]?.[resource]?.[action];

      // No permission defined
      if (permission === undefined || permission === false) {
        return res.status(403).json({
          success: false,
          message: `You don't have permission to ${action} ${resource}`
        });
      }

      // Full permission
      if (permission === true || permission === 'all') {
        return next();
      }

      // Own resource check (for update/delete)
      if (permission === 'own' && req.params.id) {
        const company = await Company.findByPk(req.params.id);
        
        if (!company) {
          return res.status(404).json({
            success: false,
            message: 'Resource not found'
          });
        }

        // Check if user created this company
        if (company.userId !== user.id) {
          return res.status(403).json({
            success: false,
            message: 'You can only modify your own resources'
          });
        }

        req.company = company; // Attach to request
        return next();
      }

      // Workspace resource check (for manager role)
      if (permission === 'workspace' && req.params.id) {
        const company = await Company.findByPk(req.params.id);
        
        if (!company) {
          return res.status(404).json({
            success: false,
            message: 'Resource not found'
          });
        }

        // TODO: Check workspace membership when workspace system is implemented
        // For now, allow managers to access all companies in their organization
        
        req.company = company;
        return next();
      }

      // Default: deny
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });

    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

/**
 * Check if user can view company
 */
const canViewCompany = async (req, res, next) => {
  try {
    const user = req.user;
    const companyId = req.params.id;

    // Admin and Auditor can view all
    if (user.role === 'admin' || user.role === 'auditor') {
      return next();
    }

    const company = await Company.findByPk(companyId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Analyst and Viewer can only see companies in their workspace
    // TODO: Implement workspace check
    // For now, allow users to see companies they created or in same organization
    
    if (company.userId === user.id) {
      req.company = company;
      return next();
    }

    // Manager can see workspace companies
    if (user.role === 'manager') {
      // TODO: Check workspace membership
      req.company = company;
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'You don\'t have permission to view this company'
    });

  } catch (error) {
    console.error('View permission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking view permissions'
    });
  }
};

/**
 * Get user permissions summary
 */
const getUserPermissions = (req, res) => {
  const userRole = req.user.role;
  const permissions = PERMISSIONS[userRole] || {};

  return res.json({
    success: true,
    data: {
      role: userRole,
      permissions: permissions
    }
  });
};

/**
 * Middleware to add role badge to response
 */
const addRoleBadge = (req, res, next) => {
  res.locals.userRole = req.user?.role;
  next();
};

module.exports = {
  requireRole,
  canPerform,
  canViewCompany,
  getUserPermissions,
  addRoleBadge,
  PERMISSIONS
};
