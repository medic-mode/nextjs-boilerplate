"use client";
import { useAuth } from '@/components/AuthContext';
import CreateCourse from '@/components/dashboard/createcourse/CreateCourse';
import CreateJobs from '@/components/dashboard/createjobs/CreateJobs';
import CreatePost from '@/components/dashboard/createpost/CreatePost';
import Events from '@/components/dashboard/events/Events';
import Faculties from '@/components/dashboard/faculties/Faculties';
import AdminGallery from '@/components/dashboard/gallery/AdminGallery';
import ReviewCourse from '@/components/dashboard/reviewcourse/ReviewCourse';
import ReviewEvent from '@/components/dashboard/reviewevent/ReviewEvent';
import ReviewJob from '@/components/dashboard/reviewjob/ReviewJob';
import ReviewPost from '@/components/dashboard/reviewpost/ReviewPost';
import UserTable from '@/components/dashboard/users/UserTable';
import PaymentHistory from '@/components/paymenthistory/PaymentHistory';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GridLoader } from 'react-spinners';

const DashboardPage = () => {
  const { loading, logged, setLoading } = useAuth();  // Check your useAuth logic to ensure this returns the correct value
  const router = useRouter();
  const { slug } = useParams();

  

  const validSlugs = [
    'users', 'create-post', 'review-post', 
    'create-course', 'review-course', 'events', 'create-job', 'review-job',
    'review-event', 'gallery', 'faculties'
  ];


  useEffect(() => {
     if (!slug || !validSlugs.includes(slug)) {
      // Redirect to dashboard if slug is invalid
      router.push('/dashboard');
    }
  }, [slug, router]);

  useEffect(() => {
    setLoading(false)

    // Only redirect if not logged and loading is false
    if (!loading && !logged) {
      router.push('/');
    }
  }, [loading, logged, router]);

  if (loading) {
    // Show the loader if loading is true
    return (
      <div className="loading-container">
        <GridLoader color={"#0A4044"} loading={loading} size={10} />
      </div>
    );
  }


  return (
    <div className="dashboard-main-content">
      {slug === 'users' && <UserTable />}
      {slug === 'create-post' && <CreatePost />}
      {slug === 'review-post' && <ReviewPost />}
      {slug === 'create-course' && <CreateCourse />}
      {slug === 'review-course' && <ReviewCourse />}
      {slug === 'events' && <Events />}
      {slug === 'review-event' && <ReviewEvent />}
      {slug === 'create-job' && <CreateJobs />}
      {slug === 'review-job' && <ReviewJob />}
      {slug === 'gallery' && <AdminGallery />}
      {slug === 'faculties' && <Faculties />}
    </div>
  );
};

export default DashboardPage;
