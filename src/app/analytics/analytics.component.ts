import { Component } from "@angular/core";
import { AnalyticsService } from "../services/analytics.service";
import { MoviePreview } from "src/interfaces/MoviePreview";
import { environment } from "../environments/environment";
import { Genre } from "src/interfaces/Genre";

type MovieKind = "trending" | "trending-recommended" | "friends" | "watchlist";


@Component({
    selector: "app-analytics",
    templateUrl: "./analytics.component.html",
    styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent {

movies = new Map<MovieKind, MoviePreview[]>();
genres = environment.genres;

trendingGenresInInt: number[] = [];

trendingGenre: Genre[] = ;

//genreOrder = for each number in trendingGenres: genres[number] add to trending  

constructor(private analyticsService: AnalyticsService){}

getTendingMovies(){
    this.analyticsService.getTrending(0, 10).subscribe();
}

getTrendingGenres(){
    this.analyticsService.getTrendingGenres(0, 10).subscribe();
}

}