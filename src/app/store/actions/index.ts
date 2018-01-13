import { Action } from '@ngrx/store';

export * from './auth.actions';
export * from './release.actions';

export class PayloadAction implements Action {
  readonly type: string;
  readonly payload: any;
}
