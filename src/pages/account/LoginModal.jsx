import React, { useState } from 'react';
import { loginUser, sendEmailForgot } from '../../Redux/actions/UserThunk';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const handleClose = () => {
        setFormData({
            username: '',
            password: '',
            rememberMe: false
        });
        setError('');
        setIsLoading(false);
        setShowForgotPassword(false);
        setEmail('');
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
        e.preventDefault();
        setError('');

        if (!formData.username?.trim()) {
            setError('Vui lòng nhập tên đăng nhập');
            return;
        }

        if (!formData.password) {
            setError('Vui lòng nhập mật khẩu');
            return;
        }

        setIsLoading(true);

        try {
            await dispatch(loginUser(formData.username, formData.password));

            const token = localStorage.getItem('accessToken');
            const userData = localStorage.getItem('USER_LOGIN');
            const user = userData ? JSON.parse(userData) : null;

            if (token && user) {
                if (user.role === "ADMIN") {
                    window.location.href = "/admin/dashboard";
                } else {
                    handleClose();
                    window.location.reload();
                }
            } else {
                setError('Đăng nhập thất bại. Vui lòng kiểm tra tên đăng nhập và mật khẩu.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Vui lòng nhập email');
            return;
        }

        setIsLoading(true);

        try {
            const result = await dispatch(sendEmailForgot(email));
            const isSuccess = result === 200;

            Swal.fire({
                title: isSuccess ? 'Đã gửi yêu cầu đặt lại mật khẩu' : 'Gửi yêu cầu thất bại',
                text: isSuccess
                    ? 'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hòm thư.'
                    : 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.',
                icon: isSuccess ? 'success' : 'error',
                confirmButtonText: isSuccess ? 'Đã hiểu' : 'Thử lại',
                showCancelButton: !isSuccess,
                cancelButtonText: 'Để sau'
            }).then((swalResult) => {
                if (isSuccess && swalResult.isConfirmed) {
                    setShowForgotPassword(false);
                    setEmail('');
                }
            });
        } catch (err) {
            console.error('Forgot password error:', err);
            setError('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const switchToForgotPassword = (e) => {
        e.preventDefault();
        setShowForgotPassword(true);
        setError('');
    };

    const switchToLogin = (e) => {
        e.preventDefault();
        setShowForgotPassword(false);
        setError('');
    };

    return (
        <div className="login-modal">
            <div className="login-modal__overlay" onClick={handleClose}></div>
            <div className="login-modal__content">
                <h2 className="login-modal__title">
                    {showForgotPassword ? 'Khôi phục mật khẩu' : 'Đăng nhập'}
                </h2>
                <button className="login-modal__close" onClick={handleClose}>
                    &times;
                </button>

                {error && (
                    <div className="login-form__error">
                        {error}
                    </div>
                )}

                {showForgotPassword ? (
                    <form className="login-form" onSubmit={handleForgotPasswordSubmit}>
                        <div className="login-form__group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Nhập email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="login-form__submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                        </button>
                        <div className="login-form__register">
                            <a href="#" onClick={switchToLogin}>
                                Quay lại đăng nhập
                            </a>
                        </div>
                    </form>
                ) : (
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
                            <a href="#" className="forgot-password" onClick={switchToForgotPassword}>
                                Quên mật khẩu?
                            </a>
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
                )}
            </div>
        </div>
    );
};

export default LoginModal;