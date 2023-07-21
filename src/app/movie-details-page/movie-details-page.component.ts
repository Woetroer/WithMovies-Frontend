import { Component, Input } from '@angular/core';
import { IMovieDto } from 'src/interfaces/IMovieDto';
import { MovieService } from '../movie.service';
import { faStar, faUsersLine } from '@fortawesome/free-solid-svg-icons';
import { ImageQuality, MovieImageType, TmdbService } from '../services/tmdb.service';

@Component({
  selector: 'app-movie-details-page',
  templateUrl: './movie-details-page.component.html',
  styleUrls: ['./movie-details-page.component.scss']
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
  public languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
  public genreNames!: string;

  @Input("id") set setId(newId: number) {
    this.id = newId;
    this.fetchMovie();
  }

  constructor(private movieService: MovieService, private tmdbService: TmdbService){}

  fetchMovie() {
    this.movieService.getMovieDetails(this.id).subscribe((movie: IMovieDto) => {
      
      this.movie = movie;
      this.companyNames = [...this.movie.productionCompanies ?? []].map((c) => c.name).join(", ");
      this.dateOfRelease = new Date(movie.releaseDate as any).toLocaleDateString();
      this.languageNames.of(movie.spokenLanguages as any);
      this.genreNames  = this.movieService.getGenreNames(movie.genres as any);
      this.movieService.convertMStoHM(movie.Runtime as any);
    });

    this.tmdbService.getMovieImage(this.id, MovieImageType.Poster, ImageQuality.Original).subscribe((poster) => this.posterPath = poster);
    this.tmdbService.getMovieImage(this.id, MovieImageType.Poster, ImageQuality.Original).subscribe((backdrop) => this.backdropPath = backdrop);
  }

  onHoverStar(index: number) {
    this.lastHovered = index;
  }

  giveRating() {
    console.log("Rated " + this.lastHovered);
  }

  getCollectionName(original: string) {
    let words = original.split(' ');
    if (words.at(0)?.toLocaleLowerCase() != "the" && words.at(-1)?.toLocaleLowerCase() == "collection")
      return "the " + original;
    return original;
  }
}
