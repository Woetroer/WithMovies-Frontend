import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Suggestion } from "src/interfaces/Suggestion";
import { environment } from "../environments/environment";
import { IMovieCollectionDto } from "src/interfaces/IMovieCollectionDto";

@Injectable({
    providedIn: "root",
})
export class MovieCollectionService {
    constructor(private httpClient: HttpClient) {}

    public findSuggestions(text: string) {
        return this.httpClient.get<Suggestion[]>(
            environment.apiUrl + "suggestion/collections/" + encodeURI(text)
        );
    }

    public getByName(name: string) {
        return this.httpClient.get<IMovieCollectionDto>(
            environment.apiUrl +
                "movie/collection/name/" +
                encodeURIComponent(name)
        );
    }
}
