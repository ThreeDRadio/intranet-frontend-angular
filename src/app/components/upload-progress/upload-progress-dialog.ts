import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { isLoading, uploadLog, uploadProgress } from '../../store/selectors';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-upload-progress-dialog',
    templateUrl: './upload-progress-dialog.html',
    styleUrls: ['./upload-progress-dialog.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatProgressBar, MatDialogActions, MatButton, MatDialogClose, RouterLink, AsyncPipe]
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
