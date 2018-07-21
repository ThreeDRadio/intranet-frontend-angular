import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as selectors from '../store/selectors/auth.selectors';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private store: Store<any>, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.store.select(selectors.getAuth).pipe(
      map(token => {
        if (!token) {
          this.router.navigate(['login']);
          return false;
        }
        return true;
      })
    );
  }
}
