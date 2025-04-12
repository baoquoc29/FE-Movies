import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.scss';
import logo from '../../assets/tmovie.png';
import LoginModal from '../../pages/account/LoginModal';
import RegisterModal from '../../pages/account/RegisterModal';
import defaultAvatar from '../../assets/avt.jpg';
import { FaUser, FaHeart, FaList, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';
import ChangePasswordModal from "../../pages/account/ChangePasswordModal";
import SearchBar from "./SearchBar";
import {searchMovies, moviesNew, moviesPopular, moviesTopRated,countryMovies} from "../../Redux/actions/MovieThunk";
import {useDispatch} from "react-redux";
import {getUserByUsername} from "../../Redux/actions/UserThunk";
const Header = () => {
    const [countries, setCountries] = useState([]);
    const headerNav = [
        { display: 'Trang chủ', path: '/' },
        { display: 'Chủ đề', path: '/movie' },
        { display: 'Hội viên', path: '/membership' },
        {
            display: 'Quốc gia',
            path: '/#',
            dropdown: countries.length > 0 ? countries.map((country) => ({
                display: country,
            })) : []
        },
        { display: 'Diễn viên', path: '/tv' },
        { display: 'Thành viên', path: '/#' }
    ];
    const { pathname } = useLocation();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const headerRef = useRef(null);
    const active = headerNav.findIndex(e => e.path === pathname);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const [data,setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem('USER_LOGIN');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [user, setUser] = useState({});
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    useEffect(() => {
        const getList = async () => {
            try {
                setLoading(true);
                const response = await dispatch(searchMovies({size : 100}));
                if (response && response.content) {
                    setData(response);
                } else {
                    console.log("Không có dữ liệu trả về từ API");
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                console.error("Đã xảy ra lỗi:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        const getCountries = async () => {
            try {
                setLoading(true);
                let response = await dispatch(countryMovies());
                if (response) {
                    setCountries(response);
                } else {
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                console.error("Đã xảy ra lỗi:", error);
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        };
        getCountries();
        getList();
    }, []);
    useEffect(() => {
        const getInformationUser = async () => {
            try {
                setLoading(true);
                const response = await dispatch(getUserByUsername(userData.username));
                if (response) {
                    setUser(response);
                } else {
                    console.log("Không có dữ liệu trả về từ API");
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                console.error("Đã xảy ra lỗi:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (userData?.username) {
            getInformationUser();
        }

        // Thêm event listener để cập nhật khi balance thay đổi
        const handleBalanceUpdate = () => {
            if (userData?.username) {
                getInformationUser();
            }
        };

        window.addEventListener('balanceUpdated', handleBalanceUpdate);

        return () => {
            window.removeEventListener('balanceUpdated', handleBalanceUpdate);
        };
    }, [userData?.username, dispatch]);

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
                        <img src={logo} alt="logo"/>
                        <Link to="/">Movies Faster</Link>
                    </div>
                    <SearchBar data={data} />
                    <ul className="header__nav">
                        {headerNav.map((e, i) => (
                            <li
                                key={i}
                                className={i === active ? 'active' : ''}
                                style={{position: 'relative'}}
                                onClick={() => {
                                    if (e.display === 'Quốc gia') {
                                        setActiveDropdown(activeDropdown === 'Quốc gia' ? null : 'Quốc gia');
                                    }
                                    if(e.display === 'Trang chủ'){
                                        window.location.href = '/';
                                    }
                                    if(e.display === 'Hội viên'){
                                        window.location.href = '/membership';
                                    }
                                    if(e.display === 'Diễn viên'){
                                        window.location.href = '/actors';
                                    }

                                }}
                            >
                                {e.display === 'Thành viên' ? (
                                    userData ? (
                                        <div className="dropdown">
                                            <button className="dropbtn" onClick={toggleDropdown}>
                                                <img src={userData.avatar || defaultAvatar} alt="Avatar"
                                                     className="avatar"/>
                                                {userData.fullName}
                                            </button>
                                            <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
                                                <div style={{
                                                    padding: '10px',
                                                    borderBottom: '1px solid #ddd',
                                                    fontWeight: 'bold'
                                                }}>
                                                    Số dư: {user?.balance?.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }) || '0 ₫'}
                                                </div>
                                                {user?.vipExpireDate && new Date(user.vipExpireDate) > new Date() && (
                                                    <div style={{
                                                        padding: '10px',
                                                        borderBottom: '1px solid #ddd',
                                                        color: 'red',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        VIP còn
                                                        đến: {new Date(user.vipExpireDate).toLocaleDateString('vi-VN')}
                                                    </div>
                                                )}
                                                <Link to="#" onClick={toggleChangePasswordModal}
                                                      style={{display: 'flex', alignItems: 'center'}}>
                                                    <FaUser style={{marginRight: '10px'}}/>
                                                    Đổi mật khẩu
                                                </Link>
                                                <Link to="/favortie">
                                                    <FaHeart style={{marginRight: '10px'}}/>
                                                    Yêu thích
                                                </Link>
                                                <Link to="/payment">
                                                    <FaMoneyBillWave style={{marginRight: '10px'}}/>
                                                    Nạp tiền
                                                </Link>
                                                <a href="#" onClick={handleLogout}>
                                                    <FaSignOutAlt style={{marginRight: '10px'}}/>
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
                                    <>
                                        {/* Add the clickable button for displaying dropdown */}
                                        <button
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'white',
                                                fontSize: '16px',
                                                cursor: 'pointer',
                                                display: 'inline-block',
                                            }}
                                            onClick={() => {
                                                if (e.display === 'Quốc gia') {
                                                    setActiveDropdown(activeDropdown === 'Quốc gia' ? null : 'Quốc gia');
                                                }
                                            }}
                                        >
                                            {e.display} {e.display === 'Quốc gia' && e.dropdown && ' ▾'}
                                        </button>

                                        {/* Hiển thị dropdown nếu là "Quốc gia" và có dropdown */}
                                        {e.display === 'Quốc gia' && e.dropdown && activeDropdown === 'Quốc gia' && (
                                            <div
                                                className="dropdown-menu"
                                                style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                                    borderRadius: '6px',
                                                    padding: '8px 0',
                                                    backgroundColor: 'black',
                                                    minWidth: '160px',
                                                    zIndex: 1000
                                                }}
                                            >
                                                {e.dropdown.map((child, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={child.path}
                                                        className="dropdown-item"
                                                        to={`/search/country/${encodeURIComponent(child.display)}`}
                                                        style={{
                                                            display: 'block',
                                                            padding: '8px 16px',
                                                            textDecoration: 'none',
                                                            fontSize: '14px',
                                                            color: 'white',
                                                            transition: 'background 0.3s',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        onClick={() => {
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        {child.display}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
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
