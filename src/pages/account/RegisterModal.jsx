import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../Redux/actions/UserThunk';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        gender: '',
        dateOfBirth: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    // Reset state when modal is closed
    const handleClose = () => {
        setFormData({
            username: '',
            password: '',
            fullName: '',
            email: '',
            gender: '',
            dateOfBirth: ''
        });
        setError('');
        setIsLoading(false);
        onClose();
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id.replace('register-', '')]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Validate form data
            if (!formData.username || !formData.username.trim()) {
                setError('Vui lòng nhập tên tài khoản');
                setIsLoading(false);
                return;
            }

            if (!formData.password) {
                setError('Vui lòng nhập mật khẩu');
                setIsLoading(false);
                return;
            }

            if (!formData.fullName || !formData.fullName.trim()) {
                setError('Vui lòng nhập họ và tên');
                setIsLoading(false);
                return;
            }

            if (!formData.email || !formData.email.trim()) {
                setError('Vui lòng nhập email');
                setIsLoading(false);
                return;
            }

            if (!formData.gender) {
                setError('Vui lòng chọn giới tính');
                setIsLoading(false);
                return;
            }

            if (!formData.dateOfBirth) {
                setError('Vui lòng chọn ngày sinh');
                setIsLoading(false);
                return;
            }
            console.log(formData.username,
                formData.password,
                formData.fullName,
                formData.email,
                formData.gender,
                formData.dateOfBirth);
            // Call the register action
            await dispatch(register(
                formData.username,
                formData.password,
                formData.fullName,
                formData.email,
                formData.gender,
                formData.dateOfBirth
            ));

            // If successful, close the modal
            handleClose();
        } catch (err) {
            setError('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
            console.error('Register error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-modal">
            <div className="login-modal__overlay" onClick={handleClose}></div>
            <div className="login-modal__content">
                <h2 className="login-modal__title">Đăng ký</h2>
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
                        <label htmlFor="register-fullName">Họ và tên</label>
                        <input
                            type="text"
                            id="register-fullName"
                            placeholder="Nhập họ và tên"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="login-form__group">
                        <label htmlFor="register-gender">Giới tính</label>
                        <select 
                            id="register-gender" 
                            className="gender-select"
                            value={formData.gender}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            <option value="">-- Chọn giới tính --</option>
                            <option value="0">Nam</option>
                            <option value="1">Nữ</option>
                            <option value="2">Khác</option>
                        </select>
                    </div>
                    <div className="login-form__group">
                        <label htmlFor="register-dateOfBirth">Ngày sinh</label>
                        <input
                            type="date"
                            id="register-dateOfBirth"
                            className="date-input"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="login-form__group">
                        <label htmlFor="register-username">Tên tài khoản</label>
                        <input
                            type="text"
                            id="register-username"
                            placeholder="Nhập tên tài khoản"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="login-form__group">
                        <label htmlFor="register-email">Email</label>
                        <input
                            type="email"
                            id="register-email"
                            placeholder="Nhập email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="login-form__group">
                        <label htmlFor="register-password">Mật khẩu</label>
                        <input
                            type="password"
                            id="register-password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="login-form__submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
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
