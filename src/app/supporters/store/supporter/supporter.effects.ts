import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpOptions } from 'app/services';
import { SupporterActions } from './supporter.actions';
import { SupporterApi } from 'app/supporters/services/supporter.api';

@Injectable()
export class SupporterEffects {
  @Effect()
  search$ = this.actions$.pipe(
    ofType(SupporterActions.Types.REQUEST_SEARCH),
    switchMap((action: SupporterActions.RequestSearch) => {
      return this.api.search(action.payload).pipe(
        map(response => new SupporterActions.ResponseSearch(response)),
        catchError(err => of(new SupporterActions.ErrorSearch(err)))
      );
    })
  );

  @Effect()
  getById$ = this.actions$.pipe(
    ofType(SupporterActions.Types.REQUEST_BY_ID),
    switchMap((action: SupporterActions.RequestById) => {
      return this.api.get(action.payload).pipe(
        map(response => new SupporterActions.ResponseById(response)),
        catchError(err => of(new SupporterActions.ErrorSearch(err)))
      );
    })
  );

  constructor(private actions$: Actions<SupporterActions.Actions>, private api: SupporterApi) {}
}
