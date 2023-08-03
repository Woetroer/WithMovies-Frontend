import { Component } from "@angular/core";
import { AnalyticsService } from "../services/analytics.service";
import { MoviePreview } from "src/interfaces/MoviePreview";
import { environment } from "../environments/environment";

type MovieKind = "trending";


@Component({
    selector: "app-analytics",
    templateUrl: "./analytics.component.html",
    styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent {

    movies = new Map<MovieKind, MoviePreview[]>();
    genres = environment.genres;

    trendingGenres: string[] = [];

    //genreOrder = for each number in trendingGenres: genres[number] add to trending  

    constructor(private analyticsService: AnalyticsService){this.movies.set("trending", this.movies.get("trending") ?? []);}

    getTendingMovies(){
        this.analyticsService.getTrending(0, 10).subscribe((res) => this.movies.set("trending", res));
    }

    getTrendingGenres(){
        this.analyticsService.getTrendingGenres(0, 10).subscribe(res => {
            this.trendingGenres = res.map(i => this.genres[i]);
        });    
    };
}
                