import React from 'react';
import './AdminMovieDetail.scss';
import { Card, CardContent, Divider, Box, Grid } from '@mui/material';
import dayjs from 'dayjs';
const MovieDetailTab = ({movie}) => {

    return (
        <div className='admin-movie-detail-container'>
            <div className='admin-poster-movie-detail'>
                <img src={movie?.posterUrl ? movie.posterUrl : require('../../../../assets/no_image.png')} width={'100%'} height={300} alt="Movie Poster" />
            </div>
            <div className='admin-movie-detail-content'>
                <div className='admin-movie-detail-thumbnail'>
                    <img src={movie?.thumbnailUrl ? movie.thumbnailUrl : require('../../../../assets/no_image.png')} width={200} height={300} style={{borderRadius: '8px'}} alt="Movie Thumbnail" />
                </div>
                <div className='admin-movie-detail-info'>
                    <div className='admin-movie-detail-title'>Tiêu đề: {movie.title}</div>
                    <div className='admin-movie-detail-genre'>Thể loại: {movie.genres.map(genre => genre.name).join(', ')}</div>
                    <div className='admin-movie-detail-attributes'>
                        <div className='admin-movie-detail-attribute'>Quốc gia: {movie?.country}</div>
                        <div className='admin-movie-detail-attribute'>Năm phát hành: {movie?.realeaseYear ? movie.realeaseYear : 'Đang cập nhật'}</div>
                        <div className='admin-movie-detail-attribute'> Thời gian mỗi tập: {movie?.duration ? `${movie.duration} phút` : 'Đang cập nhật'}</div>
                        <div className='admin-movie-detail-attribute'>Đạo diễn: {movie?.director ? movie.director : "Đang cập nhật"}</div>
                        <div className='admin-movie-detail-attribute'>Lượt xem: {movie?.viewCount ? movie.viewCount : 0}</div>
                        <div className='admin-movie-detail-attribute'>Đánh giá: {movie.averageRating} ({movie.ratingCount} đánh giá)</div>
                        <div className='admin-movie-detail-attribute'>Ngày tạo: {dayjs(movie.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>
                        <div className='admin-movie-detail-attribute'>Ngày cập nhật: {movie?.updatedAt? dayjs(movie.updatedAt).format('HH:mm:ss DD/MM/YYYY'): "Đang cập nhật"}</div>
                        <div className='admin-movie-detail-attribute'>Phim vip: {movie.restrictedAccess === true ? 'Có': 'Không'}</div>
                    </div>
                </div>
            </div>
            <Divider style={{margin: '1rem 0'}}/>
            <div className='admin-movie-detail-description'>
                <div className='admin-movie-detail-description-title'><span className='admin-detail-menu-title'>Mô tả</span></div>
                <div className='admin-movie-description-content' dangerouslySetInnerHTML={{ __html: `${movie?.description}` }} />
            </div>
            <Divider style={{margin: '1rem 0'}}/>
            <div className='admin-movie-detail-actor'>
                <div className='admin-movie-detail-actor-title'>
                    <span className='admin-detail-menu-title'>Diễn viên</span>
                </div>
                <div style={{ marginTop: '1rem' }}>
                <Grid container spacing={3}>
                    {movie?.actors?.map((actor, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <Card variant="outlined" sx={{ minWidth: 250, borderRadius: '8px' }}>
                                <CardContent>
                                    <img
                                        src={actor?.avatarUrl ? actor.avatarUrl : require('../../../../assets/no_image.png')}
                                        width="100%"
                                        height={200}
                                        style={{ borderRadius: '8px' }}
                                        alt="Actor Thumbnail"
                                    />
                                    <p
                                        style={{ textAlign: 'center', fontWeight: '600' }}
                                        className="admin-movie-detail-actor-name"
                                    >
                                        {actor.name}
                                    </p>
                                    <p
                                        style={{ textAlign: 'center' }}
                                        className="admin-movie-detail-role-name"
                                    >
                                        {actor.roleName}
                                    </p>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
            </div>
        </div>
    );
};

export default MovieDetailTab;