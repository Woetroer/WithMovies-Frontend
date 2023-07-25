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
import { SettingsComponent } from "./settings/settings.component";
import { ProfileComponent } from "./profile/profile.component";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { MovieDetailsPageComponent } from "./movie-details-page/movie-details-page.component";
import { AuthGuard } from "./guards/auth.guard";


const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        title: "Home",
        data: { showInNavigationBar: true },
        canActivate: [AuthGuard],
    },
    {
        path: "explore",
        component: ExploreComponent,
        title: "Explore",
        data: { showInNavigationBar: true },
        canActivate: [AuthGuard] 
    },
    { path: "movie/:id", component: MovieDetailsPageComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "Register", component: RegisterComponent },
    { path: "Profile", component: ProfileComponent, canActivate: [AuthGuard] },
    { path: "Settings", component: SettingsComponent, canActivate: [AuthGuard]  }
];

@NgModule({
    imports: [RouterModule],
    exports: [RouterModule],
    providers: [provideRouter(routes, withComponentInputBinding())],
})
export class AppRoutingModule {}
