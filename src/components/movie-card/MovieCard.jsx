import './movie-card.scss';
import { Link } from 'react-router-dom';
import Button from '../button/Button';
import { FaPlay, FaHeart, FaInfoCircle } from 'react-icons/fa';
import React, { useState, useRef, useEffect } from 'react';

const MovieCard = (props) => {
    const item = props.item;
    const link =  item.slug;
    const bg = item.poster_path || item.backdrop_path;

    const [showPopover, setShowPopover] = useState(false);
    const cardRef = useRef(null);
    const [popoverPosition, setPopoverPosition] = useState('left_ref');

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


                            <button className="like">
                                <FaHeart/> Thích
                            </button>
                            <button className="details">
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