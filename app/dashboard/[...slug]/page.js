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

  const {setLoading, logged} = useAuth()
  const router = useRouter();

    const { slug } = useParams();

    const baseRoute = slug ? `${slug[0]}/${slug[1]}` : '';

    const validSlugs = ['review-post/edit-post', 'review-course/edit-course', 'review-event/edit-event'];

    useEffect(() => {
     
      if (!slug || !validSlugs.includes(baseRoute)) {
        // Redirect to dashboard if slug is invalid
        router.push('/dashboard');
      }
    }, [ slug, router]);


    useEffect(() => {
      if (logged === false) {
        router.push('/');
      }
    }, [logged, router]);

  return (
    
    <div className="dashboard-main-content">
        {baseRoute  === 'review-post/edit-post' && <EditPost />}
        {baseRoute  === 'review-course/edit-course' && <EditCourse />}
        {baseRoute  === 'review-event/edit-event' && <EditEvent />}

    </div>
  );
};



export default DashboardPage;
