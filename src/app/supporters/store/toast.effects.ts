import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { SupporterActions } from './supporter/supporter.actions';
import { MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

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
  constructor(
    private actions$: Actions<SupporterActions.Actions>,
    private toast: MatSnackBar,
    private router: Router
  ) {}
}
