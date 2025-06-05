import React, { useState, useEffect, useRef } from 'react';
import { Layout, Button, Tabs, Progress, Tooltip, Row, Col, Input, Switch, Empty, message } from 'antd';
import {
    ArrowLeftOutlined,
    StarOutlined,
    CommentOutlined,
    PlayCircleOutlined,
    HeartOutlined,
    SwapOutlined,
    DesktopOutlined,
    ShareAltOutlined,
    WarningOutlined,
    SendOutlined,
    UserOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    CheckOutlined,
    MessageOutlined,
    PlusOutlined, UpOutlined, DownOutlined, HeartFilled
} from '@ant-design/icons';
import './WatchingMovie.scss';
import {decryptId, encryptId} from "../../components/SecurityComponent/cryptoUtils";
import './Comments.scss';
import Swal from 'sweetalert2';
import {episode, episodeSlug} from "../../Redux/actions/EpisodeThunk";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import '../detail/ShareDropdown'
import {commentBySlug, commentDetailSlug, pushComment, totalComment} from "../../Redux/actions/CommentThunk";
import dayjs from "dayjs";
import LoginModal from "../account/LoginModal";
import RegisterModal from "../account/RegisterModal";
import {check, pushFavourite} from "../../Redux/actions/FavouriteThunk";
import { useNavigate } from 'react-router-dom';
import {getVip} from "../../Redux/actions/UserThunk";
const { Content } = Layout;
const { TabPane } = Tabs;
const { TextArea } = Input;

const WatchingMovie = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [commentText, setCommentText] = useState('');
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState([]);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem('USER_LOGIN');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [commentType, setCommentType] = useState('comment');
    const [visibleSpoilers, setVisibleSpoilers] = useState(new Set());
    const [isCinemaMode, setIsCinemaMode] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false); // Auto-play state
    const [videoEnded, setVideoEnded] = useState(false); // Track if video has ended
    const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to
    const [replyText, setReplyText] = useState(''); // Text for the reply
    const iframeRef = useRef(null); // Reference to the iframe
    const dispatch = useDispatch();
    const { slug,ep } = useParams();
    const [episodeData, setEpisodeData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [episodes, setEpisodes] = useState([]);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [activeEpisode, setActiveEpisode] = useState(decryptId(ep)); // Default to episode 2 as active
    const [replies, setReplies] = useState({});
    const [replyVisible, setReplyVisible] = useState({});
    const [replyInputs, setReplyInputs] = useState({}); // lưu nội dung các phản hồi nhập vào theo index
    const [checkFavourite, setCheckFavourite] = useState(false);
    const [vipDate,setVipDate] = useState();

    useEffect(() => {
        if (isCinemaMode) {
            // Hide the main website header
            const mainHeader = document.querySelector('.ant-layout-header, header, .header, #header');
            if (mainHeader) {
                mainHeader.style.display = 'none';
                mainHeader.style.opacity = '0';
                mainHeader.style.visibility = 'hidden';
                mainHeader.style.height = '0';
                mainHeader.style.overflow = 'hidden';
            }

            // Add black background to body
            document.body.style.overflow = 'hidden';
            document.body.style.backgroundColor = '#000';
        } else {
            // Restore the main website header
            const mainHeader = document.querySelector('.ant-layout-header, header, .header, #header');
            if (mainHeader) {
                mainHeader.style.display = '';
                mainHeader.style.opacity = '';
                mainHeader.style.visibility = '';
                mainHeader.style.height = '';
                mainHeader.style.overflow = '';
            }

            // Restore body styles
            document.body.style.overflow = '';
            document.body.style.backgroundColor = '';
        }

        // Cleanup function
        return () => {
            // Restore the main website header when component unmounts
            const mainHeader = document.querySelector('.ant-layout-header, header, .header, #header');
            if (mainHeader) {
                mainHeader.style.display = '';
                mainHeader.style.opacity = '';
                mainHeader.style.visibility = '';
                mainHeader.style.height = '';
                mainHeader.style.overflow = '';
            }

            // Restore body styles
            document.body.style.overflow = '';
            document.body.style.backgroundColor = '';
        };
    }, [isCinemaMode]);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await dispatch(episode(slug, decryptId(ep)));
                setEpisodeData(response);
                console.log(response);
            } catch (err) {
                console.error("❌ Fetch error:", err);
            } finally {
                setIsLoading(false);
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
        fetchComment();
        fetchData();
        fetchEpisodes();
    }, [dispatch, slug, decryptId(ep)]);
    useEffect(() => {
        if (!episodeData.movieResponse?.id) return;
        const fetchTotalComment = async () => {
            try {
                setIsLoading(true);
                const data = await dispatch(totalComment(episodeData.movieResponse?.id));
                setTotalComments(data);
            } catch (error) {
                console.error("Không thể tải tổng số bình luận:", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        const checkFvr = async () => {
            try {
                setIsLoading(true);
                const data = await dispatch(check(episodeData.movieResponse?.id));
                if (data) {
                    setCheckFavourite(data);
                    console.log("✅ Check favourite:", data);
                } else {
                    console.warn("⚠️ Không có dữ liệu yêu thích.");
                }
            } catch (error) {
                console.error("❌ Lỗi khi kiểm tra yêu thích:", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchTotalComment();
        checkFvr();
    }, [dispatch,episodeData.movieResponse?.id]);

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
    console.log(episodeData);
    const handleAddFavorite = async () => {
        try {
            const movieId = episodeData.movieResponse?.id;
            const response = await dispatch(pushFavourite(movieId));

            if (response === "Success") {
                message.success('Đã thêm vào mục yêu thích!');

                setCheckFavourite(true);

            } else {
                message.warning('Không thể thêm vào mục yêu thích.');
            }
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi thêm yêu thích.');
        }
    };
    if (isLoading) {
        return <div>Đang tải dữ liệu...</div>; // hoặc một loading spinner
    }
    const switchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };
    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    const closeRegisterModal = () => {
        setShowRegisterModal(false);
    };

    const switchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };


    const handleShare = async () => {
        const shareData = {
            title: 'Phim hay nè bạn mình ơiiii!',
            text: 'Xem ngay nhé!',
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
    // Function to toggle auto-play
    const toggleAutoPlay = () => {
        setAutoPlay(!autoPlay);
        if (!autoPlay) {
            message.success('Đã bật tự động chuyển tập', 2);
        } else {
            message.info('Đã tắt tự động chuyển tập', 2);
        }
    };

    const toggleCinemaMode = () => {
        setIsCinemaMode(!isCinemaMode);
    };

    const handleCommentSubmit = async () => {
        if (commentText.trim()) {
            try {
                const isShow = isSpoiler ? 1 : 0;

                const result = await dispatch(pushComment(commentText, episodeData.movieResponse.id, null, isShow));

                // Vì pushComment trả về res.data nên result chính là commentFromServer
                if (result) {
                    setComments(prev => [result, ...prev]);
                    setCommentText('');
                    setIsSpoiler(false);
                    message.success('Bình luận đã được gửi');
                } else {
                    message.error('Gửi bình luận thất bại');
                }
            } catch (error) {
                console.error(error);
                message.error('Đã xảy ra lỗi khi gửi bình luận');
            }
        }
    };



    // Function to handle reply button click
    const handleReply = (commentId) => {
        setReplyingTo(commentId);
    };
    const toggleReplyVisibility = async (commentId, index) => {
        const isVisible = replyVisible[index];

        // Nếu đang mở và chưa có dữ liệu reply thì fetch
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
    // Function to handle reply submission
    const handleReplySubmit = async (index) => {
        const content = replyText[index];
        const parentComment = comments[index]; // hoặc comment hiện tại
        const commentId = parentComment.id;
        const movieId = episodeData.movieResponse.id; // lấy từ comment hiện có
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

    // Function to cancel reply
    const cancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
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
    const handleButtonClick = (episode) => {
        // Điều hướng tới trang chi tiết của episode trong cùng cửa sổ
        window.location.href = `/watch/${slug}/${encryptId(episode)}`;
    };

    return (
        <Layout className={`watching-movie ${isCinemaMode ? 'cinema-mode' : ''}`}>
            {/* Simple Header Section */}
            {!isCinemaMode && (
                <div className="movie-header">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        className="back-button"
                        onClick={() => navigate(-1)}
                    />
                    <span className="movie-title">Xem phim {episodeData.movieResponse.title}</span>
                </div>
            )}

            {/* Video Player Section */}
            <div className={`video-player-section ${isCinemaMode ? 'fullscreen' : ''}`}>
                <div className="video-container">
                    <iframe
                        ref={iframeRef}
                        src={episodeData.videoUrl}
                        allowFullScreen
                        className="video-iframe"
                    />
                </div>
                <div className={`video-controls ${isCinemaMode ? 'cinema-controls' : ''}`}>
                    <div className="left-controls">
                        {!isCinemaMode && (
                            <>
                                <Button
                                    icon={checkFavourite ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                                    onClick={handleAddFavorite}
                                    disabled={checkFavourite}
                                >
                                    {checkFavourite ? 'Đã yêu thích' : 'Yêu thích'}
                                </Button>
                                <Button
                                    type="text"
                                    icon={autoPlay ? <CheckOutlined /> : <PlayCircleOutlined />}
                                    onClick={toggleAutoPlay}
                                    style={{
                                        color: autoPlay ? '#52c41a' : 'rgba(255, 255, 255, 0.85)',
                                        background: autoPlay ? 'rgba(82, 196, 26, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                        borderColor: autoPlay ? '#52c41a' : 'rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    {autoPlay ? 'Tự động chuyển tập' : 'Tự động chuyển tập'}
                                </Button>
                            </>
                        )}
                        <Button
                            type="text"
                            icon={isCinemaMode ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                            onClick={toggleCinemaMode}
                        >
                            {isCinemaMode ? 'Thoát rạp phim' : 'Rạp phim'}
                        </Button>
                        {!isCinemaMode && (
                            <Button icon={<ShareAltOutlined />} onClick={handleShare}>
                                Chia sẻ
                            </Button>
                        )}
                    </div>
                    {!isCinemaMode && (
                        <div className="right-controls">
                            <Button type="text" icon={<WarningOutlined />} className="report-button">
                                Báo lỗi phần chiếu video
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {!isCinemaMode && (
                <div className="main-content">
                    <Row gutter={24}>
                        {/* Left Section - 70% */}
                        <Col span={17} className="left-section">
                            <div className="episode-section">
                                <Tabs
                                    defaultActiveKey="1"
                                    activeKey={activeTab}
                                    onChange={setActiveTab}
                                    className="episode-tabs"
                                    items={[
                                        {
                                            key: '1',
                                            label: '',
                                            children: (
                                                <div className="episode-grid" style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                                    gap: '12px',
                                                    padding: '16px 0'
                                                }}>
                                                    {episodes.map((episode) => {
                                                        const isVipLocked = episode.vip && (vipDate || dayjs(vipDate).isBefore(dayjs(), 'day'));
                                                        return (
                                                            <Tooltip
                                                                key={episode.episodeNumber}
                                                                placement="top"
                                                                title={isVipLocked ? "Yêu cầu tài khoản VIP" : `Tập ${episode.episodeNumber}`}
                                                            >
                                                                <Button
                                                                    className={`episode-button ${episode.episodeNumber === activeEpisode ? 'active' : ''}`}
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
                                                                        height: 'auto',
                                                                        padding: '12px',
                                                                        background: episode.episodeNumber === activeEpisode ? 'rgba(24, 144, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                                                        border: episode.episodeNumber === activeEpisode ? '1px solid #1890ff' : '1px solid rgba(255, 255, 255, 0.1)',
                                                                        borderRadius: '8px',
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        gap: '4px',
                                                                        transition: 'all 0.3s ease',
                                                                        ':hover': {
                                                                            background: episode.episodeNumber === activeEpisode ? 'rgba(24, 144, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                                                            transform: isVipLocked ? 'none' : 'translateY(-2px)'
                                                                        },
                                                                        cursor: isVipLocked ? 'not-allowed' : 'pointer',
                                                                        opacity: isVipLocked ? 0.7 : 1
                                                                    }}
                                                                >
                    <span className="episode-number" style={{
                        color: episode.episodeNumber === activeEpisode ? '#1890ff' : '#fff',
                        fontWeight: '200',
                        fontSize: '14px'
                    }}>
                        Tập {episode.episodeNumber}
                        {episode.vip && (
                            <span style={{
                                marginLeft: '5px',
                                color: isVipLocked ? '#ff0000' : '#ff5722'
                            }}>
                                {isVipLocked ? '🔐' : '⭐'}
                            </span>
                        )}
                    </span>
                                                                    <span className="episode-duration" style={{
                                                                        color: episode.episodeNumber === activeEpisode ? 'rgba(24, 144, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                                                                        fontSize: '12px'
                                                                    }}>
                        {episode.duration}
                    </span>
                                                                </Button>
                                                            </Tooltip>
                                                        );
                                                    })}
                                                </div>
                                            ),
                                        },
                                    ]}
                                    style={{
                                        background: 'transparent'
                                    }}
                                />
                            </div>

                            {/* Comments Section */}
                            <div className="comments-container"
                                 style={{
                                     padding: '24px',
                                     background: '#1a1a1a',
                                     borderRadius: '12px',
                                     color: '#fff',
                                     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                 }}>
                                {/* Header Tabs */}
                                <div className="comments-header" style={{marginBottom: '24px'}}>
                                    <Tabs activeKey={commentType} onChange={setCommentType}>
                                        <TabPane
                                            tab={
                                                <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                    <CommentOutlined style={{fontSize: '16px'}}/>
                                                    <span>Bình luận</span>
                                                </span>
                                            }
                                            key="comment"
                                        />
                                    </Tabs>
                                </div>

                                {/* Comment Form */}
                                {userData ? (
                                    <div className="comment-form" style={{
                                        marginBottom: '24px',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        padding: '16px',
                                        borderRadius: '8px'
                                    }}>
                                        {/* User Info */}
                                        <div className="user-info" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '12px'
                                        }}>
                                            <div className="avatar" style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                backgroundColor: '#333',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '12px'
                                            }}>
                                                <UserOutlined style={{fontSize: '20px', color: '#fff'}}/>
                                            </div>
                                            <span className="username" style={{fontWeight: '500'}}>
                Bình luận với tên <strong>{userData.fullName}</strong>
            </span>
                                        </div>

                                        {/* TextArea */}
                                        <Input.TextArea
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Viết bình luận..."
                                            maxLength={255}
                                            rows={4}
                                            style={{
                                                width: '100%',
                                                height: '100px',
                                                resize: 'none',
                                                backgroundColor: '#000',
                                                color: '#fff',
                                                border: '1px solid #444',
                                                borderRadius: '8px',
                                                padding: '10px'
                                            }}
                                        />

                                        {/* Footer */}
                                        <div className="form-footer" style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginTop: '12px'
                                        }}>
                                            {/* Left: Spoiler */}
                                            <div className="left-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

                                            {/* Right: Count & Send */}
                                            <div className="right-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="char-count" style={{ color: '#aaa' }}>
                    {commentText.length}/255
                </span>
                                                <Button
                                                    className="send-button"
                                                    type="primary"
                                                    icon={<SendOutlined />}
                                                    onClick={() => {
                                                        if (!userData) {
                                                            alert("Bạn cần đăng nhập để bình luận.");
                                                            return;
                                                        }
                                                        handleCommentSubmit();
                                                    }}
                                                >
                                                    Gửi
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        marginBottom: '24px',
                                        padding: '16px',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        textAlign: 'center'
                                    }}>
                                        <p>
                                            Bạn cần{' '}
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    switchToLogin();
                                                }}
                                                style={{color: '#1890ff'}}
                                            >
                                                đăng nhập
                                            </a>{' '}
                                            để bình luận.
                                        </p>

                                    </div>
                                )}


                                {/* Comments List or Empty */}
                                {comments.length === 0 ? (
                                    <div className="comments-empty" style={{
                                        textAlign: 'center',
                                        color: '#aaa',
                                        padding: '32px 0'
                                    }}>
                                        <Empty description="Chưa có bình luận nào"/>
                                    </div>
                                ) : (
                                    <div className="comments-list"
                                         style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '16px'
                                         }}>
                                        {comments.map((comment,index) => (
                                            <div key={comment.id} className="comment-item"
                                                 style={{
                                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                    padding: '16px',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                                 }}>
                                                    {/* Header */}
                                                    <div className="comment-header"
                                                         style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            marginBottom: '12px'
                                                         }}>
                                                        <div className="avatar" style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#1890ff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginRight: '12px'
                                                        }}>
                                                            <UserOutlined style={{fontSize: '18px', color: '#fff'}}/>
                                                        </div>

                                                        <div className="user-info">
                                                            <div className="username"
                                                                 style={{
                                                                    fontWeight: '500',
                                                                    fontSize: '14px',
                                                                    color: '#fff'
                                                                 }}>{comment.user.fullName}</div>
                                                            <div className="timestamp" style={{
                                                                fontSize: '12px',
                                                                color: '#aaa'
                                                            }}> {dayjs(comment.createdAt).format("DD/MM/YYYY HH:mm")}</div>
                                                        </div>
                                                    </div>

                                                    <div className="comment-content"
                                                         style={{
                                                            fontSize: '14px',
                                                            lineHeight: '1.6',
                                                            color: '#eee'
                                                         }}>
                                                        {renderCommentContent(comment)}
                                                    </div>
                                                {userData && (
                                                    <div className="comment-actions" style={{
                                                        display: 'flex',
                                                        gap: '12px',
                                                        marginTop: '12px'
                                                    }}>
                                                        <Button
                                                            type="text"
                                                            icon={<MessageOutlined />}
                                                            onClick={() => handleReply(index)}
                                                            style={{
                                                                color: '#999',
                                                                padding: '4px 8px',
                                                                fontSize: '13px'
                                                            }}
                                                        >
                                                            Trả lời
                                                        </Button>
                                                    </div>
                                                )}
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
                                                        icon={replyVisible[index] ? <UpOutlined /> : <DownOutlined />}
                                                        onClick={() => toggleReplyVisibility(comment.id,index)}
                                                    >
                                                        {replyVisible[index]
                                                            ? 'Ẩn phản hồi'
                                                            : `Hiển thị ${comment.replyCount} phản hồi`}
                                                    </Button>

                                                )}


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
                                                            {/* Left: Spoiler */}
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

                                                )
                                                    )
                                                }

                                            </div>
                                        )}


                                    </div>

                                    </Col>
                                    </Row>
                                    </div>
                                    )}
                                <LoginModal
                                    isOpen={showLoginModal}
                                    onClose={closeLoginModal}
                                    onSwitchToRegister={switchToRegister}
                                />
                                <RegisterModal
                                    isOpen={showRegisterModal}
                                    onClose={closeRegisterModal}
                                    onSwitchToLogin={switchToLogin}
                                />
                            </Layout>

                            );
                            };

export default WatchingMovie;
