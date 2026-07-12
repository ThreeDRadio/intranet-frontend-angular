import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";

import { PayloadAction } from "..";
import * as actions from "../actions";

@Injectable()
export class RouterEffects {
  loginSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.RESPONSE_SUCCESS_AUTH_LOGIN),
        tap(() => this.router.navigate(["/"])),
      ),
    { dispatch: false },
  );

  logoutSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.RESPONSE_SUCCESS_AUTH_LOGOUT),
        tap(() => this.router.navigate(["login"])),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions<PayloadAction>,
    private router: Router,
  ) {}
}
