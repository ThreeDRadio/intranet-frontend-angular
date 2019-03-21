import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommentActions } from '../actions/comment.actions';
import { CommentApi } from 'app/services/comment-api';
import { HttpOptions } from 'app/services';

@Injectable()
export class CommentEffects {
  @Effect()
  getForRelease$ = this.actions$.pipe(
    ofType(CommentActions.Types.requestForRelease),
    switchMap((action: CommentActions.RequestForRelease) => {
      return this.api.getForRelease(action.payload.releaseId).pipe(
        map(
          response =>
            new CommentActions.ResponseForRelease({
              releaseId: action.payload.releaseId,
              comments: response as any
            })
        ),
        catchError(err => of(new CommentActions.ErrorForRelease(err)))
      );
    })
  );

  @Effect()
  fetchMostRecent$ = this.actions$.pipe(
    ofType(CommentActions.Types.requestMostRecent),
    switchMap(action => {
      const options: HttpOptions = {
        responseType: 'json',
        params: {
          limit: 10,
          ordering: '-createwhen'
        }
      };
      return this.api.list(options).pipe(
        map(response => new CommentActions.ResponseList(response)),
        catchError(err => of(new CommentActions.ErrorList(err)))
      );
    })
  );

  constructor(private actions$: Actions<CommentActions.Actions>, private api: CommentApi) {}
}
