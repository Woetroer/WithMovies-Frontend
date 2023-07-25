import { NgModule } from "@angular/core";
import {
    RouterModule,
    Routes,
    provideRouter,
    withComponentInputBinding,
} from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { HomeComponent } from "./home/home.component";
import { ExploreComponent } from "./explore/explore.component";
import { MovieDetailsPageComponent } from "./movie-details-page/movie-details-page.component";
const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        title: "Home",
        data: { showInNavigationBar: true },
    },
    {
        path: "explore",
        component: ExploreComponent,
        title: "Explore",
        data: { showInNavigationBar: true },
    },
    { path: "movie/:id", component: MovieDetailsPageComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
];

@NgModule({
    imports: [RouterModule],
    exports: [RouterModule],
    providers: [provideRouter(routes, withComponentInputBinding())],
})
export class AppRoutingModule {}
