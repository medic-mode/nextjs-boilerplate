"use client" 
import { useAuth } from '../../context/AuthContext';
import EditCourse from '@/components/dashboard/editcourse/EditCourse';
import EditEvent from '@/components/dashboard/editevent/EditEvent';
import EditJob from '@/components/dashboard/editjobs/EditJob';
import EditPost from '@/components/dashboard/editpost/EditPost';
import PaymentHistory from '@/components/paymenthistory/PaymentHistory';
import { useParams } from 'next/navigation'; 
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GridLoader } from 'react-spinners';

const validSlugs = ['review-post/edit-post', 'review-course/edit-course', 'review-event/edit-event', 'review-job/edit-job', 'users/payment-history'];

const DashboardPage = () => {

  const { loading, logged, userEmail } = useAuth()
  const router = useRouter();

    const { slug } = useParams();

    const baseRoute = slug ? `${slug[0]}/${slug[1]}` : '';

    useEffect(() => {
     
      if (!slug || !validSlugs.includes(baseRoute)) {
        router.push('/dashboard');
      }
    }, [baseRoute, slug, router]);


    useEffect(() => {
      if (!loading && (!logged || userEmail !== 'admin@medicmode.com')) {
        router.push('/');
      }
    }, [loading, logged, userEmail, router]);

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
        {baseRoute  === 'review-post/edit-post' && <EditPost />}
        {baseRoute  === 'review-course/edit-course' && <EditCourse />}
        {baseRoute  === 'review-event/edit-event' && <EditEvent />}
        {baseRoute  === 'review-job/edit-job' && <EditJob />}
        {baseRoute  === 'users/payment-history' && <PaymentHistory />}
    </div>
  );
};



export default DashboardPage;
