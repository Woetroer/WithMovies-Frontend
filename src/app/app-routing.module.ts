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
import { AdminPageComponent } from "./admin-page/admin-page.component";
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
    { path: "register", component: RegisterComponent },
    { path: "Profile", component: ProfileComponent },
    { path: "Settings", component: SettingsComponent },
    { path: "analytics", component:AnalyticsComponent },
    { path: "admin-functions", component:AdminPageComponent}
];

@NgModule({
    imports: [RouterModule],
    exports: [RouterModule],
    providers: [provideRouter(routes, withComponentInputBinding())],
})
export class AppRoutingModule {}
