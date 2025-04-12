import './movie-card.scss';
import { Link } from 'react-router-dom';
import Button from '../button/Button';
import { FaPlay, FaHeart, FaInfoCircle } from 'react-icons/fa';
import React, { useState, useRef, useEffect } from 'react';
import {check,pushFavourite,removeFavourite} from '../../Redux/actions/FavouriteThunk';
import {getStatus} from "../../Redux/actions/RatingThunk";
import {useDispatch} from "react-redux";
import {message} from "antd";
const MovieCard = (props) => {
    const item = props.item;
    const link =  item.slug;
    const bg = item.poster_path || item.backdrop_path;
    const dispatch = useDispatch();
    const [showPopover, setShowPopover] = useState(false);
    const cardRef = useRef(null);
    const [popoverPosition, setPopoverPosition] = useState('left_ref');
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (!showPopover || !cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const popoverWidth = 450; // Width of the popover
        const margin = 20;

        const spaceRight = window.innerWidth - rect.right;
        const spaceLeft = rect.left;

        if (spaceRight >= popoverWidth + margin) {
            setPopoverPosition('right_ref');
        } else if (spaceLeft >= popoverWidth + margin) {
            setPopoverPosition('left_ref');
        } else {
            // Không đủ không gian hai bên, chọn hướng khác (ví dụ dưới)
            setPopoverPosition('bottom_ref');
        }
    }, [showPopover]);
    useEffect(() => {
        if (!item?.id) return;
        const checkFvr = async () => {
            try {
                const data = await dispatch(check(item.id));
                if (data) {
                    setLiked(data);
                    console.log("✅ Check favourite:", data);
                } else {
                    console.warn("⚠️ Không có dữ liệu yêu thích.");
                }
            } catch (error) {
                console.error("❌ Lỗi khi kiểm tra yêu thích:", error);
            }
        };

        checkFvr();
    }, [dispatch, item?.id]);
    const handleAddFavorite = async () => {
        try {
            const movieId = item.id;
            if (!liked) {
                const response = await dispatch(pushFavourite(movieId));
                if (response === "Success") {
                    message.success('Đã thêm vào mục yêu thích!');
                    setLiked(true);
                } else {
                    message.warning(response || 'Không thể thêm vào mục yêu thích.');
                }
            } else {
                const response = await dispatch(removeFavourite(movieId));
                if (response === "Success") {
                    message.success('Đã xóa khỏi mục yêu thích!');
                    setLiked(false);
                } else {
                    message.warning(response || 'Không thể xóa khỏi mục yêu thích.');
                }
            }
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi thêm yêu thích.');
        }
    };
    return (
        <div
            className="movie-card-wrapper"
            ref={cardRef}
            onMouseEnter={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
        >
            <Link>
                <div className="movie-card" style={{backgroundImage: `url(${bg})`}}>
                    <Button>
                        <i className="bx bx-play"></i>
                    </Button>
                </div>
                <h3>{item.title}</h3>
            </Link>

            {showPopover && (
                <div className={`movie-popover ${popoverPosition}`}>
                    <img
                        src={item.poster_path || 'https://via.placeholder.com/300x170?text=No+Image'}
                        alt={item.title}
                    />
                    <div className="content">
                        <h4>{item.title}</h4>

                        <div className="actions">
                            <button
                                className="watch"
                                onClick={() => (window.location.href = '/detail/' + item.slug)}
                            >
                                <FaPlay/> Xem ngay
                            </button>
                            <button
                                className={`like ${liked ? 'liked' : ''}`}
                                onClick={() => handleAddFavorite()}
                            >
                                <FaHeart style={{color: liked ? 'red' : 'white'}}/>
                                {liked ? ' Đã thích' : ' Thích'}
                            </button>


                            <button className="details"
                                    onClick={() => (window.location.href = '/detail/' + item.slug)}>
                                <FaInfoCircle/> Chi tiết
                            </button>
                        </div>
                        <div className="info-row">
                            <span className="badge imdb">MF {item.averageRating}</span>
                            <span className="badge age">T{item.episodeCount}</span>
                            <span className="badge year">{item.releaseYear || 'Đang cập nhật'}</span>
                            <span className="badge duration">
  {item.duration
      ? `${Math.floor(item.duration / 60) > 0 ? `${Math.floor(item.duration / 60)} giờ` : ''} 
       ${item.duration % 60 > 0 ? `${item.duration % 60} phút` : ''}`
      : 'Đang cập nhật'}
</span>

                        </div>

                        <div className="genres">
                            {(item.genres && item.genres.length > 0
                                    ? item.genres
                                    : ['Chính kịch', 'Tâm lý', 'Hình sự']
                            ).map((genre, index) => (
                                <span className="genre-badge" key={index}>
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieCard;