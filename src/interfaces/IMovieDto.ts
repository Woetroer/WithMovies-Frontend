import { CastMember } from "./CastMember";
import { IMovieCollectionDto } from "./IMovieCollectionDto";
import { INamedId } from "./INamedId";
import { MovieStatus } from "./MovieStatus";

export interface IMovieDto {
    imdbId?: string,
    belongsToCollection?: IMovieCollectionDto,
    title?: string,
    tagline?: string,
    originalLanguage?: string,
    originalTitle?: string,
    adult: boolean,
    overview?: string,
    budget: number,
    genres?: number[],
    homePage?: string,
    posterPath?: string,
    productionCompanies?: INamedId[],
    productionCountries?: (string | null)[],
    releaseDate?: Date,
    revenue: number,
    // TODO: Find out way to parse runtime
    Runtime?: { start: number, end: number, },
    spokenLanguages?: (string)[],
    status: MovieStatus,
    voteAverage: number,
    voteCount: number,
    popularity: number,
    keywords: string[],
    cast: CastMember[],
}