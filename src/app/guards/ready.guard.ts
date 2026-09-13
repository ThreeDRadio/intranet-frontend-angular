import "../rxjs";

import { Store } from "@ngrx/store";
import * as selectors from "../store/selectors/auth.selectors";
import { map, skipWhile } from "rxjs/operators";

import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";

export const ReadyGuard: CanActivateFn = () => {
  return inject(Store)
    .select(selectors.isReady)
    .pipe(
      skipWhile((isReady) => !isReady),
      map(() => true),
    );
};
