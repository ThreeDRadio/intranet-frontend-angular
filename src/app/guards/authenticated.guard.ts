import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import * as selectors from "../store/selectors/auth.selectors";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AuthenticatedGuard {
  private store = inject(Store<any>);
  private router = inject(Router);
  private http = inject(HttpClient);

  canActivate(): Observable<boolean> {
    return this.store.select(selectors.getAuth).pipe(
      map((token) => {
        if (!token) {
          this.router.navigate(["login"]);
          return false;
        }
        return true;
      }),
    );
  }
}
