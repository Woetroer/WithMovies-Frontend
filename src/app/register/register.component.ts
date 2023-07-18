import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
    registerForm = new FormGroup({
        watchertag: new FormControl("", Validators.required),
        emailaddress: new FormControl("", [
            Validators.required,
            Validators.email,
        ]),
        password: new FormControl("", [
            Validators.required,
            Validators.pattern(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%?&])[A-Za-z\d$@$!%?&]{8,}$"
            ),
        ]),
    });

    get watchertag() {
        return this.registerForm.get("watchertag");
    }
    get emailaddress() {
        return this.registerForm.get("emailaddress");
    }
    get password() {
        return this.registerForm.get("password");
    }

    constructor(private _authService:AuthService, private _router:Router) {}

    submit(){
      this._authService.register(this.registerForm.getRawValue()).subscribe(
        {
          next: () => {
            this._router.navigate(['/Login'])
          },
          error: () => {
            console.log("Register error")
          }
        });;
    }
}
