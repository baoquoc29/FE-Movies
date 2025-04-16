import { Link, useLocation } from 'react-router-dom';
import { 
  MdDashboard,
  MdMovie,
  MdList,

  MdMenu,
  MdChevronRight,
  MdAdd,
  MdHome,
  MdLogout
} from 'react-icons/md';
import './sidebar.scss';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; // Redirect to home page after logout
  };
  const menuItems = [
    {
      title: 'Quản lý Phim',
      icon: <MdMovie />,
      children: [
        {
          path: '/admin/movies',
          name: 'Danh sách phim',
          icon: <MdList />
        },
        {
          path: '/admin/movies/create',
          name: 'Thêm phim mới',
          icon: <MdAdd />
        }
      ]
    },
    {
      title: 'Quản lý Thể loại',
      icon: <MdList />,
      children: [
        {
          path: '/admin/genres',
          name: 'Danh sách thể loại',
          icon: <MdList />
        }
      ]
    }
  ];

  const bottomMenuItems = [
    {
      title: 'Tài khoản',
      items: [
        {
          path: '/',
          name: 'Trang chủ',
          icon: <MdHome />
        },
        {
          name: 'Đăng xuất',
          icon: <MdLogout />
        }
      ]
    }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="logo">
          <MdMovie className="logo-icon" />
          {!isCollapsed && <span>Admin Panel</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <MdChevronRight /> : <MdMenu />}
        </button>
      </div>

      <div className="sidebar__content">
        <Link 
          to="/admin/dashboard" 
          className={`sidebar__item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
        >
          <MdDashboard />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        {menuItems.map((section, index) => (
          <div key={index} className="sidebar__section">
            {!isCollapsed && <div className="section-title">{section.title}</div>}
            {section.children.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar__item ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        ))}

        {bottomMenuItems.map((section, index) => (
          <div key={index} className="sidebar__section bottom-section">
            {!isCollapsed && <div className="section-title">{section.title}</div>}
            {section.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar__item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={item.name === 'Đăng xuất' ? handleLogout : null}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
