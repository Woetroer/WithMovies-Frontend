import { HttpClient } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RecommendationsService {

    constructor(private httpClient: HttpClient) { }

    sendPreferences(preferences: Record<string, boolean>) {
        return this.httpClient.post<any>(environment.apiUrl + "recommendation/preferences", { preferences })
    }
}
