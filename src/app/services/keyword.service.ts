import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KeywordSuggestion } from "src/interfaces/KeywordSuggestion";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: "root",
})
export class KeywordService {
    constructor(private httpClient: HttpClient) {}

    public findSuggestions(text: string) {
        return this.httpClient.get<KeywordSuggestion[]>(
            environment.apiUrl + "keyword/suggest/" + encodeURI(text)
        );
    }
}
