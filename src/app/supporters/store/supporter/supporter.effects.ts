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

  @Effect()
  createSupporter = this.actions$.pipe(
    ofType(SupporterActions.Types.REQUEST_CREATE),
    switchMap((action: SupporterActions.RequestCreate) => {
      const withFormattedDate = {
        ...action.payload,
        dob:
          action.payload.dob && action.payload.dob.format
            ? action.payload.dob.format('YYYY-MM-DDD')
            : action.payload.dob
      };
      return this.api.create(withFormattedDate).pipe(
        map(response => new SupporterActions.ResponseCreate(response)),
        catchError(err => of(new SupporterActions.ErrorCreate(err)))
      );
    })
  );

  @Effect()
  updateSupporter = this.actions$.pipe(
    ofType(SupporterActions.Types.REQUEST_UPDATE),
    switchMap((action: SupporterActions.RequestUpdate) => {
      const withFormattedDate = {
        ...action.payload.payload,
        dob:
          action.payload.payload.dob && action.payload.payload.dob.format
            ? action.payload.payload.dob.format('YYYY-MM-DDD')
            : action.payload.payload.dob
      };
      return this.api.update({ id: action.payload.supporterId, ...withFormattedDate }).pipe(
        map(response => new SupporterActions.ResponseUpdate(response)),
        catchError(err => of(new SupporterActions.ErrorUpdate(err)))
      );
    })
  );

  constructor(private actions$: Actions<SupporterActions.Actions>, private api: SupporterApi) {}
}
