import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { MoviePreview } from "src/interfaces/MoviePreview";
import { Observable } from "rxjs";
import { SearchQuery } from "../searchbar/SeachQuery";
import { KeywordService } from "./keyword.service";
import { IMovieDto } from "src/interfaces/IMovieDto";
import { Genre } from "src/interfaces/Genre";
import { IndexRange, LazyLoadedArray } from "src/LazyLoadedArray";
import { AuthService } from "./auth.service";
import { toObservable } from "src/ToObservable";

@Injectable({
    providedIn: "root",
})
export class MovieService {
    static client: HttpClient;

    trendingMovies: LazyLoadedArray<MoviePreview>;
    trendingRecommendedMovies: LazyLoadedArray<MoviePreview>;
    friendMovies: LazyLoadedArray<MoviePreview>;
    watchlist: LazyLoadedArray<MoviePreview>;

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService
    ) {
        MovieService.client = httpClient;

        this.trendingMovies = new LazyLoadedArray(MovieService._getTrending);
        this.trendingRecommendedMovies = new LazyLoadedArray(
            MovieService._getTrendingRecommended
        );
        this.friendMovies = new LazyLoadedArray(MovieService._getTrending);
        this.watchlist = new LazyLoadedArray(MovieService._getTrending);
    }

    public getTrending(start: number, limit: number) {
        return toObservable(
            this.trendingMovies.getRange(new IndexRange(start, start + limit))
        );
    }

    private static _getTrending(range: IndexRange) {
        return new Promise<MoviePreview[]>((res) =>
            MovieService.client
                .get<MoviePreview[]>(
                    environment.apiUrl +
                        `movie/trending/${range.start}/${range.count()}`
                )
                .subscribe(res)
        );
    }

    public getTrendingRecommended(start: number, limit: number) {
        return toObservable(
            this.trendingRecommendedMovies.getRange(
                new IndexRange(start, start + limit)
            )
        );
    }

    private static _getTrendingRecommended(range: IndexRange) {
        return new Promise<MoviePreview[]>((res) =>
            MovieService.client
                .get<MoviePreview[]>(
                    environment.apiUrl +
                        `movie/trending/recommended/${
                            range.start
                        }/${range.count()}`
                )
                .subscribe(res)
        );
    }

    public getFriendMovies(start: number, limit: number) {
        return toObservable(
            this.friendMovies.getRange(new IndexRange(start, start + limit))
        );
    }

    public getWatchlist(start: number, limit: number) {
        return toObservable(
            this.watchlist.getRange(new IndexRange(start, start + limit))
        );
    }

    review(movieId: number, rating: number, message: string | undefined) {
        message = message?.trim();

        if (message?.length == 0)
            message = undefined;

        return this.httpClient.post(environment.apiUrl + "review/create", { movieId, rating, message });
    }

    getMovieDetails(id: number) {
        return this.httpClient.get<IMovieDto>(
            environment.apiUrl +
                "Movie/" +
                id.toString() +
                (this.authService.isLoggedIn() ? "/authorized" : "")
        );
    }

    convertMStoHM(milliseconds: number) {
        let dateTime = new Date(milliseconds);
        let hours = dateTime.getHours();
        let minutes = dateTime.getMinutes();

        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;
    }

    getGenreNames(genre: Genre) {
        return Genre[genre];
    }
}
