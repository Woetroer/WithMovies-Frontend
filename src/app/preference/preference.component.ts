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
    adult: boolean = false;

    preferences: boolean[] = [];

    constructor(private recommendationService: RecommendationsService) {
        this.preferences = new Array(20).fill(false);
    }


    checked(genre: number) {
        this.preferences[genre] = !this.preferences[genre];
    }

    checkedAdult(){
        this.adult = !this.adult
    }

    sendPreferences() {
        this.recommendationService.sendPreferences(this.preferences, this.adult).subscribe();
    }
}
