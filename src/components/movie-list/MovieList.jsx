import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './movie-list.scss';

import { SwiperSlide, Swiper } from 'swiper/react';

import MovieCard from '../movie-card/MovieCard';
import {moviesNew, moviesPopular, moviesTopRated} from '../../Redux/actions/MovieThunk';
import { useDispatch } from 'react-redux';
const MovieList = props => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const getList = async () => {
            try {
                setLoading(true);
                let response = null;

                if (props.type === 'popular') {
                    response = await dispatch(moviesPopular(props.page, 10));
                } else if (props.type === 'top-rated') {
                    response = await dispatch(moviesTopRated(props.page, 10));
                } else if (props.type === 'similar') {
                    response = await dispatch(moviesNew(props.page, 10));
                }

                if (response && response.content) {
                    setItems(response.content);
                } else {
                    console.log("Không có dữ liệu trả về từ API");
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                console.error("Đã xảy ra lỗi:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getList();
    }, [props.type, props.page]);


    if (loading) return <div className="movie-list-loading">Loading...</div>;
    if (error) return <div className="movie-list-error">Error: {error}</div>;

    return (
        <div className="movie-list">
            <Swiper
                grabCursor={true}
                spaceBetween={25}
                slidesPerView={'auto'}
            >
                {
                    items.map((item, i) => (
                        <SwiperSlide key={i}>
                            <MovieCard
                                item={{
                                    id: item.id,
                                    title: item.title,
                                    poster_path: item.posterUrl,
                                    backdrop_path: item.thumbnailUrl,
                                    slug: item.slug,
                                    releaseYear: item.releaseYear,
                                    duration: item.duration,
                                    averageRating : item.averageRating,
                                    episodeCount: item.episodeCount,
                                    status: item.status,
                                    genres : item.genres,
                                }}
                            />

                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
}

MovieList.propTypes = {
    type: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
};


export default MovieList;
