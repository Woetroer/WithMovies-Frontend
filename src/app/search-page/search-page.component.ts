import { Component, Input } from "@angular/core";
import {
    faCircleNotch,
    faFilter,
    faMinus,
    faPlus,
    faSort,
    faSortAmountAsc,
    faSortAmountDesc,
    faSortAsc,
    faSortDesc,
} from "@fortawesome/free-solid-svg-icons";
import { MovieService } from "../services/movie.service";
import { movieTracker } from "../movie-card/movie-card.component";
import { SearchResults } from "src/interfaces/SearchResults";
import { SearchQuery, SortMethod } from "../searchbar/SeachQuery";
import { KeywordSuggestion } from "src/interfaces/KeywordSuggestion";
import { KeywordService } from "../services/keyword.service";
import { ActivatedRoute, Router } from "@angular/router";

type FilterState = "positive" | "negative" | "pending";
type FilterType = "boolean" | "range"; // Only boolean implemented, range not needed yet

interface Filter {
    state: FilterState;
    name: string;
    valueType: FilterType;
    min?: number;
    max?: number;
}

function cmp<T>(x: T, y: T) {
    return x > y ? 1 : x < y ? -1 : 0;
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
    descIcon = faSortAmountDesc;
    ascIcon = faSortAmountAsc;

    query: string = "";

    isLoading = false;
    results?: SearchResults;

    filters: Filter[] = [
        {
            state: "pending",
            name: "Adult",
            valueType: "boolean",
        },
    ];

    sortMethod: SortMethod = "rating";
    sortDescending = true;

    addKeywordValue: string = "";
    keywordSuggestions: KeywordSuggestion[] = [];
    updateSuggestionsTimer?: number;
    keywordsShown = false;

    page = 0;

    private timerId?: number;

    @Input("query") set setQuery(newQuery: string) {
        this.query = newQuery;

        this.queueDispatch();
    }

    constructor(
        private movieService: MovieService,
        private keywordService: KeywordService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.queryParamMap.subscribe((params) => {
            let includes = params.getAll("include");
            let excludes = params.getAll("exclude");
            let order = params.get("order");
            let dir = params.get("order-direction");
            let page = params.get("page");

            for (const include of includes) {
                if (this.filters.find((f) => f.name == include)) continue;

                this.filters.push({
                    name: include,
                    state: "positive",
                    valueType: "boolean",
                });
            }

            for (const exclude of excludes) {
                if (this.filters.find((f) => f.name == exclude)) continue;

                this.filters.push({
                    name: exclude,
                    state: "positive",
                    valueType: "boolean",
                });
            }

            if (order) {
                this.sortMethod = (order as SortMethod) ?? "popularity";
            }

            if (dir) {
                this.sortDescending = dir == "desc";
            }

            if (page) {
                this.page = parseInt(page);
            }

            this.updateFilters(false);
            this.dispatchQuery();

            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = undefined;
            }
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

    updateFilters(dispatch: boolean = true) {
        this.filters.sort((a, b) => {
            let types = ["boolean", "range"];
            let states = ["positive", "negative", "pending"];

            return (
                cmp(types.indexOf(a.valueType), types.indexOf(b.valueType)) ||
                cmp(states.indexOf(a.state), states.indexOf(b.state)) ||
                cmp(a.name, b.name)
            );
        });

        if (dispatch) this.dispatchQuery();
    }

    setSorting(newSorting: string) {
        if (this.sortMethod == (newSorting as SortMethod)) {
            this.sortDescending = !this.sortDescending;
        } else {
            this.sortMethod = newSorting as SortMethod;
        }

        this.dispatchQuery();
    }

    dispatchQuery() {
        this.router.navigate(["search", this.query?.trim() ?? ""], {
            queryParams: {
                include: this.filters
                    .filter((f) => f.state == "positive")
                    .map((f) => f.name),
                exclude: this.filters
                    .filter((f) => f.state == "negative")
                    .map((f) => f.name),
                order: this.sortMethod,
                dir: this.sortDescending ? "desc" : "asc",
                page: this.page,
            },
        });

        if (this.isLoading) return;

        this.isLoading = true;

        let query = new SearchQuery(this.query);

        query.sortMethod = this.sortMethod;
        query.sortDescending = this.sortDescending;

        query.include = this.filters
            .filter((f) => f.state == "positive")
            .map((f) => f.name.toLowerCase());

        query.exclude = this.filters
            .filter((f) => f.state == "negative")
            .map((f) => f.name.toLowerCase());

        this.movieService
            .queryMovies(query, this.page * 20, 20)
            .subscribe((results) => {
                this.results = results;
                this.isLoading = false;
            });
    }

    private queueDispatch() {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = undefined;
        }

        this.timerId = setTimeout(
            () => this.dispatchQuery(),
            400
        ) as any as number;
    }

    filterSuggestionProvider(input: string) {
        return this.keywordService.findSuggestions(input);
    }

    filterAdded(filter: KeywordSuggestion) {
        this.filters.push({
            name: filter.keyword,
            state: "positive",
            valueType: "boolean",
        });

        this.updateFilters();
    }
}
