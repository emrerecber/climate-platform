const { Company } = require('../models');
const { Op } = require('sequelize');

// @desc    Create new company
// @route   POST /api/v1/companies
// @access  Private
const createCompany = async (req, res, next) => {
  try {
    const {
      companyName,
      sector,
      country,
      city,
      revenue,
      employees,
      yearFounded,
      formData,
      notes,
      tags
    } = req.body;

    const company = await Company.create({
      userId: req.userId,
      companyName,
      sector,
      country: country || 'Turkey',
      city,
      revenue,
      employees,
      yearFounded,
      formData: formData || {},
      notes,
      tags: tags || [],
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: { company }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies for logged in user
// @route   GET /api/v1/companies
// @access  Private
const getCompanies = async (req, res, next) => {
  try {
    const {
      status,
      sector,
      search,
      sortBy = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    // Build where clause
    const where = { userId: req.userId };
    
    if (status) {
      where.status = status;
    }
    
    if (sector) {
      where.sector = sector;
    }
    
    if (search) {
      where.companyName = {
        [Op.iLike]: `%${search}%`
      };
    }

    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Query companies
    const { count, rows: companies } = await Company.findAndCountAll({
      where,
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        companies,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / parseInt(limit)),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company
// @route   GET /api/v1/companies/:id
// @access  Private
const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: { company }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company
// @route   PUT /api/v1/companies/:id
// @access  Private
const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    const {
      companyName,
      sector,
      country,
      city,
      revenue,
      employees,
      yearFounded,
      formData,
      status,
      completionPercentage,
      notes,
      tags
    } = req.body;

    await company.update({
      ...(companyName && { companyName }),
      ...(sector && { sector }),
      ...(country && { country }),
      ...(city !== undefined && { city }),
      ...(revenue !== undefined && { revenue }),
      ...(employees !== undefined && { employees }),
      ...(yearFounded !== undefined && { yearFounded }),
      ...(formData && { formData }),
      ...(status && { status }),
      ...(completionPercentage !== undefined && { completionPercentage }),
      ...(notes !== undefined && { notes }),
      ...(tags && { tags })
    });

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: { company }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save calculation results
// @route   POST /api/v1/companies/:id/calculations
// @access  Private
const saveCalculations = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    const {
      pactaResults,
      tcfdResults,
      financialResults,
      scope3Results,
      forwardMetrics,
      physicalRisk,
      benchmarking
    } = req.body;

    await company.update({
      ...(pactaResults && { pactaResults }),
      ...(tcfdResults && { tcfdResults }),
      ...(financialResults && { financialResults }),
      ...(scope3Results && { scope3Results }),
      ...(forwardMetrics && { forwardMetrics }),
      ...(physicalRisk && { physicalRisk }),
      ...(benchmarking && { benchmarking }),
      lastCalculatedAt: new Date(),
      status: 'completed',
      completionPercentage: 100
    });

    res.json({
      success: true,
      message: 'Calculations saved successfully',
      data: { company }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company
// @route   DELETE /api/v1/companies/:id
// @access  Private
const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    await company.destroy();

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company statistics
// @route   GET /api/v1/companies/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Total companies
    const total = await Company.count({ where: { userId } });

    // By status
    const byStatus = await Company.findAll({
      where: { userId },
      attributes: [
        'status',
        [Company.sequelize.fn('COUNT', Company.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // By sector
    const bySector = await Company.findAll({
      where: { userId },
      attributes: [
        'sector',
        [Company.sequelize.fn('COUNT', Company.sequelize.col('id')), 'count']
      ],
      group: ['sector'],
      limit: 10,
      raw: true
    });

    // Recent companies
    const recent = await Company.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'companyName', 'sector', 'status', 'createdAt']
    });

    res.json({
      success: true,
      data: {
        total,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item.status] = parseInt(item.count);
          return acc;
        }, {}),
        bySector: bySector.map(item => ({
          sector: item.sector,
          count: parseInt(item.count)
        })),
        recent
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending companies for approval (Manager/Admin only)
// @route   GET /api/v1/companies/pending
// @access  Private (Manager/Admin)
const getPendingApprovals = async (req, res, next) => {
  try {
    // Get companies with status 'pending_review'
    // For now, show all pending (later: filter by workspace/organization)
    const companies = await Company.findAll({
      where: { 
        status: 'pending_review'
      },
      order: [['updatedAt', 'DESC']],
      attributes: ['id', 'companyName', 'sector', 'country', 'userId', 'createdAt', 'updatedAt', 'status']
    });

    res.json({
      success: true,
      data: { companies, count: companies.length }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve company
// @route   POST /api/v1/companies/:id/approve
// @access  Private (Manager/Admin)
const approveCompany = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if company is pending
    if (company.status !== 'pending_review') {
      return res.status(400).json({
        success: false,
        message: 'Company is not pending review'
      });
    }

    // Update company status
    await company.update({
      status: 'approved',
      approvalStatus: 'approved',
      approvedBy: req.userId,
      approvedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Company approved successfully',
      data: { company }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject company
// @route   POST /api/v1/companies/:id/reject
// @access  Private (Manager/Admin)
const rejectCompany = async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if company is pending
    if (company.status !== 'pending_review') {
      return res.status(400).json({
        success: false,
        message: 'Company is not pending review'
      });
    }

    // Update company status
    await company.update({
      status: 'rejected',
      approvalStatus: 'rejected',
      approvedBy: req.userId,
      approvedAt: new Date(),
      rejectedReason: reason || 'No reason provided'
    });

    res.json({
      success: true,
      message: 'Company rejected',
      data: { company }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit company for review
// @route   POST /api/v1/companies/:id/submit
// @access  Private
const submitForReview = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Update status to pending_review
    await company.update({
      status: 'pending_review',
      approvalStatus: 'pending',
      completionPercentage: 100
    });

    res.json({
      success: true,
      message: 'Company submitted for review',
      data: { company }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  saveCalculations,
  deleteCompany,
  getStats,
  getPendingApprovals,
  approveCompany,
  rejectCompany,
  submitForReview
};
