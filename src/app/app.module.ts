import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ProfileComponent } from "./profile/profile.component";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { SettingsComponent } from "./settings/settings.component";
import { HomeComponent } from "./home/home.component";
import { NavigationBarComponent } from "./navigation-bar/navigation-bar.component";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MovieDetailsPageComponent } from "./movie-details-page/movie-details-page.component";
import { SearchbarComponent } from "./searchbar/searchbar.component";
import { HttpClientModule } from "@angular/common/http";
import { PreferenceComponent } from "./preference/preference.component";
import { MovieCardComponent } from "./movie-card/movie-card.component";
import { NgChartsModule } from "ng2-charts";
import { JwtModule } from "@auth0/angular-jwt";

export function tokenGetter() {
    return localStorage.getItem("jwt");
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
        AnalyticsComponent,
        SettingsComponent,
        HomeComponent,
        NavigationBarComponent,
        MovieDetailsPageComponent,
        SearchbarComponent,
        MovieCardComponent,
        PreferenceComponent,
    ],
    imports: [
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: ["localhost:5186"],
                disallowedRoutes: [],
            },
        }),
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        HttpClientModule,
        NgChartsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
