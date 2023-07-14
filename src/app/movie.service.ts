import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IMovieDto } from 'src/interfaces/IMovieDto';


@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private httpClient: HttpClient) {
     
   }
   getMovieDetails(id: number) {
    return this.httpClient.get<IMovieDto>(environment.apiRoot + "Movie/" + id.toString());
   }
}
