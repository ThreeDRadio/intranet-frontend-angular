import '../../rxjs';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseApi } from '../../services/base-api.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, filter, tap, withLatestFrom } from 'rxjs/operators';

import * as actions from '../actions';
import { PayloadAction, ResponseSuccessAuthLoginAction } from '../actions';

const STORAGE_ACTION = '[Storage] Value changed';

@Injectable()
export class AuthEffects {
  @Effect()
  getAuthLogin = this.actions$.pipe(
    ofType(actions.REQUEST_AUTH_LOGIN),
    switchMap((action: actions.RequestAuthLoginAction) =>
      this.api.login(action.payload).pipe(
        map(res => new actions.ResponseSuccessAuthLoginAction(res)),
        catchError(err => of(new actions.ResponseFailAuthLoginAction(err)))
      )
    )
  );
  @Effect()
  getProfile = this.actions$.pipe(
    ofType(actions.RESPONSE_SUCCESS_AUTH_LOGIN, actions.REQUEST_AUTH_PROFILE),
    switchMap((action: actions.ResponseSuccessAuthLoginAction) =>
      this.api.getProfile().pipe(
        map(res => new actions.ResponseSuccessAuthProfile(res)),
        catchError(err => of(new actions.ResponseFailAuthProfile(err)))
      )
    )
  );

  @Effect()
  rehydrateAuth = this.actions$.pipe(
    ofType(actions.APP_READY),
    withLatestFrom(this.store.select(state => state)),
    tap(([action, state]) => {
      if (state.auth && state.auth.auth && state.auth.auth.token) {
        this.api.setToken(state.auth.auth.token);
        this.api.userId = Number(state.auth.auth.userId);
      }
    }),
    map(action => new actions.RequestAuthProfile())
  );

  @Effect({ dispatch: false })
  persistAuth = this.actions$.pipe(
    ofType(actions.RESPONSE_SUCCESS_AUTH_LOGIN),
    tap((action: ResponseSuccessAuthLoginAction) => {
      this.api.setToken(action.payload.token);
      window.localStorage.setItem('AUTH_TOKEN', action.payload.token);
      window.localStorage.setItem('AUTH_USER', action.payload.userId);
    })
  );

  @Effect()
  getAuthLogout = this.actions$.pipe(
    ofType(actions.REQUEST_AUTH_LOGOUT),
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
  forceLogout = this.actions$.pipe(
    ofType(actions.FORCE_LOGOUT_401),
    map(action => new actions.RequestAuthLogoutAction())
  );

  @Effect({ dispatch: false })
  tabTokenChanges = this.actions$.pipe(
    ofType(STORAGE_ACTION),
    filter((action: any) => action.payload.key === 'auth'),
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
