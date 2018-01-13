import {Action} from '@ngrx/store';

export interface ReleaseState {
  releases: {};
  ids: Array<Number>;
}

const initialState = {
  releases: {},
  ids: []
};

export function reducer(state: ReleaseState = initialState, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}
