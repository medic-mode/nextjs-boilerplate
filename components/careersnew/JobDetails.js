'use client'
import React, { useEffect, useState } from 'react';
import './JobDetails.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import ApplyForm from './ApplyForm';
import { Toaster } from 'sonner';

const JobDetails = ({ slug }) => {
  const [jobData, setJobData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, 'jobs', slug); // Use the slug directly
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setJobData({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching job data: ', error);
      }
    };

    fetchJob();
  }, [slug]);

  function toTitleCase(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  const handleApplyClick = () => {
    setIsModalOpen(true); // Open the modal when the button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const jobTitle = jobData?.jobTitle; // Use optional chaining to handle null jobData

  return (
    <div className="job-details-container">
      <Toaster position="top-center" richColors />
      {jobData ? (
        <div className="job-details">
          <h2>{toTitleCase(jobData.jobTitle)}</h2>
          <div className="job-short-details">
            <p>
              <LocationOnIcon style={{ fontSize: '17px' }} />
              {toTitleCase(`${jobData.city}, ${jobData.state}, ${jobData.country}`)}
            </p>
            <p>
              <AccessTimeIcon style={{ fontSize: '15px' }} />
              {toTitleCase(jobData.jobType)}
            </p>
          </div>
          <div className="job-descriptions">
            <h2>Job Description</h2>
            <div className="job-content">
              <div dangerouslySetInnerHTML={{ __html: jobData.content }} />
            </div>
          </div>
          <button className="apply-now-btn" onClick={handleApplyClick}>
            Apply Now
          </button>
        </div>
      ) : (
        <p>Loading job details...</p>
      )}
      <ApplyForm isOpen={isModalOpen} onClose={handleCloseModal} jobTitle={jobTitle} />
    </div>
  );
};

export default JobDetails;
