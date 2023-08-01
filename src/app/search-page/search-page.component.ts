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
import { SearchQuery, SortMethod } from "../searchbar/SeachQuery";
import { KeywordSuggestion } from "src/interfaces/KeywordSuggestion";
import { KeywordService } from "../services/keyword.service";

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

    isLoading = false;
    results?: SearchResults;

    filters: Filter[] = [
        {
            state: "pending",
            name: "Adult",
            valueType: "boolean",
        },
    ];

    sortMethod: SortMethod = "release date";
    sortDescending = true;

    addKeywordValue: string = "";
    keywordSuggestions: KeywordSuggestion[] = [];
    updateSuggestionsTimer?: number;
    keywordsShown = false;

    private timerId?: number;

    @Input("query") set setQuery(newQuery: string) {
        this.query = newQuery;

        this.queueDispatch();
    }

    constructor(
        private movieService: MovieService,
        private keywordService: KeywordService
    ) {}

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

        this.dispatchQuery();
    }

    setSorting(newSorting: string) {
        this.sortMethod = newSorting as SortMethod;

        this.dispatchQuery();
    }

    dispatchQuery() {
        if (!this.query || this.isLoading) return;

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

        this.movieService.queryMovies(query, 0, 20).subscribe((results) => {
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

    showKeywords() {
        this.keywordsShown = true;
    }

    hideKeywords() {
        this.keywordsShown = false;
    }

    suggestionClicked(event: Event, suggestion: KeywordSuggestion) {
        event.stopPropagation();

        this.keywordSuggestions = [];
        this.addKeywordValue = "";

        this.filters.push({
            name: suggestion.keyword,
            state: "positive",
            valueType: "boolean",
        });

        this.updateFilters();
    }

    suggestionsKeydown() {
        if (this.updateSuggestionsTimer) {
            clearTimeout(this.updateSuggestionsTimer);
            this.updateSuggestionsTimer = undefined;
        }

        this.updateSuggestionsTimer = setTimeout(() => {
            this.updateSuggestions();
            this.updateSuggestionsTimer = undefined;
        }, 100) as any;
    }

    updateSuggestions() {
        this.keywordSuggestions = [];

        let value = this.addKeywordValue.trim();

        if (value.length < 3) {
            return;
        }

        this.keywordService.findSuggestions(value.trim()).subscribe((s) => {
            this.keywordSuggestions = s.sort((a, b) => b.weight - a.weight);
            this.keywordsShown = true;
        });
    }
}
