import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Router } from "@angular/router";
import { AuthenticatedResponse } from "src/interfaces/AuthenticatedResponse";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor(private _http: HttpClient, private _router: Router) {}

    isLoggedIn(): boolean {
        return localStorage.getItem("jwt") != null;
    }

    register(formData: any) {
        return this._http.post(environment.apiUrl + "auth/register", formData);
    }

    login(formData: any) {
        return this._http.post(environment.apiUrl + "auth/login", formData);
    }

    logout() {
        localStorage.removeItem("jwt");
        localStorage.removeItem("refreshToken");
        this._router.navigateByUrl("/login");
    }

    setTokens(response: AuthenticatedResponse) {
        localStorage.setItem("jwt", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
    }

    async getUsername() {
        if (this.isLoggedIn()) {
            const token = localStorage.getItem("jwt")!;
            const isRefreshSuccess = await this.tryRefreshingTokens(token);

            if (isRefreshSuccess) {
                return JSON.parse(
                    window.atob(localStorage.getItem("jwt")!.split(".")[1])
                )["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
            }
        }
    }

    async getEmail() {
        if (this.isLoggedIn()) {
            const token = localStorage.getItem("jwt")!;
            const isRefreshSuccess = await this.tryRefreshingTokens(token);

            if (isRefreshSuccess) {
                return JSON.parse(
                    window.atob(localStorage.getItem("jwt")!.split(".")[1])
                )[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                ];
            }
        }
    }

    async tryRefreshingTokens(token: string): Promise<boolean> {
        const refreshToken: any = localStorage.getItem("refreshToken");
        if (!token || !refreshToken) {
            return false;
        }

        const credentials = JSON.stringify({
            accessToken: token,
            refreshToken: refreshToken,
        });
        let isRefreshSuccess: boolean;
        const refreshResponse = await new Promise<AuthenticatedResponse>(
            (resolve, reject) => {
                this._http
                    .post<AuthenticatedResponse>(
                        environment.apiUrl + "auth/refresh",
                        credentials,
                        {
                            headers: new HttpHeaders({
                                "Content-Type": "application/json",
                            }),
                        }
                    )
                    .subscribe({
                        next: (res: AuthenticatedResponse) => resolve(res),
                        error: (_) => {
                            reject;
                            isRefreshSuccess = false;
                        },
                    });
            }
        );
        localStorage.setItem("jwt", refreshResponse.accessToken);
        localStorage.setItem("refreshToken", refreshResponse.refreshToken);
        console.log("refresh success");
        isRefreshSuccess = true;
        return isRefreshSuccess;
    }
}
