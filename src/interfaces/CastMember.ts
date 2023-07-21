import { IMovieDto } from "./IMovieDto";

export interface CastMember{
    name: string;
    character: string;
    movie: IMovieDto[];
}