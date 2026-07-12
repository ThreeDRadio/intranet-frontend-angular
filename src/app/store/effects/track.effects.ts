import { Injectable } from "@angular/core";
import { TrackActions } from "../actions/track.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError, tap } from "rxjs/operators";
import { TrackApi } from "app/services/track-api";
import { of } from "rxjs";

@Injectable()
export class TrackEffects {
  getTracksForRelease$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.Types.requestForRelease),
      switchMap((action: TrackActions.RequestForRelease) => {
        return this.api.getForRelease(action.payload.releaseId).pipe(
          map(
            (response) =>
              new TrackActions.ResponseForRelease({
                releaseId: action.payload.releaseId,
                tracks: response as any,
              }),
          ),
          catchError((err) => of(new TrackActions.ErrorForRelease(err))),
        );
      }),
    ),
  );

  downloadFile$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TrackActions.Types.requestDownload),
        tap(async (action: TrackActions.RequestDownload) => {
          const res = await this.api
            .getDownloadUrl(action.payload.id)
            .toPromise();
          window.open(res.url, "_blank");
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions<TrackActions.Actions>,
    private api: TrackApi,
  ) {}
}
