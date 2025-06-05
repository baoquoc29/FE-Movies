import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaCommentAlt, FaRobot } from 'react-icons/fa';

import { OutlineButton } from '../components/button/Button';
import HeroSlide from '../components/hero-slide/HeroSlide';
import MovieList from '../components/movie-list/MovieList';
import ChatBox from "../components/ChatBox";

const Home = () => {
    const [showChatBox, setShowChatBox] = useState(false);
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem('USER_LOGIN');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const toggleChatBox = () => {
        if (userData === null) {
            Swal.fire({
                title: 'Thông báo',
                text: 'Vui lòng đăng nhập để sử dụng tính năng hỗ trợ!',
                icon: 'warning',
                confirmButtonText: 'Đăng nhập',
                showCancelButton: true,
                cancelButtonText: 'Để sau',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'swal-confirm-button',
                    cancelButton: 'swal-cancel-button'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/login';
                }
            });
            return;
        }
        setShowChatBox(!showChatBox);
    };

    return (
        <>
            <HeroSlide/>
            <div className="container">
                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Phim mới</h2>
                    </div>
                    <MovieList type={"similar"} page={1} />
                </div>

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Phim Nổi Bật</h2>
                    </div>
                    <MovieList type={"popular"} page={2} />
                </div>

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Top Phim Hay</h2>
                    </div>
                    <MovieList type={"top-rated"} page={3} />
                </div>

                {/* Floating Chat Button */}
                {!showChatBox && (
                    <div
                        className="floating-chat-button"
                        onClick={toggleChatBox}
                        title="Hỗ trợ trực tuyến"
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#3b82f6', // Màu xanh dương (thay = #8b5cf6 nếu thích tím)
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // Đổ bóng đậm hơn để nổi trên nền đen
                            zIndex: 1000,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <FaCommentAlt style={{color: 'white', fontSize: '24px'}}/>
                        {userData && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    backgroundColor: '#f59e0b', // Màu vàng cho thông báo
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <FaRobot style={{color: 'black', fontSize: '12px'}}/> {/* Icon màu đen để tương phản */}
                            </div>
                        )}
                    </div>
                )}

                <ChatBox
                    showChatBox={showChatBox}
                    toggleChatBox={toggleChatBox}
                />
            </div>
        </>
    );
}

export default Home;