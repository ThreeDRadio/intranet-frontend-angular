import '../../rxjs';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseApi } from '../../services/base-api.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError, filter, tap, withLatestFrom } from 'rxjs/operators';

import * as actions from '../actions';
import { PayloadAction } from '../actions';

const STORAGE_ACTION = '[Storage] Value changed';

@Injectable()
export class AuthEffects {
  @Effect()
  getAuthLogin = this.actions$.ofType(actions.REQUEST_AUTH_LOGIN).pipe(
    switchMap((action: actions.RequestAuthLoginAction) =>
      this.api.login(action.payload).pipe(
        map(res => new actions.ResponseSuccessAuthLoginAction(res)),
        catchError(err => of(new actions.ResponseFailAuthLoginAction(err)))
      )
    )
  );

  @Effect({ dispatch: false })
  rehydrateAuth = this.actions$.ofType(actions.APP_READY).pipe(
    withLatestFrom(this.store.select(state => state)),
    tap(([action, state]) => {
      if (state.auth && state.auth.auth && state.auth.auth.token) {
        this.api.setToken(state.auth.auth.token);
        this.api.userId = Number(state.auth.auth.userId);
      }
    })
  );

  @Effect({ dispatch: false })
  persistAuth = this.actions$.ofType(actions.RESPONSE_SUCCESS_AUTH_LOGIN).pipe(
    tap(action => {
      this.api.setToken(action.payload.token);
      window.localStorage.setItem('AUTH_TOKEN', action.payload.token);
      window.localStorage.setItem('AUTH_USER', action.payload.userId);
    })
  );

  @Effect()
  getAuthLogout = this.actions$.ofType(actions.REQUEST_AUTH_LOGOUT).pipe(
    switchMap((action: any) => {
      return this.api.logout().pipe(
        tap(res => {
          window.localStorage.removeItem('AUTH_TOKEN');
          window.localStorage.removeItem('AUTH_USER');
        }),
        map(res => new actions.ResponseSuccessAuthLogoutAction()),
        catchError(err => of(new actions.ResponseSuccessAuthLogoutAction()))
      );
    })
  );

  @Effect()
  forceLogout = this.actions$
    .ofType(actions.FORCE_LOGOUT_401)
    .pipe(map(action => new actions.RequestAuthLogoutAction()));

  @Effect({ dispatch: false })
  tabTokenChanges = this.actions$.ofType(STORAGE_ACTION).pipe(
    filter(action => action.payload.key === 'auth'),
    tap(action => this.api.setToken(action.payload.newValue))
  );

  constructor(
    private store: Store<any>,
    private api: BaseApi,
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
