import React, { useState } from 'react';
import { 
  MdSearch, 
  MdNotifications, 
  MdPerson, 
  MdLogout,
  MdSettings,
  MdHelp,
  MdMovie
} from 'react-icons/md';
import './adminHeader.scss';
import defaultAvatar from '../../assets/avt.jpg';

const AdminHeader = ({ isCollapsed }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('USER_LOGIN');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const handleLogout = () => {
    localStorage.clear();
    setUserData(null);
    window.location.href = '/'; // Redirect to home page after logout
};
  return (
    <header className={`admin-header ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="admin-header__container">


        <div className="admin-header__actions">

          {/* Profile */}
          <div className="profile-wrapper">
            <button 
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-info">
                {userData ? (
                  
                  <>
                    <img src={userData?.avatar || defaultAvatar} alt="Avatar" className="avatar" style={{margin: 0}}/>
                    <span className="name">{userData?.fullName}</span>
                  </>
                ) : (
                  <>
                    <button className="login-button">
                      Đăng nhập
                    </button>
                  </>
                )}
              </div>
            </button>

            {showProfileMenu && (
              <div className="dropdown-menu profile-menu">
                <div className="menu-header">
                <img src={userData?.avatar || defaultAvatar} alt="Avatar" className="avatar" style={{margin: 0}}/>
                  <div>
                    <h4>{userData?.fullName}</h4>
                    <span>{userData?.email}</span>
                  </div>
                </div>
                
                <div className="menu-items">
                  <button className="menu-item logout" onClick={handleLogout}>
                    <MdLogout />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
