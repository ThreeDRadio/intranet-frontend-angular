import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PayloadAction } from 'app/store';
import { Router } from '@angular/router';

import * as actions from 'app/store/actions';

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false })
  loginSuccess = this.actions$
    .ofType(actions.RESPONSE_SUCCESS_AUTH_LOGIN)
    .do(() => this.router.navigate(['/']));

  constructor(private actions$: Actions<PayloadAction>, private router: Router) {}
}
