import { Action } from '@ngrx/store';
import { ReleaseActions } from '../actions/release.actions';

export interface ReleaseState {
  entities?: {};
  ids?: Array<number>;
  loading: boolean;

  count?: number;
  nextPage?: string;
  previousPage?: string;

  error?: any;
}

const initialState = {
  entities: {},
  ids: [],
  loading: false
};

export function reducer(state: ReleaseState = initialState, action: ReleaseActions.Actions) {
  switch (action.type) {
    case ReleaseActions.Types.REQUEST_SIMPLE_SEARCH:
      return { ...state, loading: true };
    case ReleaseActions.Types.ERROR_SIMPLE_SEARCH:
      return { ...state, loading: false, error: action.payload };
    case ReleaseActions.Types.RESPONSE_SIMPLE_SEARCH:
      const responseAction = action as ReleaseActions.ResponseSearch;
      return {
        ...screen,
        loading: false,
        error: null,
        previousPage: responseAction.payload.previous,
        nextPage: responseAction.payload.next,
        count: responseAction.payload.count,
        ids: responseAction.payload.results.map(item => item.id),
        entities: responseAction.payload.results.reduce((accum, current) => {
          accum[current.id] = current;
          return accum;
        }, {})
      };
    case ReleaseActions.Types.REQUEST_BY_ID:
      return { ...state, loading: true };
    case ReleaseActions.Types.RESPONSE_BY_ID:
      const ids = Array.from(new Set([...state.ids, action.payload.id]));
      const entities = { ...state.entities };
      entities[action.payload.id] = action.payload;
      return { ...state, loading: false, ids, entities };
    default:
      return state;
  }
}
