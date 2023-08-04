export interface ReviewDto {
    watcherTag: string;
    movieId: number;
    rating: number;
    message?: string;
    postedTime: Date;
}
