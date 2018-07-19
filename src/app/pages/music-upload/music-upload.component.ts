import { DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Id3Service } from '../../services/id3.service';
import { FilesSelectedAction } from '../../store/actions/music-upload.actions';
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
    company: new FormControl('')
  });

  dataSource;
  displayedColumns = ['track', 'artist', 'title', 'filename', 'size'];

  constructor(private id3: Id3Service, private store: Store<any>) {
    this.selectedData$ = this.store.select(selectors.selectedFilesWithMetadata);
    this.compilation$ = this.store.select(selectors.isSelectedCompilation);
    this.artist$ = this.store.select(selectors.selectedArtist);
    this.album$ = this.store.select(selectors.selectedAlbum);
    this.loading$ = this.store.select(selectors.isLoading);
    this.dataSource = new SelectedFilesDataSource(this.selectedData$);

    this.selectedData$.subscribe(data => {
      if (data.length === 0 || !data[0].metadata) {
        return;
      }
      console.log(data);
      this.albumDetails.patchValue({
        artist: data[0].metadata.artist,
        title: data[0].metadata.album,
        year: data[0].metadata.year
      });
    });
  }

  async handleSelection(event: any) {
    this.store.dispatch(new FilesSelectedAction(event.target.files));
  }
}

export class SelectedFilesDataSource extends DataSource<any> {
  constructor(private data) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Array<any>> {
    return this.data;
  }

  disconnect() {}
}
