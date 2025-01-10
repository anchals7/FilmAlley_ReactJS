import React from 'react';

const MovieCard = ({movie}) => {
    return (
        <div className="card">
            <div>
                <p>{movie.Year}</p>
            </div>
            <div>
                <img src={movie.Poster} alt={movie.Title} />
            </div>
            <div>
                <span>{movie.Type}</span>
                <h3>{movie.Title}</h3>
            </div>
        </div>
    )
}

export default MovieCard;