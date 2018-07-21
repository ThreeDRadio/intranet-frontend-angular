import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  UploadProgressDialogComponent,
} from '../../components/upload-progress/upload-progress-dialog';
import {
  FilesSelectedAction,
  RequestSubmitRelease,
} from '../../store/actions/music-upload.actions';
import * as selectors from '../../store/selectors';

@Component({
  selector: 'app-music-upload',
  templateUrl: './music-upload.component.html',
  styleUrls: ['./music-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicUploadComponent {
  selectedData$: Observable<any>;
  compilation$: Observable<boolean>;
  artist$: Observable<string>;
  album$: Observable<string>;
  loading$: Observable<boolean>;

  selectedFiles = new FormControl('', Validators.required);

  albumDetails = new FormGroup({
    artist: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required),
    cpa: new FormControl('', Validators.required),
    company: new FormControl(''),
    local: new FormControl(undefined, Validators.required),
    compilation: new FormControl(undefined, Validators.required),
    female: new FormControl(undefined, Validators.required)
  });

  trackDetails = new FormGroup({
    tracks: new FormArray([])
  });

  stepsCompleted = false;

  constructor(private store: Store<any>, public dialog: MatDialog) {
    this.selectedData$ = this.store.select(selectors.selectedFilesWithMetadata);
    this.compilation$ = this.store.select(selectors.isSelectedCompilation);
    this.artist$ = this.store.select(selectors.selectedArtist);
    this.album$ = this.store.select(selectors.selectedAlbum);
    this.loading$ = this.store.select(selectors.isLoading);

    this.selectedData$.subscribe(data => {
      if (data.length === 0 || !data[0].metadata) {
        return;
      }
      console.log(data);
      this.albumDetails.patchValue({
        artist: data[0].metadata.artist || '',
        title: data[0].metadata.album || '',
        year: data[0].metadata.year || ''
      });

      const tracks = <FormArray>this.trackDetails.controls['tracks'];
      while (tracks.length > 0) {
        tracks.removeAt(0);
      }
      let i = 1;
      for (const item of data) {
        tracks.push(
          new FormGroup({
            tracknum: new FormControl(this.getTrackNum(item.metadata) || i, Validators.required),
            tracktitle: new FormControl(item.metadata.title, Validators.required),
            trackartist: new FormControl(item.metadata.artist, Validators.required),
            tracklength: new FormControl(Math.ceil(item.metadata.duration), Validators.required),
            filename: new FormControl(item.file.name),
            file: new FormControl(item.file)
          })
        );
        i++;
      }
    });
  }

  private getTrackNum(metadata) {
    if (metadata.v1.track) {
      return Number.parseInt(metadata.v1.track);
    }
    if (metadata.v2.track) {
      return Number.parseInt(metadata.v2.track.split('/')[0]);
    }
    return null;
  }

  public submitRelease() {
    console.log('submit');
    this.stepsCompleted = true;
    console.log(this.albumDetails.value);
    const dialogRef = this.dialog.open(UploadProgressDialogComponent, {
      width: '600px'
    });
    this.store.dispatch(
      new RequestSubmitRelease({
        album: this.albumDetails.value,
        tracks: this.trackDetails.controls['tracks'].value
      })
    );
  }

  async handleSelection(event: any) {
    this.store.dispatch(new FilesSelectedAction(event.target.files));
  }
}
