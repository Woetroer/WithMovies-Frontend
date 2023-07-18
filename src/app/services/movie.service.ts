import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { IMoviePreview } from "src/interfaces/IMoviePreview";
import { Observable } from "rxjs";
import { SearchQuery } from "../searchbar/SeachQuery";
import { KeywordService } from "./keyword.service";

@Injectable({
    providedIn: "root",
})
export class MovieService {
    private popularMovies?: IMoviePreview[];
    private searchCache: Map<SearchQuery, IMoviePreview[]> = new Map();

    constructor(
        private httpClient: HttpClient,
        private keywordService: KeywordService
    ) {}

    getPopularMovies(forceReload: boolean = false) {
        // Already fetched once, so return the cached list
        if (this.popularMovies && !forceReload) {
            return new Observable<IMoviePreview[]>((subscriber) => {
                subscriber.next(this.popularMovies);
                subscriber.complete();
            });
        }

        let observable = this.httpClient.get<IMoviePreview[]>(
            environment.apiUrl + "movie/getpopularmovies"
        );

        observable.subscribe((movies) => (this.popularMovies = movies));

        return observable;
    }
}
