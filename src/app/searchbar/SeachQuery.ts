export type SortMethod = "release date" | "rating" | "relevance" | "popularity";

export class SearchQuery {
    public rawText: string;

    public include: string[] = [];
    public exclude: string[] = [];

    public sortMethod: SortMethod = "release date";
    public sortDescending: boolean = true;

    public constructor(rawText: string) {
        this.rawText = rawText;
    }
}
