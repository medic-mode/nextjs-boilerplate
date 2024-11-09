import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import './DashboardLayout.css'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
        {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
