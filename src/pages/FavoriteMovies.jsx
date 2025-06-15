import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../components/movie-grid/movie-grid.scss';

import MovieCard from '../components/movie-card/MovieCard';
import { Pagination } from 'antd';
import {countryMovies, genresMovies, releaseYearMovies} from "../Redux/actions/MovieThunk";
import {searchFavorite} from "../Redux/actions/FavouriteThunk";

import { useDispatch } from "react-redux";
import { FiSearch } from 'react-icons/fi';

const FavouriteMovies = () => {
    const [searchItems, setSearchItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [releaseYears, setReleaseYears] = useState([]);
    const [genres, setGenres] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        releaseYear: '',
        genre: '',
        country: ''
    });
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem('USER_LOGIN');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0
    });
    const dispatch = useDispatch();
    const { keyword } = useParams();

    useEffect(() => {
        const getListSearch = async () => {
            try {
                setLoading(true);
                const searchParams = {
                    keyword: keyword || '',
                    country: selectedFilters.country || '',
                    releaseYear: selectedFilters.releaseYear || '',
                    genreId: selectedFilters.genre || '',
                    page: pagination.current,
                    size: pagination.pageSize
                };

                const response = await dispatch(searchFavorite(userData?.id,searchParams));

                if (response?.content) {
                    setSearchItems(response.content);
                    setPagination(prev => ({
                        ...prev,
                        total: response.totalElements,
                        current: response.currentPage,
                        pageSize: response.pageSize
                    }));
                } else {
                    setError('Không có dữ liệu trả về');
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const getGenres = async () => {
            try {
                setLoading(true);
                let response = await dispatch(genresMovies());
                if (response.content) {
                    setGenres(response.content);
                } else {
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                console.error("Đã xảy ra lỗi:", error);
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        };

        const getCountries = async () => {
            try {
                setLoading(true);
                let response = await dispatch(countryMovies());
                if (response) {
                    const country = response
                        .map(ct => ({ id: ct, name: ct }))
                        .sort((a, b) => a.name === 'Quốc Gia Khác' ? 1 : -1);

                    setCountries(country);
                } else {
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                console.error("Đã xảy ra lỗi:", error);
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        };

        const getReleaseYears = async () => {
            try {
                let response = await dispatch(releaseYearMovies());
                if (response) {
                    const yearsData = response.map(year => ({
                        id: year,
                        name: year
                    }));
                    setReleaseYears(yearsData);
                } else {
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                console.error("Đã xảy ra lỗi:", error);
                setError(error.message);
            }
        };

        getListSearch();
        if (genres.length === 0) getGenres();
        if (countries.length === 0) getCountries();
        if (releaseYears.length === 0) getReleaseYears();
    }, [keyword, dispatch,selectedFilters,pagination.current]);

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        // Reset về trang đầu tiên khi thay đổi filter
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handlePageChange = (page, pageSize) => {
        setPagination(prev => ({ ...prev, current: page, pageSize }));
    };
    const applyFilters = async () => {
        try {
            setLoading(true);
            // Reset về trang đầu tiên khi áp dụng filter
            setPagination(prev => ({ ...prev, current: 1 }));

            const searchParams = {
                keyword: keyword || '',
                country: selectedFilters.country || '',
                releaseYear: selectedFilters.releaseYear || '',
                genre: selectedFilters.genre || '',
                page: 1,
                size: pagination.pageSize
            };

            const response = await dispatch(searchFavorite(userData?.id,searchParams));
            if (response?.content) {
                setSearchItems(response.content);
                setPagination(prev => ({
                    ...prev,
                    total: response.totalElements || 0
                }));
            } else {
                setError('Không có dữ liệu trả về');
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="search-result-header"
                 style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem'}}>

                <button
                    onClick={() => setShowFilter(!showFilter)}
                    style={{
                        backgroundColor: '#facc15',
                        color: '#000',
                        marginTop: '0.5rem',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        fontWeight: '500',
                    }}
                >
                    {showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                </button>
            </div>

            {showFilter && (
                <div
                    style={{
                        backgroundColor: '#121212',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '0.375rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        marginBottom: '1rem'
                    }}
                >
                    <div style={{
                        fontWeight: '600',
                        fontSize: '1.125rem',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <span style={{color: '#facc15'}}></span> Bộ lọc
                    </div>

                    <FilterGroup
                        title="Quốc gia"
                        items={countries}
                        selected={selectedFilters.country}
                        onSelect={(value) => handleFilterChange('country', value)}
                    />
                    <FilterGroup
                        title="Thể loại"
                        items={genres}
                        selected={selectedFilters.genre}
                        onSelect={(value) => handleFilterChange('genre', value)}
                    />
                    <FilterGroup
                        title="Năm sản xuất"
                        items={releaseYears}
                        selected={selectedFilters.releaseYear}
                        onSelect={(value) => handleFilterChange('releaseYear', value)}
                    />

                    <div style={{display: 'flex', gap: '1rem'}}>
                        <button
                            style={{
                                backgroundColor: '#facc15',
                                color: 'black',
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                            }}
                            onClick={applyFilters}
                        >
                            Lọc kết quả ➜
                        </button>
                        <button
                            style={{
                                border: '1px solid white',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                backgroundColor: 'transparent'
                            }}
                            onClick={() => setShowFilter(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <>
                    <div className="movie-grid">
                        {searchItems.length > 0 ? (
                            searchItems.map((item) => (
                                <MovieCard
                                    key={item.id}
                                    item={{
                                        id: item.id,
                                        title: item.title,
                                        poster_path: item.posterUrl,
                                        backdrop_path: item.thumbnailUrl,
                                        slug: item.slug,
                                        releaseYear: item.releaseYear,
                                        duration: item.duration,
                                        averageRating: item.averageRating,
                                        episodeCount: item.episodeCount,
                                        status: item.status,
                                        genres: item.genres
                                    }}
                                />
                            ))
                        ) : (
                            <div>Không tìm thấy kết quả phù hợp</div>
                        )}
                    </div>

                    {searchItems.length > 0 && (
                        <div className="pagination-wrapper">
                            <Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={pagination.total}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                responsive
                            />
                        </div>
                    )}


                </>
            )}
        </>
    );
};


const FilterGroup = ({ title, items = [], selected, onSelect }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ minWidth: '100px', fontWeight: '500' }}>{title}:</span>
            <button
                style={{
                    fontSize: '0.875rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    backgroundColor: !selected ? '#facc15' : 'transparent',
                    color: !selected ? 'black' : 'white',
                    border: !selected ? 'none' : '1px solid white'
                }}
                onClick={() => onSelect('')}
            >
                Tất cả
            </button>
            {items.map((item) => (
                <button
                    key={item.id}
                    style={{
                        fontSize: '0.875rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        backgroundColor: selected === item.id ? '#facc15' : 'transparent',
                        color: selected === item.id ? 'black' : 'white',
                        border: selected === item.id ? 'none' : '1px solid white'
                    }}
                    onClick={() => onSelect(item.id)}
                >
                    {item.name}
                </button>
            ))}
        </div>
    );
};

export default FavouriteMovies;