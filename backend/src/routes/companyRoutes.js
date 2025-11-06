const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
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
} = require('../controllers/companyController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Validation rules
const createCompanyValidation = [
  body('companyName').notEmpty().trim().withMessage('Company name is required'),
  body('sector').notEmpty().withMessage('Sector is required'),
  body('country').optional().trim(),
  body('city').optional().trim(),
  body('revenue').optional().isNumeric().withMessage('Revenue must be a number'),
  body('employees').optional().isInt({ min: 0 }).withMessage('Employees must be a positive integer'),
  body('yearFounded').optional().isInt({ min: 1800, max: new Date().getFullYear() })
];

// Routes - all protected by auth middleware
router.use(auth);

// Stats endpoint (must be before /:id to avoid conflict)
router.get('/stats', getStats);

// Approval workflow (must be before /:id to avoid conflict)
router.get('/pending', getPendingApprovals);
router.post('/:id/submit', submitForReview);
router.post('/:id/approve', approveCompany);
router.post('/:id/reject', rejectCompany);

// CRUD operations
router.post('/', createCompanyValidation, validate, createCompany);
router.get('/', getCompanies);
router.get('/:id', getCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

// Calculation results
router.post('/:id/calculations', saveCalculations);

module.exports = router;
