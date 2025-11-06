import React, { useState, useEffect } from 'react';
import { authAPI } from './services/api';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import App from './App'; // Mevcut uygulamanız

const AppWithAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (authAPI.isAuthenticated()) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        // Token geçersiz, logout yap
        authAPI.logout();
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setSelectedCompany(null);
  };

  const handleSelectCompany = (company) => {
    console.log('🔵 handleSelectCompany called with:', company);
    setSelectedCompany(company);
  };

  const handleBackToDashboard = () => {
    setSelectedCompany(null);
  };

  const handleDataSaved = () => {
    // Optionally refresh dashboard data after save
    console.log('Data saved, you can refresh dashboard here if needed');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌍</div>
          <p>Loading Climate Platform...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -> Show login
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Authenticated but no company selected -> Show dashboard
  if (selectedCompany === null) {
    console.log('🟢 Rendering Dashboard with onSelectCompany:', typeof handleSelectCompany);
    return (
      <Dashboard 
        user={user}
        onLogout={handleLogout}
        onSelectCompany={handleSelectCompany}
      />
    );
  }

  // Company selected -> Show existing app
  return (
    <div>
      {/* Back to Dashboard Button */}
      <div style={{
        background: 'white',
        padding: '10px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={handleBackToDashboard}
          style={{
            padding: '8px 16px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Back to Dashboard
        </button>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {selectedCompany?.companyName ? (
            <>Editing: <strong>{selectedCompany.companyName}</strong></>
          ) : (
            <>Creating: <strong>New Assessment</strong></>
          )}
        </div>
      </div>
      
      {/* Existing App */}
      <App 
        selectedCompany={selectedCompany} 
        user={user}
        onDataSaved={handleDataSaved}
      />
    </div>
  );
};

export default AppWithAuth;
