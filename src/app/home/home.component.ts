import { Component, OnInit } from "@angular/core";
import { MovieService } from "../services/movie.service";
import { MoviePreview } from "src/interfaces/MoviePreview";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";
import { IndexRange, LazyLoadedArray } from "src/LazyLoadedArray";

type MovieKind = "trending" | "trending-recommended" | "friends" | "watchlist";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
    isLoggedIn = false;

    movies = new Map<MovieKind, MoviePreview[]>();

    constructor(
        private movieService: MovieService,
        private authService: AuthService
    ) {
        this.isLoggedIn = this.authService.isLoggedIn();

        this.movies.set("trending", this.movies.get("trending") ?? []);
        this.movies.set(
            "trending-recommended",
            this.movies.get("trending-recommended") ?? []
        );
        this.movies.set("friends", this.movies.get("friends") ?? []);
        this.movies.set("watchlist", this.movies.get("watchlist") ?? []);

        if (this.isLoggedIn) {
            this.movieService.trendingRecommendedMovies
                .getRange(new IndexRange(0, 10))
                .subscribe((res) =>
                    this.movies.set("trending-recommended", res)
                );
            this.movieService.friendMovies
                .getRange(new IndexRange(0, 10))
                .subscribe((res) => this.movies.set("friends", res));
            this.movieService.watchlist
                .getRange(new IndexRange(0, 10))
                .subscribe((res) => this.movies.set("watchlist", res));
        } else {
            this.movieService.trendingMovies
                .getRange(new IndexRange(0, 10))
                .subscribe((res) => this.movies.set("trending", res));
        }
    }
}
