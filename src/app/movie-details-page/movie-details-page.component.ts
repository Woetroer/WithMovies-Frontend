import { Component, Input } from "@angular/core";
import { IMovieDto } from "src/interfaces/IMovieDto";
import { MovieService } from "../services/movie.service";
import { faStar, faUsersLine } from "@fortawesome/free-solid-svg-icons";
import {
    ImageQuality,
    MovieImageType,
    TmdbService,
} from "../services/tmdb.service";

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

    public companyNames = "";

    public dateOfRelease = "";
    public languageNames?: string;
    public genreNames!: string;
    public budgetDisplay: string = "";
    public runtimeDisplay: string = "";

    private languageNameProvider = new Intl.DisplayNames(["en"], {
        type: "language",
    });

    @Input("id") set setId(newId: number) {
        this.id = newId;
        this.fetchMovie();
    }

    constructor(
        private movieService: MovieService,
        private tmdbService: TmdbService
    ) {}

    fetchMovie() {
        this.movieService
            .getMovieDetails(this.id)
            .subscribe((movie: IMovieDto) => {
                this.movie = movie;
                this.companyNames = [...(this.movie.productionCompanies ?? [])]
                    .map((c) => c.name)
                    .join(", ");
                this.dateOfRelease = new Date(
                    movie.releaseDate as any
                ).toLocaleDateString();
                this.languageNames = [...(movie.spokenLanguages ?? [])]
                    .map((l) => this.languageNameProvider.of(l))
                    .join(", ");
                this.genreNames = this.movieService.getGenreNames(
                    movie.genres as any
                );
                this.movieService.convertMStoHM(movie.runtime as any);
                this.budgetDisplay = new Intl.NumberFormat(["en-US"], {
                    style: "currency",
                    currency: "USD",
                }).format(this.movie.budget);
                this.runtimeDisplay = this.movieService.convertMStoHM(
                    this.movie.runtime
                );
            });

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
                MovieImageType.Poster,
                ImageQuality.Original
            )
            .subscribe((backdrop) => (this.backdropPath = backdrop));
    }

    onHoverStar(index: number) {
        this.lastHovered = index;
    }

    giveRating() {
        let rating = this.lastHovered;
    }

    getCollectionName(original: string) {
        let words = original.split(" ");
        if (
            words.at(0)?.toLocaleLowerCase() != "the" &&
            words.at(-1)?.toLocaleLowerCase() == "collection"
        )
            return "the " + original;
        return original;
    }
}
