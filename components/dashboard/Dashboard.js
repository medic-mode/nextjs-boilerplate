"use client"; // To indicate that this component is client-side rendered

import { useState } from 'react';
import './Dashboard.css';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Link from 'next/link';

const Dashboard = () => {


  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
      <div className={`admin-blog ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className={`sidebar larger-screen`}>
          <div className="sidebar-options">
            <div className="left-arrow">
              <h2>Dashboard</h2>
            </div>
            <ul>
              <Link href="/dashboard/users" className='hover' style={{marginTop:'10px'}} onClick={() => setSidebarOpen(false)} ><li>User List</li></Link>
              <li className='list-heading'>Blogs</li>
                <ul>
                  <Link className='hover' href="/dashboard/create-post" onClick={() => setSidebarOpen(false)} ><li>New Blog</li></Link>
                  <Link className='hover' href="/dashboard/review-post" onClick={() => setSidebarOpen(false)} ><li>Blog List</li></Link>	
                </ul>
              <li className='list-heading'>Courses</li>
                <ul>
                  <Link className='hover' href="/dashboard/create-course" onClick={() => setSidebarOpen(false)} ><li>New Course</li></Link>
                  <Link className='hover' href="/dashboard/review-course" onClick={() => setSidebarOpen(false)} ><li>Course List</li></Link>
                </ul>
              <li className='list-heading'>Events</li>
                <ul>
                  <Link className='hover' href="/dashboard/events" onClick={() => setSidebarOpen(false)} ><li>New Event</li></Link>
                  <Link className='hover' href="/dashboard/review-event" onClick={() => setSidebarOpen(false)} ><li>Event List</li></Link>
                </ul>
                <li className='list-heading'>Gallery</li>  
                <ul>
                    <Link className='hover' href="/dashboard/gallery" onClick={() => setSidebarOpen(false)} ><li>Gallery</li></Link>
                </ul>
                <li className='list-heading'>Faculties</li>  
                <ul>
                    <Link className='hover' href="/dashboard/faculties" onClick={() => setSidebarOpen(false)} ><li>Faculty</li></Link>
                </ul>
            </ul>
          </div>
        </div>

        {/* Sidebar - Small Screens */}
        <div className={`sidebar smaller-screen ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className="left-arrow">
            <h2>Dashboard</h2>
            <KeyboardDoubleArrowLeftIcon 
              className="left-arrow-icon" 
              onClick={() => setSidebarOpen(false)}
            />
          </div>
          <ul>
              <Link href="/dashboard/users" className='hover' style={{marginTop:'10px'}} onClick={() => setSidebarOpen(false)} ><li>User List</li></Link>
              <li className='list-heading'>Blogs</li>
                <ul>
                  <Link className='hover' href="/dashboard/create-post" onClick={() => setSidebarOpen(false)} ><li>New Blog</li></Link>
                  <Link className='hover' href="/dashboard/review-post" onClick={() => setSidebarOpen(false)} ><li>Blog List</li></Link>	
                </ul>
              <li className='list-heading'>Courses</li>
                <ul>
                  <Link className='hover' href="/dashboard/create-course" onClick={() => setSidebarOpen(false)} ><li>New Course</li></Link>
                  <Link className='hover' href="/dashboard/review-course" onClick={() => setSidebarOpen(false)} ><li>Course List</li></Link>
                </ul>
              <li className='list-heading'>Events</li>
                <ul>
                  <Link className='hover' href="/dashboard/events" onClick={() => setSidebarOpen(false)} ><li>New Event</li></Link>
                  <Link className='hover' href="/dashboard/review-event" onClick={() => setSidebarOpen(false)} ><li>Event List</li></Link>
                </ul>
                <li className='list-heading'>Gallery</li>  
                <ul>
                    <Link className='hover' href="/dashboard/gallery" onClick={() => setSidebarOpen(false)} ><li>Gallery</li></Link>
                </ul>
                <li className='list-heading'>Faculties</li>  
                <ul>
                    <Link className='hover' href="/dashboard/faculties" onClick={() => setSidebarOpen(false)} ><li>Faculty</li></Link>
                </ul>
            </ul>
        </div>

        {/* Main Content Area */}
        <div className="admin-main">
          <div className="right-arrow">
            <KeyboardDoubleArrowRightIcon 
              className="right-arrow-icon" 
              onClick={() => setSidebarOpen(true)} 
            />
            <h2>Dashboard</h2>
          </div>
        </div>
      </div>
    
  );
};

export default Dashboard;
