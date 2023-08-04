import { Component, Input } from "@angular/core";
import { ReviewService } from "../services/review.service";
import { ReviewDto } from "src/interfaces/ReviewDto";

@Component({
    selector: "app-movie-reviews-page",
    templateUrl: "./movie-reviews-page.component.html",
    styleUrls: ["./movie-reviews-page.component.scss"],
})
export class MovieReviewsPageComponent {
    @Input("movie") set id(movieId: number) {
        this.reviewService
            .getReviewsForMovie(movieId)
            .subscribe((reviews) => (this.reviews = reviews));
    }

    reviews?: ReviewDto[];

    constructor(private reviewService: ReviewService) {}
}
