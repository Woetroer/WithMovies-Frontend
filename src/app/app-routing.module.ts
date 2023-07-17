import { NgModule } from "@angular/core";
import {
    RouterModule,
    Routes,
    provideRouter,
    withComponentInputBinding,
} from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { PickAMovieComponent } from "./pick-a-movie/pick-a-movie.component";
import { ProfileComponent } from "./profile/profile.component";
import { HomeComponent } from "./home/home.component";
import { ExploreComponent } from "./explore/explore.component";
import { SettingsComponent } from "./settings/settings.component";

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
    { path: "login", component: LoginComponent },
    { path: "Register", component: RegisterComponent },
    { path: "PickAMovie", component: PickAMovieComponent },
    { path: "Profile", component: ProfileComponent },
    { path: "Settings", component: SettingsComponent }
];

@NgModule({
    imports: [RouterModule],
    exports: [RouterModule],
    providers: [provideRouter(routes, withComponentInputBinding())],
})
export class AppRoutingModule {}
