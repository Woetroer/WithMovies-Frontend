import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import UserIdentifiers from "../admin-page/UserIdentifiers";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: "root",
})
export class AdminFunctionsService {
    private blockUrl = environment.apiUrl + "user/block";
    private revokeReviewRightUrl = environment.apiUrl + "user/reviewright";
    private deleteUrl = environment.apiUrl + "user/delete";

    constructor(private httpClient: HttpClient) {}

    BlockUser(userIdentifiers: UserIdentifiers) {
        return this.httpClient.post(this.blockUrl, userIdentifiers);
    }
    RevokeReviewRightUser(userIdentifiers: UserIdentifiers) {
        return this.httpClient.post(this.revokeReviewRightUrl, userIdentifiers);
    }
    DeleteUser(userIdentifiers: UserIdentifiers) {
        return this.httpClient.post(this.deleteUrl, userIdentifiers);
    }
}
