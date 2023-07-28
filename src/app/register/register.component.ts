import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { RegisterError } from "src/interfaces/RegisterError";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
    errors: RegisterError = {};

    registerForm = new FormGroup({
        username: new FormControl(""),
        email: new FormControl("",Validators.email),
        password: new FormControl(),
    });

    get username() {
        return this.registerForm.get("username");
    }
    get email() {
        return this.registerForm.get("email");
    }
    get password() {
        return this.registerForm.get("password");
    }

    constructor(private _authService:AuthService, private _router:Router) {}

    submit(){
      this._authService.register(this.registerForm.getRawValue()).subscribe(
        {
          next: () => {
            this._router.navigate(['/login'])
          },
          error: (error) => {
            console.log("Register error")
            this.errors = error.error;
          }
        });;
    }
}
