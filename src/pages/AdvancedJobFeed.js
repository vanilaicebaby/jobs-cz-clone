import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Flame, 
  Zap, 
  Award, 
  Filter, 
  CheckCircle,
  TrendingUp,
  Briefcase,
  UserPlus,
  LogIn,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';
import config from '../config';

// API endpoint now uses the config
const API_BASE_URL = config.apiBaseUrl;

// Dynamic Emoji Generator
const getDynamicEmoji = (job) => {
  const emojis = {
    'Frontend': '💻',
    'Backend': '🖥️',
    'AI': '🤖',
    'Data': '📊',
    'Product': '🚀',
    'Design': '🎨',
    'Marketing': '📈',
    'Sales': '💼',
    'Finance': '💰',
    'Healthcare': '🏥',
    'default': '💡'
  };

  // Find the first matching tag or return default
  const matchedEmojiKey = job.tags?.find(tag => 
    Object.keys(emojis).some(key => 
      tag.toLowerCase().includes(key.toLowerCase())
    )
  );

  return emojis[matchedEmojiKey] || emojis['default'];
};

// Dynamic Categories
const INDUSTRY_CATEGORIES = [
  { name: 'Tech', icon: <Zap className="category-icon" /> },
  { name: 'Finance', icon: <Award className="category-icon" /> },
  { name: 'Healthcare', icon: <CheckCircle className="category-icon" /> },
  { name: 'Product', icon: <Briefcase className="category-icon" /> },
];

// Dropdown component for mobile view
const IndustryDropdown = ({ categories, selectedCategory, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="industry-dropdown">
      <button 
        className="dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCategory 
          ? (() => {
              const selectedCat = categories.find(cat => cat.name === selectedCategory);
              return (
                <div className="dropdown-selected-category">
                  {selectedCat?.icon}
                  {selectedCat?.name}
                </div>
              );
            })()
          : 'All Industries'
        }
        <ChevronDown size={20} className="dropdown-icon" />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button 
            className={`dropdown-item ${!selectedCategory ? 'active' : ''}`}
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
            }}
          >
            All Industries
          </button>
          {categories.map(category => (
            <button
              key={category.name}
              className={`dropdown-item ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => {
                onSelect(category.name);
                setIsOpen(false);
              }}
            >
              <div className="dropdown-item-content">
                {category.icon}
                {category.name}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function AdvancedJobFeed() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching jobs with params:', {
      searchTerm, 
      selectedCategory, 
      currentPage
    });
    fetchJobs();
  }, [searchTerm, selectedCategory, currentPage]);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('industry', selectedCategory);
      params.append('page', currentPage);
      params.append('limit', 10);

      const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch job listings');
      }

      const data = await response.json();
      
      console.log('API Response:', data);

      // Flexible data handling
      const jobsData = data.jobs || data.data || data;
      setJobs(jobsData);
      setTotalJobs(data.totalJobs || data.total || jobsData.length);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching job listings:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const renderJobCard = (job) => (
    <div 
      key={job._id || job.id} 
      className={`job-card`}
    >
      <div className="job-card-header">
        <div className="job-card-badges">
          <span className="badge matched-badge">
            <TrendingUp size={16} /> Matched for You
          </span>
        </div>
      </div>

      <div className="job-card-content">
        <h3>{getDynamicEmoji(job)} {job.title}</h3>
        <p className="job-company">{job.company}</p>
        
        <div className="job-details">
          <span><MapPin size={16} /> {job.location}</span>
          <span className="job-salary">{job.salary}</span>
        </div>

        <p className="job-description">{job.description}</p>

        <div className="job-tags">
          {(job.tags || []).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div className="job-card-actions">
          <button className="btn-quick-apply">Quick Apply</button>
          <button className="btn-details">View Details</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="advanced-job-feed">
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authMode}
        />
      )}

      <div className="auth-buttons">
        <button 
          className="login-btn" 
          onClick={() => {
            setAuthMode('login');
            setIsAuthModalOpen(true);
          }}
        >
          <LogIn size={20} /> Login
        </button>
        <button 
          className="register-btn" 
          onClick={() => {
            setAuthMode('register');
            setIsAuthModalOpen(true);
          }}
        >
          <UserPlus size={20} /> Register
        </button>
      </div>

      <div className="job-feed-hero">
        <img 
          src="/logo.png" 
          alt="Workuj Logo" 
          className="workuj-logo" 
          style={{
            maxWidth: '250px',
            marginBottom: '20px',
            display: 'block',
            margin: '0 auto'
          }}
        />
        <p className="job-feed-subtitle" style={{
          textAlign: 'center',
          color: 'var(--neutral-600)',
          marginBottom: '20px'
        }}>
          Najdi si svou prací snů
        </p>
        <div className="search-container">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search jobs, skills, companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter className="filter-icon" />
        </div>
      </div>

      <div className="job-categories-container">
        <div className="job-categories desktop-categories">
          {INDUSTRY_CATEGORIES.map(category => (
            <button 
              key={category.name}
              className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(
                selectedCategory === category.name ? null : category.name
              )}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        <div className="mobile-category-dropdown">
          <IndustryDropdown 
            categories={INDUSTRY_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      <div className="job-results">
        <h2>Hot Jobs 🔥 <span className="job-count">({totalJobs} positions)</span></h2>
        
        {isLoading ? (
          <div className="loading-spinner">Načítání...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : jobs.length > 0 ? (
          <div className="job-grid">
            {jobs.map(renderJobCard)}
          </div>
        ) : (
          <div className="no-jobs-found">
            <Briefcase size={64} />
            <p>No jobs match your search criteria</p>
          </div>
        )}

        {jobs.length > 0 && (
          <div className="job-pagination">
            <div className="pagination-controls">
              <button 
                className="pagination-prev"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="pagination-info">
                <span className="current-page">Page {currentPage}</span>
                {totalJobs > 0 && (
                  <span className="total-jobs">of {Math.ceil(totalJobs / 10)} ({totalJobs} total jobs)</span>
                )}
              </div>
              <button 
                className="pagination-next"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage >= Math.ceil(totalJobs / 10)}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvancedJobFeed;