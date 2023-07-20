import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { MoviePreview } from "src/interfaces/MoviePreview";
import { Observable } from "rxjs";
import { SearchQuery } from "../searchbar/SeachQuery";
import { KeywordService } from "./keyword.service";

@Injectable({
    providedIn: "root",
})
export class MovieService {
    private popularMovies?: MoviePreview[];
    private searchCache: Map<SearchQuery, MoviePreview[]> = new Map();

    constructor(
        private httpClient: HttpClient,
        private keywordService: KeywordService
    ) {}

    getPopularMovies(forceReload: boolean = false) {
        // Already fetched once, so return the cached list
        if (this.popularMovies && !forceReload) {
            return new Observable<MoviePreview[]>((subscriber) => {
                subscriber.next(this.popularMovies);
                subscriber.complete();
            });
        }

        let observable = this.httpClient.get<MoviePreview[]>(
            environment.apiUrl + "movie/getpopularmovies"
        );

        observable.subscribe((movies) => (this.popularMovies = movies));

        return observable;
    }
}
