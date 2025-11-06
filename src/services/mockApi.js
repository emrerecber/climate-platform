/**
 * Mock API Service
 * Backend olmadan tüm özellikleri test etmek için mock data ve fake API calls
 */

// Mock database (localStorage'da saklanacak)
const STORAGE_KEYS = {
  USERS: 'mock_users',
  COMPANIES: 'mock_companies',
  ORGANIZATIONS: 'mock_organizations',
  WORKSPACES: 'mock_workspaces',
  CURRENT_USER: 'mock_current_user'
};

// Helper: Generate UUID
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper: Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize mock data
const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const mockUsers = [
      {
        id: generateId(),
        username: 'admin',
        email: 'admin@climate.com',
        password: 'admin123', // In real app, never store plaintext!
        role: 'admin',
        organizationId: 'org-1',
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        username: 'analyst',
        email: 'analyst@climate.com',
        password: 'analyst123',
        role: 'analyst',
        organizationId: 'org-1',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS)) {
    const mockOrgs = [
      {
        id: 'org-1',
        name: 'Demo Climate Bank',
        type: 'bank',
        country: 'Turkey',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(mockOrgs));
  }

  if (!localStorage.getItem(STORAGE_KEYS.COMPANIES)) {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.WORKSPACES)) {
    localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify([]));
  }
};

// Initialize on load
initializeMockData();

// Mock Auth Token
let mockAuthToken = localStorage.getItem('mockAuthToken') || null;

const setMockAuthToken = (token) => {
  mockAuthToken = token;
  if (token) {
    localStorage.setItem('mockAuthToken', token);
  } else {
    localStorage.removeItem('mockAuthToken');
  }
};

// Get data from localStorage
const getStorageData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

// Set data to localStorage
const setStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ========================
// MOCK AUTH API
// ========================

export const mockAuthAPI = {
  register: async (userData) => {
    await delay();
    
    const users = getStorageData(STORAGE_KEYS.USERS);
    
    // Check if user exists
    if (users.find(u => u.email === userData.email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: generateId(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'analyst',
      organizationId: userData.organizationId || 'org-1',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    setStorageData(STORAGE_KEYS.USERS, users);

    const token = `mock-token-${newUser.id}`;
    setMockAuthToken(token);
    
    const { password, ...userWithoutPassword } = newUser;
    
    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    };
  },

  login: async (credentials) => {
    await delay();
    
    const users = getStorageData(STORAGE_KEYS.USERS);
    const user = users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = `mock-token-${user.id}`;
    setMockAuthToken(token);
    
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));

    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    };
  },

  getMe: async () => {
    await delay(200);
    
    if (!mockAuthToken) {
      throw new Error('Not authenticated');
    }

    const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!currentUser) {
      throw new Error('User not found');
    }

    return {
      success: true,
      data: {
        user: JSON.parse(currentUser)
      }
    };
  },

  updateProfile: async (profileData) => {
    await delay();
    
    const users = getStorageData(STORAGE_KEYS.USERS);
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = { ...users[userIndex], ...profileData };
    setStorageData(STORAGE_KEYS.USERS, users);
    
    const { password, ...userWithoutPassword } = users[userIndex];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));

    return {
      success: true,
      data: { user: userWithoutPassword }
    };
  },

  logout: () => {
    setMockAuthToken(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  isAuthenticated: () => {
    return !!mockAuthToken;
  }
};

// ========================
// MOCK COMPANY API
// ========================

export const mockCompanyAPI = {
  create: async (companyData) => {
    await delay();
    
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));

    const newCompany = {
      id: generateId(),
      userId: currentUser.id,
      ...companyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    companies.push(newCompany);
    setStorageData(STORAGE_KEYS.COMPANIES, companies);

    return {
      success: true,
      data: { company: newCompany }
    };
  },

  getAll: async (params = {}) => {
    await delay(300);
    
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));

    // Filter by current user
    let filtered = companies.filter(c => c.userId === currentUser.id);

    // Apply filters
    if (params.status) {
      filtered = filtered.filter(c => c.status === params.status);
    }
    if (params.sector) {
      filtered = filtered.filter(c => c.sector === params.sector);
    }

    return {
      success: true,
      data: {
        companies: filtered,
        total: filtered.length
      }
    };
  },

  getById: async (id) => {
    await delay(200);
    
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const company = companies.find(c => c.id === id);

    if (!company) {
      throw new Error('Company not found');
    }

    return {
      success: true,
      data: { company }
    };
  },

  update: async (id, companyData) => {
    await delay();
    
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const companyIndex = companies.findIndex(c => c.id === id);

    if (companyIndex === -1) {
      throw new Error('Company not found');
    }

    companies[companyIndex] = {
      ...companies[companyIndex],
      ...companyData,
      updatedAt: new Date().toISOString()
    };

    setStorageData(STORAGE_KEYS.COMPANIES, companies);

    return {
      success: true,
      data: { company: companies[companyIndex] }
    };
  },

  delete: async (id) => {
    await delay();
    
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const filtered = companies.filter(c => c.id !== id);

    setStorageData(STORAGE_KEYS.COMPANIES, filtered);

    return {
      success: true,
      data: { message: 'Company deleted' }
    };
  },

  saveCalculations: async (id, calculations) => {
    await delay();
    
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const companyIndex = companies.findIndex(c => c.id === id);

    if (companyIndex === -1) {
      throw new Error('Company not found');
    }

    companies[companyIndex].calculations = calculations;
    companies[companyIndex].lastCalculatedAt = new Date().toISOString();

    setStorageData(STORAGE_KEYS.COMPANIES, companies);

    return {
      success: true,
      data: { message: 'Calculations saved' }
    };
  },

  getStats: async () => {
    await delay(200);
    
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    
    const userCompanies = companies.filter(c => c.userId === currentUser.id);

    return {
      success: true,
      data: {
        total: userCompanies.length,
        completed: userCompanies.filter(c => c.status === 'completed').length,
        inReview: userCompanies.filter(c => c.status === 'in_review').length,
        draft: userCompanies.filter(c => c.status === 'draft').length
      }
    };
  },

  getPending: async () => {
    await delay(200);
    
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    
    // Get companies that are in_review status
    const pending = companies.filter(c => 
      c.status === 'in_review' && 
      (currentUser.role === 'admin' || c.userId === currentUser.id)
    );

    return {
      success: true,
      data: { companies: pending }
    };
  },

  submitForReview: async (id) => {
    await delay();
    
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const companyIndex = companies.findIndex(c => c.id === id);

    if (companyIndex === -1) {
      throw new Error('Company not found');
    }

    companies[companyIndex].status = 'in_review';
    companies[companyIndex].submittedAt = new Date().toISOString();

    setStorageData(STORAGE_KEYS.COMPANIES, companies);

    return {
      success: true,
      data: { message: 'Submitted for review' }
    };
  },

  approve: async (id) => {
    await delay();
    
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const companyIndex = companies.findIndex(c => c.id === id);

    if (companyIndex === -1) {
      throw new Error('Company not found');
    }

    companies[companyIndex].status = 'approved';
    companies[companyIndex].approvedAt = new Date().toISOString();

    setStorageData(STORAGE_KEYS.COMPANIES, companies);

    return {
      success: true,
      data: { message: 'Approved' }
    };
  },

  reject: async (id, reason) => {
    await delay();
    
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const companyIndex = companies.findIndex(c => c.id === id);

    if (companyIndex === -1) {
      throw new Error('Company not found');
    }

    companies[companyIndex].status = 'rejected';
    companies[companyIndex].rejectionReason = reason;
    companies[companyIndex].rejectedAt = new Date().toISOString();

    setStorageData(STORAGE_KEYS.COMPANIES, companies);

    return {
      success: true,
      data: { message: 'Rejected' }
    };
  }
};

// ========================
// MOCK ORGANIZATION API
// ========================

export const mockOrganizationAPI = {
  getAll: async () => {
    await delay(200);
    const orgs = getStorageData(STORAGE_KEYS.ORGANIZATIONS);
    return {
      success: true,
      data: { organizations: orgs }
    };
  },

  getMyOrganization: async () => {
    await delay(200);
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    const orgs = getStorageData(STORAGE_KEYS.ORGANIZATIONS);
    const org = orgs.find(o => o.id === currentUser.organizationId);

    return {
      success: true,
      data: { organization: org || orgs[0] }
    };
  },

  getById: async (id) => {
    await delay(200);
    const orgs = getStorageData(STORAGE_KEYS.ORGANIZATIONS);
    const org = orgs.find(o => o.id === id);

    if (!org) {
      throw new Error('Organization not found');
    }

    return {
      success: true,
      data: { organization: org }
    };
  },

  create: async (data) => {
    await delay();
    const orgs = getStorageData(STORAGE_KEYS.ORGANIZATIONS);
    
    const newOrg = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orgs.push(newOrg);
    setStorageData(STORAGE_KEYS.ORGANIZATIONS, orgs);

    return {
      success: true,
      data: { organization: newOrg }
    };
  },

  update: async (id, data) => {
    await delay();
    const orgs = getStorageData(STORAGE_KEYS.ORGANIZATIONS);
    const orgIndex = orgs.findIndex(o => o.id === id);

    if (orgIndex === -1) {
      throw new Error('Organization not found');
    }

    orgs[orgIndex] = { ...orgs[orgIndex], ...data, updatedAt: new Date().toISOString() };
    setStorageData(STORAGE_KEYS.ORGANIZATIONS, orgs);

    return {
      success: true,
      data: { organization: orgs[orgIndex] }
    };
  },

  delete: async (id) => {
    await delay();
    const orgs = getStorageData(STORAGE_KEYS.ORGANIZATIONS);
    const filtered = orgs.filter(o => o.id !== id);

    setStorageData(STORAGE_KEYS.ORGANIZATIONS, filtered);

    return {
      success: true,
      data: { message: 'Organization deleted' }
    };
  },

  getStats: async (id) => {
    await delay(200);
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const orgs = getStorageData(STORAGE_KEYS.ORGANIZATIONS);
    const org = orgs.find(o => o.id === id);

    if (!org) {
      throw new Error('Organization not found');
    }

    // Count companies for this organization
    const orgCompanies = companies.filter(c => c.organizationId === id);

    return {
      success: true,
      data: {
        totalCompanies: orgCompanies.length,
        totalUsers: 1, // Mock data
        totalAssessments: orgCompanies.length
      }
    };
  }
};

// ========================
// MOCK WORKSPACE API
// ========================

export const mockWorkspaceAPI = {
  getMyWorkspaces: async () => {
    await delay(200);
    const workspaces = getStorageData(STORAGE_KEYS.WORKSPACES);
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    
    // Filter workspaces by current user's organization
    const filtered = workspaces.filter(w => w.organizationId === currentUser.organizationId);
    
    return {
      success: true,
      data: { workspaces: filtered }
    };
  },

  getById: async (id) => {
    await delay(200);
    const workspaces = getStorageData(STORAGE_KEYS.WORKSPACES);
    const workspace = workspaces.find(w => w.id === id);

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    return {
      success: true,
      data: { workspace }
    };
  },

  create: async (data) => {
    await delay();
    const workspaces = getStorageData(STORAGE_KEYS.WORKSPACES);
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    
    const newWorkspace = {
      id: generateId(),
      ...data,
      createdBy: currentUser.id,
      members: [{ userId: currentUser.id, role: 'owner' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    workspaces.push(newWorkspace);
    setStorageData(STORAGE_KEYS.WORKSPACES, workspaces);

    return {
      success: true,
      data: { workspace: newWorkspace }
    };
  },

  update: async (id, data) => {
    await delay();
    const workspaces = getStorageData(STORAGE_KEYS.WORKSPACES);
    const workspaceIndex = workspaces.findIndex(w => w.id === id);

    if (workspaceIndex === -1) {
      throw new Error('Workspace not found');
    }

    workspaces[workspaceIndex] = {
      ...workspaces[workspaceIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    setStorageData(STORAGE_KEYS.WORKSPACES, workspaces);

    return {
      success: true,
      data: { workspace: workspaces[workspaceIndex] }
    };
  },

  delete: async (id) => {
    await delay();
    const workspaces = getStorageData(STORAGE_KEYS.WORKSPACES);
    const filtered = workspaces.filter(w => w.id !== id);

    setStorageData(STORAGE_KEYS.WORKSPACES, filtered);

    return {
      success: true,
      data: { message: 'Workspace deleted' }
    };
  },

  getStats: async (id) => {
    await delay(200);
    const companies = getStorageData(STORAGE_KEYS.COMPANIES);
    const workspaces = getStorageData(STORAGE_KEYS.WORKSPACES);
    const workspace = workspaces.find(w => w.id === id);

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const workspaceCompanies = companies.filter(c => c.workspaceId === id);

    return {
      success: true,
      data: {
        totalCompanies: workspaceCompanies.length,
        totalMembers: workspace.members?.length || 0
      }
    };
  },

  addMember: async (id, data) => {
    await delay();
    const workspaces = getStorageData(STORAGE_KEYS.WORKSPACES);
    const workspaceIndex = workspaces.findIndex(w => w.id === id);

    if (workspaceIndex === -1) {
      throw new Error('Workspace not found');
    }

    const newMember = {
      userId: data.userId,
      role: data.role || 'member',
      addedAt: new Date().toISOString()
    };

    workspaces[workspaceIndex].members = workspaces[workspaceIndex].members || [];
    workspaces[workspaceIndex].members.push(newMember);

    setStorageData(STORAGE_KEYS.WORKSPACES, workspaces);

    return {
      success: true,
      data: { message: 'Member added' }
    };
  },

  removeMember: async (id, userId) => {
    await delay();
    const workspaces = getStorageData(STORAGE_KEYS.WORKSPACES);
    const workspaceIndex = workspaces.findIndex(w => w.id === id);

    if (workspaceIndex === -1) {
      throw new Error('Workspace not found');
    }

    workspaces[workspaceIndex].members = workspaces[workspaceIndex].members.filter(
      m => m.userId !== userId
    );

    setStorageData(STORAGE_KEYS.WORKSPACES, workspaces);

    return {
      success: true,
      data: { message: 'Member removed' }
    };
  },

  updateMemberRole: async (id, userId, role) => {
    await delay();
    const workspaces = getStorageData(STORAGE_KEYS.WORKSPACES);
    const workspaceIndex = workspaces.findIndex(w => w.id === id);

    if (workspaceIndex === -1) {
      throw new Error('Workspace not found');
    }

    const memberIndex = workspaces[workspaceIndex].members.findIndex(
      m => m.userId === userId
    );

    if (memberIndex === -1) {
      throw new Error('Member not found');
    }

    workspaces[workspaceIndex].members[memberIndex].role = role;

    setStorageData(STORAGE_KEYS.WORKSPACES, workspaces);

    return {
      success: true,
      data: { message: 'Member role updated' }
    };
  }
};

// ========================
// HEALTH CHECK
// ========================

export const mockHealthAPI = {
  check: async () => {
    await delay(100);
    return {
      success: true,
      message: 'Mock API is running',
      mode: 'MOCK_MODE',
      timestamp: new Date().toISOString()
    };
  }
};

// Export all
export default {
  auth: mockAuthAPI,
  company: mockCompanyAPI,
  organization: mockOrganizationAPI,
  workspace: mockWorkspaceAPI,
  health: mockHealthAPI
};
