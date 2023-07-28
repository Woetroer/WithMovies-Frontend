import { Component, Input, OnInit } from "@angular/core";
import { MoviePreview } from "src/interfaces/MoviePreview";
import {
    ImageQuality,
    MovieImageType,
    TmdbService,
} from "../services/tmdb.service";

@Component({
    selector: "app-movie-card",
    templateUrl: "./movie-card.component.html",
    styleUrls: ["./movie-card.component.scss"],
})
export class MovieCardComponent implements OnInit {
    @Input() movie!: MoviePreview;
    poster?: string;

    constructor(private tmdbService: TmdbService) {}

    ngOnInit(): void {
        this.tmdbService
            .getMovieImage(
                this.movie.id,
                MovieImageType.Poster,
                ImageQuality.W780
            )
            .subscribe((poster) => (this.poster = poster));
    }
}
