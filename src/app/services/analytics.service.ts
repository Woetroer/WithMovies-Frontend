import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IndexRange, LazyLoadedArray } from 'src/LazyLoadedArray';
import { toObservable } from 'src/ToObservable';
import { environment } from '../environments/environment';
import { MoviePreview } from 'src/interfaces/MoviePreview';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  static client: HttpClient;

  trendingMovies: LazyLoadedArray<MoviePreview>;
  trendingGenres: number[] = [];
  
  constructor(private httpClient: HttpClient) {
  AnalyticsService.client = httpClient;
  
  this.trendingMovies = new LazyLoadedArray(AnalyticsService._getTrending);
  }

public getTrending(start: number, limit: number) {
return toObservable(
    this.trendingMovies.getRange(new IndexRange(start, start + limit))
);
}

private static _getTrending(range: IndexRange) {
return new Promise<MoviePreview[]>((res) =>
    AnalyticsService.client
        .get<MoviePreview[]>(
            environment.apiUrl +
                `movie/trending/${range.start}/${range.count()}`
        )
        .subscribe(res)
);
}

public getTrendingGenres(start: number, limit: number): Observable<number[]> {
  return AnalyticsService.client.get<number[]>(
  environment.apiUrl + `movie/trending/genres/${start}/${limit}`);
  }
}