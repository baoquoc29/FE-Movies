import React from 'react';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    if (!isOpen) return null;

    return (
        <div className="login-modal">
            <div className="login-modal__overlay" onClick={onClose}></div>
            <div className="login-modal__content">
                <h2 className="login-modal__title">Đăng ký</h2>
                <button className="login-modal__close" onClick={onClose}>
                    &times;
                </button>
                <form className="login-form">
                    <div className="login-form__group">
                        <label htmlFor="register-username">Tên tài khoản</label>
                        <input
                            type="text"
                            id="register-username"
                            placeholder="Nhập tên tài khoản"
                        />
                    </div>
                    <div className="login-form__group">
                        <label htmlFor="register-email">Email</label>
                        <input
                            type="email"
                            id="register-email"
                            placeholder="Nhập email"
                        />
                    </div>
                    <div className="login-form__group">
                        <label htmlFor="register-password">Mật khẩu</label>
                        <input
                            type="password"
                            id="register-password"
                            placeholder="Nhập mật khẩu"
                        />
                    </div>
                    <button type="submit" className="login-form__submit">Đăng ký</button>
                    <div className="login-form__register">
                        Đã có tài khoản? <a href="#" onClick={(e) => {
                        e.preventDefault();
                        onSwitchToLogin();
                    }}>Đăng nhập</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;