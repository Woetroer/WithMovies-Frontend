import { Component, OnInit } from "@angular/core";
import { MovieService } from "../services/movie.service";
import { IMoviePreview } from "src/interfaces/MoviePreview";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit{
    movies!: IMoviePreview[];
    constructor(private _movieService:MovieService) {}

    ngOnInit(): void {
        this.getPopularMovies();
    }
    getPopularMovies() {
        this._movieService.getPopularMovies().subscribe((Response) => {this.movies = Response, console.log(this.movies)})
    }
}
