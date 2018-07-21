import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { isLoading, uploadLog, uploadProgress } from '../../store/selectors';

@Component({
  selector: 'app-upload-progress-dialog',
  templateUrl: './upload-progress-dialog.html',
  styleUrls: ['./upload-progress-dialog.scss']
})
export class UploadProgressDialogComponent {
  public progress$: Observable<number>;
  public log$: Observable<Array<string>>;
  public loading$: Observable<boolean>;
  constructor(private store: Store<any>) {
    this.progress$ = this.store.select(uploadProgress);
    this.log$ = this.store.select(uploadLog);
    this.loading$ = this.store.select(isLoading);
  }
}
