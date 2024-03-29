import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AppStateService } from '../../../../shared/services';
import { Photo } from '../../../../../common/models/photo';
import { CheckImageDirective } from '../../../../../app/shared/directives';

@Component({
  selector: 'prs-mobile-edit-photo-thumb',
  template: <any>require('./edit-photo-thumb.html'),
  directives: [CheckImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPhotoThumbComponent {
  @Input() photo: Photo;
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  constructor(private appStateService: AppStateService) { }

  public openChooseAlbum(event) {
    this.appStateService.setEditPhotosState({page: 2});
  }

}
