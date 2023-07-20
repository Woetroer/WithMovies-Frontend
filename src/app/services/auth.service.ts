import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

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
    localStorage.removeItem("Jwt");
    this._router.navigateByUrl("/login")
  }

  setAccessToken(token: string) {
    localStorage.setItem("Jwt", token.toString());
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
