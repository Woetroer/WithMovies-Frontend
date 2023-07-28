import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticatedResponse } from 'src/interfaces/AuthenticatedResponse';
import { environment } from '../environments/environment';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
    constructor(private router:Router, 
      private jwtHelper: JwtHelperService, 
      private http: HttpClient,
      private _authService: AuthService){}
  
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      
      const token = localStorage.getItem("jwt")!;
      if (token && !this.jwtHelper.isTokenExpired(token)){
        console.log(this.jwtHelper.decodeToken(token))
        return true;
      }
      const isRefreshSuccess = await this._authService.tryRefreshingTokens(token); 
      if (!isRefreshSuccess) { 
        this.router.navigate(["login"]); 
      }
      return isRefreshSuccess;
    }
}