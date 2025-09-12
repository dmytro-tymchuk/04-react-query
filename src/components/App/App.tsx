import { useState } from 'react'
import { movieSearch } from '../../services/movieService'
import SearchBar from '../SearchBar/SearchBar'
import styles from './App.module.css'
import type { Movie } from '../../types/movie'
import toast, { Toaster } from 'react-hot-toast'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'

const App = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState(Object);

    const handleSubmit = async (submitValue: string) => {
        setMovies([]);
        setErrorMessage(false)
        setLoading(true)
        try {
            const newMovies = await movieSearch(submitValue);
            if (newMovies.length === 0) {
                toast.error("No movies found for your request.")
                setLoading(false)
                return
            }
            setMovies(newMovies);
            setLoading(false)
        } catch (err) {
            setErrorMessage(true)
        } finally {
            setLoading(false)
        }
    }
    
    const handleSelect = (movie: Movie) => {
        setSelectedMovie(movie)
        setIsModalOpen(true)
        
    }

    const handleClose = () => {
        setIsModalOpen(false)
    }
    
    return (<div className={styles.app}>
        <Toaster />
        <SearchBar onSubmit={handleSubmit} />
        {loading && <Loader />}
        {errorMessage ? (<ErrorMessage />) : <MovieGrid onSelect={handleSelect} movies={movies} />}
        {isModalOpen && <MovieModal movie={selectedMovie} onClose={handleClose}/>}
    </div>)
}

export default App