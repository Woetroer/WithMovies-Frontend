import { Injectable } from "@angular/core";
import KEYWORDS_FILE from "raw-loader!./keywords.txt";
import { findBestMatch } from "src/string-similarity";

// Custom format for quick keyword lookup
class KeywordSet {
    private children: Map<string, KeywordSet> = new Map();
    private set: Set<string> = new Set();

    public getOrInit(word: string) {
        let set = this.children.get(word);

        if (!set) {
            set = new KeywordSet();
            this.children.set(word, set);
        }

        return set;
    }

    public push(word: string) {
        this.set.add(word);
    }

    private _pushBuffer(buffer: string[]) {
        if (buffer.length == 1) {
            this.push(buffer[0]);
            return;
        }

        this.getOrInit(buffer.pop()!)._pushBuffer(buffer);
    }

    public tree(prefix: string): string[] {
        return [
            ...[...this.set].map((s) => prefix + " " + s),
            ...[...this.children.entries()].flatMap((c) =>
                c[1].tree(prefix + " " + c[0])
            ),
        ];
    }

    public pushBuffer(buffer: string[]) {
        if (buffer.length == 0) {
            return;
        }

        let rev = [...buffer].reverse();
        this._pushBuffer(rev);
    }

    private _fromBuffer(
        buffer: string[],
        path: string,
        partial: boolean,
        suggestions: boolean,
        count: number
    ): string[] {
        // If no more segments left or 8 iterations have passed (the longest
        // keyword has 8 spaces)
        if (buffer.length == 0 || count == 8) {
            return [];
        }

        let segment = buffer.at(-1)!;
        let newPath = (path + " " + segment).trimStart();
        let keywords = [];

        if (partial) {
            // Find best matching keyword
            let bestMatch = findBestMatch(segment, [
                ...this.children.keys(),
                ...this.set,
            ]);
            console.log(
                `${segment} / ${bestMatch.bestMatch.target} / ${bestMatch.bestMatch.rating}`
            );
            if (bestMatch.bestMatch.rating > 0.4) {
                segment = bestMatch.bestMatch.target;
                newPath = (path + " " + segment).trimStart();
            }

            // If keyword is similar to current one, add it
            if (this.set.has(segment)) keywords.push(newPath);

            if (suggestions && this.children.has(segment)) {
                keywords.push(...this.children.get(segment)!.tree(newPath));
            }
        }

        // If keyword exists at the current path, add it
        if (this.set.has(segment)) {
            keywords.push(newPath);
        }

        let child = this.children.get(buffer.pop()!);

        if (child) {
            keywords = [
                ...keywords,
                ...child._fromBuffer(
                    buffer,
                    newPath,
                    partial,
                    suggestions,
                    count + 1
                ),
            ];
        }

        return keywords;
    }

    public fromBuffer(
        buffer: string[],
        partial: boolean = false,
        suggestions: boolean = false
    ): string[] {
        if (buffer.length == 0) {
            return [];
        }

        let keywords: Set<string> = new Set();

        for (let i = 0; i < Math.min(8, buffer.length); i++) {
            let slice = buffer.slice(i, undefined);
            for (const keyword of this._fromBuffer(
                slice.reverse(),
                "",
                partial,
                suggestions,
                0
            )) {
                keywords.add(keyword);
            }
        }

        return [...keywords];
    }
}

@Injectable({
    providedIn: "root",
})
export class KeywordService {
    keywords: KeywordSet = new KeywordSet();
    reverseKeywords: KeywordSet = new KeywordSet();

    constructor() {
        this.initKeywords().catch(console.error);
    }

    async initKeywords() {
        let buffer: string[] = [""];

        console.log("Initializing local keyword database");
        console.time("Local keyword database setup");

        for (const ch of KEYWORDS_FILE) {
            switch (ch) {
                case " ":
                    buffer.push("");
                    break;
                case "\n":
                    if (buffer.length > 0) {
                        buffer[0] = buffer[0].trim();
                        this.keywords.pushBuffer(buffer);
                        this.reverseKeywords.pushBuffer(buffer.reverse());
                    }

                    buffer = [""];
                    break;
                default:
                    buffer[buffer.length - 1] += ch;
                    break;
            }
        }

        console.timeEnd("Local keyword database setup");
        console.log("Initialized local keyword database");
    }

    public findKeywords(text: string) {
        let words = text.toLowerCase().split(" ");
        return this.keywords.fromBuffer(words);
    }

    public findSuggestions(text: string) {
        let words = text.toLowerCase().split(" ");
        return this.keywords.fromBuffer(words, true, true).reverse();
    }
}
