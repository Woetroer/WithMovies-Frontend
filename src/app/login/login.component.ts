import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})

export class LoginComponent{
  loginForm = new FormGroup({
    userInfo: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')])
  })
  get password() {return this.loginForm.get('password');}
  get userInfo() {return this.loginForm.get('userInfo');}
}

