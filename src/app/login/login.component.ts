import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    loginForm = new FormGroup({
        userInfo: new FormControl("", Validators.required),
        password: new FormControl("", [Validators.required]),
    });
    get password() {
        return this.loginForm.get("password");
    }
    get userInfo() {
        return this.loginForm.get("userInfo");
    }

    constructor(private _authService:AuthService, private _router:Router) {}

    submit(){
      this._authService.login(this.loginForm.getRawValue()).subscribe(
        {
          next: (response) => {
            this._authService.setAccessToken((<any>response).token);
            this._router.navigate(['/'])
          },
          error: () => {
            console.log("Login error")
          }
        });;
    }
}
