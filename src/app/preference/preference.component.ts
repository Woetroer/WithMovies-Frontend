import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import GenrePreference from './GenrePreference';

@Component({
    selector: 'app-preference',
    templateUrl: './preference.component.html',
    styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent {
    genres = environment.genres;

    preferences: Record<string, boolean> = {};

    constructor() {
        for (const genre of this.genres) {
            this.preferences[genre] = false;
        }
    }


    checked(genre: string) {
        this.preferences[genre] = !this.preferences[genre];
    }
}
