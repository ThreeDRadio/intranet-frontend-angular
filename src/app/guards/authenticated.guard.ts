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
      if (token) {
        return of(true);
      }

      return ipService.getIpAddress().pipe(
        map((response) => {
          if (ipService.IsWhitelisted(response)) {
            return true;
          }

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
