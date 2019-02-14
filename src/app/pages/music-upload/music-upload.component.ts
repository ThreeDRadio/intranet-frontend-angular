import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import * as moment from 'moment-timezone';
import { Observable } from 'rxjs';

import { UploadProgressDialogComponent } from '../../components/upload-progress/upload-progress-dialog';
import {
  FilesSelectedAction,
  RequestSubmitRelease,
  ResetMusicUpload
} from '../../store/actions/music-upload.actions';
import * as selectors from '../../store/selectors';

@Component({
  selector: 'app-music-upload',
  templateUrl: './music-upload.component.html',
  styleUrls: ['./music-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicUploadComponent implements OnInit {
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
    local: new FormControl('', Validators.required),
    compilation: new FormControl('', Validators.required),
    female: new FormControl('', Validators.required),
    format: new FormControl(7),
    status: new FormControl(0),
    copies: new FormControl(0),
    demo: new FormControl(1),
    createwhen: new FormControl(moment().unix()),
    modifywhen: new FormControl(moment().unix()),
    arrivaldate: new FormControl(
      moment()
        .tz('Australia/Adelaide')
        .format('YYYY-MM-DD')
    ),
    genre: new FormControl('')
  });

  trackDetails = new FormGroup({
    tracks: new FormArray([])
  });

  stepsCompleted = false;

  ngOnInit() {
    this.store.dispatch(new ResetMusicUpload());
  }

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
      // console.log(data);
      this.albumDetails.patchValue({
        artist: data[0].metadata.artist ? data[0].metadata.artist.replace('\0', '') : '',
        title: data[0].metadata.album ? data[0].metadata.album.replace('\0', '') : '',
        year: data[0].metadata.year ? data[0].metadata.year.replace('\0', '') : ''
      });

      const tracks = <FormArray>this.trackDetails.controls['tracks'];
      while (tracks.length > 0) {
        tracks.removeAt(0);
      }
      let i = 1;
      for (const item of data) {
        const title = item.metadata.title ? item.metadata.title.replace('\0', '') : '';
        const artist = item.metadata.artist ? item.metadata.artist.replace('\0', '') : '';
        tracks.push(
          new FormGroup({
            tracknum: new FormControl(this.getTrackNum(item.metadata) || i, Validators.required),
            tracktitle: new FormControl(title, Validators.required),
            trackartist: new FormControl(artist, Validators.required),
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
      return Number.parseInt(metadata.v1.track, 10);
    }
    if (metadata.v2.track) {
      return Number.parseInt(metadata.v2.track.split('/')[0], 10);
    }
    return null;
  }

  public submitRelease() {
    this.stepsCompleted = true;
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
