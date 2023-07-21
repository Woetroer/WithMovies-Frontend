import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { AuthenticatedResponse } from "src/interfaces/AuthenticatedResponse";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    loginForm = new FormGroup({
        username: new FormControl("", Validators.required),
        password: new FormControl("", [Validators.required]),
    });
    get password() {
        return this.loginForm.get("password");
    }
    get username() {
        return this.loginForm.get("username");
    }

    constructor(private _authService:AuthService, private _router:Router) {}

    submit(){
      this._authService.login(this.loginForm.getRawValue()).subscribe(
        {
          next: (response: any) => {
            this._authService.setTokens(response);
            this._router.navigate(['/'])
          },
          error: () => {
            console.log("Login error")
          }
        });;
    }
}
