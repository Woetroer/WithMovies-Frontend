import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-pagination",
    templateUrl: "./pagination.component.html",
    styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent {
    leftIcon = faChevronLeft;
    rightIcon = faChevronRight;

    @Input() page!: number;
    @Output() pageChange = new EventEmitter<number>();
    @Input("max-pages") maxPages!: number;

    setPage(newPage: number) {
        this.page = newPage;
        this.pageChange.emit(this.page);
    }
}
