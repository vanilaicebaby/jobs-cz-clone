import React, { useState } from 'react';
import { Search, Filter, Briefcase } from 'lucide-react';
import { MOCK_JOBS, INDUSTRY_CATEGORIES } from '../utils/mockData';

const JobCard = ({ job }) => (
  <div className="bg-white border border-neutral-100 rounded-lg p-4 mb-4 shadow-soft hover:shadow-card transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-bold text-primary-300">{job.title}</h3>
        <p className="text-neutral-600">{job.company} · {job.location}</p>
      </div>
      <span className="text-sm text-neutral-500">{job.postedDate}</span>
    </div>
    <div className="mt-2">
      <p className="text-neutral-700 line-clamp-2">{job.description}</p>
    </div>
    <div className="mt-3 flex justify-between items-center">
      <div className="flex space-x-2">
        {job.tags.map((tag, index) => (
          <span 
            key={index} 
            className="px-2 py-1 bg-primary-50 text-primary-300 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <span className="text-sm font-semibold text-neutral-700">{job.salary}</span>
    </div>
  </div>
);

function FeedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredJobs = MOCK_JOBS.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? job.industry === selectedCategory : true)
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative">
            <input 
              type="text"
              placeholder="Hledat práci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 pl-10 border border-neutral-200 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" 
              size={20} 
            />
            <Filter 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 cursor-pointer" 
              size={20} 
            />
          </div>
        </div>

        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2">
            {INDUSTRY_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(
                  selectedCategory === category ? null : category
                )}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category 
                    ? 'bg-primary-300 text-white' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <Briefcase className="mx-auto mb-4 text-neutral-300" size={48} />
              <p>Žádné pracovní nabídky nesplňují vaše kritéria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedPage;