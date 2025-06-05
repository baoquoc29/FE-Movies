import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import {resetPassword} from "../Redux/actions/UserThunk";

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.newPassword) {
            setError('Vui lòng nhập mật khẩu mới');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (!token) {
            setError('Token không hợp lệ');
            return;
        }

        setIsLoading(true);

        try {
            const response = await dispatch(resetPassword({
                token: token,
                newPassword: formData.newPassword
            }));
            if (response === 200) {
                Swal.fire({
                    title: "Thành công!",
                    text: "Mật khẩu của bạn đã được đặt lại thành công",
                    icon: "success",
                    button: "Đăng nhập",
                }).then(() => {
                    navigate('/');
                });
            } else {
                setError('Đã xảy ra lỗi khi đặt lại mật khẩu');
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError('Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Inline CSS styles
    const styles = {
        resetPasswordContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px'
        },
        resetPasswordForm: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '400px'
        },
        heading: {
            textAlign: 'center',
            marginBottom: '20px',
            color: '#333'
        },
        errorMessage: {
            color: '#e74c3c',
            backgroundColor: '#fadbd8',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
        },
        formGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#555'
        },
        input: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s',
            outline: 'none'
        },
        inputFocus: {
            borderColor: '#3498db'
        },
        submitButton: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
        },
        submitButtonHover: {
            backgroundColor: '#2980b9'
        },
        submitButtonDisabled: {
            backgroundColor: '#95a5a6',
            cursor: 'not-allowed'
        }
    };

    return (
        <div style={styles.resetPasswordContainer}>
            <div style={styles.resetPasswordForm}>
                <h2 style={styles.heading}>Đặt lại mật khẩu</h2>

                {error && <div style={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="newPassword" style={styles.label}>Mật khẩu mới</label>
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Nhập mật khẩu mới"
                            value={formData.newPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            style={{
                                ...styles.input,
                                ...(isLoading ? { backgroundColor: '#f2f2f2' } : {})
                            }}
                            onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
                            onBlur={(e) => e.target.style.borderColor = styles.input.borderColor}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="confirmPassword" style={styles.label}>Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Nhập lại mật khẩu mới"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            style={{
                                ...styles.input,
                                ...(isLoading ? { backgroundColor: '#f2f2f2' } : {})
                            }}
                            onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
                            onBlur={(e) => e.target.style.borderColor = styles.input.borderColor}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.submitButton,
                            ...(isLoading ? styles.submitButtonDisabled : {}),
                            ':hover': !isLoading ? styles.submitButtonHover : {}
                        }}
                        disabled={isLoading}
                        onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor)}
                        onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = styles.submitButton.backgroundColor)}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;