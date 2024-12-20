// Careers.js
'use client'
import './Careers.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useRouter } from 'next/navigation';
import { GridLoader } from 'react-spinners';
import { useState } from 'react';

const Careers = ({ filteredJobs  }) => {

    const router = useRouter()

    const [loading, setLoading] = useState(false);

    const formatDate = (createdAt) => {
        if (!createdAt) return 'Unknown date'; 
        
        const date = createdAt.toDate(); 
        const now = new Date();
        
       
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
        if (diffInDays === 0) {
            return 'Today';
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else {
            return `${diffInDays} days ago`;
        }
    };

    function toTitleCase(str) {
        return str
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }

      const viewJobs = (id) => {
        setLoading(true);
        setTimeout(() => {
            router.push(`/careers/${id}`);
        }, 500); 
    };


      
    

    return (
        <div className="job-list-container">
            {loading && (
                <div className="loading-container">
                    <GridLoader color={'#0A4044'} loading={loading} size={10} />
                </div>
            )}
            {!loading && (
                <>
                    <h1>
                        Our Current <span style={{ color: 'var(--orange)' }}>Openings</span>
                    </h1>
                    <div className="job-list">
                        {filteredJobs.map((job) => (
                            <div className="jobs" key={job.id}>
                                <h2>{toTitleCase(job.jobTitle)}</h2>
                                <p className="job-posted">{formatDate(job.createdAt)}</p>
                                <p className="job-location">
                                    <LocationOnIcon style={{ fontSize: '18px' }} />
                                    {toTitleCase(`${job.city}, ${job.state}, ${job.country}`)}
                                </p>
                                <p className="job-type">
                                    <AccessTimeIcon style={{ fontSize: '14px' }} />
                                    {toTitleCase(job.jobType)}
                                </p>
                                <div style={{ cursor: 'pointer' }}>
                                    <button
                                        className="job-details-btn"
                                        onClick={() => viewJobs(job.id)}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Careers;
