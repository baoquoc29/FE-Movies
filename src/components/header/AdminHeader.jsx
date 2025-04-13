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
  return (
    <header className={`admin-header ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="admin-header__container">
        <div className="admin-header__search">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
          />
        </div>

        <div className="admin-header__actions">
          {/* Notifications */}
          <div className="notification-wrapper">
            <button 
              className="action-button"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <MdNotifications />
              <span className="notification-badge">5</span>
            </button>

            {showNotifications && (
              <div className="dropdown-menu notifications-menu">
                <h3>Thông báo</h3>
                <div className="notification-list">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="notification-item">
                      <div className="notification-icon">
                        <MdMovie />
                      </div>
                      <div className="notification-content">
                        <p>Phim mới đã được thêm vào</p>
                        <span>2 giờ trước</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="view-all">Xem tất cả thông báo</button>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="profile-wrapper">
            <button 
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-info">
                {userData ? (
                  
                  <>
                    <img src={userData.avatar || defaultAvatar} alt="Avatar" className="avatar"/>
                    <span className="name">{userData.username}</span>
                    <span className="role">Quản trị viên</span>
                  </>
                ) : (
                  <>
                    <span className="name">Admin Name</span>
                    <span className="role">Administrator</span>
                  </>
                )}
              </div>
            </button>

            {showProfileMenu && (
              <div className="dropdown-menu profile-menu">
                <div className="menu-header">
                  <img
                    src="/default-avatar.jpg"
                    alt="Admin"
                    className="avatar"
                  />
                  <div>
                    <h4>Admin Name</h4>
                    <span>admin@example.com</span>
                  </div>
                </div>
                
                <div className="menu-items">
                  <button className="menu-item">
                    <MdPerson />
                    <span>Thông tin cá nhân</span>
                  </button>
                  <button className="menu-item">
                    <MdSettings />
                    <span>Cài đặt</span>
                  </button>
                  <button className="menu-item">
                    <MdHelp />
                    <span>Trợ giúp</span>
                  </button>
                  <div className="divider"></div>
                  <button className="menu-item logout">
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
