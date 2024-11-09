"use client" 
import { useAuth } from '@/components/AuthContext';
import EditCourse from '@/components/dashboard/editcourse/EditCourse';
import EditEvent from '@/components/dashboard/editevent/EditEvent';
import EditPost from '@/components/dashboard/editpost/EditPost';
import { useParams } from 'next/navigation'; 
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GridLoader } from 'react-spinners';

const DashboardPage = () => {

  const {loading} = useAuth()
  const router = useRouter();

    const { slug } = useParams();
    const route = slug.join('/');

    const validSlugs = ['review-post/edit-post', 'review-course/edit-course', 'review-event/edit-event'];

    useEffect(() => {
      if (logged === false) {
        // Redirect if not logged in
        router.push('/');
      } else if (!slug || !validSlugs.includes(slug)) {
        // Redirect to dashboard if slug is invalid
        router.push('/dashboard');
      }
    }, [logged, slug, router]);

  return (
    <div className="dashboard-main-content">
        {route === 'review-post/edit-post' && <EditPost />}
        {route === 'review-course/edit-course' && <EditCourse />}
        {route === 'review-event/edit-event' && <EditEvent />}

        {(!slug || !validSlugs.includes(slug)) && (
          <div className="loading-container">
            <GridLoader color={"#0A4044"} loading={loading} size={10} />
          </div>
        )}
    </div>
  );
};



export default DashboardPage;
