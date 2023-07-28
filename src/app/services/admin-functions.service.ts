import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import UserIdentifiers from "../admin-page/UserIdentifiers";

@Injectable({
    providedIn: "root",
})
export class AdminFunctionsService {
    private blockUrl = "http://localhost:4200/api/User/block";
    private revokeReviewRightUrl = "http://localhost:4200/api/User/reviewright";
    private deleteUrl = "http://localhost:4200/api/User/delete";

    constructor(private httpClient: HttpClient) {}

    BlockUser(this: AdminFunctionsService, userIdentifiers: UserIdentifiers) {
        return this.httpClient.post(this.blockUrl, userIdentifiers);
    }
    RevokeReviewRightUser(
        this: AdminFunctionsService,
        userIdentifiers: UserIdentifiers
    ) {
        return this.httpClient.post(this.revokeReviewRightUrl, userIdentifiers);
    }
    DeleteUser(this: AdminFunctionsService, userIdentifiers: UserIdentifiers) {
        return this.httpClient.post(this.deleteUrl, userIdentifiers);
    }
}
