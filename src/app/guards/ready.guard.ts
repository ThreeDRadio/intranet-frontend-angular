import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import 'app/rxjs';
import { CanActivate } from '@angular/router';

import * as selectors from 'app/store/selectors/auth.selectors';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ReadyGuard implements CanActivate {
  constructor(private store: Store<any>) {}
  canActivate(): Observable<boolean> {
    return this.store
      .select(selectors.isReady)
      .skipWhile(val => !val)
      .map(() => true);
  }
}
