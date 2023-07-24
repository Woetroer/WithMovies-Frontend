import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Genre } from 'src/interfaces/Genre';
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
   convertMStoHM(milliseconds: number){
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
  
    seconds = seconds % 60;
    //  if seconds are greater than 30, round minutes up (optional)
    minutes = seconds >= 30 ? minutes + 1 : minutes;
  
    minutes = minutes % 60;

    return `${this.padTo2Digits(hours)}:{this.padTo2Digits(minutes)}`;
}

    padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');}
    
    getGenreNames(genre: Genre){
      return Genre[genre]
    }
    
    createReview() {
      
    }
}
