import { Component, Input } from '@angular/core';
import { IMovieDto } from 'src/interfaces/IMovieDto';
import { MovieService } from '../movie.service';
import { faStar, faUsersLine } from '@fortawesome/free-solid-svg-icons';

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

  public lastHovered: number = 0;

  @Input("id") set setId(newId: number) {
    this.id = newId;
    this.fetchMovie();
  }

  constructor(private movieService: MovieService){}

  fetchMovie() {
    this.movieService.getMovieDetails(this.id).subscribe((movie: IMovieDto) => {
      movie.releaseDate = new Date(movie.releaseDate as any);
      this.movie = movie;
    });
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
