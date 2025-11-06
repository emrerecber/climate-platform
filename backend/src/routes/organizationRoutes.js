const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const organizationController = require('../controllers/organizationController');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Organization routes working' });
});

// Get current user's organization (must be before /:id)
router.get('/my-organization', auth, organizationController.getMyOrganization);

// Get all organizations
router.get('/', auth, organizationController.getAllOrganizations);

// Create organization
router.post('/', auth, organizationController.createOrganization);

// Get organization statistics (must be before /:id)
router.get('/:id/stats', auth, organizationController.getOrganizationStats);

// Get organization by ID
router.get('/:id', auth, organizationController.getOrganizationById);

// Update organization
router.put('/:id', auth, organizationController.updateOrganization);

// Delete organization
router.delete('/:id', auth, organizationController.deleteOrganization);

module.exports = router;
