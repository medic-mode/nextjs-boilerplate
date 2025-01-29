'use client'
import React, { useEffect, useState } from 'react';
import './JobDetails.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ApplyForm from './ApplyForm';
import { Toaster } from 'sonner';
import { GridLoader } from 'react-spinners';
import { useAuth } from '../AuthContext';

const JobDetails = ({ slug }) => {
  const [jobData, setJobData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { loading } = useAuth()

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

  const handleApplyClick = () => {
    setIsModalOpen(true); // Open the modal when the button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Ensure the jobTitle is available before rendering ApplyForm
  const jobTitle = jobData?.jobTitle;

  return (
    <div className="job-details-container">
      <Toaster position="top-center" richColors />
      {jobData ? (
        <div className="job-details">
          <h2>{jobTitle}</h2>
          <div className="job-short-details">
            <p>
              <LocationOnIcon style={{ fontSize: '17px' }} />
              {jobData.city}, {jobData.state}, {jobData.country}
            </p>
            <p>
              <AccessTimeIcon style={{ fontSize: '15px' }} />
              {jobData.jobType}
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
        <div className="loading-container">
          <GridLoader color={"#0A4044"} loading={loading} size={10} />
        </div>
      )}

      {/* Pass jobTitle only after jobData is loaded */}
      {jobData && <ApplyForm isOpen={isModalOpen} onClose={handleCloseModal} jobTitle={jobTitle} />}
    </div>
  );
};

export default JobDetails;
