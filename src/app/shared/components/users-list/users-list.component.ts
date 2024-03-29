import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserCardComponent } from './user-card.component';

@Component({
  selector: 'prs-users-list',
  directives: [UserCardComponent],
  template: <any>require('./users-list.html')
})
export class UsersListComponent {
  @Input() users;
  @Input() showButtons;
  @Output() onClicked: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;

  passUser(event) {
    this.passEvent.emit(event);
  }

  acceptUser(event) {
    this.acceptEvent.emit(event);
  }

  onUserClicked(data) {
    this.onClicked.emit(data);
  }
}
