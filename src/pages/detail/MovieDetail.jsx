import React, {useState, useRef, useEffect} from 'react';
import { Layout, Row, Col, Button,Tabs, Tag, Empty, Input, message } from 'antd';
import {
    HeartOutlined,
    PlusOutlined,
    UpOutlined,
    MessageOutlined,
    ShareAltOutlined,
    CommentOutlined,
    PlayCircleOutlined,
    StarOutlined,
    CommentOutlined as CommentIcon,
    DownOutlined,
    SendOutlined,
    WarningOutlined, EyeOutlined, EyeInvisibleOutlined, HeartFilled
} from '@ant-design/icons';
import './MovieDetail.scss';
import {getMoviePropose, moviesSlug} from '../../Redux/actions/MovieThunk';
import {episodeSlug} from '../../Redux/actions/EpisodeThunk';
import {commentDetailSlug, commentBySlug, pushComment, totalComment} from '../../Redux/actions/CommentThunk';
import {check, getFavourite, pushFavourite, removeFavourite} from '../../Redux/actions/FavouriteThunk';
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import {decryptId, encryptId} from "../../components/SecurityComponent/cryptoUtils";
import StarRatingModal from "../StarRatingModal";
import {getStatus} from "../../Redux/actions/RatingThunk";
import Swal from 'sweetalert2';
import {getVip} from "../../Redux/actions/UserThunk";
const { Content } = Layout;
const { TextArea } = Input;

const MovieDetail = () => {
    const [activeTab, setActiveTab] = useState('episodes');
    const [loadingMore, setLoadingMore] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const { TabPane } = Tabs;
    const commentsRef = useRef(null);
    const dispatch = useDispatch();
    const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
    const scrollToComments = () => {
        if (commentsRef.current) {
            const offset = 20; // Offset in pixels from the top
            const elementPosition = commentsRef.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            // Custom smooth scroll implementation
            const startPosition = window.pageYOffset;
            const distance = offsetPosition - startPosition;
            const duration = 800; // Duration in milliseconds
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);

                // Easing function for smoother animation
                const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        }
    };

    const handleLoadMoreComments = () => {
        setLoadingMore(true);

        // Simulate loading more comments
        setTimeout(() => {
            // Here you would typically fetch more comments from your API
            // For now, we'll just simulate the loading state
            setLoadingMore(false);
        }, 1500);
    };

    const handleReply = (commentIndex) => {
        setReplyingTo(commentIndex);
    };
    const [isSpoiler, setIsSpoiler] = useState(false);

    const cancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };
    const [replyVisible, setReplyVisible] = useState({});
    const [replyInputs, setReplyInputs] = useState({}); // lưu nội dung các phản hồi nhập vào theo index
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem('USER_LOGIN');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const { slug } = useParams();
    const [movie, setMovie] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState([]);
    const [replies, setReplies] = useState({});
    const [visibleSpoilers, setVisibleSpoilers] = useState(new Set());
    const [checkFavourite, setCheckFavourite] = useState(false);
    const [status,setStatus] = useState(false);
    const [moviePropose, setMoviePropose] = useState([]);
    const [movieGallery, setMovieGallery] = useState([]);
    const [vipDate,setVipDate] = useState();
    const [encryptedId, setEncryptedId] = useState(null);
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await dispatch(moviesSlug(slug));
                if (data) {
                    setMovie(data);
                    console.log("✅ Movie data:", data);
                } else {
                    console.warn("⚠️ Không có dữ liệu phim.");
                }
            } catch (error) {
                console.error("❌ Lỗi khi lấy chi tiết phim:", error);
            }
        };
        const fetchEpisodes = async () => {
            try {
                const data = await dispatch(episodeSlug(slug));
                setEpisodes(data);
            } catch (error) {
                console.error("Không thể tải danh sách tập:", error);
            }
        };

        const fetchComment = async () => {
            try {
                const data = await dispatch(commentBySlug(slug));
                setComments(data.content);
            } catch (error) {
                console.error("Không thể tải danh sách tập:", error);
            }
        };
        fetchEpisodes();
        fetchComment();
        fetchMovie();
    }, [dispatch, slug]);
    useEffect(() => {
        if (!movie?.id) return;

        const fetchTotalComment = async () => {
            try {
                const data = await dispatch(totalComment(movie.id));
                setTotalComments(data);
            } catch (error) {
                console.error("Không thể tải tổng số bình luận:", error);
            }
        };

        const checkFvr = async () => {
            try {
                const data = await dispatch(check(movie.id));
                if (data) {
                    setCheckFavourite(data);
                    console.log("✅ Check favourite:", data);
                } else {
                    console.warn("⚠️ Không có dữ liệu yêu thích.");
                }
            } catch (error) {
                console.error("❌ Lỗi khi kiểm tra yêu thích:", error);
            }
        };
        const fetchMoviePropose = async () => {
            try {
                const data = await dispatch(getMoviePropose(movie.genres[0]?.id,movie.id));
                if (data) {
                    setMoviePropose(data.content);
                    console.log("✅ Movie data:", data);
                } else {
                    console.warn("⚠️ Không có dữ liệu phim.");
                }
            } catch (error) {
                console.error("❌ Lỗi khi lấy chi tiết phim:", error);
            }
        };
        const fetchMovieGallery = async () => {
            try {
                const data = await dispatch(getFavourite());
                if (data) {
                    setMovieGallery(data.content);
                    console.log("✅ Movie data:", data);
                } else {
                    console.warn("⚠️ Không có dữ liệu phim.");
                }
            } catch (error) {
                console.error("❌ Lỗi khi lấy chi tiết phim:", error);
            }
        };
        const fetchCheckStatus = async () => {
            try {
                const data = await dispatch(getStatus(movie.id));
                if (data === "Success") {
                    setStatus(true);
                    console.log("✅ Check favourite:", data);
                } else {
                    console.warn("⚠️ Không có dữ liệu yêu thích.");
                }
            } catch (error) {
                console.error("Không thể tải tổng số bình luận:", error);
            }
        };
        fetchMoviePropose();
        fetchCheckStatus();
        fetchTotalComment();
        checkFvr();
        fetchMovieGallery();
    }, [dispatch, movie?.id]);
    useEffect(() => {
        if (!userData?.id) return; // Không gọi nếu chưa có ID

        const fetchVip = async () => {
            try {
                const data = await dispatch(getVip(userData?.id));
                setVipDate(data);
            } catch (error) {
                console.error("Không thể tải vip:", error);
            }
        };

        fetchVip();
    }, [userData?.id]);

    const handleReplySubmit = async (index) => {
        const content = replyText[index];
        const parentComment = comments[index]; // hoặc comment hiện tại
        const commentId = parentComment.id;
        const movieId = movie.id; // lấy từ comment hiện có
        const isShow = isSpoiler ? 1 : 0;
        if (!parentComment || !commentId || !movieId) {
            message.error('Không thể xác định comment gốc hoặc ID phim');
            return;
        }

        if (!content || content.trim() === '') {
            message.warning('Vui lòng nhập nội dung phản hồi');
            return;
        }

        try {
            const result = await dispatch(pushComment(content, movieId, commentId, isShow));
            message.success('Phản hồi đã được gửi!');

            // Cập nhật replyCount của comment cha
            setComments(prev => prev.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replyCount: (comment.replyCount || 0) + 1
                    };
                }
                return comment;
            }));

            // Cập nhật replies
            setReplies(prev => ({
                ...prev,
                [commentId]: [result, ...(prev[commentId] || [])]
            }));

            // Reset các state
            setReplyInputs(prev => ({ ...prev, [index]: '' }));
            setReplyingTo(null);
        } catch (error) {
            console.error('Lỗi khi gửi phản hồi:', error);
            message.error('Gửi phản hồi thất bại!');
        }
    };
    const handleButtonClick = (episode) => {
        window.location.href = `/watch/${slug}/${encryptId(episode)}`;
    };
    const handleAddFavorite = async () => {
        try {
            const movieId = movie.id;
            if (!checkFavourite) {
                const response = await dispatch(pushFavourite(movieId));
                if (response === "Success") {
                    message.success('Đã thêm vào mục yêu thích!');
                    setCheckFavourite(true);
                } else {
                    message.warning(response || 'Không thể thêm vào mục yêu thích.');
                }
            } else {
                const response = await dispatch(removeFavourite(movieId));
                if (response === "Success") {
                    message.success('Đã xóa khỏi mục yêu thích!');
                    setCheckFavourite(false);
                } else {
                    message.warning(response || 'Không thể xóa khỏi mục yêu thích.');
                }
            }
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi thêm yêu thích.');
        }
    };

    const toggleReplyVisibility = async (commentId, index) => {
        const isVisible = replyVisible[index];

        if (!isVisible) {
            if (!replies[commentId]) {
                try {
                    const data = await dispatch(commentDetailSlug(commentId));
                    setReplies(prev => ({
                        ...prev,
                        [commentId]: data || [], // Đảm bảo luôn là mảng
                    }));
                } catch (err) {
                    console.error('Lỗi khi lấy phản hồi:', err);
                    setReplies(prev => ({
                        ...prev,
                        [commentId]: [], // Fallback về mảng rỗng nếu có lỗi
                    }));
                }
            }
        }

        setReplyVisible(prev => ({
            ...prev,
            [index]: !isVisible,
        }));
    };

    if (!movie) {
        return <p>Đang tải...</p>; // hoặc bạn có thể cho một spinner loading
    }
    const handleShare = async () => {
        const shareData = {
            title: 'Chia sẻ ứng dụng',
            text: 'Cùng khám phá ứng dụng này nhé!',
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
    const toggleSpoilerVisibility = (commentId) => {
        setVisibleSpoilers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };
    const handleMovieClick = (movieSlug) => {
        // Ví dụ chuyển hướng đến trang chi tiết phim
        window.location.href = `/detail/${movieSlug}`;


    };

    const renderCommentContent = (comment) => {
        if (comment.isShow && !visibleSpoilers.has(comment.id)) {
            return (
                <div className="spoiler-content" style={{
                    background: 'linear-gradient(45deg, rgba(255, 77, 79, 0.1), rgba(255, 77, 79, 0.05))',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    ':hover': {
                        background: 'linear-gradient(45deg, rgba(255, 77, 79, 0.15), rgba(255, 77, 79, 0.1))'
                    }
                }}
                     onClick={() => toggleSpoilerVisibility(comment.id)}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            background: 'rgba(255, 77, 79, 0.1)',
                            padding: '8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <WarningOutlined style={{
                                color: '#ff4d4f',
                                fontSize: '18px'
                            }} />
                        </div>
                        <div>
                            <div style={{
                                color: '#ff4d4f',
                                fontWeight: '500',
                                fontSize: '14px',
                                marginBottom: '4px'
                            }}>
                                Nội dung chứa spoiler
                            </div>
                            <div style={{
                                color: 'rgba(255, 77, 79, 0.8)',
                                fontSize: '12px'
                            }}>
                                Nhấp để xem nội dung
                            </div>
                        </div>
                    </div>
                    <EyeOutlined style={{
                        color: '#ff4d4f',
                        fontSize: '18px'
                    }} />
                </div>
            );
        }

        return (
            <div style={{
                position: 'relative',
                background: comment.isShow ? 'rgba(255, 77, 79, 0.05)' : 'transparent',
                borderRadius: '12px',
                padding: '16px 20px',
                margin: '0',
                cursor: comment.isShow ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center'
            }}
                 onClick={() => comment.isShow && toggleSpoilerVisibility(comment.id)}>
                <div style={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    maxWidth: '100%',
                    flex: 1
                }}>
                    {comment.content}
                </div>
                {comment.isShow && (
                    <EyeInvisibleOutlined style={{
                        color: '#ff4d4f',
                        fontSize: '18px',
                        marginLeft: '12px',
                        flexShrink: 0
                    }} />
                )}
            </div>
        );
    };
    return (
        <Layout className="movie-detail">
            <div className="movie-header-background">
                <img src={movie.posterUrl} alt="" className="backdrop-image"/>
            </div>

            <StarRatingModal
                visible={isRatingModalVisible}
                onClose={() => setIsRatingModalVisible(false)}
                ratingAvg={movie.averageRating}
                title={movie.title}
                movieId={movie.id}
                totalRating={movie.totalRating}
            />

            <Content className="movie-content">
                <Row gutter={24}>
                    {/* Cột bên trái - chiếm 4 phần (40%) */}
                    <Col xs={24} lg={10} className="movie-info-column">
                        <div className="movie-header">
                            <div className="movie-poster">
                                <img src={movie.posterUrl} alt={movie.title}/>
                            </div>

                            <div className="movie-info">
                                <h1>{movie.title}</h1>

                                <div className="movie-meta">
                                    <div className="rating-box">
                                        <span className="imdb-rating">MF {movie.averageRating}</span>
                                        <Tag>{movie.releaseYear}</Tag>
                                    </div>
                                </div>

                                <div className="movie-details">
                                    <div className="detail-item">
                                        <div className="genre-tags">
                                            {movie.genres.map(genre => (
                                                <Tag key={genre.id}>{genre.name}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <label>Giới thiệu</label>
                                        <div
                                            className="description"
                                            dangerouslySetInnerHTML={{__html: movie.description}}
                                        ></div>
                                    </div>

                                    <div className="detail-item">
                                        <label>Thời lượng</label>
                                        <span>
    {movie.duration
        ? `${Math.floor(movie.duration / 60)} giờ${movie.duration % 60 !== 0 ? ` ${movie.duration % 60} phút` : ''}`
        : 'Đang cập nhật'}
  </span>
                                    </div>


                                    <div className="detail-item">
                                        <label>Quốc gia</label>
                                        <span>{movie.country ? movie.country : 'Đang cập nhật'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Sản xuất</label>
                                        <span>{movie.publisher ? movie.publisher : 'Đang cập nhật'}</span>
                                    </div>


                                    <div className="detail-item">
                                        <label>Đạo diễn</label>
                                        <span>{movie.director ? movie.director : 'Đang cập nhật'}</span>
                                    </div>


                                    <label className="section-label">Diễn viên</label>
                                    <div className="cast-list">
                                        {movie.actors.map((actor) => (
                                            <div key={actor.id} className="cast-item">
                                                <div className="actor-avatar">
                                                    <img
                                                        src={actor.profileUrl || '/default-avatar.jpg'} // sửa lại cho đúng field ảnh
                                                        alt={actor.name}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/default-avatar.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="actor-info">
                                                    <span className="actor-name">{actor.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>


                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col xs={30} lg={30} className="movie-content-column">
                        <div className="right-content full-width">
                            <div className="action-buttons">
                                <Button type="primary" icon={<PlayCircleOutlined/>} size="large"
                                        className="watch-now-btn" onClick={() => handleButtonClick(1)}>
                                    Xem Ngay
                                </Button>
                                <Button
                                    icon={checkFavourite ? <HeartFilled style={{color: 'red'}}/> : <HeartOutlined/>}
                                    onClick={handleAddFavorite}
                                >
                                    {checkFavourite ? 'Đã yêu thích' : 'Yêu thích'}
                                </Button>

                                <Button icon={<ShareAltOutlined/>} onClick={handleShare}>
                                    Chia sẻ
                                </Button>
                                <Button icon={<CommentOutlined/>} onClick={scrollToComments}>
                                    Bình luận
                                </Button>

                                {!userData ? (
                                    <Button
                                        icon={<StarOutlined />}
                                        onClick={() => alert('Vui lòng đăng nhập để đánh giá phim')}
                                    >
                                        Đánh giá phim
                                    </Button>
                                ) : status ? (
                                    <Button icon={<StarOutlined style={{ color: '#faad14' }} />}>
                                        Đã đánh giá
                                    </Button>
                                ) : (
                                    <Button
                                        icon={<StarOutlined />}
                                        onClick={() => setIsRatingModalVisible(true)}
                                    >
                                        Đánh giá phim
                                    </Button>
                                )}

                            </div>
                        </div>
                        <Col xs={24} lg={24} className="movie-tabs">
                            <div className="tab-navigation">
                                <Tabs
                                    defaultActiveKey="1"
                                    className="custom-tabs"
                                    centered={false}
                                    type="card"
                                    size="large"
                                    tabPosition="top"
                                    destroyInactiveTabPane={true}
                                >
                                    <TabPane tab={<span className="tab-label">Tập phim</span>} key="1">
                                        <div className="tab-content">
                                            <div className="episode-list">
                                                {episodes.map((episode) => {
                                                    console.log("vip" + vipDate);
                                                    const isVipLocked = episode.vip && (vipDate || dayjs(vipDate).isBefore(dayjs(), 'day'));
                                                    return (
                                                        <div
                                                            className="episode-item"
                                                            key={episode.id}
                                                            onClick={() => {
                                                                if (isVipLocked) {
                                                                    Swal.fire({
                                                                        title: 'Yêu cầu tài khoản VIP',
                                                                        text: 'Tài khoản VIP của bạn đã hết hạn hoặc bạn chưa có VIP. Vui lòng gia hạn để xem nội dung này',
                                                                        icon: 'info',
                                                                        confirmButtonText: 'Nâng cấp ngay',
                                                                        showCancelButton: true,
                                                                        cancelButtonText: 'Để sau'
                                                                    }).then((result) => {
                                                                        if (result.isConfirmed) {
                                                                            window.location.href = 'http://localhost:3000/membership';
                                                                        }
                                                                    });
                                                                } else {
                                                                    handleButtonClick(episode.episodeNumber);
                                                                }
                                                            }}
                                                            style={{
                                                                cursor: isVipLocked ? 'not-allowed' : 'pointer',
                                                                position: 'relative',
                                                                opacity: isVipLocked ? 0.7 : 1
                                                            }}
                                                        >
                                                            <div className="episode-number">
                                                                Tập {episode.episodeNumber}
                                                                {episode.vip && (
                                                                    <span style={{
                                                                        marginLeft: '5px',
                                                                        color: isVipLocked ? '#ff0000' : '#ff5722'
                                                                    }}>
                                    {isVipLocked ? '🔐' : '⭐'}
                                </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </TabPane>

                                    <TabPane tab={<span className="tab-label">Gallery</span>} key="2">
                                    <div className="tab-content">
                                            <div className="recommendations">
                                                {movieGallery.length > 0 &&  userData  ? (

                                                    movieGallery.map((movie, index) => (

                                                        <div className="recommendation-item" key={index}
                                                             onClick={() => handleMovieClick(movie.slug)}
                                                        >
                                                            <img src={movie.posterUrl} alt={movie.title} />
                                                            <div className="recommendation-title">{movie.title}</div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>Còn trống hãy đăng nhập mà thêm vào nhé :3</div>
                                                )}
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab={<span className="tab-label">Diễn viên</span>} key="3">
                                        <div className="tab-content">
                                            <div className="cast-grid">
                                                {movie.actors.map((actor) => (
                                                    <div key={actor.id} className="cast-card">
                                                        <div className="cast-avatar">
                                                            <img
                                                                src={actor.profileUrl || '/default-avatar.jpg'}
                                                                alt={actor.name}
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/default-avatar.jpg';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="cast-name">{actor.name}</div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </TabPane>
                                    <TabPane tab={<span className="tab-label">Đề xuất</span>} key="4">
                                        <div className="tab-content">
                                            <div className="recommendations">
                                                {moviePropose.length > 0 ? (
                                                    moviePropose.map((movie, index) => (
                                                        <div className="recommendation-item" key={index}  onClick={() => handleMovieClick(movie.slug)}>
                                                            <img src={movie.posterUrl} alt={movie.title} />
                                                            <div className="recommendation-title">{movie.title}</div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>Không có đề xuất nào.</div>
                                                )}
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Col>
                        <div className="comments-section" ref={commentsRef}>
                            <div className="comments-header">
                                {totalComments > 0 && <h3>Bình luận ( {totalComments} )</h3>}

                            </div>

                            <div className="comment-list">
                                {comments && comments.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <div key={index} className="comment-item">
                                            <div className="comment-author">{comment.user.fullName}</div>
                                            <div className="comment-time">
                                                {dayjs(comment.createdAt).format("DD/MM/YYYY HH:mm")}
                                            </div>
                                            <div className="comment-content"
                                                 style={{
                                                     fontSize: '14px',
                                                     lineHeight: '1.6',
                                                     color: '#eee'
                                                 }}>
                                                {renderCommentContent(comment)}
                                            </div>
                                            <div className="comment-actions">
                                                <Button type="text" icon={<MessageOutlined/>}
                                                        onClick={() => handleReply(index)}>
                                                    Trả lời
                                                </Button>
                                            </div>

                                            {/* Nếu có replies thì hiển thị nút toggle */}
                                            {comment.replyCount > 0 && (
                                                <Button
                                                    type="default" // hoặc bỏ type để dùng style custom
                                                    style={{
                                                        padding: '4px 12px',
                                                        marginTop: 5,
                                                        fontWeight: 500,
                                                        backgroundColor: '#f5f5f5', // nền sáng
                                                        color: '#000', // chữ đen
                                                        border: '1px solid #ddd', // viền sáng nhẹ
                                                        borderRadius: 20,
                                                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)', // hiệu ứng bóng
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 4,
                                                    }}
                                                    icon={replyVisible[index] ? <UpOutlined/> : <DownOutlined/>}
                                                    onClick={() => toggleReplyVisibility(comment.id, index)}
                                                >
                                                    {replyVisible[index]
                                                        ? 'Ẩn phản hồi'
                                                        : `Hiển thị ${comment.replyCount} phản hồi`}
                                                </Button>
                                            )}


                                            {/* Form trả lời */}
                                            {replyingTo === index && (
                                                <div className="reply-form" style={{marginTop: 12}}>
                                                    <TextArea
                                                        value={replyText[index] || ''}
                                                        onChange={(e) => setReplyText(prev => ({
                                                            ...prev,
                                                            [index]: e.target.value
                                                        }))}
                                                        placeholder="Viết phản hồi..."
                                                        rows={3}
                                                        maxLength={255}
                                                        showCount
                                                        style={{
                                                            color: '#fff',
                                                            borderRadius: '8px',
                                                            padding: '12px',
                                                            fontSize: '14px',
                                                            resize: 'none',
                                                            width: '100%',
                                                            maxWidth: '600px',
                                                            backgroundColor: '#1c1c1c',
                                                            borderColor: '#3a3a3a'
                                                        }}
                                                    />
                                                    <div className="left-controls" style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px'
                                                        }}>
                                                            <div
                                                                id="spoil-toggle"
                                                                className={`toggle-x ${isSpoiler ? 'on' : ''}`}
                                                                onClick={() => setIsSpoiler(!isSpoiler)}
                                                            >
                                                                <span></span>
                                                            </div>
                                                            <span className="spoiler-text">Tiết lộ?</span>
                                                        </div>
                                                    </div>
                                                    <div className="reply-actions"
                                                         style={{marginTop: 8, display: 'flex', gap: 10}}>
                                                        <Button
                                                            type="primary"
                                                            onClick={() => handleReplySubmit(index)}
                                                            icon={<SendOutlined/>}
                                                        >
                                                            Gửi
                                                        </Button>
                                                        <Button
                                                            danger
                                                            onClick={() => {
                                                                setReplyInputs(prev => ({
                                                                    ...prev,
                                                                    [index]: ''
                                                                }));
                                                                setReplyText(prev => ({
                                                                    ...prev,
                                                                    [index]: ''
                                                                }));
                                                                setReplyingTo(null); // hoặc setReplyingTo(-1); tùy theo bạn dùng giá trị gì mặc định
                                                            }}
                                                        >
                                                            Hủy
                                                        </Button>

                                                    </div>

                                                </div>

                                            )}

                                            {/* Danh sách replies - chỉ hiển thị khi bật replyVisible */}
                                            {replyVisible[index] && replies[comment.id] && (
                                                <div
                                                    className="replies-list"
                                                    style={{
                                                        margin: '15px 0 15px 25px',
                                                        paddingLeft: '25px',
                                                        borderLeft: '2px solid rgba(245, 197, 24, 0.2)',
                                                        position: 'relative',
                                                    }}
                                                >
                                                    {(replies[comment.id] || []).map((reply, replyIndex) => (
                                                        <div
                                                            key={replyIndex}
                                                            className="reply-item"
                                                            style={{
                                                                padding: '15px',
                                                                marginBottom: '10px',
                                                                borderRadius: '10px',
                                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                            }}
                                                        >
                                                            <div
                                                                className="reply-author"
                                                                style={{
                                                                    color: '#f5c518',
                                                                    fontWeight: '500',
                                                                    fontSize: '13px',
                                                                    marginBottom: '4px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '6px',
                                                                }}
                                                            >
                    <span
                        style={{
                            display: 'inline-block',
                            width: '6px',
                            height: '6px',
                            background: '#f5c518',
                            borderRadius: '50%',
                        }}
                    ></span>
                                                                {reply.user.fullName}
                                                            </div>
                                                            <div
                                                                className="reply-time"
                                                                style={{
                                                                    color: 'rgba(255, 255, 255, 0.5)',
                                                                    fontSize: '11px',
                                                                    marginBottom: '8px',
                                                                }}
                                                            >
                                                                {dayjs(reply.createdAt).format("DD/MM/YYYY HH:mm")}
                                                            </div>
                                                            <div
                                                                className="reply-content"
                                                                style={{
                                                                    color: '#fff',
                                                                    fontSize: '13px',
                                                                    lineHeight: '1.5',
                                                                    wordBreak: 'break-word',
                                                                }}
                                                            >
                                                                {renderCommentContent(reply)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                        </div>

                                    ))
                                ) : (
                                    <div
                                        className="no-comments"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            minHeight: '200px', // bạn có thể điều chỉnh
                                            padding: '20px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Empty
                                            image={<CommentIcon
                                                style={{fontSize: 60, color: 'rgba(255, 255, 255, 0.3)'}}/>}
                                            description={<span style={{color: '#999'}}>Chưa có bình luận nào</span>}
                                        />
                                    </div>

                                )}
                            </div>

                            {comments.length > 10 && (
                                <div className="view-more-comments">
                                    <Button
                                        type="primary"
                                        className="load-more-btn"
                                        onClick={handleLoadMoreComments}
                                        loading={loadingMore}
                                        icon={!loadingMore && <DownOutlined />}
                                    >
                                        {loadingMore ? 'Đang tải...' : 'Xem thêm bình luận'}
                                    </Button>
                                </div>
                            )}

                        </div>
                    </Col>

                </Row>
            </Content>
        </Layout>
    )
        ;
}

export default MovieDetail;