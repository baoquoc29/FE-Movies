import '../movie-card/movie-card.scss';
import { Link } from 'react-router-dom';
import Button from '../button/Button';
import React, { useState } from 'react';

const ActorCard = ({ item }) => {
    const [isHovered, setIsHovered] = useState(false);
    const bg = item.profileUrl || 'default-actor-image.jpg';

    return (
        <div
            className="actor-card-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            }}
        >
            <Link to={`/actor/practice/${encodeURIComponent(item.id)}`}>
                <div
                    className="actor-movie-card"
                    style={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '150%',
                        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent), url(${bg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: isHovered
                            ? '0 10px 20px rgba(0, 0, 0, 0.3)'
                            : '0 4px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            padding: '10px',
                            textAlign: 'center',
                        }}
                    >
                        <h3
                            style={{
                                color: '#fff',
                                margin: 0,
                                fontSize: '16px',
                                fontWeight: 'bold',
                                textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
                            }}
                        >
                            {item.name}
                        </h3>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ActorCard;
