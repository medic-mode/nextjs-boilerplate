import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import './DashboardLayout.css'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ReviewPost from './reviewpost/ReviewPost';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Check screen width on component mount
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <div className="dashboard-layout">
      <div className={`dashboard ${!sidebarOpen ? 'closed' : ''}`}>
        <Sidebar />
      </div>
      
      <div className={`dashboard-main ${!sidebarOpen ? '' : 'shifted'}`}>
        <div className="slider-arrow" onClick={toggleSidebar}>
          {sidebarOpen ? (
            <KeyboardDoubleArrowLeftIcon className="left-arrow-icon" />
          ) : (
            <KeyboardDoubleArrowRightIcon className="right-arrow-icon" />
          )}
        </div>
        <div className="children">
        {children || <ReviewPost />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
