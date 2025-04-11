import React from 'react';

import { useParams } from 'react-router';

import MovieGrid from '../components/movie-grid/MovieGrid';

const Catalog = () => {


    return (
        <>
            <div className="container">
                <div className="section mb-3">
                    <MovieGrid/>
                </div>
            </div>
        </>
    );
}

export default Catalog;
