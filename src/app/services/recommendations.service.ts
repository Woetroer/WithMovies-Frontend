import { HttpClient } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { PreferenceComponent } from '../preference/preference.component';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {

    constructor(private httpClient: HttpClient) {}

      sendPreferences(preferences:Record<string, boolean>){
        this.httpClient.post<any>(environment.apiUrl + "recommendation/sendPreferences", {preferences})

        
        return new Observable<Record<string, boolean>>((subscriber) => {
          subscriber.next(preferences);
          subscriber.complete();
        })
      }
}
