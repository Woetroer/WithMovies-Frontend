import { Component } from '@angular/core';
import { ITitle } from '../interfaces/ITitle';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements ITitle {
    pageTitle = "Home";
}
