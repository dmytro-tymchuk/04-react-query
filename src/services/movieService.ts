import axios from "axios"
import type { Movie } from '../types/movie';

interface FetchResponse{
    results: Movie[];
    total_pages: number
}

export const movieSearch = async(submitValue: string, page: number): Promise<FetchResponse> => {
    const response = await axios.get<FetchResponse>(`https://api.themoviedb.org/3/search/movie`, {
        params: {
            query: submitValue,
            page: page
        },
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
    });
    return response.data
}