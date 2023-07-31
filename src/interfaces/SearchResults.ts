import { MoviePreview } from "./MoviePreview";

export interface SearchResults {
    time: number;
    keywords: string[];
    movies: MoviePreview[];
}
