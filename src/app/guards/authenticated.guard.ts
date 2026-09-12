import { inject, Injectable } from "@angular/core";
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
      // 1. If token exists, allow access immediately
      if (token) {
        return of(true);
      }

      // 2. If no token, check the IP whitelist asynchronously
      return ipService.getIpAddress().pipe(
        map((response) => {
          console.log(response);

          // 3. Not tokenized and not whitelisted -> Redirect to login
          router.navigate(["login"]);
          return false;
        }),
        catchError((err) => {
          console.error("Failed to get IP address", err);
          router.navigate(["login"]);
          return of(false);
        }),
      );
    }),
  );
};
