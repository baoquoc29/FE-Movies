import React, { useState, useEffect } from 'react';
import '../movie-grid/movie-grid.scss';
import { Pagination } from 'antd';
import {getAllActor} from "../../Redux/actions/MovieThunk";
import { useDispatch } from "react-redux";
import ActorCard from "../actor/ActorCard";

const ActorGird = () => {
    const [actor, setActor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 48,
        total: 0
    });
    const dispatch = useDispatch();
    useEffect(() => {
        const getActors = async () => {
            try {
                setLoading(true);
                const param = {
                    page: pagination.current,
                    size: pagination.pageSize
                };
                const response = await dispatch(getAllActor(param));
                if (response?.content) {
                    setActor(response.content);
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
        getActors();
    }, [
        dispatch,
        pagination.current,
        pagination.pageSize]);

    const handlePageChange = (page, pageSize) => {
        setPagination(prev => ({ ...prev, current: page, pageSize }));
    };
    return (
        <>
            <div className="search-result-header"
                 style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem'}}>
                </div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <>
                    <div className="movie-grid">
                        {actor.length > 0 ? (
                            actor.map((item) => (
                                <ActorCard
                                    key={item.id}
                                    item={{
                                        id: item.id,
                                        name: item.name,
                                        bio: item.bio,
                                        birthDate: item.birthDate,
                                        profileUrl: item.profileUrl,
                                    }}
                                />
                            ))
                        ) : (
                            <div>Không tìm thấy kết quả phù hợp</div>
                        )}
                    </div>

                    {actor.length > 0 && (
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


export default ActorGird;