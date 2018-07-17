import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PayloadAction } from 'app/store';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import * as actions from 'app/store/actions';

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false })
  loginSuccess = this.actions$
    .ofType(actions.RESPONSE_SUCCESS_AUTH_LOGIN)
    .pipe(tap(() => this.router.navigate(['/'])));

  constructor(private actions$: Actions<PayloadAction>, private router: Router) {}
}
