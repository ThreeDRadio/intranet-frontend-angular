import { Injectable } from '@angular/core';
import { TrackActions } from '../actions/track.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { TrackApi } from 'app/services/track-api';
import { of } from 'rxjs';

@Injectable()
export class TrackEffects {
  @Effect()
  getTracksForRelease$ = this.actions$.pipe(
    ofType(TrackActions.Types.requestTracksForRelease),
    switchMap((action: TrackActions.RequestTracksForRelease) => {
      return this.api.getForRelease(action.payload.releaseId).pipe(
        map(
          response =>
            new TrackActions.ResponseTracksForRelease({
              releaseId: action.payload.releaseId,
              tracks: response as any
            })
        ),
        catchError(err => of(new TrackActions.ErrorTracksForRelease(err)))
      );
    })
  );
  constructor(private actions$: Actions<TrackActions.Actions>, private api: TrackApi) {}
}
