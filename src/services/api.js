/**
 * API Service Layer
 * Handles all communication with backend API
 * Features: Retry logic, Request/Response interceptors, Better error handling
 * Mock Mode: Set REACT_APP_USE_MOCK_API=true to use mock data (no backend needed)
 */

import mockAPI from './mockApi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true' || true; // Default to true for development

// Configuration
const API_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // ms
  timeout: 30000, // 30 seconds
  enableLogging: process.env.NODE_ENV === 'development'
};

// Request/Response interceptors
const requestInterceptors = [];
const responseInterceptors = [];

// Add request interceptor
export const addRequestInterceptor = (interceptor) => {
  requestInterceptors.push(interceptor);
};

// Add response interceptor
export const addResponseInterceptor = (interceptor) => {
  responseInterceptors.push(interceptor);
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Sleep utility for retry delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Check if error is retryable
const isRetryableError = (error) => {
  // Network errors, timeouts, 5xx errors are retryable
  if (error.name === 'TypeError' || error.name === 'NetworkError') return true;
  if (error.message?.includes('timeout')) return true;
  if (error.status >= 500 && error.status < 600) return true;
  if (error.status === 429) return true; // Rate limit
  return false;
};

// Enhanced API request helper with retry logic
const apiRequest = async (endpoint, options = {}, retryCount = 0) => {
  const token = getAuthToken();
  
  let headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let config = {
    ...options,
    headers,
  };

  // Apply request interceptors
  for (const interceptor of requestInterceptors) {
    config = await interceptor(config);
  }

  // Logging
  if (API_CONFIG.enableLogging) {
    console.log(`[API Request] ${options.method || 'GET'} ${endpoint}`, {
      headers: config.headers,
      body: config.body ? JSON.parse(config.body) : null
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  config.signal = controller.signal;

  try {
    const startTime = Date.now();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const duration = Date.now() - startTime;
    
    clearTimeout(timeoutId);

    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Logging
    if (API_CONFIG.enableLogging) {
      console.log(`[API Response] ${response.status} ${endpoint} (${duration}ms)`, data);
    }

    if (!response.ok) {
      const error = new Error(data.message || data.error || `HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.response = data;
      
      // Retry logic for retryable errors
      if (isRetryableError(error) && retryCount < API_CONFIG.maxRetries) {
        const delay = API_CONFIG.retryDelay * Math.pow(2, retryCount); // Exponential backoff
        console.warn(`[API Retry] Attempt ${retryCount + 1}/${API_CONFIG.maxRetries} after ${delay}ms`);
        await sleep(delay);
        return apiRequest(endpoint, options, retryCount + 1);
      }
      
      throw error;
    }

    // Apply response interceptors
    let result = data;
    for (const interceptor of responseInterceptors) {
      result = await interceptor(result, response);
    }

    return result;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle abort/timeout
    if (error.name === 'AbortError') {
      const timeoutError = new Error(`Request timeout after ${API_CONFIG.timeout}ms`);
      timeoutError.name = 'TimeoutError';
      
      // Retry on timeout
      if (retryCount < API_CONFIG.maxRetries) {
        const delay = API_CONFIG.retryDelay * Math.pow(2, retryCount);
        console.warn(`[API Retry] Timeout - Attempt ${retryCount + 1}/${API_CONFIG.maxRetries} after ${delay}ms`);
        await sleep(delay);
        return apiRequest(endpoint, options, retryCount + 1);
      }
      
      throw timeoutError;
    }
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error('Network error - Unable to reach server. Please check your connection.');
      networkError.name = 'NetworkError';
      networkError.originalError = error;
      
      // Retry on network error
      if (retryCount < API_CONFIG.maxRetries) {
        const delay = API_CONFIG.retryDelay * Math.pow(2, retryCount);
        console.warn(`[API Retry] Network error - Attempt ${retryCount + 1}/${API_CONFIG.maxRetries} after ${delay}ms`);
        await sleep(delay);
        return apiRequest(endpoint, options, retryCount + 1);
      }
      
      throw networkError;
    }
    
    console.error('[API Error]', error);
    throw error;
  }
};

// ========================
// AUTH ENDPOINTS
// ========================

const authAPI = {
  // Register new user
  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.data?.token) {
      setAuthToken(data.data.token);
    }
    
    return data;
  },

  // Login user
  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.data?.token) {
      setAuthToken(data.data.token);
    }
    
    return data;
  },

  // Get current user
  getMe: async () => {
    return await apiRequest('/auth/me');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return await apiRequest('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return await apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Logout
  logout: () => {
    removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// ========================
// COMPANY ENDPOINTS
// ========================

const companyAPI = {
  // Create new company
  create: async (companyData) => {
    return await apiRequest('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },

  // Get all companies
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/companies?${queryString}` : '/companies';
    return await apiRequest(endpoint);
  },

  // Get single company
  getById: async (id) => {
    return await apiRequest(`/companies/${id}`);
  },

  // Update company
  update: async (id, companyData) => {
    return await apiRequest(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  },

  // Delete company
  delete: async (id) => {
    return await apiRequest(`/companies/${id}`, {
      method: 'DELETE',
    });
  },

  // Save calculation results
  saveCalculations: async (id, calculations) => {
    return await apiRequest(`/companies/${id}/calculations`, {
      method: 'POST',
      body: JSON.stringify(calculations),
    });
  },

  // Get statistics
  getStats: async () => {
    return await apiRequest('/companies/stats');
  },
  
  // Approval workflow
  getPending: async () => {
    return await apiRequest('/companies/pending');
  },
  
  submitForReview: async (id) => {
    return await apiRequest(`/companies/${id}/submit`, {
      method: 'POST'
    });
  },
  
  approve: async (id) => {
    return await apiRequest(`/companies/${id}/approve`, {
      method: 'POST'
    });
  },
  
  reject: async (id, reason) => {
    return await apiRequest(`/companies/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  },
};

// ========================
// ORGANIZATION ENDPOINTS
// ========================

const organizationAPI = {
  // Get all organizations (admin only)
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/organizations?${queryString}` : '/organizations';
    return await apiRequest(endpoint);
  },

  // Get my organization
  getMyOrganization: async () => {
    return await apiRequest('/organizations/my-organization');
  },

  // Get organization by ID
  getById: async (id) => {
    return await apiRequest(`/organizations/${id}`);
  },

  // Create organization
  create: async (data) => {
    return await apiRequest('/organizations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Update organization
  update: async (id, data) => {
    return await apiRequest(`/organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Delete organization
  delete: async (id) => {
    return await apiRequest(`/organizations/${id}`, {
      method: 'DELETE'
    });
  },

  // Get organization statistics
  getStats: async (id) => {
    return await apiRequest(`/organizations/${id}/stats`);
  }
};

// ========================
// WORKSPACE ENDPOINTS
// ========================

const workspaceAPI = {
  // Get my workspaces
  getMyWorkspaces: async () => {
    return await apiRequest('/workspaces/my-workspaces');
  },

  // Get workspace by ID
  getById: async (id) => {
    return await apiRequest(`/workspaces/${id}`);
  },

  // Create workspace
  create: async (data) => {
    return await apiRequest('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Update workspace
  update: async (id, data) => {
    return await apiRequest(`/workspaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Delete workspace
  delete: async (id) => {
  return await apiRequest(`/workspaces/${id}`, {
      method: 'DELETE'
    });
  },

  // Get workspace statistics
  getStats: async (id) => {
    return await apiRequest(`/workspaces/${id}/stats`);
  },

  // Add member to workspace
  addMember: async (id, data) => {
    return await apiRequest(`/workspaces/${id}/members`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Remove member from workspace
  removeMember: async (id, userId) => {
    return await apiRequest(`/workspaces/${id}/members/${userId}`, {
      method: 'DELETE'
    });
  },

  // Update member role
  updateMemberRole: async (id, userId, role) => {
    return await apiRequest(`/workspaces/${id}/members/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  }
};

// ========================
// ASSESSMENT API
// ========================

const assessmentAPI = {
  // Get all assessments
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/assessments${queryString ? `?${queryString}` : ''}`);
  },

  // Get assessment by ID
  getById: async (id) => {
    return await apiRequest(`/assessments/${id}`);
  },

  // Create assessment
  create: async (data) => {
    return await apiRequest('/assessments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Update assessment
  update: async (id, data) => {
    return await apiRequest(`/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Delete assessment
  delete: async (id) => {
    return await apiRequest(`/assessments/${id}`, {
      method: 'DELETE'
    });
  },

  // Get assessment statistics
  getStats: async () => {
    return await apiRequest('/assessments/stats');
  }
};

// ========================
// HEALTH CHECK
// ========================

const healthAPI = {
  check: async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, message: 'Backend not available' };
    }
  },
};

// Export utility functions
export { getAuthToken, setAuthToken, removeAuthToken };

// Use mock API if enabled, otherwise use real API
if (USE_MOCK_API) {
  console.log('%c🎭 MOCK MODE ENABLED', 'background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold');
  console.log('%cBackend is not required. All data is stored in localStorage.', 'color: #10b981');
  console.log('%cTest credentials: admin@climate.com / admin123 or analyst@climate.com / analyst123', 'color: #6b7280');
}

// Choose between mock and real API
const finalAuthAPI = USE_MOCK_API ? mockAPI.auth : authAPI;
const finalCompanyAPI = USE_MOCK_API ? mockAPI.company : companyAPI;
const finalOrganizationAPI = USE_MOCK_API ? mockAPI.organization : organizationAPI;
const finalWorkspaceAPI = USE_MOCK_API ? mockAPI.workspace : workspaceAPI;
const finalAssessmentAPI = USE_MOCK_API ? mockAPI.assessment : assessmentAPI;
const finalHealthAPI = USE_MOCK_API ? mockAPI.health : healthAPI;

// Export with original names for backward compatibility
export { finalAuthAPI as authAPI };
export { finalCompanyAPI as companyAPI };
export { finalOrganizationAPI as organizationAPI };
export { finalWorkspaceAPI as workspaceAPI };
export { finalAssessmentAPI as assessmentAPI };
export { finalHealthAPI as healthAPI };

export default {
  auth: finalAuthAPI,
  company: finalCompanyAPI,
  organization: finalOrganizationAPI,
  workspace: finalWorkspaceAPI,
  assessment: finalAssessmentAPI,
  health: finalHealthAPI,
};
