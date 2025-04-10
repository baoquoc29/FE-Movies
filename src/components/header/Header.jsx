import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.scss';
import logo from '../../assets/tmovie.png';
import LoginModal from '../../pages/account/LoginModal';
import RegisterModal from '../../pages/account/RegisterModal';
import defaultAvatar from '../../assets/avt.jpg';
import { FaUser, FaHeart, FaList, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';
import ChangePasswordModal from "../../pages/account/ChangePasswordModal";

const headerNav = [
    { display: 'Trang chủ', path: '/' },
    { display: 'Chủ đề', path: '/movie' },
    { display: 'Phim Hay', path: '/movie' },
    { display: 'TV Series', path: '/tv' },
    { display: 'Diễn viên', path: '/tv' },
    { display: 'Quốc gia', path: '/tv' },
    { display: 'Thành viên', path: '/#' }
];

const Header = () => {
    const { pathname } = useLocation();
    const headerRef = useRef(null);
    const active = headerNav.findIndex(e => e.path === pathname);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem('USER_LOGIN');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    useEffect(() => {
        const shrinkHeader = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                headerRef.current?.classList.add('shrink');
            } else {
                headerRef.current?.classList.remove('shrink');
            }
        };
        window.addEventListener('scroll', shrinkHeader);
        return () => window.removeEventListener('scroll', shrinkHeader);
    }, []);

    const handleLoginClick = (e) => {
        if (e.display === 'Thành viên') {
            setShowLoginModal(true);
            setShowRegisterModal(false);
        }
    };

    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    const closeRegisterModal = () => {
        setShowRegisterModal(false);
    };

    const switchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const switchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        setUserData(null);
    };

    // Toggle Change Password Modal
    const toggleChangePasswordModal = () => {
        setIsChangePasswordModalOpen(!isChangePasswordModalOpen);
    };

    // Toggle dropdown menu
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.dropdown')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <>
            <div ref={headerRef} className="header">
                <div className="header__wrap container">
                    <div className="logo">
                        <img src={logo} alt="logo" />
                        <Link to="/">Movies Faster</Link>
                    </div>
                    <ul className="header__nav">
                        {headerNav.map((e, i) => (
                            <li key={i} className={i === active ? 'active' : ''}>
                                {e.display === 'Thành viên' ? (
                                    userData ? (
                                        <div className="dropdown">
                                            <button className="dropbtn" onClick={toggleDropdown}>
                                                <img src={userData.avatar || defaultAvatar} alt="Avatar" className="avatar"/>
                                                {userData.fullName}
                                            </button>
                                            <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
                                                <Link to="#" onClick={toggleChangePasswordModal} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <FaUser style={{ marginRight: '10px' }} />
                                                    Đổi mật khẩu
                                                </Link>
                                                <Link to="/profile">
                                                    <FaHeart style={{ marginRight: '10px' }} />
                                                    Yêu thích
                                                </Link>
                                                <Link to="/">
                                                    <FaList style={{ marginRight: '10px' }} />
                                                    Danh sách
                                                </Link>
                                                <Link to="/payment">
                                                    <FaMoneyBillWave style={{ marginRight: '10px' }} />
                                                    Nạp tiền
                                                </Link>
                                                <a href="#" onClick={handleLogout}>
                                                    <FaSignOutAlt style={{ marginRight: '10px' }} />
                                                    Đăng xuất
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <a href="#" onClick={(evt) => {
                                            evt.preventDefault();
                                            handleLoginClick(e);
                                        }}>
                                            {e.display}
                                        </a>
                                    )
                                ) : (
                                    <Link to={e.path}>
                                        {e.display}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Modals */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={closeLoginModal}
                onSwitchToRegister={switchToRegister}
            />

            <RegisterModal
                isOpen={showRegisterModal}
                onClose={closeRegisterModal}
                onSwitchToLogin={switchToLogin}
            />

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={toggleChangePasswordModal}
            />
        </>
    );
};

export default Header;
