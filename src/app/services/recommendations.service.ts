import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: "root",
})
export class RecommendationsService {
    constructor(private httpClient: HttpClient) {}

    sendPreferences(preferences: boolean[], adult: boolean) {
        return this.httpClient.post<any>(
            environment.apiUrl + "recommendations/preferences",
            { preferences, adult }
        );
    }
}
