import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Id3Service } from '../../services';
import { ReleaseApi } from '../../services/release-api';
import { TrackApi } from '../../services/track-api';
import * as actions from '../actions/music-upload.actions';

@Injectable()
export class MusicUploadEffects {
  @Effect()
  getMetadataForFiles = this.actions$.ofType(actions.FILES_SELECTED).pipe(
    switchMap(async (action: actions.FilesSelectedAction) => {
      const entities = {};
      for (const file of action.payload) {
        entities[file.name] = await this.id3.getMetadata(file);
      }
      return entities;
    }),
    map(data => new actions.UpdateMetadataAction(data))
  );

  @Effect()
  uploadRelease = this.actions$.ofType(actions.REQUEST_SUBMIT_RELEASE).pipe(
    switchMap(async (action: actions.RequestSubmitRelease) => {
      const release = await this.releases.create(action.payload.album).toPromise();
      this.store.dispatch(new actions.UploadProgressLog('Created release'));
      let i = 0;
      for (const track of action.payload.tracks) {
        const payload: any = { ...track };
        delete payload.file;
        payload.release = release.id;
        const entry = await this.tracks.create({ ...payload }).toPromise();
        const file = await this.tracks.uploadHi(entry.id, track.file).toPromise();
        this.store.dispatch(new actions.UploadProgressLog(`Uploaded ${track.file.name}`));
        this.store.dispatch(
          new actions.UploadProgressValue(Math.ceil((++i / action.payload.tracks.length) * 100))
        );
      }
    }),
    map(res => new actions.ResponseSuccessSubmitRelease(res))
  );

  constructor(
    private actions$: Actions,
    private id3: Id3Service,
    private releases: ReleaseApi,
    private tracks: TrackApi,
    private store: Store<any>
  ) {}
}
