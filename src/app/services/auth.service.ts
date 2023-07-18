import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http:HttpClient, private _router:Router) {}  

  // isLoggedIn() : boolean{
  //   if(localStorage.getItem("Jwt") != null) return true;
  //   else return false;
  // }

  register(formData: any) {
    return this._http.post(environment.apiUrl + "auth/register", formData)
  }

  login(formData: any){
    return this._http.post(environment.apiUrl + "auth/login", formData)
  }

  logout(){
    localStorage.removeItem("Jwt");
    this._router.navigateByUrl("/Login")
  }

  setAccessToken(token: string) {
    localStorage.setItem("Jwt", token.toString());
  }
}
