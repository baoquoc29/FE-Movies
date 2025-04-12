import React, {useEffect, useState} from 'react';
import { Button } from 'antd';
import {addRating} from "../Redux/actions/RatingThunk"
import {useDispatch} from "react-redux";
const StarRatingModal = ({ visible, onClose,movieId,title,ratingAvg,totalRating }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    if (!visible) return null;

    const handleRatingClick = (value) => {
        setRating(value);
    };

    const handleSubmit = async () => {
        if (rating === 0) return;

        try {
            setLoading(true);
            const result = await dispatch(addRating(movieId, rating, reviewText));
            console.log(reviewText);
            if (result === "Success") {
                alert('Đánh giá của bạn đã được gửi thành công!');
                window.location.reload();
            }
            else{
                console.log(result);
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi gửi đánh giá: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const ratingLabels = [
        { value: 5, label: 'Tuyệt vời', image: 'https://www.rophim.me/images/reviews/rate-5.webp' },
        { value: 4, label: 'Phim hay', image: 'https://www.rophim.me/images/reviews/rate-4.webp' },
        { value: 3, label: 'Khả ốn', image: 'https://www.rophim.me/images/reviews/rate-3.webp' },
        { value: 2, label: 'Phim chán', image: 'https://www.rophim.me/images/reviews/rate-2.webp' },
        { value: 1, label: 'Dở tệ', image: 'https://www.rophim.me/images/reviews/rate-1.webp' },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">{title}</h3>
                <div className="rating-summary">
                    <span className="average-rating">{ratingAvg}</span>
                    <span className="rating-count">/ {totalRating} lượt đánh giá</span>
                </div>

                <div className="rating-options">
                    {ratingLabels.map((item) => (
                        <div
                            key={item.value}
                            className={`rating-option ${rating === item.value ? 'selected' : ''}`}
                            onClick={() => handleRatingClick(item.value)}
                        >
                            <img
                                src={item.image}
                                alt={item.label}
                                className="rating-icon"
                                onError={(e) => {
                                    e.target.style.display = 'none'; // Hide if image fails to load
                                }}
                            />
                            <div className="rating-label">{item.label}</div>
                        </div>
                    ))}
                </div>

                <div className="review-input">
                         <textarea
                        placeholder="Viết nhận xét về phim (tuỳ chọn)"
                        value={reviewText}
                        maxLength={255}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                    <div className="char-count">{reviewText.length} / 255</div>
                </div>


                <div className="modal-actions">
                    <Button
                        className="custom-button close-button"
                        onClick={onClose}
                    >
                        Đóng
                    </Button>
                    <Button
                        type="primary"
                        className="custom-button submit-button"
                        onClick={handleSubmit}
                        disabled={rating === 0}
                    >
                        Gửi đánh giá
                    </Button>
                </div>

            </div>

            <style jsx>{`
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 20px;
                }

                .custom-button {
                    padding: 10px 20px;
                    border-radius: 8px;
                    border: none;
                    font-weight: 500;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .close-button {
                    background-color: #e0e0e0;
                    color: #333;
                }

                .submit-button {
                    color: white;
                }

                .submit-button:disabled {
                    background-color: #aac8f2;
                    cursor: not-allowed;
                }

                .submit-button:hover:not(:disabled) {
                    background-color: #c41a1a;
                }
                .char-count {
                    text-align: right;
                    font-size: 12px;
                    color: #666;
                    margin-top: 4px;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: #111112;
                    border-radius: 16px;
                    padding: 24px;
                    width: 400px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    animation: fadeInUp 0.3s ease;
                }

                .modal-title {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    text-align: center;
                }

                .rating-summary {
                    text-align: center;
                    font-size: 18px;
                    margin-bottom: 20px;
                }

                .average-rating {
                    font-size: 14px;
                    font-weight: bold;
                    color: #ffd700;
                }

                .rating-count {
                    font-size: 14px;
                    color: #aaa;
                    margin-left: 5px;
                }

                .rating-options {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .rating-option {
                    flex: 1;
                    text-align: center;
                    padding: 8px 4px;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .rating-option:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .rating-option.selected {
                    background: rgba(255, 215, 0, 0.2);
                }

                .rating-icon {
                    width: 24px;
                    height: 24px;
                    margin-bottom: 6px;
                    object-fit: contain;
                }

                .rating-label {
                    font-size: 12px;
                }

                .review-input textarea {
                    width: 100%;
                    height: 80px;
                    padding: 10px;
                    background: #1e1e1e;
                    border: 1px solid #333;
                    border-radius: 4px;
                    color: white;
                    resize: none;
                    margin-bottom: 20px;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }

                .close-button {
                    background-color: transparent;
                    border: 1px solid #555;
                    color: #ddd;
                }

                .submit-button {
                    background-color: #ffd700;
                    border-color: #ffd700;
                    color: #000;
                    font-weight: 500;
                }

                @keyframes fadeInUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default StarRatingModal;