import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

import * as selectors from "../store/selectors/auth.selectors";
import { IpAddressService } from "../services/ip-address.service";

export const AuthenticatedGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const ipService = inject(IpAddressService);

  return store.select(selectors.getAuth).pipe(
    switchMap((token) => {
      if (token) {
        return of(true);
      }

      return ipService.isWhitelisted().pipe(
        map((response) => {
          if (!response) {
            router.navigate(["login"]);
            return false;
          }

          return true;
        }),
        catchError((err) => {
          console.error("Error when logging in via whitelist.", err);
          router.navigate(["login"]);
          return of(false);
        }),
      );
    }),
  );
};
