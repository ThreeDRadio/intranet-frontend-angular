import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as selectors from 'app/store/selectors/auth.selectors';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
