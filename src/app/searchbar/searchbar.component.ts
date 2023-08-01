import { Component } from "@angular/core";
import { faClose, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { KeywordService } from "../services/keyword.service";
import { KeywordSuggestion } from "src/interfaces/KeywordSuggestion";
import { EventType, Router } from "@angular/router";

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

    searchValue = "";

    constructor(private router: Router) {
        this.router.events.subscribe((event) => {
            if (event.type == EventType.NavigationStart)
                this.setOpen(event.url.includes("/search/"));
        });
    }

    setOpen(value: boolean) {
        if (this.open == value) return;

        this.open = value;

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

    updateSearch() {
        this.router
            .navigate(["search", this.searchValue], {
                replaceUrl: !this.router.url.includes("search"),
            })
            .catch(console.error);
    }
}
