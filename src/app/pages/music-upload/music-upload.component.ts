import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
import { FileSelection } from 'app/models/file_selection';



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

  selectedFiles = new UntypedFormControl('', Validators.required);

  albumDetails = new UntypedFormGroup({
    artist: new UntypedFormControl('', Validators.required),
    title: new UntypedFormControl('', Validators.required),
    year: new UntypedFormControl('', Validators.required),
    cpa: new UntypedFormControl('', Validators.required),
    company: new UntypedFormControl(''),
    local: new UntypedFormControl('', Validators.required),
    compilation: new UntypedFormControl('', Validators.required),
    female: new UntypedFormControl('', Validators.required),
    format: new UntypedFormControl(7),
    status: new UntypedFormControl(0),
    copies: new UntypedFormControl(0),
    demo: new UntypedFormControl(1),
    createwhen: new UntypedFormControl(moment().unix()),
    modifywhen: new UntypedFormControl(moment().unix()),
    arrivaldate: new UntypedFormControl(
      moment()
        .tz('Australia/Adelaide')
        .format('YYYY-MM-DD')
    ),
    genre: new UntypedFormControl('')
  });

  trackDetails = new UntypedFormGroup({
    tracks: new UntypedFormArray([])
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
      if (data.length === 0) {
        return;
      }

      // Extract the first data index and pull music info from it.
      var first_track = data[0];
      
      if (first_track.metadata && first_track.metadata.tags) {
        this.albumDetails.patchValue({
          artist: this.parseTag(first_track.metadata.tags.artist),
          title: this.parseTag(first_track.metadata.tags.album),
          year: this.parseTag(first_track.metadata.tags.year)
        });
      }

      const tracks = <UntypedFormArray>this.trackDetails.controls['tracks'];
      while (tracks.length > 0) {
        tracks.removeAt(0);
      }
      let i = 1;
      for (const item of data) {
        let title = '';
        let artist = '';
        let duration = 0;
        if (item.metadata) {
          duration = Math.ceil(item.metadata.duration);
        }
        if (item.metadata && item.metadata.tags) {
          title = this.parseTag(item.metadata.tags.title);
          artist = this.parseTag(item.metadata.tags.artist);
        }
        tracks.push(
          new UntypedFormGroup({
            tracknum: new UntypedFormControl(this.getTrackNum(item.metadata) || i, Validators.required),
            tracktitle: new UntypedFormControl(title, Validators.required),
            trackartist: new UntypedFormControl(artist, Validators.required),
            tracklength: new UntypedFormControl(duration, Validators.required),
            filename: new UntypedFormControl(item.file.name),
            file: new UntypedFormControl(item.file)
          })
        );
        i++;
      }
    });
  }

  parseTag(tag?: string | null): string {
    if (tag == null || tag === undefined) {
      return '';
    }
    return tag.replace(/\0/g, '').trim();
  }

  private getTrackNum(metadata) {
    if (metadata && metadata.tags && metadata.tags.track) {
      return Number.parseInt(metadata.tags.track, 10);
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
    var refs: Array<FileSelection> = Array.from<File>(event.target.files).map((f: File): FileSelection => new FileSelection(f));
    this.store.dispatch(new FilesSelectedAction(refs));
  }
}