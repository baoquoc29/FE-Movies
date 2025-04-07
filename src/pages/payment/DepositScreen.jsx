import React, { useState } from "react";
import { useDispatch } from "react-redux"; // import useDispatch để gọi action
import "./DepositScreen.scss";
import {createUrlPay} from "../../Redux/actions/PaymentThunk";

const DepositScreen = () => {
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("VNPay");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const dispatch = useDispatch(); // Khởi tạo useDispatch

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
        setError(""); // Clear error message when user changes the amount
    };

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleDeposit = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            setError("Vui lòng nhập số tiền hợp lệ.");
            return;
        }

        if (amount < 10000) { // Kiểm tra số tiền tối thiểu là 10,000 VND
            setError("Số tiền tối thiểu phải là 10,000 VND.");
            return;
        }

        setLoading(true);
        setMessage("");

        // Gọi action createUrlPay để tạo URL thanh toán
        dispatch(createUrlPay(amount, { orderInfo: `Thanh toán ${amount} VND qua ${paymentMethod}` }));
    };

    return (
        <div className="deposit-screen">
            <div className="deposit-card">
                <h2>Nạp Tiền</h2>

                <div className="input-group">
                    <label>Số Tiền:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Nhập số tiền muốn nạp"
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="payment-method">
                    <label>Chọn phương thức thanh toán:</label>
                    <div className="payment-options">
                        <label>
                            <input
                                type="radio"
                                value="VNPay"
                                checked={paymentMethod === "VNPay"}
                                onChange={handlePaymentMethodChange}
                            />
                            VNPay
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="ZaloPay"
                                checked={paymentMethod === "ZaloPay"}
                                onChange={handlePaymentMethodChange}
                            />
                            ZaloPay
                        </label>
                    </div>
                </div>

                <div className="action">
                    <button className="deposit-button" onClick={handleDeposit} disabled={loading}>
                        {loading ? "Đang nạp..." : "Nạp Tiền"}
                    </button>
                </div>

                {message && <div className="result-message">{message}</div>}
            </div>
        </div>
    );
};

export default DepositScreen;
