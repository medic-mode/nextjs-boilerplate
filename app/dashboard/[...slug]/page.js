"use client" 
import EditCourse from '@/components/dashboard/editcourse/EditCourse';
import EditEvent from '@/components/dashboard/editevent/EditEvent';
import EditPost from '@/components/dashboard/editpost/EditPost';
import { useParams } from 'next/navigation'; 

const DashboardPage = () => {

    const { slug } = useParams();
    const route = slug.join('/');

  return (
    <div className="dashboard-main-content">
        {route === 'review-post/edit-post' && <EditPost />}
        {route === 'review-course/edit-course' && <EditCourse />}
        {route === 'review-event/edit-event' && <EditEvent />}
    </div>
  );
};



export default DashboardPage;
