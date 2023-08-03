import { Component, Input } from "@angular/core";
import { IMovieCollectionDto } from "src/interfaces/IMovieCollectionDto";

@Component({
    selector: "app-movie-collection-banner",
    templateUrl: "./movie-collection-banner.component.html",
    styleUrls: ["./movie-collection-banner.component.scss"],
})
export class MovieCollectionBannerComponent {
    @Input("collection")
    public collection!: IMovieCollectionDto;

    @Input("small")
    public small: boolean = false;

    collectionName() {
        let words = this.collection.name.split(" ");
        if (
            words.at(0)?.toLocaleLowerCase() != "the" &&
            words.at(-1)?.toLocaleLowerCase() == "collection"
        )
            return "the " + this.collection.name;
        return this.collection.name;
    }
}
