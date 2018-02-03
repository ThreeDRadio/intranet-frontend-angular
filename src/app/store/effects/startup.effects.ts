import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AppReadyAction } from 'app/store/actions';

@Injectable()
export class StartupEffects {
  @Effect() startup = this.actions$.ofType('@ngrx/effects/init').map(() => new AppReadyAction());

  constructor(private actions$: Actions<any>) {}
}
