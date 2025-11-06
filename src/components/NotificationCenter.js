import React, { useState, useEffect } from 'react';

const NotificationCenter = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem(`notifications_${userId}`);
      const parsed = stored ? JSON.parse(stored) : [];
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated));
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated));
    setNotifications(updated);
    setUnreadCount(0);
  };

  const clearAll = () => {
    localStorage.setItem(`notifications_${userId}`, JSON.stringify([]));
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'approval_request': return '📋';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'member_added': return '👤';
      case 'workspace_created': return '📁';
      default: return '📬';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'approval_request': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'member_added': return '#667eea';
      case 'workspace_created': return '#0066cc';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          position: 'relative',
          padding: '10px 16px',
          background: '#f8f9fa',
          color: '#333',
          border: '2px solid #e0e0e0',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '18px',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#e7f3ff';
          e.currentTarget.style.borderColor = '#667eea';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#f8f9fa';
          e.currentTarget.style.borderColor = '#e0e0e0';
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '700'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowDropdown(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
          />
          
          {/* Dropdown Content */}
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '400px',
            maxHeight: '500px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '2px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </h3>
              {notifications.length > 0 && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      style={{
                        padding: '4px 8px',
                        background: 'transparent',
                        color: '#667eea',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    style={{
                      padding: '4px 8px',
                      background: 'transparent',
                      color: '#dc3545',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#999' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
                  <p style={{ margin: 0, fontSize: '14px' }}>No notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.read) markAsRead(notif.id);
                      if (notif.onClick) notif.onClick();
                    }}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      background: notif.read ? 'white' : '#f0f8ff',
                      transition: 'background 0.2s',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'start'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = notif.read ? '#f8f9fa' : '#e7f3ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = notif.read ? 'white' : '#f0f8ff';
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      fontSize: '24px',
                      flexShrink: 0
                    }}>
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: notif.read ? '400' : '600',
                        color: '#333',
                        marginBottom: '4px'
                      }}>
                        {notif.title}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#666',
                        marginBottom: '6px'
                      }}>
                        {notif.message}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#999'
                      }}>
                        {new Date(notif.timestamp).toLocaleString()}
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {!notif.read && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getNotificationColor(notif.type),
                        flexShrink: 0,
                        marginTop: '6px'
                      }} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper function to add notifications
export const addNotification = (userId, notification) => {
  try {
    const stored = localStorage.getItem(`notifications_${userId}`);
    const existing = stored ? JSON.parse(stored) : [];
    
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    const updated = [newNotification, ...existing].slice(0, 50); // Keep last 50
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated));
    
    // Trigger storage event for other tabs/windows
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Error adding notification:', err);
  }
};

export default NotificationCenter;
