import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { RecommendationsService } from '../services/recommendations.service';

@Component({
    selector: 'app-preference',
    templateUrl: './preference.component.html',
    styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent {
    genres = environment.genres;

    preferences: boolean[] = [];

    constructor(private recommendationService: RecommendationsService) {
        this.preferences = new Array(20).fill(false);
    }


    checked(genre: number) {
        this.preferences[genre] = !this.preferences[genre];
    }

    sendPreferences() {
        this.recommendationService.sendPreferences(this.preferences).subscribe();
    }
}
