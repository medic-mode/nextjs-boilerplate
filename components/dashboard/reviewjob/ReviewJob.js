"use client"
import React, { useEffect, useState } from 'react'
import './Reviewjob.css'
import { db } from '../../../lib/firebase'; // Adjust the path as necessary
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { GridLoader } from 'react-spinners';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

const ReviewJob = () => {

  const {loading, setLoading} = useAuth();
  const [jobs, setJobs] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState({});
  const [approvedJobs, setApprovedJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'jobs'));
        const jobs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setJobs(jobs);

        // Initialize approval status and approved posts
        const initialApprovalStatus = {};
        const approvedList = []; // Temporary array to hold approved posts

        jobs.forEach((job) => {
          initialApprovalStatus[job.id] = job.approved === true;
          if (initialApprovalStatus[job.id]) {
            approvedList.push(job); 
          }
        });

        setApprovalStatus(initialApprovalStatus);
        setApprovedJobs(approvedList);
      } catch (error) {
        console.error('Error fetching courses: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [setLoading]);

  const handleApprovalChange = async (jobId) => {
    const isApproved = approvalStatus[jobId];
    const newApprovalStatus = !isApproved;

    setApprovalStatus((prevState) => ({
      ...prevState,
      [jobId]: newApprovalStatus,
    }));

    const approvedJob = jobs.find((job) => job.id === jobId);
    if (approvedJob) {
      if (newApprovalStatus && !approvedJobs.includes(approvedJob)) {
        setApprovedJobs((prevApproved) => [...prevApproved, approvedJob]);
      } else if (!newApprovalStatus) {
        setApprovedJobs((prevApproved) => prevApproved.filter((job) => job.id !== jobId));
      }

      try {
        await updateDoc(doc(db, 'jobs', jobId), {
          approved: newApprovalStatus,
        });
      } catch (error) {
        console.error('Error updating course approval status: ', error);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return 'N/A';
    }
    if (date.seconds) {
      return formatDateString(new Date(date.seconds * 1000));
    }
    return formatDateString(new Date(date));
  };

  const formatDateString = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'jobs', jobId));
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      } catch (error) {
        console.error('Error deleting course: ', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <GridLoader color={"#0A4044"} loading={loading} size={10} />
      </div>
    );
  }

  return (
    <div className="review-course-container">
      <h1>Review Jobs</h1>
      {jobs.length > 0 ? (
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date Created</th>
                <th>Job Title</th>
                <th>Job Type</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Experience</th>
                <th colSpan="2">Description</th>
                <th colSpan="2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={job.id}>
                  <td>{index + 1}</td>
                  <td>{formatDate(job.createdAt)}</td>
                  <td>{job.jobTitle}</td>
                  <td>{job.jobType}</td>
                  <td>{job.city}</td>
                  <td>{job.state}</td>
                  <td>{job.country}</td>
                  <td>{job.experience}</td>
                  <td>
                    <Link href={`/careers/${job.id}`}>
                      View job
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={{
                        pathname: "/dashboard/review-job/edit-job",
                        query: { id: job.id },
                      }}
                    >
                      Edit job
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleApprovalChange(job.id)}
                      className={`approve-btn ${approvalStatus[job.id] ? 'approved' : 'pending'}`}
                    >
                      {approvalStatus[job.id] ? 'Approved' : 'Approve'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(job.id)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No jobs found.</div>
      )}
    </div>
  );
}

export default ReviewJob;
