import { TmdbImage } from "./TmdbImage";

export interface TmdbImagesResponse {
    id: number;
    backdrops: TmdbImage[];
    logos: TmdbImage[];
    posters: TmdbImage[];
}
