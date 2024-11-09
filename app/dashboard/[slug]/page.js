"use client";
import { useAuth } from '@/components/AuthContext';
import CreateCourse from '@/components/dashboard/createcourse/CreateCourse';
import CreatePost from '@/components/dashboard/createpost/CreatePost';
import Events from '@/components/dashboard/events/Events';
import Faculties from '@/components/dashboard/faculties/Faculties';
import AdminGallery from '@/components/dashboard/gallery/AdminGallery';
import ReviewCourse from '@/components/dashboard/reviewcourse/ReviewCourse';
import ReviewEvent from '@/components/dashboard/reviewevent/ReviewEvent';
import ReviewPost from '@/components/dashboard/reviewpost/ReviewPost';
import UserTable from '@/components/dashboard/users/UserTable';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GridLoader } from 'react-spinners';

const DashboardPage = () => {
  const { loading, logged } = useAuth();  // Check your useAuth logic to ensure this returns the correct value
  const router = useRouter();
  const { slug } = useParams();

  const validSlugs = [
    'users', 'create-post', 'review-post', 
    'create-course', 'review-course', 'events', 
    'review-event', 'gallery', 'faculties'
  ];


  useEffect(() => {
     if (!slug || !validSlugs.includes(slug)) {
      // Redirect to dashboard if slug is invalid
      router.push('/dashboard');
    }
  }, [slug, router]);



  return (
    <div className="dashboard-main-content">
      {slug === 'users' && <UserTable />}
      {slug === 'create-post' && <CreatePost />}
      {slug === 'review-post' && <ReviewPost />}
      {slug === 'create-course' && <CreateCourse />}
      {slug === 'review-course' && <ReviewCourse />}
      {slug === 'events' && <Events />}
      {slug === 'review-event' && <ReviewEvent />}
      {slug === 'gallery' && <AdminGallery />}
      {slug === 'faculties' && <Faculties />}
    </div>
  );
};

export default DashboardPage;
