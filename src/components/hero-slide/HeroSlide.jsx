import React, { useState, useEffect, useRef } from 'react';
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Button, { OutlineButton } from '../button/Button';
import Modal, { ModalContent } from '../modal/Modal';
import { useNavigate } from 'react-router-dom';
import './hero-slide.scss';
import { useDispatch } from 'react-redux';
import { moviesNew } from '../../Redux/actions/MovieThunk';
import { Link } from 'react-router-dom';
const HeroSlide = () => {
    SwiperCore.use([Autoplay]);
    const [movieItems, setMovieItems] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getMovies = async () => {
            try {
                const response = await dispatch(moviesNew(3, 5));
                
                if (response && response.content && Array.isArray(response.content)) {
                    setMovieItems(response.content);
                } else {
                    console.error("Invalid response format:", response);
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        }
        getMovies();
    }, [dispatch]);


    return (
        <div className="hero-slide">
            <Swiper
                modules={[Autoplay]}
                grabCursor={true}
                spaceBetween={0}
                slidesPerView={1}
            >
                {
                    movieItems && movieItems.length > 0 ? (
                        movieItems.map((item, i) => (
                            <SwiperSlide key={i}>
                                {({ isActive }) => (
                                    <HeroSlideItem item={item} className={`${isActive ? 'active' : ''}`} />
                                )}
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide>
                            <div className="hero-slide__item">
                                <div className="hero-slide__item__content container">
                                    <div className="hero-slide__item__content__info">
                                        <h2 className="title">Loading...</h2>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    )
                }
            </Swiper>
        </div>
    );
}

const HeroSlideItem = props => {
    const navigate = useNavigate();
    const item = props.item;
    const tagStyle = {
        backgroundColor: '#444',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '14px',
    };

    const genreStyle = {
        backgroundColor: '#2c2c2c',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '14px',
    };


    const background = item.posterUrl;
    const title = item.title;

    const formatDuration = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h > 0 && m > 0) return `${h}h ${m} phút`;
        if (h > 0 && m === 0) return `${h}h`;
        return `${m} phút`;
    };
    console.log(item.slug);
    return (
        <div
            className={`hero-slide__item ${props.className}`}
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                padding: '40px',
            }}
        >
            <div style={{maxWidth: '800px', marginTop: '200px',}}>
                <h1 style={{fontSize: '40px', fontWeight: 'bold', marginBottom: '20px'}}>
                    {title}
                </h1>

                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
                <span style={{
                    backgroundColor: '#f5c518',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}>
                    MF {item.averageRating}
                </span>
                    <span style={tagStyle}>T{item.episodeCount}</span>
                    <span style={tagStyle}>{item.releaseYear}</span>
                    <span style={tagStyle}>
  {item.duration ? formatDuration(item.duration) : "Đang cập nhật"}
</span>

                </div>

                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px'}}>
                    {item.genres.map((genre) => (
                        <span key={genre.id} style={genreStyle}>
            {genre.name}
        </span>
                    ))}
                </div>

                <p
                    style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3, // Giới hạn số dòng muốn hiển thị
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    dangerouslySetInnerHTML={{__html: item.description}}
                ></p>
                <div style={{marginTop: '20px'}}>
                    <Button
                        onClick={() => {
                            navigate('/detail/' + item.slug);
                        }}
                    >
                        Xem ngay
                    </Button>
                </div>


            </div>

            <div className="hero-slide__item__content__poster">
                <img src={item.posterUrl} alt={item.title} style={{borderRadius: '12px', width: '250px'}}/>
            </div>
        </div>
    );

}

export default HeroSlide;
