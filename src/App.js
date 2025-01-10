import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import './App.css';
import searchIcon from './search_icon.png';

//c2729b24

const API_KEY = 'c2729b24';
const API_URL = 'https://www.omdbapi.com/?apikey=' + API_KEY;



const App = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const searchMovies = async (title) => {
        const response = await fetch(`${API_URL}&s=${title}`);
        const data = await response.json();

        console.log(data.Search);
        setMovies(data.Search);
    }

    useEffect(() => {
        searchMovies('harry potter');
    }, [])  // [] -> dependency list

    return (
        
        <div className="app">
            <h1>FilmAlley</h1>
            <div className="search-box">
                <input placeholder="Search for a movie..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <button onClick={() => searchMovies(searchTerm)}><img src={searchIcon} alt="search"/></button>
            </div>

            {
                movies?.length > 0
                    ? (
                        <div className="content">
                            {movies.map((movie) => (<MovieCard movie={movie} />))}
                        </div>
                    ) : (
                        <div>
                            <h2>No movies found</h2>
                        </div>
                    )
            }

        </div>
        
    );
}

export default App;