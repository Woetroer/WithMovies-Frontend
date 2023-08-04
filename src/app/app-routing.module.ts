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
import { SettingsComponent } from "./settings/settings.component";
import { ProfileComponent } from "./profile/profile.component";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { PreferenceComponent } from "./preference/preference.component";
import { MovieDetailsPageComponent } from "./movie-details-page/movie-details-page.component";
import { AuthGuard } from "./guards/auth.guard";
import { AdminPageComponent } from "./admin-page/admin-page.component";
import { AuthService } from "./services/auth.service";

import { SearchPageComponent } from "./search-page/search-page.component";
import { MovieReviewsPageComponent } from "./movie-reviews-page/movie-reviews-page.component";
const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        title: "Home",
        data: { showInNavigationBar: true, animation: "HomePage" },
    },
    {
        path: "movie/:id",
        component: MovieDetailsPageComponent,
        data: { animation: "MovieDetailsPage" },
    },
    {
        path: "movie/:movie",
        component: MovieDetailsPageComponent,
        data: { animation: "MovieDetailsPage" },
    },
    {
        path: "movie/:movie/reviews",
        component: MovieReviewsPageComponent,
        data: { animation: "MovieReviewsPage" },
    },
    {
        path: "login",
        component: LoginComponent,
        data: { animation: "LoginPage" },
    },
    {
        path: "register",
        component: RegisterComponent,
        data: { animation: "RegisterPage" },
    },
    {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { animation: "ProfilePage" },
    },
    {
        path: "settings",
        component: SettingsComponent,
        canActivate: [AuthGuard],
        data: { animation: "SettingsPage" },
    },
    {
        path: "admin-functions",
        component: AdminPageComponent,
        canActivate: [AuthGuard],
        data: { animation: "AdminFunctionsPage" },
    },
    {
        path: "analytics",
        component: AnalyticsComponent,
        data: { animation: "AnalyticsPage" },
    },
    {
        path: "preference",
        component: PreferenceComponent,
        data: { animation: "PreferencePage" },
        canActivate: [AuthGuard],
    },
    {
        path: "search",
        component: SearchPageComponent,
        data: { animation: "SearchPage" },
    },
    {
        path: "search/:query",
        component: SearchPageComponent,
        data: { animation: "SearchPage" },
    },
];

@NgModule({
    imports: [RouterModule],
    exports: [RouterModule],
    providers: [provideRouter(routes, withComponentInputBinding())],
})
export class AppRoutingModule {}
