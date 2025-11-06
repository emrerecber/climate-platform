import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    role: 'analyst',
    customerProfile: 'other'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        
        if (response.success) {
          onAuthSuccess(response.data.user);
        }
      } else {
        // Register
        const response = await authAPI.register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          organizationName: formData.organizationName,
          role: formData.role,
          customerProfile: formData.customerProfile
        });
        
        if (response.success) {
          onAuthSuccess(response.data.user);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            color: '#667eea',
            marginBottom: '10px'
          }}>
            🌍 Climate Platform
          </h1>
          <p style={{ color: '#666' }}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                transition: 'border-color 0.3s'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          {!isLogin && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  name="organizationName"
                  placeholder="Organization Name"
                  value={formData.organizationName}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Role Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                  Your Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="viewer">Viewer (Read-only)</option>
                  <option value="analyst">Analyst (Create & Edit)</option>
                  <option value="manager">Manager (Team Lead)</option>
                  <option value="admin">Admin (Full Access)</option>
                </select>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  {formData.role === 'viewer' && '📖 Can view reports only'}
                  {formData.role === 'analyst' && '✍️ Can create and edit assessments'}
                  {formData.role === 'manager' && '👥 Can manage team and approve'}
                  {formData.role === 'admin' && '⚙️ Full system access'}
                </p>
              </div>

              {/* Customer Profile Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                  Organization Type
                </label>
                <select
                  name="customerProfile"
                  value={formData.customerProfile}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="bank">🏦 Bank</option>
                  <option value="asset_manager">💼 Asset Manager</option>
                  <option value="corporate">🏭 Corporate</option>
                  <option value="consultant">📊 Consultant</option>
                  <option value="other">🌐 Other</option>
                </select>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  {formData.customerProfile === 'bank' && 'Credit risk assessment & portfolio monitoring'}
                  {formData.customerProfile === 'asset_manager' && 'ESG scoring & investment analysis'}
                  {formData.customerProfile === 'corporate' && 'Own operations & TCFD reporting'}
                  {formData.customerProfile === 'consultant' && 'Multi-client advisory services'}
                  {formData.customerProfile === 'other' && 'General climate risk analysis'}
                </p>
              </div>
            </>
          )}

          {error && (
            <div style={{
              padding: '12px',
              background: '#f8d7da',
              color: '#721c24',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            {isLogin 
              ? "Don't have an account? Register" 
              : 'Already have an account? Login'
            }
          </button>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: '#e7f3ff',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>Demo credentials:</strong><br/>
          Email: test@example.com<br/>
          Password: password123
        </div>
      </div>
    </div>
  );
};

export default Auth;
