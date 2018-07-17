import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AppReadyAction } from 'app/store/actions';
import { map } from 'rxjs/operators';

@Injectable()
export class StartupEffects {
  @Effect()
  startup = this.actions$.ofType('@ngrx/effects/init').pipe(map(() => new AppReadyAction()));

  constructor(private actions$: Actions<any>) {}
}
