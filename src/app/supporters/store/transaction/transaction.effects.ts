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

  constructor(private actions$: Actions<TransactionActions.Actions>, private api: TransactionApi) {}
}
