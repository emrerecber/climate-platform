import React from 'react';
import './LoadingComponents.css';

/**
 * Loading Spinner Component
 * Simple spinner for inline loading states
 */
export const LoadingSpinner = ({ size = 'medium', color = '#3b82f6', text }) => {
  const sizeClass = `spinner-${size}`;
  
  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${sizeClass}`} style={{ borderTopColor: color }}>
        <div className="spinner-inner" style={{ borderTopColor: color }}></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

/**
 * Loading Overlay Component
 * Full-screen overlay with loading spinner
 * Used for blocking operations (e.g., form submission, data save)
 */
export const LoadingOverlay = ({ message = 'Loading...', submessage }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-overlay-content">
        <div className="loading-spinner-large">
          <div className="spinner-circle"></div>
          <div className="spinner-circle spinner-circle-2"></div>
          <div className="spinner-circle spinner-circle-3"></div>
        </div>
        <h3 className="loading-overlay-message">{message}</h3>
        {submessage && <p className="loading-overlay-submessage">{submessage}</p>}
      </div>
    </div>
  );
};

/**
 * Button Loading State Component
 * Button with integrated loading spinner
 */
export const LoadingButton = ({ 
  loading, 
  onClick, 
  disabled, 
  children, 
  className = '',
  loadingText = 'Processing...',
  type = 'button',
  variant = 'primary'
}) => {
  const buttonClass = `loading-button ${className} loading-button-${variant} ${loading ? 'loading-button-loading' : ''}`;
  
  return (
    <button 
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="button-spinner"></span>
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

/**
 * Skeleton Loader Component
 * For content that is loading
 */
export const SkeletonLoader = ({ width = '100%', height = '20px', borderRadius = '4px', count = 1 }) => {
  return (
    <div className="skeleton-container">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="skeleton-loader"
          style={{
            width,
            height,
            borderRadius,
            marginBottom: count > 1 ? '8px' : '0'
          }}
        ></div>
      ))}
    </div>
  );
};

/**
 * Progress Bar Component
 * Shows progress of an operation
 */
export const ProgressBar = ({ progress = 0, message, showPercentage = true }) => {
  const percentage = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="progress-bar-container">
      {message && <p className="progress-bar-message">{message}</p>}
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        >
          {showPercentage && percentage > 10 && (
            <span className="progress-bar-percentage">{percentage}%</span>
          )}
        </div>
      </div>
      {showPercentage && percentage <= 10 && (
        <span className="progress-bar-percentage-outside">{percentage}%</span>
      )}
    </div>
  );
};

/**
 * Dots Loading Indicator
 * Simple animated dots for minimal loading states
 */
export const DotsLoader = ({ color = '#3b82f6' }) => {
  return (
    <div className="dots-loader">
      <span className="dot" style={{ backgroundColor: color }}></span>
      <span className="dot" style={{ backgroundColor: color }}></span>
      <span className="dot" style={{ backgroundColor: color }}></span>
    </div>
  );
};

export default {
  LoadingSpinner,
  LoadingOverlay,
  LoadingButton,
  SkeletonLoader,
  ProgressBar,
  DotsLoader
};
