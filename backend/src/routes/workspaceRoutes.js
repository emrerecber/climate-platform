const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
  updateMemberRole,
  getWorkspaceStats
} = require('../controllers/workspaceController');

// Get current user's workspaces
router.get('/my-workspaces', auth, getMyWorkspaces);

// Create workspace
router.post('/', auth, createWorkspace);

// Get workspace by ID
router.get('/:id', auth, getWorkspaceById);

// Get workspace statistics
router.get('/:id/stats', auth, getWorkspaceStats);

// Update workspace
router.put('/:id', auth, updateWorkspace);

// Delete workspace
router.delete('/:id', auth, deleteWorkspace);

// Member management
router.post('/:id/members', auth, addMember);
router.delete('/:id/members/:userId', auth, removeMember);
router.put('/:id/members/:userId/role', auth, updateMemberRole);

module.exports = router;
