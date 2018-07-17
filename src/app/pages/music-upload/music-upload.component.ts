import { FilesSelectedAction } from '../../store/actions/music-upload.actions';
import { Id3Service } from '../../services/id3.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as selectors from '../../store/selectors';
import { DataSource } from '@angular/cdk/collections';

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

  dataSource;
  displayedColumns = ['track', 'artist', 'title', 'filename', 'size'];

  constructor(private id3: Id3Service, private store: Store<any>) {
    this.selectedData$ = this.store.select(selectors.selectedFilesWithMetadata);
    this.compilation$ = this.store.select(selectors.isSelectedCompilation);
    this.artist$ = this.store.select(selectors.selectedArtist);
    this.album$ = this.store.select(selectors.selectedAlbum);
    this.loading$ = this.store.select(selectors.isLoading);
    this.dataSource = new SelectedFilesDataSource(this.selectedData$);
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
