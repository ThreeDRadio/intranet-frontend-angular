import '../rxjs';

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import * as selectors from '../store/selectors/auth.selectors';
import { Observable } from 'rxjs';
import { map, skipWhile } from 'rxjs/operators';

@Injectable()
export class ReadyGuard implements CanActivate {
  constructor(private store: Store<any>) {}
  canActivate(): Observable<boolean> {
    return this.store.select(selectors.isReady).pipe(
      skipWhile(val => !val),
      map(() => true)
    );
  }
}
