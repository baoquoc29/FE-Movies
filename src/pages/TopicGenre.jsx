import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'; // ⚠️ BẠN BỎ QUÊN CÁI NÀY
import { genresMovies } from '../Redux/actions/MovieThunk';
import { useNavigate } from 'react-router-dom';
const gradients = [
    'linear-gradient(135deg, #3a7bd5, #3a6073)',
    'linear-gradient(135deg, #cc2b5e, #753a88)',
    'linear-gradient(135deg, #56ab2f, #a8e063)',
    'linear-gradient(135deg, #614385, #516395)',
    'linear-gradient(135deg, #1c92d2, #f2fcfe)',
    'linear-gradient(135deg, #43cea2, #185a9d)',
    'linear-gradient(135deg, #ff9966, #ff5e62)',
    'linear-gradient(135deg, #11998e, #38ef7d)',
    'linear-gradient(135deg, #c31432, #240b36)',
    'linear-gradient(135deg, #f12711, #f5af19)',
    'linear-gradient(135deg, #DA4453, #89216B)',
    'linear-gradient(135deg, #2980B9, #6DD5FA)',
];

const TopicGenre = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const handleCardClick = (id) => {
        navigate(`/search/genre/${encodeURIComponent(id)}`);
    };
    useEffect(() => {
        const getGenres = async () => {
            try {
                setLoading(true);
                const response = await dispatch(genresMovies());
                if (response) {
                    setTopics(response.content); // ✅ set lại dữ liệu vào state
                } else {
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                console.error('Đã xảy ra lỗi:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getGenres(); // ⚠️ bạn viết sai chỗ khi gọi hàm này
    }, [dispatch]);

    if (loading) return <div style={{ padding: 40, color: 'white' }}>Đang tải...</div>;
    if (error) return <div style={{ padding: 40, color: 'red' }}>Lỗi: {error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Các chủ đề</h1>
            <div style={styles.grid}>
                {topics.map((topic, index) => (
                    <div
                        key={topic.id || index}
                        onClick={() => handleCardClick(topic.id)}
                        style={{
                            ...styles.card,
                            background: gradients[index % gradients.length],
                        }}
                    >
                        <div style={styles.cardContent}>
                            <h2 style={styles.cardTitle}>{topic.name || topic}</h2>
                            <p style={styles.cardLink}>Xem toàn bộ &rarr;</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#0e0e13',
        minHeight: '100vh',
        padding: '40px',
        marginTop: '100px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '28px',
        marginBottom: '30px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '20px',
    },
    card: {
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
        fontWeight: 'bold',
        minHeight: '120px',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: '18px',
        margin: 0,
    },
    cardLink: {
        marginTop: '16px',
        fontSize: '14px',
        fontWeight: 'normal',
    },
};

export default TopicGenre;
