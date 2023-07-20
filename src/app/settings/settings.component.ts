import { Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";


@Component({
    selector: "app-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit{
    username: string = "";
    currentEmail: string = "";
    email: string = "";
    isReadOnly: boolean = true;
    faEdit = faEdit;
    faSave = faSave;
    constructor(private _userService:UserService, private _authService:AuthService) {}

    ngOnInit(): void {
        this.username = this._authService.getUsername();
        this.currentEmail = this._authService.getEmail();
        this.email = this.currentEmail;
        console.log(this.username, this.email)
    }

    changeInfo(id: string){
        const element = document.getElementById(id);
        this.email = "";
        this.isReadOnly = false;
        element?.focus();
    }

    saveInfo(id: string){
        const element = document.getElementById(id);
        if(this.email != null){
            this._userService.changeEmail(this.email).subscribe(() => {this.email = this._authService.getEmail()})
            this.isReadOnly = false;
        }
    }
}
