import { Component } from "@angular/core";
import { faClose, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

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

    timer?: number;

    toggle() {
        this.open = !this.open;

        if (this.open) {
            window.requestAnimationFrame(() => {
                document.getElementById("search-input")!.focus();
            });
        }

        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }

        // Set icon after 40 milliseconds, this makes the animation exactly
        // 23.868x better (objectively)
        this.timer = setTimeout(() => {
            this.icon = this.open ? this.closeIcon : this.searchIcon;
            this.timer = undefined;
        }, 40) as any;
    }
}
