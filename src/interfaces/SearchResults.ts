import { MoviePreview } from "./MoviePreview";

export interface SearchResults {
    time: number;
    movies: MoviePreview[];
    resultCount: number;
}
