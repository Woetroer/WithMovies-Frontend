import { Component } from "@angular/core";
import { ActivatedRoute, EventType, Route, Router } from "@angular/router";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "../services/auth.service";

function removeFirstSlash(str: string) {
    if (str.startsWith("/")) return str.slice(1);
    return str;
}

@Component({
    selector: "app-navigation-bar",
    templateUrl: "./navigation-bar.component.html",
    styleUrls: ["./navigation-bar.component.scss"],
})
export class NavigationBarComponent {
    public activeRoute: string;
    public routes: Route[];
    public open: boolean = false;

    public faUser = faUser;

    constructor(private router: Router, private _authService:AuthService) {
        this.routes = [...router.config].filter((r) =>
            r.data ? r.data["showInNavigationBar"] : false
        );
        this.activeRoute = this.routes[0].path!;

        this.router.events.subscribe((event) => {
            if (event.type == EventType.NavigationEnd) {
                this.activeRoute = removeFirstSlash(event.url);
            }
        });
    }

    toggleDropdown(event: Event) {
        event.stopPropagation();
        this.open = !this.open;
    }

    logout(){
        this._authService.logout();
    }

    isLoggedIn(){
        return this._authService.isLoggedIn();
    }
}
