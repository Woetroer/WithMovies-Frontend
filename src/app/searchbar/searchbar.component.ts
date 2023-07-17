import { Component } from "@angular/core";
import { faClose, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { KeywordService } from "../services/keyword.service";

@Component({
    selector: "app-searchbar",
    templateUrl: "./searchbar.component.html",
    styleUrls: ["./searchbar.component.scss"],
})
export class SearchbarComponent {
    open: boolean = false;
    searchIcon = faMagnifyingGlass;
    closeIcon = faClose;
    icon = this.searchIcon;

    iconTimer?: number;
    submitTimer?: number;

    searchValue = "";

    suggestions: string[] = [];

    constructor(private keywordService: KeywordService) {}

    toggle() {
        this.open = !this.open;

        if (this.open) {
            window.requestAnimationFrame(() => {
                document.getElementById("search-input")!.focus();
            });
        }

        if (this.iconTimer) {
            clearTimeout(this.iconTimer);
            this.iconTimer = undefined;
        }

        // Set icon after 40 milliseconds, this makes the animation exactly
        // 23.868x better (objectively)
        this.iconTimer = setTimeout(() => {
            this.icon = this.open ? this.closeIcon : this.searchIcon;
            this.iconTimer = undefined;
        }, 40) as any;
    }

    searchKeydown() {
        if (this.submitTimer) {
            clearTimeout(this.submitTimer);
            this.submitTimer = undefined;
        }

        // Set icon after 40 milliseconds, this makes the animation exactly
        // 23.868x better (objectively)
        this.submitTimer = setTimeout(() => {
            this.searchSubmit();
            this.submitTimer = undefined;
        }, 200) as any;
    }

    searchSubmit() {
        this.suggestions = [];

        let value = this.searchValue.trim();

        if (value.length < 3) {
            return;
        }

        this.suggestions = this.keywordService.findSuggestions(value.trim());
        console.log("Suggestions: ", this.suggestions);
        console.log("Keywords: ", this.keywordService.findKeywords(value));
    }
}
