import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { TrackApi } from 'app/services/track-api';
import { of } from 'rxjs';
import { TransactionActions } from './transaction.actions';
import { TransactionApi } from 'app/supporters/services/transaction.api';

@Injectable()
export class TransactionEffects {
  @Effect()
  getTransactionsForSupporter$ = this.actions$.pipe(
    ofType(TransactionActions.Types.requestForSupporter),
    switchMap((action: TransactionActions.RequestForSupporter) => {
      return this.api.getForSupporter(action.payload.supporterId).pipe(
        map(
          response =>
            new TransactionActions.ResponseForSupporter({
              supporterId: action.payload.supporterId,
              transactions: response as any
            })
        ),
        catchError(err => of(new TransactionActions.ErrorForSupporter(err)))
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType(TransactionActions.Types.requestUpdate),
    switchMap((action: TransactionActions.RequestUpdate) => {
      return this.api.partialUpdate(action.payload).pipe(
        map(response => new TransactionActions.ResponseUpdate(response)),
        catchError(err => of(new TransactionActions.ErrorUpdate(err)))
      );
    })
  );

  @Effect()
  createTransactionForSupporter = this.actions$.pipe(
    ofType(TransactionActions.Types.requestCreateForSupporter),
    switchMap((action: TransactionActions.RequestCreateForSupporter) => {
      return this.api.createForSupporter(action.payload.supporterId, action.payload.data).pipe(
        map(response => new TransactionActions.ResponseCreateForSupporter(<any>response)),
        catchError(err => of(new TransactionActions.ErrorCreateForSupporter(err)))
      );
    })
  );

  @Effect()
  search$ = this.actions$.pipe(
    ofType(TransactionActions.Types.REQUEST_SEARCH),
    switchMap((action: TransactionActions.RequestSearch) => {
      return this.api
        .search({
          ...action.payload,
          payment_processed: action.payload.payment_processed ? 2 : 3,
          pack_sent: action.payload.pack_sent ? 2 : 3
        })
        .pipe(
          map(response => new TransactionActions.ResponseSearch(response)),
          catchError(err => of(new TransactionActions.ErrorSearch(err)))
        );
    })
  );

  constructor(private actions$: Actions<TransactionActions.Actions>, private api: TransactionApi) {}
}
