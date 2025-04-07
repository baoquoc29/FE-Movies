import React from "react";
import "./Loading.css";

const Loading = ({ count = 8 }) => {
    return (
        <div className="movie-loading-container">
            {Array.from({ length: count }).map((_, index) => (
                <div className="movie-skeleton" key={index}>
                    <div className="poster-placeholder"></div>
                    <div className="text-placeholder long"></div>
                    <div className="text-placeholder short"></div>
                </div>
            ))}
        </div>
    );
};

export default Loading;
