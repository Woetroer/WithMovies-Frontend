import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http:HttpClient, ) {}  

  changeUsername(userName: string) {
    return this._http.put(environment.apiUrl + "user/change-username/" + encodeURIComponent(userName), "")
  }

  changeEmail(email: string) {
    return this._http.put(environment.apiUrl + "user/change-email/"+ encodeURIComponent(email), "")
  }

  resetPassword(formData: any){
    return this._http.post(environment.apiUrl + "user/reset-password", formData)
  }
}
