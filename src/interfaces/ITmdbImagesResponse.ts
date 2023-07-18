import { ITmdbImage } from "./ITmdbImage";

export interface ITmdbImagesResponse {
    id: number;
    backdrops: ITmdbImage[];
    logos: ITmdbImage[];
    posters: ITmdbImage[];
}
