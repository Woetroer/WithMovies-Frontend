import { Component } from '@angular/core';
import UserIdentifiers from './UserIdentifiers';
import { AdminFunctionsService } from '../services/admin-functions.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent {

  targetWatcherTag: string = "";
  targetEmail: string = "";

  constructor(public adminFunctionService: AdminFunctionsService) {
  }

  popup(callback: (_: UserIdentifiers) => Observable<any>) {
    callback({ name: this.targetWatcherTag, email: this.targetEmail })
  }

}
