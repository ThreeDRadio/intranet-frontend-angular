import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap } from "rxjs/operators";

import { Id3Service } from "../../services";
import { ReleaseApi } from "../../services/release-api";
import { TrackApi } from "../../services/track-api";
import * as actions from "../actions/music-upload.actions";

@Injectable()
export class MusicUploadEffects {
  getMetadataForFiles = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.FILES_SELECTED),
      switchMap(async (action: actions.FilesSelectedAction) => {
        try {
          const entities = {};
          for (const f of action.payload) {
            entities[f.file_reference.name] = await this.id3.getMetadata(
              f.file_reference,
            );
          }
          return new actions.UpdateMetadataAction(entities);
        } catch (err) {
          return new actions.MetadataErrorAction(err);
        }
      }),
    ),
  );

  uploadRelease = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.REQUEST_SUBMIT_RELEASE),
      switchMap(async (action: actions.RequestSubmitRelease) => {
        try {
          const release = await this.releases
            .create({ ...action.payload.album, digital: true })
            .toPromise();
          this.store.dispatch(new actions.UploadProgressLog("Created release"));
          let i = 0;
          for (const track of action.payload.tracks) {
            const payload: any = { ...track };
            delete payload.file;
            payload.release = release.id;
            const entry = await this.tracks
              .create({ ...payload, needsencoding: true })
              .toPromise();
            const file = await this.tracks
              .uploadHi(entry.id, track.file)
              .toPromise();
            this.store.dispatch(
              new actions.UploadProgressLog(`Uploaded ${track.file.name}`),
            );
            this.store.dispatch(
              new actions.UploadProgressValue(
                Math.ceil((++i / action.payload.tracks.length) * 100),
              ),
            );
          }
          return new actions.ResponseSuccessSubmitRelease(release);
        } catch (err) {
          this.store.dispatch(new actions.UploadProgressLog(`Upload failed.`));
          return new actions.ResponseErrorSubmitRelease(err);
        }
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private id3: Id3Service,
    private releases: ReleaseApi,
    private tracks: TrackApi,
    private store: Store<any>,
  ) {}
}
