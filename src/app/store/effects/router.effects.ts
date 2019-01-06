import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { PayloadAction } from '..';
import * as actions from '../actions';

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false })
  loginSuccess = this.actions$.pipe(
    ofType(actions.RESPONSE_SUCCESS_AUTH_LOGIN),
    tap(() => this.router.navigate(['/']))
  );

  @Effect({ dispatch: false })
  logoutSuccess = this.actions$.pipe(
    ofType(actions.RESPONSE_SUCCESS_AUTH_LOGOUT),
    tap(() => this.router.navigate(['login']))
  );

  constructor(private actions$: Actions<PayloadAction>, private router: Router) {}
}
