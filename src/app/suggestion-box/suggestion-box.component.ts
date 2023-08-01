import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Observable } from "rxjs";
import { KeywordSuggestion } from "src/interfaces/KeywordSuggestion";

export type SuggestionProvider = (
    value: string
) => Observable<KeywordSuggestion[]>;

@Component({
    selector: "app-suggestion-box",
    templateUrl: "./suggestion-box.component.html",
    styleUrls: ["./suggestion-box.component.scss"],
})
export class SuggestionBoxComponent {
    @Input("values") @Output("values") values: string[] = [];
    @Input("provider") provider!: SuggestionProvider;
    @Input("placeholder") placeholder?: string = undefined;
    @Output("added") added: EventEmitter<KeywordSuggestion> =
        new EventEmitter();

    suggestions: KeywordSuggestion[] = [];
    suggestionsShown = false;
    inputValue: string = "";

    timerId?: number;

    showSuggestions() {
        this.suggestionsShown = true;
    }

    hideSuggestions() {
        this.suggestionsShown = false;
    }

    inputChanged() {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = undefined;
        }

        this.timerId = setTimeout(() => {
            this.updateSuggestions();
            this.timerId = undefined;
        }, 100) as any;
    }

    suggestionClicked(suggestion: KeywordSuggestion) {
        this.suggestions = [];
        this.inputValue = "";

        this.values.push(suggestion.keyword);
        this.added.emit(suggestion);
    }

    updateSuggestions() {
        this.suggestions = [];

        let value = this.inputValue.trim();

        if (value.length < 3) {
            return;
        }

        this.provider(value.trim()).subscribe((s) => {
            this.suggestions = s.sort((a, b) => b.weight - a.weight);
            this.suggestionsShown = true;
        });
    }
}
