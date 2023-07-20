import { Component, OnInit } from "@angular/core";
import { MovieService } from "../services/movie.service";
import { IMoviePreview } from "src/interfaces/MoviePreview";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    movies: IMoviePreview[] = [];

    constructor(private movieService: MovieService) {}

    ngOnInit(): void {
        if (this.movies.length == 0) {
            this.getPopularMovies();
        }
    }

    getPopularMovies() {
        this.movieService.getPopularMovies().subscribe((res) => {
            this.movies = res;
        });
    }
}
