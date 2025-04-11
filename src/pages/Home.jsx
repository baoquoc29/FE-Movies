import React from 'react';
import { Link } from 'react-router-dom';

import { OutlineButton } from '../components/button/Button';
import HeroSlide from '../components/hero-slide/HeroSlide';
import MovieList from '../components/movie-list/MovieList';

const Home = () => {
    return (
        <>
            <HeroSlide/>
            <div className="container">
                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Phim mới</h2>
                    </div>
                    <MovieList type={"similar"} page={1} />
                </div>

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Phim Nổi Bật</h2>
                    </div>
                    <MovieList type={"popular"} page={2} />
                </div>


                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Top Phim Hay</h2>
                    </div>
                    <MovieList type={"top-rated"} page={3} />
                </div>
            </div>
        </>
    );
}

export default Home;
