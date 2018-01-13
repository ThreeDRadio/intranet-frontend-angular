import 'app/rxjs';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { IntranetService } from 'app/services/intranet.service';
import { Observable } from 'rxjs/Observable';

import * as actions from '../actions/index';
import { PayloadAction } from '../actions/index';

const STORAGE_ACTION = '[Storage] Value changed';

@Injectable()
export class AuthEffects {
  @Effect()
  getAuthLogin = this.actions$
    .ofType(actions.REQUEST_AUTH_LOGIN)
    .switchMap((action: actions.RequestAuthLoginAction) =>
      this.api
        .login(action.payload)
        .map(res => new actions.ResponseSuccessAuthLoginAction(res))
        .catch(err => Observable.of(new actions.ResponseFailAuthLoginAction(err)))
    );

  @Effect()
  getAuthLogout = this.actions$.ofType(actions.REQUEST_AUTH_LOGOUT).switchMap((action: any) => {
    return this.api
      .logout()
      .map(res => new actions.ResponseSuccessAuthLogoutAction())
      .catch(err => Observable.of(new actions.ResponseSuccessAuthLogoutAction()));
  });

  @Effect()
  forceLogout = this.actions$
    .ofType(actions.FORCE_LOGOUT_401)
    .map(action => new actions.RequestAuthLogoutAction());

  @Effect({ dispatch: false })
  tabTokenChanges = this.actions$
    .ofType(STORAGE_ACTION)
    .filter(action => action.payload.key === 'auth')
    .do(action => this.api.setToken(action.payload.newValue));

  constructor(
    private store: Store<any>,
    private api: IntranetService,
    private actions$: Actions<PayloadAction>
  ) {
    window.addEventListener('storage', event => {
      let newValue: any, key: string;
      ({ key, newValue } = event);
      try {
        newValue = JSON.parse(newValue);
      } catch (ex) {
        newValue = {};
      }
      this.store.dispatch({ type: STORAGE_ACTION, payload: { key, newValue } });
    });
  }
}
