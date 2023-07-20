import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IMoviePreview } from 'src/interfaces/MoviePreview';


@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private _http:HttpClient) { }

  getPopularMovies(){
    return this._http.get<IMoviePreview[]>(environment.apiUrl + "movie/getpopularmovies");
  }
}
