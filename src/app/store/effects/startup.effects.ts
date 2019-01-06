import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AppReadyAction } from '../actions';
import { map } from 'rxjs/operators';

@Injectable()
export class StartupEffects {
  @Effect()
  startup = this.actions$.pipe(
    ofType('@ngrx/effects/init'),
    map(() => new AppReadyAction())
  );

  constructor(private actions$: Actions<any>) {}
}
