import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { IMoviePreview } from "src/interfaces/IMoviePreview";
import { Observable } from "rxjs";
import { SearchQuery } from "../searchbar/SeachQuery";
import { KeywordService } from "./keyword.service";
import { IMovieDto } from "src/interfaces/IMovieDto";
import { Genre } from "src/interfaces/Genre";

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

    review(movieId: number, rating: number, message: string | undefined) {
        message = message?.trim();

        if (message?.length == 0)
            message = undefined;

        return this.httpClient.post(environment.apiUrl + "review/create", { movieId, rating, message });
    }

    getMovieDetails(id: number) {
        return this.httpClient.get<IMovieDto>(environment.apiUrl + "Movie/" + id.toString());
    }
    
    convertMStoHM(milliseconds: number) {
        let dateTime = new Date(milliseconds);
        let hours = dateTime.getHours();
        let minutes = dateTime.getMinutes();


        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    getGenreNames(genre: Genre) {
        return Genre[genre]
    }
}
