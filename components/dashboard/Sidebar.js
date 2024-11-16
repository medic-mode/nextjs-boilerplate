"use client"; // To indicate that this component is client-side rendered


import './Sidebar.css';
import Link from 'next/link';

const Sidebar = () => {

    

return( 
        <div className="sidebar-options">
            <div className="dashboard-heading">
              <h2>Dashboard</h2>
            </div> 
            <div className='sidebar-scroll'>
            <ul >
              <Link href="/dashboard/users" className='hover' style={{marginTop:'10px'}} onClick={() => setSidebarOpen(false)} ><li>User List</li></Link>
              <li className='list-heading' style={{marginTop:'10px'}}>Blogs</li>
                <ul>
                  <Link className='hover' href="/dashboard/create-post" onClick={() => setSidebarOpen(false)} ><li>New Blog</li></Link>
                  <Link className='hover' href="/dashboard/review-post" onClick={() => setSidebarOpen(false)} ><li>Blog List</li></Link>	
                </ul>
              <li className='list-heading' style={{marginTop:'10px'}}>Courses</li>
                <ul>
                  <Link className='hover' href="/dashboard/create-course" onClick={() => setSidebarOpen(false)} ><li>New Course</li></Link>
                  <Link className='hover' href="/dashboard/review-course" onClick={() => setSidebarOpen(false)} ><li>Course List</li></Link>
                </ul>
              <li className='list-heading' style={{marginTop:'10px'}}>Events</li>
                <ul>
                  <Link className='hover' href="/dashboard/events" onClick={() => setSidebarOpen(false)} ><li>New Event</li></Link>
                  <Link className='hover' href="/dashboard/review-event" onClick={() => setSidebarOpen(false)} ><li>Event List</li></Link>
                </ul>
              <li className='list-heading' style={{marginTop:'10px'}}>Careers</li>  
                <ul>
                    <Link className='hover' href="/dashboard/create-job" onClick={() => setSidebarOpen(false)} ><li>Create Job</li></Link>
                    <Link className='hover' href="/dashboard/review-job" onClick={() => setSidebarOpen(false)} ><li>Review Job</li></Link>
                </ul>
                <li className='list-heading' style={{marginTop:'10px'}}>Gallery</li>  
                <ul>
                    <Link className='hover' href="/dashboard/gallery" onClick={() => setSidebarOpen(false)} ><li>Gallery</li></Link>
                </ul>
                <li className='list-heading' style={{marginTop:'10px'}}>Faculties</li>  
                <ul>
                    <Link className='hover' href="/dashboard/faculties" onClick={() => setSidebarOpen(false)} ><li>Faculty</li></Link>
                </ul>
            </ul>
            </div>
          </div>

 )
}

export default Sidebar;

