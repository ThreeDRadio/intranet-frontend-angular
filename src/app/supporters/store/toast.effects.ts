import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { SupporterActions } from './supporter/supporter.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TransactionActions } from './transaction/transaction.actions';

@Injectable()
export class ToastEffects {
  @Effect({ dispatch: false })
  onSupporterCreate$ = this.actions$.pipe(
    ofType(SupporterActions.Types.RESPONSE_CREATE),
    tap((action: SupporterActions.ResponseCreate) => {
      this.toast.open('Supporter Created');
      this.router.navigate(['supporters', action.payload.id]);
    })
  );

  @Effect({ dispatch: false })
  onSupporterCreateError$ = this.actions$.pipe(
    ofType(SupporterActions.Types.ERROR_CREATE),
    tap(() => {
      this.toast.open('Could not create supporter');
    })
  );

  @Effect({ dispatch: false })
  onSupporterUpdate$ = this.actions$.pipe(
    ofType(SupporterActions.Types.RESPONSE_UPDATE),
    tap(() => {
      this.toast.open('Supporter Updated');
    })
  );

  @Effect({ dispatch: false })
  onSupporterUpdateError$ = this.actions$.pipe(
    ofType(SupporterActions.Types.ERROR_UPDATE),
    tap(() => {
      this.toast.open('Could not update supporter');
    })
  );

  @Effect({ dispatch: false })
  onTransactionCreate$ = this.actions$.pipe(
    ofType(TransactionActions.Types.responseCreateForSupporter),
    tap(() => {
      this.toast.open('Subscription Added');
    })
  );

  @Effect({ dispatch: false })
  onTransactionCreateError$ = this.actions$.pipe(
    ofType(TransactionActions.Types.errorCreateForSupporter),
    tap(() => {
      this.toast.open('Could not create subscription');
    })
  );

  @Effect({ dispatch: false })
  onTransactionUpdate$ = this.actions$.pipe(
    ofType(TransactionActions.Types.responseUpdate),
    tap(() => {
      this.toast.open('Subscription Updated!');
    })
  );

  @Effect({ dispatch: false })
  onTransactionUpdateError$ = this.actions$.pipe(
    ofType(TransactionActions.Types.errorUpdate),
    tap(() => {
      this.toast.open('Could not update subscription');
    })
  );

  constructor(
    private actions$: Actions<SupporterActions.Actions>,
    private toast: MatSnackBar,
    private router: Router
  ) {}
}
