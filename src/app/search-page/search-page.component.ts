import { Component, Input } from "@angular/core";
import {
    faCircleNotch,
    faFilter,
    faMinus,
    faPlus,
    faSort,
    faSortAsc,
    faSortDesc,
} from "@fortawesome/free-solid-svg-icons";
import { MovieService } from "../services/movie.service";
import { movieTracker } from "../movie-card/movie-card.component";
import { SearchResults } from "src/interfaces/SearchResults";

type SortMethod = "for you" | "rating" | "relevancy" | "popularity";
type FilterState = "positive" | "negative" | "pending";
type FilterType = "boolean" | "range"; // Only boolean implemented, range not needed yet

interface Filter {
    state: FilterState;
    name: string;
    valueType: FilterType;
    min?: number;
    max?: number;
}

@Component({
    selector: "app-search-page",
    templateUrl: "./search-page.component.html",
    styleUrls: ["./search-page.component.scss"],
})
export class SearchPageComponent {
    movieTracker = movieTracker;
    spinner = faCircleNotch;
    plus = faPlus;
    minus = faMinus;
    filtersIcon = faFilter;
    sortIcon = faSort;

    query?: string;

    isLoading = true;
    results?: SearchResults;

    filters: Filter[] = [
        {
            state: "pending",
            name: "Adult",
            valueType: "boolean",
        },
    ];

    sortMethod: SortMethod = "for you";
    sortDescending = true;

    @Input("query") set setQuery(newQuery: string) {
        this.query = newQuery;
    }

    constructor(private movieService: MovieService) {
        this.movieService.getTrending(0, 50).subscribe((movies) => {
            this.results = {
                time: 0.3,
                keywords: ["fight", "fight club", "club"],
                movies,
            };
            this.isLoading = false;
        });
    }

    plusFilter(filter: Filter) {
        if (filter.state == "positive") {
            filter.state = "pending";
        } else {
            filter.state = "positive";
        }

        this.updateFilters();
    }

    minusFilter(filter: Filter) {
        if (filter.state == "negative") {
            filter.state = "pending";
        } else {
            filter.state = "negative";
        }

        this.updateFilters();
    }

    updateFilters() {
        this.filters.sort((a, b) => {
            let result = 0;

            let types = ["boolean", "range"];

            result += types.indexOf(a.valueType) - types.indexOf(b.valueType);
            result *= 10;

            if (a.valueType == "boolean") {
                let states = ["positive", "negative", "pending"];

                result += states.indexOf(a.state) - types.indexOf(a.state);
                result *= 10;
            }

            result += a.name.localeCompare(b.name);

            return result;
        });
    }

    setSorting(newSorting: string) {
        this.sortMethod = newSorting as SortMethod;
    }
}
