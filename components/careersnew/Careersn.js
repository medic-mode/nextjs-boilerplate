// Careers.js
'use client'
import './Careersn.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Link from 'next/link';

const Careers = () => {


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
    return (
        <div className="job-list-container">
            <h1>Our Current <span style={{ color: 'var(--orange)' }}>Openings</span></h1>
            <div className="job-list">
                {filteredJobs.map((job) => (
                    <div className="jobs" key={job.id}>
                        <h2>{job.jobTitle}</h2>
                        <p className='job-posted'>{formatDate(job.createdAt)}</p>
                        <p className='job-location'><LocationOnIcon style={{fontSize:'18px'}}/> {job.city}, {job.state}, {job.country}</p>
                        <p className='job-type'><AccessTimeIcon style={{fontSize:'14px'}}/> {job.jobType}</p>
                        <Link href={`/careers/${job.id}`}>
                            <button className='job-details-btn'>Apply</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Careers;
