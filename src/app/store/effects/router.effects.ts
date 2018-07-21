import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { PayloadAction } from '..';
import * as actions from '../actions';

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false })
  loginSuccess = this.actions$
    .ofType(actions.RESPONSE_SUCCESS_AUTH_LOGIN)
    .pipe(tap(() => this.router.navigate(['/'])));

  @Effect({ dispatch: false })
  logoutSuccess = this.actions$
    .ofType(actions.RESPONSE_SUCCESS_AUTH_LOGOUT)
    .pipe(tap(() => this.router.navigate(['login'])));

  constructor(private actions$: Actions<PayloadAction>, private router: Router) {}
}
