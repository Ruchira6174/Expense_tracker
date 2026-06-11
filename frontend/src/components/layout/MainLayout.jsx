import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  // State to manage sidebar visibility on smaller screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="main-wrapper">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="main-content">
          {/* Outlet renders the nested child route components (e.g., Dashboard, Expenses) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
