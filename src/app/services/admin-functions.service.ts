import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import UserIdentifiers from '../admin-page/UserIdentifiers';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminFunctionsService {

  private blockUrl = 'http://localhost:4200/api/User/block'
  private revokeReviewRightUrl = 'http://localhost:4200/api/User/reviewright'
  private deleteUrl = 'http://localhost:4200/api/User/delete'

  constructor(private httpClient: HttpClient) { }

  BlockUser(userIdentifiers: UserIdentifiers) {
    return this.httpClient.post(this.blockUrl, userIdentifiers)
  }
  RevokeReviewRightUser(userIdentifiers: UserIdentifiers) {
    return this.httpClient.post(this.revokeReviewRightUrl, userIdentifiers)
  }
  DeleteUser(userIdentifiers: UserIdentifiers) {
    return this.httpClient.post(this.deleteUrl, userIdentifiers)
  }

}
