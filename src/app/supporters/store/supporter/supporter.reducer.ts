import { SupporterActions } from './supporter.actions';

export interface SupporterState {
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

export function reducer(
  state: SupporterState = initialState,
  action: SupporterActions.Actions
): SupporterState {
  switch (action.type) {
    case SupporterActions.Types.CLEAR:
      return initialState;
    case SupporterActions.Types.REQUEST_SEARCH:
      return { ...state, loading: true };
    case SupporterActions.Types.RESPONSE_SEARCH: {
      const responseAction = action as SupporterActions.ResponseSearch;
      return {
        ...state,
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
    }
    case SupporterActions.Types.REQUEST_BY_ID:
      return { ...state, loading: true };
    case SupporterActions.Types.RESPONSE_BY_ID: {
      const responseAction = action as SupporterActions.ResponseById;
      const ids = Array.from(new Set([...state.ids, responseAction.payload.id]));
      const entities = { ...state.entities };
      entities[responseAction.payload.id] = responseAction.payload;
      return { ...state, loading: false, ids, entities };
    }
    default:
      return state;
  }
}
