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
  ChevronDown
} from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';

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
  const matchedEmojiKey = job.tags.find(tag => 
    Object.keys(emojis).some(key => 
      tag.toLowerCase().includes(key.toLowerCase())
    )
  );

  return emojis[matchedEmojiKey] || emojis['default'];
};

// Dynamic Flame Icon with Animation
const AnimatedFlameIcon = ({ hotness }) => {
  // Map hotness to intensity of flame
  const getFlameIntensity = (hotness) => {
    if (hotness < 30) return 'low-flame';
    if (hotness < 70) return 'medium-flame';
    return 'high-flame';
  };

  return (
    <Flame 
      className={`job-hotness-flame ${getFlameIntensity(hotness)}`} 
      size={24} 
    />
  );
};

// Enhanced Mock Jobs
const ENHANCED_MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Tech Innovators Inc.',
    location: 'San Francisco, CA',
    salary: '$120,000 - $180,000',
    tags: ['React', 'TypeScript', 'Web3', 'Frontend'],
    featured: true,
    matched: true,
    hotness: 95,
    companyRating: 4.8,
    description: 'Revolutionary startup seeking top-tier frontend talent to build next-gen web applications.'
  },
  {
    id: '2',
    title: 'AI Research Scientist',
    company: 'DeepMind Solutions',
    location: 'New York, NY',
    salary: '$180,000 - $250,000',
    tags: ['Machine Learning', 'Python', 'Deep Learning', 'AI'],
    featured: true,
    matched: false,
    hotness: 88,
    companyRating: 4.9,
    description: 'Cutting-edge AI research position pushing the boundaries of machine intelligence.'
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'Growth Dynamics LLC',
    location: 'Remote',
    salary: '$100,000 - $150,000',
    tags: ['Product Strategy', 'Agile', 'Leadership', 'Product'],
    featured: false,
    matched: true,
    hotness: 75,
    companyRating: 4.5,
    description: 'Seeking a strategic product leader to drive innovation and user-centric design.'
  }
];

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
          ? categories.find(cat => cat.name === selectedCategory)?.name || 'Select Industry'
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
              {category.icon}
              {category.name}
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
  const [filteredJobs, setFilteredJobs] = useState(ENHANCED_MOCK_JOBS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    const filtered = ENHANCED_MOCK_JOBS.filter(job => 
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedCategory ? job.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase())) : true)
    );
    setFilteredJobs(filtered);
  }, [searchTerm, selectedCategory]);

  const renderJobCard = (job) => (
    <div 
      key={job.id} 
      className={`job-card ${job.featured ? 'featured-job' : ''} ${job.matched ? 'matched-job' : ''}`}
    >
      <div className="job-card-header">
        <div className="job-card-badges">
          {job.featured && (
            <span className="badge featured-badge">
              <AnimatedFlameIcon hotness={job.hotness} /> Featured
            </span>
          )}
          {job.matched && (
            <span className="badge matched-badge">
              <TrendingUp size={16} /> Matched for You
            </span>
          )}
        </div>
        <div className="job-card-meta">
          <div 
            className="job-hotness-indicator" 
            style={{
              width: `${job.hotness}%`, 
              background: `linear-gradient(90deg, 
                hsl(${Math.max(0, 120 * (job.hotness / 100))}, 70%, 50%), 
                hsl(${Math.max(0, 120 * (job.hotness / 100))}, 100%, 40%))`
            }}
          ></div>
          <span className="company-rating">⭐ {job.companyRating}/5</span>
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
          {job.tags.map(tag => (
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
        {/* Desktop categories */}
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

        {/* Mobile dropdown */}
        <div className="mobile-category-dropdown">
          <IndustryDropdown 
            categories={INDUSTRY_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      <div className="job-results">
        <h2>Hot Jobs 🔥 <span className="job-count">({filteredJobs.length} positions)</span></h2>
        
        {filteredJobs.length > 0 ? (
          <div className="job-grid">
            {filteredJobs.map(renderJobCard)}
          </div>
        ) : (
          <div className="no-jobs-found">
            <Briefcase size={64} />
            <p>No jobs match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvancedJobFeed;