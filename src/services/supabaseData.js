import { supabase } from './supabase';

// =====================================================
// COMPANIES API - Supabase
// =====================================================

export const supabaseCompanyAPI = {
  // Get all companies for current user
  getAll: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        data: {
          companies: data || [],
          total: data?.length || 0
        }
      };
    } catch (error) {
      console.error('Get companies error:', error);
      throw error;
    }
  },

  // Get company by ID
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Get company error:', error);
      throw error;
    }
  },

  // Create new company
  create: async (companyData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user profile to get organization_id
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      const { data, error } = await supabase
        .from('companies')
        .insert([{
          user_id: user.id,
          organization_id: profile?.organization_id,
          company_name: companyData.companyName || companyData.entityName,
          sector: companyData.sector,
          country: companyData.country,
          city: companyData.city,
          revenue: companyData.totalIncome || companyData.revenue,
          total_assets: companyData.totalAssets,
          equity: companyData.equity,
          currency: companyData.currency,
          facility_latitude: companyData.facilityLatitude,
          facility_longitude: companyData.facilityLongitude,
          physical_address: companyData.physicalAddress,
          status: companyData.status || 'draft'
        }])
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Create company error:', error);
      throw error;
    }
  },

  // Update company
  update: async (id, companyData) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({
          company_name: companyData.companyName || companyData.entityName,
          sector: companyData.sector,
          country: companyData.country,
          city: companyData.city,
          revenue: companyData.totalIncome || companyData.revenue,
          total_assets: companyData.totalAssets,
          equity: companyData.equity,
          currency: companyData.currency,
          facility_latitude: companyData.facilityLatitude,
          facility_longitude: companyData.facilityLongitude,
          physical_address: companyData.physicalAddress,
          status: companyData.status,
          approval_status: companyData.approvalStatus,
          approved_by: companyData.approvedBy,
          approved_at: companyData.approvedAt,
          rejected_reason: companyData.rejectedReason
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Update company error:', error);
      throw error;
    }
  },

  // Delete company
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Delete company error:', error);
      throw error;
    }
  },

  // Get stats
  getStats: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('companies')
        .select('*');

      if (error) throw error;

      const stats = {
        total: data.length,
        byStatus: {
          draft: data.filter(c => c.status === 'draft').length,
          completed: data.filter(c => c.status === 'completed').length,
          pending_review: data.filter(c => c.status === 'pending_review').length,
          approved: data.filter(c => c.status === 'approved').length,
          rejected: data.filter(c => c.status === 'rejected').length
        },
        recent: data.slice(0, 5)
      };

      return { data: stats };
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  }
};

// =====================================================
// ASSESSMENTS API - Supabase
// =====================================================

export const supabaseAssessmentAPI = {
  // Get all assessments
  getAll: async (params = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (params.sector) {
        query = query.eq('sector', params.sector);
      }
      if (params.status) {
        query = query.eq('status', params.status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        data: {
          assessments: data || [],
          total: data?.length || 0
        }
      };
    } catch (error) {
      console.error('Get assessments error:', error);
      throw error;
    }
  },

  // Get assessment by ID
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Get assessment error:', error);
      throw error;
    }
  },

  // Create assessment
  create: async (assessmentData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user profile to get organization_id
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      const { data, error } = await supabase
        .from('assessments')
        .insert([{
          user_id: user.id,
          company_id: assessmentData.companyId,
          organization_id: profile?.organization_id,
          company_name: assessmentData.companyName,
          sector: assessmentData.sector,
          assessment_type: assessmentData.assessmentType || 'comprehensive',
          status: assessmentData.status || 'completed',
          form_data: assessmentData.formData || {},
          results: assessmentData.results || {}
        }])
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Create assessment error:', error);
      throw error;
    }
  },

  // Update assessment
  update: async (id, assessmentData) => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .update({
          status: assessmentData.status,
          form_data: assessmentData.formData,
          results: assessmentData.results
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Update assessment error:', error);
      throw error;
    }
  },

  // Delete assessment
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Delete assessment error:', error);
      throw error;
    }
  },

  // Get assessment stats
  getStats: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('assessments')
        .select('*');

      if (error) throw error;

      const stats = {
        total: data.length,
        completed: data.filter(a => a.status === 'completed').length,
        inProgress: data.filter(a => a.status === 'in_progress').length,
        draft: data.filter(a => a.status === 'draft').length
      };

      return { data: stats };
    } catch (error) {
      console.error('Get assessment stats error:', error);
      throw error;
    }
  }
};

// =====================================================
// ORGANIZATIONS API - Supabase
// =====================================================

export const supabaseOrganizationAPI = {
  // Get my organization
  getMyOrganization: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user's organization_id
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) {
        return {
          data: {
            organization: null,
            message: 'No organization assigned. Please contact your administrator.'
          }
        };
      }

      // Get organization details
      const { data: org, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.organization_id)
        .single();

      if (error) throw error;

      return {
        data: {
          organization: org
        }
      };
    } catch (error) {
      console.error('Get organization error:', error);
      throw error;
    }
  },

  // Create organization (admin only)
  create: async (orgData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('organizations')
        .insert([{
          name: orgData.name,
          industry: orgData.industry,
          settings: orgData.settings || {
            approval_required: false,
            roles_enabled: true,
            notification_enabled: true
          }
        }])
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Create organization error:', error);
      throw error;
    }
  },

  // Update organization
  update: async (id, orgData) => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update({
          name: orgData.name,
          industry: orgData.industry,
          settings: orgData.settings
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Update organization error:', error);
      throw error;
    }
  },

  // Get all organizations (admin only)
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        data: {
          organizations: data || []
        }
      };
    } catch (error) {
      console.error('Get all organizations error:', error);
      throw error;
    }
  }
};

// =====================================================
// NOTIFICATIONS API - Supabase
// =====================================================

export const supabaseNotificationAPI = {
  // Get all notifications for current user
  getAll: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        data: {
          notifications: data || [],
          unreadCount: data?.filter(n => !n.is_read).length || 0
        }
      };
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  },

  // Delete notification
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }
};
