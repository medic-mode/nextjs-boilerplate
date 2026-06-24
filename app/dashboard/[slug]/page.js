"use client";
import { useAuth } from '../../context/AuthContext';
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
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GridLoader } from 'react-spinners';

const validSlugs = [
  'users', 'create-post', 'review-post',
  'create-course', 'review-course', 'events', 'create-job', 'review-job',
  'review-event', 'gallery', 'faculties'
];

const DashboardPage = () => {
  const { loading, logged, userEmail } = useAuth(); 
  const router = useRouter();
  const { slug } = useParams();

  

  useEffect(() => {
    if (!loading) {
      if (!logged || userEmail !== 'admin@medicmode.com') {
        router.push('/');
      }
    }
  }, [loading, logged, userEmail, router]);

  useEffect(() => {
    if (!loading && logged && userEmail === 'admin@medicmode.com') {
      if (!slug || !validSlugs.includes(slug)) {
        router.push('/dashboard/users'); 
      }
    }
  }, [slug, loading, logged, userEmail, router]);

  if (loading) {
    return (
      <div className="loading-container">
        <GridLoader color={"#0A4044"} loading={loading} size={10} />
      </div>
    );
  }


  if (!logged || userEmail !== 'admin@medicmode.com') {
    return null; 
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
