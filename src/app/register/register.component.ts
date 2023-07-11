import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})

export class RegisterComponent {
registerForm = new FormGroup({
    watchertag: new FormControl('', Validators.required),
    emailaddress: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')])
  })
  
  get watchertag() {return this.registerForm.get('watchertag');}
  get emailaddress() {return this.registerForm.get('emailaddress');}
  get password() {return this.registerForm.get('password');}
  }

