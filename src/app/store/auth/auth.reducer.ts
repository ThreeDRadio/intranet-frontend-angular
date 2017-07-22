import {Action} from '@ngrx/store';

export interface AuthState { token?: string; }

const initialState: AuthState = {

};

export function reducer(state: AuthState = initialState, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}
