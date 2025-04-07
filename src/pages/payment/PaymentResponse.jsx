import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deposit } from "../../Redux/actions/PaymentThunk";
import { USER_LOGIN } from "../../Utils/Setting/Config";

const PaymentResult = () => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('Đang xử lý kết quả giao dịch...');

    // Đọc user từ localStorage và parse
    const [userData] = useState(() => {
        const savedUser = localStorage.getItem(USER_LOGIN);
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const amount = params.get('vnp_Amount');
        const responseCode = params.get('vnp_ResponseCode');
        const transactionStatus = params.get('vnp_TransactionStatus');

        // Kiểm tra xem các tham số có tồn tại trong URL hay không
        if (!amount || !responseCode || !transactionStatus) {
            setMessage('❌ Thiếu tham số trong URL.');
            return;
        }

        // Kiểm tra giao dịch thành công
        if (responseCode === '00' && transactionStatus === '00' && amount) {
            const numericAmount = parseInt(amount)/100;

            if (isNaN(numericAmount)) {
                setMessage('❌ Số tiền giao dịch không hợp lệ.');
                return;
            }

            if (!userData || !userData.username) {
                setMessage('❌ Không tìm thấy tài khoản người dùng.');
                return;
            }

            dispatch(deposit(userData.username, numericAmount))
                .then((data) => {
                    if (data && data.amount) {
                        setMessage(`✅ Nạp thành công ${data.amount.toLocaleString()} VNĐ!`);
                    } else {
                        setMessage('❌ Dữ liệu giao dịch không hợp lệ.');
                    }
                })
                .catch((err) => {
                    setMessage(`❌ Nạp tiền thất bại: ${err.message || 'Không xác định.'}`);
                });
        } else {
            setMessage('❌ Giao dịch không thành công hoặc bị hủy.');
        }
    }, [dispatch, userData]);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Kết quả giao dịch</h2>
                <p style={styles.message}>{message}</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#121212',
        color: '#ffffff',
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: '100%',
        maxWidth: '500px',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '1rem',
    },
    message: {
        fontSize: '1.2rem',
        color: '#B0B0B0',
    },
};

export default PaymentResult;
