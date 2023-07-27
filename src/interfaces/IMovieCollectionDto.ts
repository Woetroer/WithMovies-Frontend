export interface IMovieCollectionDto {
    id: number,
    name: string,
    posterPath?: string,
    backdropPath?: string,
    movies: number[],
}