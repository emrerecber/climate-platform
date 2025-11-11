import { supabase } from './supabase';

// =====================================================
// AUTHENTICATION SERVICE - Supabase
// =====================================================

export const supabaseAuthAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const { email, password, firstName, lastName, role, customerProfile } = userData;

      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role || 'analyst',
            customer_profile: customerProfile
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      if (signUpError) throw signUpError;

      // Update user profile with additional data
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            role: role || 'viewer',
            customer_profile: customerProfile,
            first_name: firstName,
            last_name: lastName
          })
          .eq('id', authData.user.id);

        if (profileError) console.error('Profile update error:', profileError);
      }

      return {
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        user: authData.user,
        session: authData.session
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      return {
        success: true,
        user: {
          ...data.user,
          ...profile,
          firstName: profile?.first_name,
          lastName: profile?.last_name,
          customerProfile: profile?.customer_profile
        },
        session: data.session
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  // Logout user
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Logout failed');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) return null;

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return user;
      }

      return {
        ...user,
        ...profile,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        customerProfile: profile?.customer_profile
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Request password reset
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Password updated successfully!'
      };
    } catch (error) {
      console.error('Update password error:', error);
      throw new Error(error.message || 'Password update failed');
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Verification email sent!'
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      throw new Error(error.message || 'Failed to resend verification email');
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

export default supabaseAuthAPI;
