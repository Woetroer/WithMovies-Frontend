import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Suggestion } from "src/interfaces/Suggestion";
import { environment } from "../environments/environment";
import { ReviewDto } from "src/interfaces/ReviewDto";
import { map } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ReviewService {
    constructor(private httpClient: HttpClient) {}

    public getReviewsForMovie(movieId: number) {
        return this.httpClient
            .get<ReviewDto[]>(environment.apiUrl + "review/movie/" + movieId)
            .pipe(
                map((value, _) =>
                    value.map((v) => {
                        v.postedTime = new Date(v.postedTime);
                        return v;
                    })
                )
            );
    }
}
