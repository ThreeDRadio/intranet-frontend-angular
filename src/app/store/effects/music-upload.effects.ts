import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Id3Service } from '../../services';
import { ReleaseApi } from '../../services/release-api';
import { TrackApi } from '../../services/track-api';
import * as actions from '../actions/music-upload.actions';

@Injectable()
export class MusicUploadEffects {
  @Effect()
  getMetadataForFiles = this.actions$.pipe(
    ofType(actions.FILES_SELECTED),
    switchMap(async (action: actions.FilesSelectedAction) => {
      try {
        const entities = {};
        for (const file of action.payload) {
          entities[file.name] = await this.id3.getMetadata(file);
        }
        return new actions.UpdateMetadataAction(entities);
      } catch (err) {
        return new actions.MetadataErrorAction(err);
      }
    })
  );

  @Effect()
  uploadRelease = this.actions$.pipe(
    ofType(actions.REQUEST_SUBMIT_RELEASE),
    switchMap(async (action: actions.RequestSubmitRelease) => {
      const release = await this.releases
        .create({ ...action.payload.album, digital: true })
        .toPromise();
      this.store.dispatch(new actions.UploadProgressLog('Created release'));
      let i = 0;
      for (const track of action.payload.tracks) {
        const payload: any = { ...track };
        delete payload.file;
        payload.release = release.id;
        const entry = await this.tracks.create({ ...payload, needsEncoding: true }).toPromise();
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
