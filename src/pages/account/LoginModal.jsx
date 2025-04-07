import React, { useState } from 'react';

import { loginUser } from '../../Redux/actions/UserThunk';
import { useDispatch } from 'react-redux';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    // Reset state when modal is closed
    const handleClose = () => {
        setFormData({
            username: '',
            password: '',
            rememberMe: false
        });
        setError('');
        setIsLoading(false);
        onClose();
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngừng hành động mặc định của form

        setError(''); // Reset lỗi cũ

        if (!formData.username || !formData.username.trim()) {
            setError('Vui lòng nhập tên đăng nhập');
            return;
        }

        if (!formData.password) {
            setError('Vui lòng nhập mật khẩu');
            return;
        }

        setIsLoading(true); // Hiển thị loading khi xử lý đăng nhập

        try {
            await dispatch(loginUser(formData.username, formData.password));

            // Kiểm tra token trong localStorage sau khi đăng nhập
            const token = localStorage.getItem('accessToken');
            if (token) {
                handleClose(); // Đóng modal khi đăng nhập thành công
                window.location.reload(); // Tải lại trang
            } else {
                setError('Đăng nhập thất bại. Vui lòng kiểm tra tên đăng nhập và mật khẩu.');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false); // Ẩn loading khi xử lý xong
        }
    };


    return (
        <div className="login-modal">
            <div className="login-modal__overlay" onClick={handleClose}></div>
            <div className="login-modal__content">
                <h2 className="login-modal__title">Đăng nhập</h2>
                <button className="login-modal__close" onClick={handleClose}>
                    &times;
                </button>

                {error && (
                    <div className="login-form__error">
                        {error}
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-form__group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Nhập tên đăng nhập"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="login-form__group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="login-form__options">
                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
                        </div>
                        <a href="#" className="forgot-password">Quên mật khẩu?</a>
                    </div>
                    <button
                        type="submit"
                        className="login-form__submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                    <div className="login-form__register">
                        Chưa có tài khoản? <a href="#" onClick={(e) => {
                        e.preventDefault();
                        onSwitchToRegister();
                    }}>Đăng ký ngay</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
