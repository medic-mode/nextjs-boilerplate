"use client"
import CreateCourse from '@/components/dashboard/createcourse/CreateCourse';
import CreatePost from '@/components/dashboard/createpost/CreatePost';
import DashboardLayout from '@/components/dashboard/DashboardLayout';  
import EditCourse from '@/components/dashboard/editcourse/EditCourse';
import EditPost from '@/components/dashboard/editpost/EditPost';
import Events from '@/components/dashboard/events/Events';
import Faculties from '@/components/dashboard/faculties/Faculties';
import AdminGallery from '@/components/dashboard/gallery/AdminGallery';
import ReviewCourse from '@/components/dashboard/reviewcourse/ReviewCourse';
import ReviewEvent from '@/components/dashboard/reviewevent/ReviewEvent';
import ReviewPost from '@/components/dashboard/reviewpost/ReviewPost';
import UserTable from '@/components/dashboard/users/UserTable';
import { useParams } from 'next/navigation'; 

const DashboardPage = () => {

    const { slug } = useParams();
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
