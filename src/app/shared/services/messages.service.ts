import { Injectable } from '@angular/core';
import { HttpClient, DateUtil, ListUtil } from '../../../common/core';
import { Observable, Subject } from 'rxjs';
import { TokenUtil } from '../../../common/core/util';

@Injectable()
export class MessagesService {
  static API_URL = '/api/v1/messages/';

  _dataStore = [];
  _limit: number = 12;
  _next: string = '';
  _total_count: number = 0;
  _offset: number = 0;
  _loading: boolean = false;
  _isListEmpty: boolean = false;
  _observer: Subject<any> = new Subject(null);
  _senderUri = '';
  _myImage = '';
  _myUri = '';
  _newMessage = false;
  _initialLoadingFinished = false;

  constructor(private http: HttpClient) {
    let userId = TokenUtil.getValue('user_id');
    this._myUri = `/api/v1/auth/user/${userId}/`;
  }

  public reset() {
    this._loading = false;
    this._dataStore = [];
    this._next = '';
    this._total_count = 0;
    this._offset = 0;
    this._isListEmpty = true;
    this._newMessage = false;
    this._initialLoadingFinished = false;
    this._notify();
  }

  public startLoadingMessages(id) {
    this._senderUri = `/api/v1/auth/user/${id}/`;
    this._loadMessages(this._limit, id, false);
  }

  public send(id, message) {
    if (this._senderUri === '') {
      this._senderUri = `/api/v1/auth/user/${id}/`;
    }
    let url = `${MessagesService.API_URL}?format=json`;
    let sendData = {
      body: message,
      recipient: this._senderUri,
      sender: this._myUri
    };
    let channel = this.http.post(url, JSON.stringify(sendData))
      .map(response => response.json())
      .subscribe(data => {
        this._appendMessage(data);
        channel.unsubscribe();
      }, error => console.log('Could not create message.'));
  }

  public sendNew(id, message): Observable<any> {
    if (this._senderUri === '') {
      this._senderUri = `/api/v1/auth/user/${id}/`;
    }
    let url = `${MessagesService.API_URL}?format=json`;
    let sendData = {
      body: message,
      recipient: this._senderUri,
      sender: this._myUri
    };
    return this.http.post(url, JSON.stringify(sendData))
      .map(response => response.json());
  }

  public serviceObserver(): Subject<any> {
    return this._observer;
  }

  public loadMore(id) {
    this._loadMessages(this._limit, id, true);
  }

  public getMessages() {
    return this._dataStore;
  }

  public recievedMessage(data) {
    if (data.recipient === this._myUri && data.sender === this._senderUri) {
      this._appendMessage(data);
    }
  }

  private _appendMessage(data) {
    this._dataStore[this._dataStore.length - 1].data = [...this._dataStore[this._dataStore.length - 1].data, {
      image: this._checkImage(data.sender_image),
      name: data.sender_name,
      username: data.sender_sender,
      body: data.body,
      sent_at: data.sent_at,
      time: DateUtil.format(data.sent_at, 'LT')
    }];
    this._total_count++;
    this._newMessage = true;
    this._notify();
  }

  private _checkImage(field) {
    if (!field) {
      return '';
    }

    if (field.indexOf('media') === -1 && field.indexOf('http')) {
      return '/media/' + field;
    } else {
      return field;
    }
  }

  private _loadMessages(limit: number, user: any, more: boolean) {

    if (this._loading) {
      return;
    }

    if (this._next === null) {
      this._notify();
      return;
    }

    let url = '';

    if (this._next === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${user}`,
        `order_by=-sent_at`,
        `offset=0`
      ].join('&');

      url = `${MessagesService.API_URL}?${params}`;
    } else {
      url = this._next;
    }

    this._loading = true;
    this._notify();
    let channel = this.http.get(url)
      .map((res: any) => res.json())
      .subscribe((data: any) => {
          try {
            this._parseData(data);
            this._notify();
          } catch (e) {
            console.log('error', e);
            this._notify();
            channel.unsubscribe();
            return;
          }
          channel.unsubscribe();
        },
        (error) => {
          console.log(`Could not load messages ${error}`);
        },
        () => {

        });
  }

  private _parseData(data) {
    let m = data.objects;

    for (var i = m.length - 1; i >= 0; i--) {
      let displayDate = DateUtil.format(m[i].sent_at, 'ddd, D MMMM YYYY');
      let date = DateUtil.format(m[i].sent_at, 'L');
      let time = DateUtil.format(m[i].sent_at, 'LT');

      let idx = ListUtil.findIndex(this._dataStore, {date: date});

      if (idx === -1) {
        this._dataStore = [...this._dataStore, {
          date: date,
          displayDate: displayDate,
          data: []
        }];
        idx = this._dataStore.length - 1;
      }

      this._dataStore[idx].data = [...this._dataStore[idx].data, {
        image: this._checkImage(m[i].sender_image),
        name: m[i].sender_name,
        username: m[i].sender_sender,
        body: m[i].body,
        sent_at: m[i].sent_at,
        time: time
      }];

      this._dataStore[idx].data = ListUtil.orderBy(this._dataStore[idx].data, ['sent_at'], ['asc']);

    }

    this._loading = false;
    this._total_count = data.meta.total_count;
    this._initialLoadingFinished = true;
    if (data.meta.total_count === 0) {
      this._isListEmpty = true;
      this._dataStore = [];
    } else {
      this._isListEmpty = false;
    }

    this._next = data.meta.next;
    this._offset = data.meta.offset;

  }

  private _notify() {
    this._observer.next({
      loading: this._loading,
      initialLoadingFinished: this._initialLoadingFinished,
      data: this._dataStore,
      total: this._total_count,
      finished: this._next === null ? true : false,
      isEmpty: this._isListEmpty,
      next: this._next,
      hasNew: this._newMessage
    });
    this._newMessage = false;
  }

}

export var messagesServiceInjectables: any[] = [
  {provide: MessagesService, useClass: MessagesService}
];
