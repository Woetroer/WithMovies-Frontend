import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Suggestion } from "src/interfaces/Suggestion";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: "root",
})
export class ProductionCompanyService {
    constructor(private httpClient: HttpClient) {}

    public findSuggestions(text: string) {
        return this.httpClient.get<Suggestion[]>(
            environment.apiUrl +
                "suggestion/companies/" +
                encodeURIComponent(text)
        );
    }
}
