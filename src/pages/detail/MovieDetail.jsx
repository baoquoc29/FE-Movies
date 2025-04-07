import React, { useState } from 'react';
import { Layout, Row, Col, Button,Tabs, Rate, Tag, Divider, Badge } from 'antd';
import { HeartOutlined, PlusOutlined,MessageOutlined, ShareAltOutlined, CommentOutlined, PlayCircleOutlined } from '@ant-design/icons';
import './MovieDetail.scss';

const { Content } = Layout;
const MovieDetail = () => {
    const [activeTab, setActiveTab] = useState('episodes');
    const { TabPane } = Tabs;
    // Mock data - replace with actual data
    const movie = {
        title: "Mật Vụ Phụ Hồ",
        englishTitle: "A Working Man",
        rating: 8.0,
        imdb: 6.0,
        year: 2025,
        duration: "1h 56m",
        country: "Mỹ",
        production: "Warner Bros",
        director: "David Ayer",
        genres: ["Hành Động", "Chiếu Rạp", "Gay Cấn", "Hình Sự"],
        cast: [
            {
                name: "Jason Statham",
                avatar: "https://image.tmdb.org/t/p/w200/8Z7cq5pUkzQBE8nZWHfQJYwHjdT.jpg"
            },
            {
                name: "Michael Peña",
                avatar: "https://image.tmdb.org/t/p/w200/6aOYYY0hb5yQSh5y6qQrWKR3yAs.jpg"
            },
            {
                name: "Emmy Raver-Lampman",
                avatar: "https://image.tmdb.org/t/p/w200/uKydQqIvZxQYQ13XHZUnBZAJ3tm.jpg"
            }
        ],
        poster: "https://i.imgur.com/TRdD9Lo.jpg",
        backdropImage: "https://images2.thanhnien.vn/528068263637045248/2025/4/4/1-1-1743734536239340252439.jpg",
        description: "Levon Cade - cựu biệt kích tình nhuệ thuộc lực lượng Thủy quân Lục chiến Hoàng gia Anh. Sau khi nghỉ hưu, anh sống cuộc đời yên bình là một công nhân xây dựng tại Chicago (Mỹ). Levon có mối quan hệ rất tốt với gia đình ông chủ Joe Garcia (Michael Peña). Một ngày nọ, có con gái tuổi teen...",
        commentCount: 8
    };

    return (
        <Layout className="movie-detail">
            <div className="movie-header-background">
                <img src={movie.backdropImage} alt="" className="backdrop-image"/>
            </div>

            <Content className="movie-content">
                <Row gutter={24}>
                    {/* Cột bên trái - chiếm 4 phần (40%) */}
                    <Col xs={24} lg={10} className="movie-info-column">
                        <div className="movie-header">
                            <div className="movie-poster">
                                <img src={movie.poster} alt={movie.title}/>
                            </div>

                            <div className="movie-info">
                                <h1>{movie.title}</h1>
                                <h2>{movie.englishTitle}</h2>

                                <div className="movie-meta">
                                    <div className="rating-box">
                                        <span className="imdb-rating">IMDb {movie.imdb}</span>
                                        <Tag>{movie.year}</Tag>
                                    </div>
                                </div>

                                <div className="movie-details">
                                    <div className="detail-item">
                                        <div className="genre-tags">
                                            {movie.genres.map(genre => (
                                                <Tag key={genre}>{genre}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <label>Giới thiệu</label>
                                        <span>{movie.description}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Thời lượng</label>
                                        <span>{movie.duration}</span>
                                    </div>

                                    <div className="detail-item">
                                        <label>Quốc gia</label>
                                        <span>{movie.country}</span>
                                    </div>

                                    <div className="detail-item">
                                        <label>Sản xuất</label>
                                        <span>{movie.production}</span>
                                    </div>

                                    <div className="detail-item">
                                        <label>Đạo diễn</label>
                                        <span>{movie.director}</span>
                                    </div>

                                    <label className="section-label">Diễn viên</label>
                                    <div className="cast-list">
                                        {movie.cast.map((actor, index) => (
                                            <div key={index} className="cast-item">
                                                <div className="actor-avatar">
                                                    <img
                                                        src={actor.avatar || '/'}
                                                        alt={actor.name}
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

                    <Col xs={24} lg={24} className="movie-content-column">
                        <div className="right-content full-width">
                            <div className="action-buttons">
                                <Button type="primary" icon={<PlayCircleOutlined/>} size="large" className="watch-now-btn">
                                    Xem Ngay
                                </Button>
                                <Button icon={<HeartOutlined/>}>
                                    Yêu thích
                                </Button>
                                <Button icon={<PlusOutlined/>}>
                                    Thêm vào
                                </Button>
                                <Button icon={<ShareAltOutlined/>}>
                                    Chia sẻ
                                </Button>
                                <Button icon={<CommentOutlined/>}>
                                    Bình luận
                                </Button>
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
                                                <div className="episode-item">
                                                    <div className="episode-number">Tập 1</div>
                                                </div>
                                                <div className="episode-item">
                                                    <div className="episode-number">Tập 2</div>
                                                </div>
                                                <div className="episode-item">
                                                    <div className="episode-number">Tập 3</div>
                                                </div>
                                                <div className="episode-item">
                                                    <div className="episode-number">Tập 4</div>
                                                </div>
                                                <div className="episode-item">
                                                    <div className="episode-number">Tập 5</div>
                                                </div>
                                                <div className="episode-item">
                                                    <div className="episode-number">Tập 6</div>
                                                </div>
                                                <div className="episode-item">
                                                    <div className="episode-number">Tập 7</div>
                                                </div>
                                                <div className="episode-item">
                                                    <div className="episode-number">Tập 8</div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab={<span className="tab-label">Gallery</span>} key="2">
                                        <div className="tab-content">
                                            <div className="gallery-grid">
                                                <div className="gallery-item">
                                                    <img src="https://via.placeholder.com/200x300" alt="Gallery 1" />
                                                </div>
                                                <div className="gallery-item">
                                                    <img src="https://via.placeholder.com/200x300" alt="Gallery 2" />
                                                </div>
                                                <div className="gallery-item">
                                                    <img src="https://via.placeholder.com/200x300" alt="Gallery 3" />
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab={<span className="tab-label">Diễn viên</span>} key="3">
                                        <div className="tab-content">
                                            <div className="cast-grid">
                                                {movie.cast.map((actor, index) => (
                                                    <div key={index} className="cast-card">
                                                        <div className="cast-avatar">
                                                            <img src={actor.avatar} alt={actor.name} />
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
                                                <div className="recommendation-item">
                                                    <img src="https://via.placeholder.com/150x225" alt="Movie 1" />
                                                    <div className="recommendation-title">Phim đề xuất 1</div>
                                                </div>
                                                <div className="recommendation-item">
                                                    <img src="https://via.placeholder.com/150x225" alt="Movie 2" />
                                                    <div className="recommendation-title">Phim đề xuất 2</div>
                                                </div>
                                                <div className="recommendation-item">
                                                    <img src="https://via.placeholder.com/150x225" alt="Movie 3" />
                                                    <div className="recommendation-title">Phim đề xuất 3</div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Col>
                        <div className="comments-section">
                            <div className="comments-header">
                                <h3>Bình luận ({movie.commentCount || 97})</h3>
                            </div>

                            <div className="comment-list">
                                {/* Comment 1 */}
                                <div className="comment-item">
                                    <div className="comment-author">Thành nam</div>
                                    <div className="comment-time">14 phút trước</div>
                                    <div className="comment-content">
                                        Nghề trong phím tiếp theo sẽ là diễn viên đóng phím jav,ok đi nhạ,đối qua phím
                                        tình cảm nhẹ nhàng thứ xem sao
                                    </div>
                                </div>
                            </div>

                            <div className="comment-actions">
                                <Button type="text" icon={<MessageOutlined/>}>Trả lời</Button>
                                <Button type="text" icon={<PlusOutlined/>}>Thêm</Button>
                            </div>

                            <div className="view-more-comments">
                                <Button type="link">Xem thêm 1 bình luận</Button>
                            </div>
                        </div>
                </Col>

            </Row>
        </Content>
</Layout>
)
    ;
}

export default MovieDetail;