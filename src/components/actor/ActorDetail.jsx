import React, {useEffect, useState} from 'react';
import './ActorDetail.css';
import {useParams} from "react-router-dom";
import {getActorById, getAllMovieByActor} from "../../Redux/actions/MovieThunk";
import {useDispatch} from "react-redux";

const ActorDetail = () => {
    const { key } = useParams();
    const [actor, setActor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const [movies, setMovie] = useState([]);
    useEffect(() => {
        const fetchActorInformation = async () => {
            try {
                const response = await dispatch(getActorById(key));
                if (response) {
                    setActor(response);
                }
            } catch (err) {
                console.error("Lỗi khi tải:", err);
                setError(err.message || 'Đã xảy ra lỗi');
            } finally {
                setLoading(false);
            }
        };
        const fetchMovieInformation = async () => {
            try {
                const response = await dispatch(getAllMovieByActor(key));
                if (response) {
                    setMovie(response.content);
                }
            } catch (err) {
                console.error("Lỗi khi tải:", err);
                setError(err.message || 'Đã xảy ra lỗi');
            } finally {
                setLoading(false);
            }
        }
        fetchActorInformation();
        fetchMovieInformation();
    }, [key]);
    const handleShare = async () => {
        const shareData = {
            title: 'Chia sẻ diễn viên nổi bật',
            text: 'Xem nè thật ấn tượng với khả năng diễn xuất của người này!',
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Đã chia sẻ thành công!');
            } catch (error) {
                console.error('Lỗi chia sẻ:', error);
            }
        } else {
            alert('Trình duyệt không hỗ trợ chia sẻ trực tiếp. Vui lòng sao chép link.');
        }
    };

    return (
        <div className="actor-detail-container">
            {/* Sidebar thông tin diễn viên */}
            <aside className="actor-sidebar">
                <img src={actor.profileUrl} alt={actor.name} className="actor-avatar" />
                <h2 className="actor-movie-name">{actor.name}</h2>
                <div className="actor-actions">
                    <button onClick={handleShare} className="btn btn-share">✈ Chia sẻ</button>
                </div>
                <div className="actor-info">
                    <p><strong>Giới thiệu:</strong> {actor.bio || 'Đang cập nhật'}</p>
                    <p><strong>Giới tính:</strong>
                        {actor.gender === 1 ? 'Nữ' : (actor.gender === 0 ? 'Nam' : 'Đang cập nhật')}
                    </p>

                    <p><strong>Ngày sinh:</strong> {actor.birthDate || 'Đang cập nhật'}</p>
                </div>
            </aside>

            {/* Danh sách phim */}
            <main className="actor-movies">
            <h3 className="section-actor-title">Các phim đã tham gia</h3>
                <div className="movie-actor-list">
                    {movies.map((movie, index) => (
                        <div className="movie-actor-card" key={index}>
                            <img src={movie.posterUrl} alt={movie.title} className="movie-actor-poster" />
                            <div className="badge-actor">{movie.country}</div>
                            <p className="movie-actor-title">{movie.title}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ActorDetail;
