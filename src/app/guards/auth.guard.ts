import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticatedResponse } from 'src/interfaces/AuthenticatedResponse';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
    constructor(private router:Router, private jwtHelper: JwtHelperService, private http: HttpClient){}
  
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const token = localStorage.getItem("jwt")!;
      if (token && !this.jwtHelper.isTokenExpired(token)){
        console.log(this.jwtHelper.decodeToken(token))
        return true;
      }
      const isRefreshSuccess = await this.tryRefreshingTokens(token); 
      if (!isRefreshSuccess) { 
        this.router.navigate(["login"]); 
      }
      return isRefreshSuccess;
    }

    private async tryRefreshingTokens(token: string): Promise<boolean> {
        const refreshToken: any = localStorage.getItem("refreshToken");
        if (!token || !refreshToken) { 
          return false;
        }
        
        const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
        let isRefreshSuccess: boolean;
        const refreshResponse = await new Promise<AuthenticatedResponse>((resolve, reject) => {
          this.http.post<AuthenticatedResponse>(environment.apiUrl + "/auth/refresh", credentials, {
            headers: new HttpHeaders({
              "Content-Type": "application/json"
            })
          }).subscribe({
            next: (res: AuthenticatedResponse) => resolve(res),
            error: (_) => { reject; isRefreshSuccess = false;}
          });
        });
        localStorage.setItem("jwt", refreshResponse.accessToken);
        localStorage.setItem("refreshToken", refreshResponse.refreshToken);
        isRefreshSuccess = true;
        return isRefreshSuccess;
      }
}