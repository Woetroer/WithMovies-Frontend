export type SortMethod = "release date" | "rating" | "relevance" | "popularity";

export class SearchQuery {
    public rawText: string;

    public include: string[] = [];
    public exclude: string[] = [];

    public includeGenres: string[] = [];
    public excludeGenres: string[] = [];

    public includeProductionCompanies: string[] = [];
    public excludeProductionCompanies: string[] = [];

    public collection?: string;

    public sortMethod: SortMethod = "release date";
    public sortDescending: boolean = true;

    public page: number = 0;

    public constructor(rawText: string) {
        this.rawText = rawText;
    }
}
