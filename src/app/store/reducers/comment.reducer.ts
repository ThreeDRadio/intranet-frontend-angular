import { Comment } from 'app/models/comment';
import { CommentActions as actions } from '../actions/comment.actions';

export interface CommentState {
  // All the tracks we currently have in the store
  entities: { [id: string]: Comment };

  // All the track IDs for what we hav in the store
  ids: Array<number>;

  loading: boolean;

  /// Maps a release ID to a list of track ids
  releaseEntities: { [id: string]: Array<string> };

  count?: number;
  nextPage?: string;
  previousPage?: string;

  error?: any;
}

export const initialState: CommentState = {
  entities: {},
  ids: [],
  loading: false,
  releaseEntities: {}
};

export function reducer(state: CommentState = initialState, action: actions.Actions): CommentState {
  switch (action.type) {
    case actions.Types.requestForRelease:
      return { ...state, loading: true };
    case actions.Types.responseList:
      {
        const a = action as actions.ResponseList;
        return {
          ...state,
          loading: false,
          error: null,
          previousPage: a.payload.previous,
          nextPage: a.payload.next,
          count: a.payload.count,
          ids: a.payload.results.map(item => item.id),
          entities: a.payload.results.reduce((accum, current) => {
            accum[current.id] = current;
            return accum;
          }, {})
        };
      }
      break;

    case actions.Types.responseForRelease: {
      const a = action as actions.ResponseForRelease;
      const releaseId = a.payload.releaseId;
      const releaseIds = a.payload.comments.map(track => track.id);
      const ids = Array.from(new Set([...state.ids, ...releaseIds]));
      const entities = a.payload.comments.reduce((accum, current) => {
        accum[current.id] = current;
        return accum;
      }, {});
      return {
        ...state,
        loading: false,
        ids,
        entities: { ...state.entities, ...entities }
      };
    }
    default:
      return state;
  }
}
