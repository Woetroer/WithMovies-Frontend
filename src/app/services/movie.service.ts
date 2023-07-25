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
    trendingMovies: LazyLoadedArray<MoviePreview>;
    trendingRecommendedMovies: LazyLoadedArray<MoviePreview>;
    friendMovies: LazyLoadedArray<MoviePreview>;
    watchlist: LazyLoadedArray<MoviePreview>;

    constructor(private httpClient: HttpClient) {
        this.trendingMovies = new LazyLoadedArray(this._getTrending);
        this.trendingRecommendedMovies = new LazyLoadedArray(
            this._getTrendingRecommended
        );
        this.friendMovies = new LazyLoadedArray(this._getTrending);
        this.watchlist = new LazyLoadedArray(this._getTrending);
    }

    private _getTrending(range: IndexRange) {
        return this.httpClient.get<MoviePreview[]>(
            environment.apiUrl +
                `movie/trending/${range.start}/${range.count()}`
        );
    }

    private _getTrendingRecommended(range: IndexRange) {
        return this.httpClient.get<MoviePreview[]>(
            environment.apiUrl +
                `movie/trending/recommended/${range.start}/${range.count()}`
        );
    }

    getMovieDetails(id: number) {
        return this.httpClient.get<IMovieDto>(
            environment.apiUrl + "Movie/" + id.toString()
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
