import { Component, Input } from "@angular/core";
import { IMovieDto } from "src/interfaces/IMovieDto";
import { MovieService } from "../services/movie.service";
import { faStar, faUsersLine } from "@fortawesome/free-solid-svg-icons";
import {
    ImageQuality,
    MovieImageType,
    TmdbService,
} from "../services/tmdb.service";
import { GenreDescriptions } from "src/interfaces/Genre";

@Component({
    selector: "app-movie-details-page",
    templateUrl: "./movie-details-page.component.html",
    styleUrls: ["./movie-details-page.component.scss"],
})
export class MovieDetailsPageComponent {
    faStar = faStar;
    faUsersLine = faUsersLine;

    public id!: number;
    public movie?: IMovieDto;

    public posterPath: string = "";
    public backdropPath: string = "";

    public lastHovered: number = 0;
    public activeStar: number = 0;

    public genreNames = GenreDescriptions;

    public currency = new Intl.NumberFormat(["en-US"], {
        style: "currency",
        currency: "USD",
    });
    public regionName = new Intl.DisplayNames(["en"], { type: "region" });
    public languageName = new Intl.DisplayNames(["en"], { type: "language" });

    public popupOpen = false;
    public ratingScore = 0;
    public ratingMessage = "";

    @Input("id") set setId(newId: number) {
        this.id = newId;
        this.fetchMovie();
    }

    @Input("movie") set setMovie(newMovie: IMovieDto) {
        this.movie = newMovie;
        this.fetchMovie(false);
    }

    constructor(
        private movieService: MovieService,
        private tmdbService: TmdbService
    ) {}

    fetchMovie(api: boolean = true) {
        if (api) {
            this.movieService
                .getMovieDetails(this.id)
                .subscribe((movie: IMovieDto) => {
                    this.movie = movie;
                    this.movie.productionCountries?.filter(
                        (c) => c != undefined
                    );

                    if (this.movie.releaseDate)
                        this.movie.releaseDate = new Date(
                            this.movie.releaseDate
                        );
                });
        }

        this.tmdbService
            .getMovieImage(
                this.id,
                MovieImageType.Poster,
                ImageQuality.Original
            )
            .subscribe((poster) => (this.posterPath = poster));

        this.tmdbService
            .getMovieImage(
                this.id,
                MovieImageType.Backdrop,
                ImageQuality.Original
            )
            .subscribe((backdrop) => (this.backdropPath = backdrop));
    }

    onHoverStar(index: number) {
        this.lastHovered = index;

        if (!this.popupOpen) this.activeStar = this.lastHovered;
    }

    giveRating() {
        this.activeStar = this.lastHovered;
        this.ratingScore = this.activeStar * 2.0;

        this.popupOpen = true;
    }

    submitRating() {
        this.popupOpen = false;

        let ogVoteScore = this.movie!.voteAverage * this.movie!.voteCount;
        this.movie!.voteCount += 1;

        this.movie!.voteAverage =
            (ogVoteScore + this.ratingScore) / this.movie!.voteCount;

        this.movieService
            .review(this.id, this.ratingScore, this.ratingMessage)
            .subscribe();
    }
}
