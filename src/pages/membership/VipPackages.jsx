import React, { useEffect, useState } from "react";
import "./VipPackages.css";
import { getVipPackages } from "../../Redux/actions/VipPackagesThunk";
import { buyVip } from "../../Redux/actions/PaymentThunk";
import {useDispatch} from "react-redux";
import CustomAlert from "./CustomAlert";
const VipPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem('USER_LOGIN');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [alertMessage, setAlertMessage] = useState("");
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await dispatch(getVipPackages());
                // Kiểm tra cấu trúc response theo đúng API trả về
                if (!response) {
                    throw new Error('Dữ liệu gói VIP không hợp lệ');
                }

                // Format dữ liệu từ API
                const formattedPackages = response.map(pkg => ({
                    ...pkg,
                    status: pkg.status === "ACTIVE" ? 1 : 0, // Chuyển sang number
                    popular: pkg.id === 2 // Gói 3 tháng là phổ biến
                }));

                setPackages(formattedPackages);
            } catch (err) {
                console.error("Lỗi khi tải gói VIP:", err);
                setError(err.message || 'Đã xảy ra lỗi khi tải danh sách gói VIP');
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);
    const handleBuyClick = async (pkg) => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            const result = await dispatch(buyVip(userData.username, pkg.duration));
            if (result) {
                setAlertMessage(`Bạn đã mua thành công gói ${pkg.name}!`);
                window.dispatchEvent(new Event("balanceUpdated"));
            } else {
                setAlertMessage(`Ví của bạn không đủ, vui lòng nạp thêm!`);
            }
        } catch (error) {
            setAlertMessage(`Có lỗi xảy ra hoặc ví không đủ, vui lòng nạp thêm!`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="loading">Đang tải danh sách gói VIP...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;
    if (packages.length === 0) return <div className="info">Hiện không có gói VIP nào</div>;
    return (
        <div className="vip-packages-container">
            <h2 className="vip-title">Danh Sách Gói VIP</h2>
            <p className="vip-subtitle">Nâng cấp tài khoản để trải nghiệm dịch vụ tốt nhất</p>

            <div className="vip-grid">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className={`vip-card ${pkg.popular ? "popular" : ""} ${pkg.status === 0 ? "inactive" : ""}`}
                    >
                        {pkg.popular && <div className="popular-badge">Phổ biến</div>}

                        <h3 className="vip-name">{pkg.name}</h3>
                        <p className="vip-description">{pkg.description}</p>

                        <div className="vip-price-container">
                            <span className="vip-price">
                                {pkg.price === 0 ? "Miễn phí" : pkg.price.toLocaleString("vi-VN") + "₫"}
                            </span>
                            {pkg.duration > 30 && (
                                <span className="vip-price-per-month">
                                    ~{(pkg.price / (pkg.duration / 30)).toLocaleString("vi-VN", {maximumFractionDigits: 0})}₫/tháng
                                </span>
                            )}
                        </div>

                        <p className="vip-duration">Thời hạn: {pkg.duration} ngày</p>

                        {pkg.status === 1 ? (
                            <button
                                className={`buy-button ${pkg.popular ? "popular-button" : ""}`}
                                onClick={() => handleBuyClick(pkg)}
                            >
                                Mua ngay
                            </button>
                        ) : (
                            <button className="buy-button disabled" disabled>
                                Tạm ngừng
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {alertMessage && (
                <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />
            )}
        </div>

    );
};
export default VipPackages;