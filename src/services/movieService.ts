import axios from "axios"
import type { Movie } from '../types/movie';

interface FetchResponse{
    results: Movie[];
}

export const movieSearch = async(submitValue: string) => {
    const response = await axios.get<FetchResponse>(`https://api.themoviedb.org/3/search/movie`, {
        params: {
            query: submitValue
        },
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
    });
    return response.data.results
}