import { Component } from "@angular/core";
import { AnalyticsService } from "../services/analytics.service";
import { MoviePreview } from "src/interfaces/MoviePreview";
import { environment } from "../environments/environment";
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { Genre } from "src/interfaces/Genre";
import { User } from "src/interfaces/User";

type MovieKind = "trending";


@Component({
    selector: "app-analytics",
    templateUrl: "./analytics.component.html",
    styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent {

    movies = new Map<MovieKind, MoviePreview[]>();

    genres = environment.genres;
    chart: any;
    trendingGenres: string[] = [];
    trendingGenresData?: ChartData;
    trendingGenresChartOptions: ChartOptions;

    allUsers: number = 0;
    averageReviewsPerUser: number = 0;
    mostActiveUsers: User[] = [];

    //genreOrder = for each number in trendingGenres: genres[number] add to trending  

    constructor(private analyticsService: AnalyticsService) {
        this.getAllUsers();
        this.getAverageReviewsPerUser();
        this.getUsersWithMostReviews(10);

        this.movies.set("trending", this.movies.get("trending") ?? []);

        this.analyticsService.getTrendingGenres(0, 10).subscribe((data) => {
            const map = new Map<string, number>();

            const increaseGenre = (genreName: string) => {
                map.set(genreName, (map.get(genreName) ?? 0) + 1);
            }

            for (const entry of data)
                increaseGenre(Genre[entry]);

            this.trendingGenresData = {
                labels: [...map.keys()],
                datasets: [{
                    label: 'Trending genres',
                    data: [...map.values()],
                    backgroundColor: [
                        '#f03e3e',
                        '#d6336c',
                        '#ae3ec9',
                        '#7048e8',
                        '#4263eb',
                        '#1c7ed6',
                        '#1098ad',
                        '#0ca678',
                        '#37b24d',
                        '#74b816',
                        '#f59f00',
                        '#f76707'
                    ],
                    hoverOffset: 4,
                    borderColor: '#e7e9e8',
                    borderWidth: 2,
                    hoverBorderWidth: 4,
                }]
            };
            this.analyticsService.getTrending(0, 10).subscribe((res) => this.movies.set("trending", res));
        });


        this.trendingGenresChartOptions = {
            plugins: {
                "decimation": {
                    enabled: true
                },
                "legend":{
                    position: "left",
                    labels: {
                        color: '#e7e9e8',
                        font: {
                            family: "Lexend",
                        },
                        boxHeight: 16,
                        boxWidth: 16,
                        boxPadding: 8
                    },
                    align: "start"
                }
            },
            layout: {
                padding: {
                    top: 5,
                    bottom: 5
                }
            }
        };
    }

    getTendingMovies() {
        this.analyticsService.getTrending(0, 10).subscribe((res) => this.movies.set("trending", res));
    }

    getTrendingGenres(){
        this.analyticsService.getTrendingGenres(0, 10).subscribe(res => {
            this.trendingGenres = res.map(i => this.genres[i]);
        });    
    };

    public getAllUsers() {
        this.analyticsService.getAllUsers().subscribe(res => this.allUsers = res)
    };
    public getAverageReviewsPerUser() {
        this.analyticsService.getAverageReviewsPerUser().subscribe(res => this.averageReviewsPerUser = res)
    };
    public getUsersWithMostReviews(amount: number) {
        this.analyticsService.getUsersWithMostReviews(10).subscribe(res => this.mostActiveUsers = res)
    };
    
}
                