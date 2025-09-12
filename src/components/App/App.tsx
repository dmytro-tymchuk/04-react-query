import { useState } from 'react'
import { movieSearch } from '../../services/movieService'
import SearchBar from '../SearchBar/SearchBar'
import styles from './App.module.css'
import type { Movie } from '../../types/movie'
import  { Toaster } from 'react-hot-toast'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ReactPaginate from 'react-paginate'

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState(Object);
    const [submitV, setSubmitV] = useState<string>("")
    const [page, setPage] = useState(1);

   


    const {data, isError, isLoading} = useQuery({
            queryKey: ['movie', submitV, page],
            queryFn: () => movieSearch(submitV, page),
            enabled: !!submitV,
            placeholderData: keepPreviousData
    });
    
    const totalPages = data?.total_pages ?? 0;
    const hasResults = (data?.results?.length ?? 0) > 0;
    const showPagination = totalPages > 1 && hasResults;
    
    const handleSubmit = async (submitValue: string) => {
        setSubmitV(submitValue);
        setPage(1)
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
        {showPagination && <ReactPaginate
            pageCount={data?.total_pages ?? 0}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            nextLabel="→"
            previousLabel="←"
            renderOnZeroPageCount={null}
        />}
        {isLoading && <Loader />}
        {isError ? (<ErrorMessage />) : <MovieGrid onSelect={handleSelect} movies={data?.results ?? []} />}
        {isModalOpen && <MovieModal movie={selectedMovie} onClose={handleClose}/>}
    </div>)
}

export default App