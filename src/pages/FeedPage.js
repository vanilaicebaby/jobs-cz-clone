import React, { useState } from 'react';
import { Search, Filter, Briefcase } from 'lucide-react';
import { MOCK_JOBS, INDUSTRY_CATEGORIES } from '../utils/mockData';

function FeedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredJobs = MOCK_JOBS.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? job.industry === selectedCategory : true)
  );

  return (
    <div className="job-feed">
      <div className="job-feed-container">
        <div className="job-search-container">
          <div className="job-search-wrapper">
            <Search className="job-search-icon" size={20} />
            <input 
              type="text"
              placeholder="Hledat práci..."
              className="job-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Filter className="job-search-filter" size={20} />
          </div>
        </div>

        <div className="job-categories">
          {INDUSTRY_CATEGORIES.map(category => (
            <button
              key={category}
              className={`job-category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(
                selectedCategory === category ? null : category
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="job-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <div className="job-card-info">
                    <h3 className="job-card-title">{job.title}</h3>
                    <p className="job-card-company">{job.company} · {job.location}</p>
                  </div>
                  <span className="job-card-date">{job.postedDate}</span>
                </div>
                
                <p className="job-card-description">{job.description}</p>

                <div className="job-card-footer">
                  <div className="job-card-tags">
                    {job.tags.map((tag, index) => (
                      <span key={index} className="job-card-tag">{tag}</span>
                    ))}
                  </div>
                  <span className="job-card-salary">{job.salary}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="job-no-results">
              <Briefcase size={48} className="job-no-results-icon" />
              <p>Žádné pracovní nabídky nesplňují vaše kritéria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedPage;