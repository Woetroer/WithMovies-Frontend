import { Component, OnInit} from "@angular/core";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import { FormControl, FormGroup, Validators } from "@angular/forms";


@Component({
    selector: "app-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit{
    emailError?: string;
    usernameError?: string;
    currentUsername: string = "";
    username: string = "";
    currentEmail: string = "";
    email: string = "";
    isReadOnly: boolean = true;
    faEdit = faEdit;
    faSave = faSave;
    displayPasswordForm: boolean = false;

    emailForm = new FormGroup({email: new FormControl("", Validators.email)});
    usernameForm = new FormGroup({username: new FormControl("", Validators.minLength(5))});
    passwordForm = new FormGroup({oldPassword: new FormControl(), newPassword: new FormControl()});

    constructor(private _userService:UserService, private _authService:AuthService) {}

    get emailField() {
      return this.emailForm.get("email");
    }
    get usernameField() {
      return this.usernameForm.get("username");
    }

    async ngOnInit(){
        this.currentUsername = await this._authService.getUsername();
        this.currentEmail = await this._authService.getEmail();
        this.username = this.currentUsername;
        this.email = this.currentEmail;
    }

    changeInfo(id: string){
        if(id == 'emailAddress'){
            const element = document.getElementById(id);
            this.email = "";
            this.isReadOnly = false;
            element?.focus();
        }
        else{
            const element = document.getElementById(id);
            this.username = "";
            this.isReadOnly = false;
            element?.focus();        
        }
    }

    async saveInfo(id: string){
        if(id == "email"){
            this.emailError = undefined;
            if(this.email != null){
                this._userService.changeEmail(this.email).subscribe(            
                {
                    next: async () => {
                      this.currentEmail = await this._authService.getEmail();
                      this.email = this.currentEmail;
                      this.isReadOnly = true;
                    },
                    error: (error) => {
                      console.log("Settings error");
                      this.emailError = error.error;
                    }
                  });
            }
        }
        else{
            this.usernameError = undefined;
            if(this.username != null){
                this._userService.changeUsername(this.username).subscribe(            
                {
                    next: async () => {
                      this.currentUsername = await this._authService.getUsername();
                      this.username = this.currentUsername;
                      this.isReadOnly = true;
                    },
                    error: (error) => {
                      console.log("Settings error");
                      this.usernameError = error.error;
                    }
                  });
            }
        }
    }

    togglePasswordForm(){
        this.displayPasswordForm = !this.displayPasswordForm;
    }

    resetPassword(){
        this._userService.resetPassword(this.passwordForm.getRawValue()).subscribe();
        this.displayPasswordForm = !this.displayPasswordForm;
    }
}

