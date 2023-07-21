import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { AuthenticatedResponse } from 'src/interfaces/AuthenticatedResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http:HttpClient, private _router:Router) {}  

  isLoggedIn() : boolean{
    return localStorage.getItem("Jwt") != null
  }

  register(formData: any) {
    return this._http.post(environment.apiUrl + "auth/register", formData)
  }

  login(formData: any){
    return this._http.post(environment.apiUrl + "auth/login", formData)
  }

  logout(){
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    this._router.navigateByUrl("/login")
  }

  setTokens(response: AuthenticatedResponse) {
    localStorage.setItem("jwt", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
  }

  getUsername(){
    if(this.isLoggedIn()){
      let username = JSON.parse(window.atob(localStorage.getItem('Jwt')!.split('.')[1]))['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      return username.charAt(0).toUpperCase() + username.substring(1);
    }
  }
 
  getEmail(){
    if(this.isLoggedIn()){
      return JSON.parse(window.atob(localStorage.getItem('Jwt')!.split('.')[1]))['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    }
  }
}
