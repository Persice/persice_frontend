import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, TokenUtil } from '../../../common/core';

@Injectable()
export class NewConversationMobileService {

  static API_URL = '/api/v1/messages/';
  static API_USER_URL = '/api/v1/auth/user/';

  public sendingInProgress: boolean = false;
  private _me: string;

  constructor(private http: HttpClient) {
    const userId: string = TokenUtil.getValue('user_id');
    this._me = `/api/v1/auth/user/${userId}/`;
  }

  public sendMessage(recipientId: string, message: string): Observable<any> {
    if (this.sendingInProgress) {
      return;
    }
    let recipient: string = `/api/v1/auth/user/${recipientId}/`;
    let url = `${NewConversationMobileService.API_URL}?format=json`;
    let data = {
      body: message,
      recipient: recipient,
      sender: this._me
    };
    this.sendingInProgress = true;
    return this.http.post(url, JSON.stringify(data))
      .map((res: any) => res.json());
  }

  public messageSent(): void {
    this.sendingInProgress = false;
  }

  public messageNotSent(): void {
    this.sendingInProgress = false;
  }

}
