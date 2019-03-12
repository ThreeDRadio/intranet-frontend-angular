import { ReleaseApi } from 'app/services/release-api';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ReleaseActions } from '../actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpOptions } from 'app/services';

@Injectable()
export class ReleaseEffects {
  @Effect()
  search$ = this.actions$.pipe(
    ofType(ReleaseActions.Types.REQUEST_SIMPLE_SEARCH),
    switchMap((action: ReleaseActions.RequestSearch) => {
      return this.api.simpleSearch(action.payload).pipe(
        map(response => new ReleaseActions.ResponseSearch(response)),
        catchError(err => of(new ReleaseActions.ErrorSearch(err)))
      );
    })
  );

  @Effect()
  fetchMostRecent$ = this.actions$.pipe(
    ofType(ReleaseActions.Types.REQUEST_MOST_RECENT),
    switchMap((action: ReleaseActions.RequestSearch) => {
      const options: HttpOptions = {
        responseType: 'json',
        params: {
          limit: 5,
          ordering: '-arrivaldate'
        }
      };
      return this.api.list(options).pipe(
        map(response => new ReleaseActions.ResponseSearch(response)),
        catchError(err => of(new ReleaseActions.ErrorSearch(err)))
      );
    })
  );

  @Effect()
  getById$ = this.actions$.pipe(
    ofType(ReleaseActions.Types.REQUEST_BY_ID),
    switchMap((action: ReleaseActions.RequestById) => {
      return this.api.get(action.payload).pipe(
        map(response => new ReleaseActions.ResponseById(response)),
        catchError(err => of(new ReleaseActions.ErrorSearch(err)))
      );
    })
  );

  constructor(private actions$: Actions<ReleaseActions.Actions>, private api: ReleaseApi) {}
}
