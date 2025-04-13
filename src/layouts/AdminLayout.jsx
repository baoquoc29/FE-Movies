import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import AdminHeader from '../components/header/AdminHeader';
import './adminLayout.scss';

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`admin-layout__wrapper ${isCollapsed ? 'collapsed' : ''}`}>
        <AdminHeader isCollapsed={isCollapsed} />
        <main className="admin-layout__main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 