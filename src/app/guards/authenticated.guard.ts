import { Store } from '@ngrx/store';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

import * as selectors from 'app/store/selectors/auth.selectors';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private store: Store<any>, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.store.select(selectors.getAuth).map(token => {
      if (!token) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
    });
  }
}
