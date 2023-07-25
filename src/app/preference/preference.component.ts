import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../environments/environment';
import { RecommendationsService } from '../services/recommendations.service';

@Component({
    selector: 'app-preference',
    templateUrl: './preference.component.html',
    styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent {
    genres = environment.genres;
    info: Record<string, boolean> = {};
    displayInfo: string = ""

    preferences: Record<string, boolean> = {};

    constructor(private recommendationService: RecommendationsService) {
        for (const genre of this.genres) {
            this.preferences[genre] = false;
        }
    }


    checked(genre: string) {
        this.preferences[genre] = !this.preferences[genre];
    }

    sendPreferences() {
        this.recommendationService.sendPreferences(this.preferences).subscribe((res) => {this.info = res;});

            for (const key in this.info){
                const value = this.info[key]
                this.displayInfo = this.displayInfo + (key + ":" + value);
            }
    }
}
