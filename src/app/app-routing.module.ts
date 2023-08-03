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

const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        title: "Home",
        data: { showInNavigationBar: true },
    },
    { path: "movie/:id", component: MovieDetailsPageComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
    { path: "settings", component: SettingsComponent, canActivate: [AuthGuard] },
    { path: "preference", component: PreferenceComponent },
    { path: "analytics", component: AnalyticsComponent },
    { path: "admin-functions", component: AdminPageComponent },
];

@NgModule({
    imports: [RouterModule],
    exports: [RouterModule],
    providers: [provideRouter(routes, withComponentInputBinding())],
})
export class AppRoutingModule {}
