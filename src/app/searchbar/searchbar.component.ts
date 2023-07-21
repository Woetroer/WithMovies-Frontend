import { Component } from "@angular/core";
import { faClose, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { KeywordService } from "../services/keyword.service";
import { KeywordSuggestion } from "src/interfaces/KeywordSuggestion";

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

    suggestions: KeywordSuggestion[] = [];

    lastClickedSuggestionWordCount?: number = undefined;

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
        this.lastClickedSuggestionWordCount = undefined;

        if (this.submitTimer) {
            clearTimeout(this.submitTimer);
            this.submitTimer = undefined;
        }

        // Set icon after 40 milliseconds, this makes the animation exactly
        // 23.868x better (objectively)
        this.submitTimer = setTimeout(() => {
            this.searchSubmit();
            this.submitTimer = undefined;
        }, 400) as any;
    }

    searchSubmit() {
        this.suggestions = [];

        let value = this.searchValue.trim();

        if (value.length < 3) {
            return;
        }

        this.keywordService
            .findSuggestions(value.trim())
            .subscribe(
                (s) =>
                    (this.suggestions = s.sort((a, b) => b.weight - a.weight))
            );
    }

    suggestionClicked(event: Event, suggestion: KeywordSuggestion) {
        event.stopPropagation();

        let wordCount = suggestion.keyword.split(" ").length;

        this.searchValue =
            this.searchValue
                .trim()
                .split(" ")
                .slice(0, -(this.lastClickedSuggestionWordCount ?? wordCount))
                .join(" ") +
            " " +
            suggestion.keyword;

        this.lastClickedSuggestionWordCount = wordCount;
    }
}
