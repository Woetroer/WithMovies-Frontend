import { Component, Input, OnInit } from "@angular/core";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { ReviewDto } from "src/interfaces/ReviewDto";

@Component({
    selector: "app-review-display",
    templateUrl: "./review-display.component.html",
    styleUrls: ["./review-display.component.scss"],
})
export class ReviewDisplayComponent implements OnInit {
    faStar = faStar;

    @Input() review!: ReviewDto;

    timeDisplay!: string;

    ngOnInit(): void {
        this.timeDisplay = this.review.postedTime.toLocaleString();
    }
}
