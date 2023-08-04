import { Component, Input, OnInit } from "@angular/core";
import { MoviePreview } from "src/interfaces/MoviePreview";
import {
    ImageQuality,
    MovieImageType,
    TmdbService,
} from "../services/tmdb.service";
import { MovieService } from "../services/movie.service";
import { Router } from "@angular/router";

export function movieTracker(idx: number, moviePreview: MoviePreview) {
    return moviePreview.id;
}

@Component({
    selector: "app-movie-card",
    templateUrl: "./movie-card.component.html",
    styleUrls: ["./movie-card.component.scss"],
})
export class MovieCardComponent implements OnInit {
    @Input() movie!: MoviePreview;
    poster?: string;

    @Input() placeholder: boolean = false;

    isLoading: boolean = false;

    constructor(
        private tmdbService: TmdbService,
        public movieService: MovieService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.tmdbService
            .getMovieImage(
                this.movie.id,
                MovieImageType.Poster,
                ImageQuality.W780
            )
            .subscribe((poster) => (this.poster = poster));
    }

    onClick() {
        if (this.movieService.isLoadingDetails) return;

        this.isLoading = true;

        this.movieService.getMovieDetails(this.movie.id).subscribe((_) => {
            this.router.navigate(["movie", this.movie.id]).catch(console.error);
        });
    }
}
