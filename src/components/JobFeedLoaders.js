import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

export const JobFeedLoader = () => (
  <div className="job-feed-loader">
    <div className="loader-container">
      <Loader2 size={48} className="spinning-loader" />
      <p>Načítání pracovních nabídek...</p>
    </div>
  </div>
);

export const JobFeedErrorMessage = ({ message, onRetry }) => (
  <div className="job-feed-error">
    <div className="error-content">
      <AlertTriangle size={64} className="error-icon" />
      <h3>Nastala chyba při načítání</h3>
      <p>{message || 'Nepodařilo se načíst pracovní nabídky'}</p>
      {onRetry && (
        <button 
          className="retry-button" 
          onClick={onRetry}
        >
          Zkusit znovu
        </button>
      )}
    </div>
  </div>
);