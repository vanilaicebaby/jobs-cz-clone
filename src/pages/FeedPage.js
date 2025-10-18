import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Briefcase, 
  MapPin, 
  Clock, 
  BookmarkPlus, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { MOCK_JOBS, INDUSTRY_CATEGORIES } from '../utils/mockData';

function FeedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState(MOCK_JOBS);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  useEffect(() => {
    const filtered = MOCK_JOBS.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? job.industry === selectedCategory : true)
    );
    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredJobs.length / jobsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="job-pagination">
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <ChevronLeft size={20} />
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`pagination-number ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === pageNumbers.length}
          className="pagination-button"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="job-feed">
      <div className="job-feed-container">
        <div className="job-feed-header">
          <h1>Pracovní nabídky</h1>
          <p>Najděte svou vysněnou práci mezi {MOCK_JOBS.length} pozicemi</p>
        </div>

        <div className="job-search-container">
          <div className="job-search-wrapper">
            <Search className="job-search-icon" size={20} />
            <input 
              type="text"
              placeholder="Hledat práci podle názvu, společnosti nebo dovedností..."
              className="job-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Filter className="job-search-filter" size={20} />
          </div>
        </div>

        <div className="job-categories-container">
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
        </div>

        <div className="job-results-summary">
          <span>{filteredJobs.length} pracovních nabídek</span>
          {selectedCategory && (
            <span>v kategorii {selectedCategory}</span>
          )}
        </div>

        <div className="job-grid">
          {currentJobs.length > 0 ? (
            currentJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <div className="job-card-company-logo">
                    <Briefcase size={40} className="job-card-logo-icon" />
                  </div>
                  <div className="job-card-info">
                    <h3 className="job-card-title">{job.title}</h3>
                    <div className="job-card-details">
                      <span className="job-card-company">{job.company}</span>
                      <span className="job-card-location">
                        <MapPin size={14} /> {job.location}
                      </span>
                    </div>
                  </div>
                  <button className="job-card-bookmark">
                    <BookmarkPlus size={20} />
                  </button>
                </div>
                
                <p className="job-card-description">{job.description}</p>

                <div className="job-card-footer">
                  <div className="job-card-tags">
                    {job.tags.map((tag, index) => (
                      <span key={index} className="job-card-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="job-card-meta">
                    <span className="job-card-salary">{job.salary}</span>
                    <span className="job-card-date">
                      <Clock size={14} /> Zveřejněno {job.postedDate}
                    </span>
                  </div>
                </div>

                <button className="job-card-apply-button">
                  Zobrazit detaily
                </button>
              </div>
            ))
          ) : (
            <div className="job-no-results">
              <Briefcase size={48} className="job-no-results-icon" />
              <p>Žádné pracovní nabídky nesplňují vaše kritéria</p>
            </div>
          )}
        </div>

        {filteredJobs.length > jobsPerPage && renderPagination()}
      </div>
    </div>
  );
}

export default FeedPage;