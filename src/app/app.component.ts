import {
    animate,
    animateChild,
    group,
    query,
    style,
    transition,
    trigger,
} from "@angular/animations";
import { Component } from "@angular/core";
import { ChildrenOutletContexts } from "@angular/router";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    animations: [
        trigger("routeAnimations", [
            transition("HomePage => SearchPage", [
                style({ position: "relative" }),
                query(":enter, :leave", [
                    style({
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "100%",
                    }),
                ]),
                query(":enter", [
                    style({ opacity: 0, transform: "scale(0.97)" }),
                ]),
                query(":leave", animateChild()),
                group([
                    query(":leave", [
                        animate(
                            "0.6s cubic-bezier(0.23, 1, 0.320, 1)",
                            style({ right: "100%", opacity: 0 })
                        ),
                    ]),
                    query(":enter", [
                        animate(
                            "0.5s cubic-bezier(0.23, 1, 0.320, 1)",
                            style({ transform: "*", opacity: 1 })
                        ),
                    ]),
                ]),
                query(":enter", animateChild()),
            ]),
            transition("SearchPage => HomePage", [
                style({ position: "relative" }),
                query(":enter, :leave", [
                    style({
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                    }),
                ]),
                query(":enter", [style({ left: "-100%", opacity: 0 })]),
                query(":leave", animateChild()),
                group([
                    query(":leave", [
                        animate(
                            "0.3s cubic-bezier(0.23, 1, 0.320, 1)",
                            style({ transform: "scale(0.97)", opacity: 0 })
                        ),
                    ]),
                    query(":enter", [
                        animate(
                            "0.3s cubic-bezier(0.23, 1, 0.320, 1)",
                            style({ left: "0%", opacity: 1 })
                        ),
                    ]),
                ]),
                query(":enter", animateChild()),
            ]),
            transition("* => MovieDetailsPage", [
                query(":leave", [
                    style({
                        position: "absolute",
                        top: "76px",
                        left: 0,
                        width: "100%",
                    }),
                ]),
                query(":enter", [
                    style({ transform: "translateY(50px)", opacity: 0 }),
                ]),
                query(":leave", animateChild()),
                group([
                    query(":leave", [
                        style({ zIndex: 0 }),
                        animate(
                            "0.6s cubic-bezier(0.23, 1, 0.320, 1)",
                            style({
                                opacity: 0,
                                transform: "translateY(50px) scale(0.97)",
                            })
                        ),
                    ]),
                    query(":enter", [
                        style({ zIndex: 3 }),
                        animate(
                            "0.5s cubic-bezier(0.23, 1, 0.320, 1)",
                            style({ transform: "*", opacity: 1 })
                        ),
                    ]),
                ]),
                query(":enter", animateChild()),
            ]),
            transition("MovieDetailsPage => *", [
                query(":leave", [
                    style({
                        position: "absolute",
                        top: "76px",
                        left: 0,
                        width: "100%",
                    }),
                ]),
                query(":enter", [
                    style({
                        transform: "translateY(50px) scale(0.97)",
                        opacity: 0,
                    }),
                ]),
                query(":leave", animateChild()),
                group([
                    query(":leave", [
                        style({ zIndex: 0 }),
                        animate(
                            "0.6s cubic-bezier(0.23, 1, 0.320, 1)",
                            style({
                                opacity: 0,
                                transform: "translateY(50px)",
                            })
                        ),
                    ]),
                    query(":enter", [
                        style({ zIndex: 3 }),
                        animate(
                            "0.5s cubic-bezier(0.23, 1, 0.320, 1)",
                            style({ transform: "*", opacity: 1 })
                        ),
                    ]),
                ]),
                query(":enter", animateChild()),
            ]),
        ]),
    ],
})
export class AppComponent {
    constructor(private contexts: ChildrenOutletContexts) {}

    getRouteAnimationData() {
        return this.contexts.getContext("primary")?.route?.snapshot?.data?.[
            "animation"
        ];
    }
}
