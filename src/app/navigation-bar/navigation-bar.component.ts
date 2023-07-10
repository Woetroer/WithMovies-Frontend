import { Component } from '@angular/core';
import { ActivatedRoute, EventType, Route, Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function removeFirstSlash(str: string) {
    if (str.startsWith("/"))
        return str.slice(1);
    return str;
}

@Component({
    selector: 'app-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
    public activeRoute: string;
    public routes: Route[];

    public faUser = faUser;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
        this.routes = [...router.config]
            .filter(r => r.data ? r.data["showInNavigationBar"] : false);
        this.activeRoute = this.routes[0].path!;

        this.router.events.subscribe(event => {
            if (event.type == EventType.NavigationEnd) {
                this.activeRoute = removeFirstSlash(event.url);
            }
        });
    }
}
