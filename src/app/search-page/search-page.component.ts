import { Component, Input } from "@angular/core";
import {
    faCircleNotch,
    faFilter,
    faMinus,
    faPlus,
    faSort,
    faSortAmountAsc,
    faSortAmountDesc,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { MovieService } from "../services/movie.service";
import { movieTracker } from "../movie-card/movie-card.component";
import { SearchResults } from "src/interfaces/SearchResults";
import { SearchQuery, SortMethod } from "../searchbar/SeachQuery";
import { Suggestion } from "src/interfaces/Suggestion";
import { KeywordService } from "../services/keyword.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SuggestionProvider } from "../suggestion-box/suggestion-box.component";
import { Genre } from "src/interfaces/Genre";
import { ProductionCompanyService } from "../services/production-company.service";
import { MovieCollectionService } from "../services/movie-collection.service";
import { IMovieCollectionDto } from "src/interfaces/IMovieCollectionDto";

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
    deleteIcon = faTrashCan;

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

    genreFilters: Filter[];
    companyFilters: Filter[] = [];
    belongsToCollection?: string;
    collectionData?: IMovieCollectionDto;

    sortMethod: SortMethod = "rating";
    sortDescending = true;

    filterSuggestionProviderBound: SuggestionProvider;
    movieCollectionSuggestionProviderBound: SuggestionProvider;
    productionCompanySuggestionProviderBound: SuggestionProvider;

    page = 0;

    private timerId?: number;

    @Input("query") set setQuery(newQuery: string) {
        this.query = newQuery;

        this.queueDispatch();
    }

    constructor(
        private movieService: MovieService,
        private keywordService: KeywordService,
        private productionCompanyService: ProductionCompanyService,
        private movieCollectionService: MovieCollectionService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.genreFilters = Object.keys(Genre)
            .filter((k) => Number.isNaN(Number(k)))
            .map((name) => ({
                name,
                state: "pending",
                valueType: "boolean",
            })) as Filter[];

        this.filterSuggestionProviderBound =
            this.filterSuggestionProvider.bind(this);

        this.movieCollectionSuggestionProviderBound =
            this.movieCollectionSuggestionProvider.bind(this);

        this.productionCompanySuggestionProviderBound =
            this.productionCompanySuggestionProvider.bind(this);

        this.route.queryParamMap.subscribe((params) => {
            let includes = params.getAll("include");
            let excludes = params.getAll("exclude");
            let order = params.get("order");
            let dir = params.get("order-direction");
            let page = params.get("page");
            let genreIncludes = params.getAll("includeGenre");
            let genreExcludes = params.getAll("excludeGenre");
            let companyIncludes = params.getAll("includeCompany");
            let companyExcludes = params.getAll("excludeCompany");
            let collection = params.get("collection");

            const addFilters = (
                filterArray: Filter[],
                state: FilterState,
                input: string[]
            ) => {
                for (const name of input) {
                    const existing = filterArray.find((f) => f.name == name);

                    if (existing) {
                        existing.state = state;
                    } else {
                        filterArray.push({
                            name,
                            state,
                            valueType: "boolean",
                        });
                    }
                }
            };

            addFilters(this.filters, "positive", includes);
            addFilters(this.filters, "negative", excludes);
            addFilters(this.genreFilters, "positive", genreIncludes);
            addFilters(this.genreFilters, "negative", genreExcludes);
            addFilters(this.companyFilters, "positive", companyIncludes);
            addFilters(this.companyFilters, "negative", companyExcludes);

            if (order) {
                this.sortMethod = (order as SortMethod) ?? "popularity";
            }

            if (dir) {
                this.sortDescending = dir == "desc";
            }

            if (page) {
                this.page = parseInt(page);
            }

            if (collection) {
                this.setMovieCollection(collection, false);
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
        const filterArrays = [
            this.filters,
            this.genreFilters,
            this.companyFilters,
        ];

        for (const filterArray of filterArrays) {
            filterArray.sort((a, b) => {
                let types = ["boolean", "range"];
                let states = ["positive", "negative", "pending"];

                return (
                    cmp(
                        types.indexOf(a.valueType),
                        types.indexOf(b.valueType)
                    ) ||
                    cmp(states.indexOf(a.state), states.indexOf(b.state)) ||
                    cmp(a.name, b.name)
                );
            });
        }

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
                includeGenre: this.genreFilters
                    .filter((f) => f.state == "positive")
                    .map((f) => f.name),
                excludeGenre: this.genreFilters
                    .filter((f) => f.state == "negative")
                    .map((f) => f.name),
                includeCompany: this.companyFilters
                    .filter((f) => f.state == "positive")
                    .map((f) => f.name),
                excludeCompany: this.companyFilters
                    .filter((f) => f.state == "negative")
                    .map((f) => f.name),
                collection: this.belongsToCollection,
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

        query.includeGenres = this.genreFilters
            .filter((f) => f.state == "positive")
            .map((f) => f.name);

        query.excludeGenres = this.genreFilters
            .filter((f) => f.state == "negative")
            .map((f) => f.name);

        query.includeProductionCompanies = this.companyFilters
            .filter((f) => f.state == "positive")
            .map((f) => f.name);

        query.excludeProductionCompanies = this.companyFilters
            .filter((f) => f.state == "negative")
            .map((f) => f.name);

        query.collection = this.belongsToCollection;

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

    movieCollectionSuggestionProvider(input: string) {
        return this.movieCollectionService.findSuggestions(input);
    }

    productionCompanySuggestionProvider(input: string) {
        return this.productionCompanyService.findSuggestions(input);
    }

    filterAdded(filter: Suggestion) {
        this.filters.push({
            name: filter.keyword,
            state: "positive",
            valueType: "boolean",
        });

        this.updateFilters();
    }

    companyFilterAdded(filter: Suggestion) {
        this.companyFilters.push({
            name: filter.keyword,
            state: "positive",
            valueType: "boolean",
        });

        this.updateFilters();
    }

    setMovieCollection(collectionName: string, dispatch: boolean = true) {
        this.belongsToCollection = collectionName;

        this.movieCollectionService
            .getByName(collectionName)
            .subscribe((collection) => (this.collectionData = collection));

        if (dispatch) this.dispatchQuery();
    }

    unsetMovieCollection() {
        this.belongsToCollection = undefined;
        this.collectionData = undefined;

        this.dispatchQuery();
    }
}
