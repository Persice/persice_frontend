import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AppStateService } from '../../../shared/services/app-state.service';
import { InfiniteScrollDirective } from '../../../../common/directives';
import { LoadingComponent } from '../../../../app/shared/components/loading';
import { HeaderState } from '../../../header';

@Component({
  selector: 'prs-mobile-choose-photo',
  template: <any>require('./choose-photo.html'),
  directives: [InfiniteScrollDirective, LoadingComponent]
})
export class ChoosePhotoComponent implements OnInit {

  @Input() photos: any[] = [];
  @Input() loading: boolean;
  @Output() onLoadMoreFBPhotos: EventEmitter<any> = new EventEmitter();

  constructor(
    private appStateService: AppStateService,
    private headerState: HeaderState
  ) { }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backWithTitle('choose photo', HeaderState.actions.ChooseAlbum)
    );
  }

  public openCropPhoto(selectedPhoto: any) {
    this.appStateService.setEditPhotosState({page: 4, refreshPhotos: false, photo: selectedPhoto});
  }

}
