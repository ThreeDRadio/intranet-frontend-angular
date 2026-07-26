import { Comment } from "app/models/comment";
import { CommentActions as actions } from "../actions/comment.actions";

type ReleaseEntities = { [id: string]: string[] };

export interface CommentState {
  // All the tracks we currently have in the store
  entities: { [id: string]: Comment };

  // All the track IDs for what we hav in the store
  ids: Array<number>;

  loading: boolean;

  /// Maps a release ID to a list of track ids
  releaseEntities: ReleaseEntities;

  count?: number;
  nextPage?: string;
  previousPage?: string;

  error?: any;
}

export const initialState: CommentState = {
  entities: {},
  ids: [],
  loading: false,
  releaseEntities: {},
};

export function reducer(
  state: CommentState = initialState,
  action: actions.Actions,
): CommentState {
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
          ids: a.payload.results.map((item) => item.id),
          entities: a.payload.results.reduce((accum, current) => {
            accum[current.id] = current;
            return accum;
          }, {}),
        };
      }
      break;

    case actions.Types.responseForRelease: {
      const a = action as actions.ResponseForRelease;
      const releaseId = a.payload.releaseId;
      const commentIds = a.payload.comments.map((comment) => comment.id);
      const ids = Array.from(new Set([...state.ids, ...commentIds]));
      const entities = a.payload.comments.reduce((accum, current) => {
        accum[current.id] = current;
        return accum;
      }, {});
      return {
        ...state,
        loading: false,
        ids,
        releaseEntities: { ...state.releaseEntities, [releaseId]: commentIds },
        entities: { ...state.entities, ...entities },
      };
    }

    case actions.Types.requestModeratorRemoveComment: {
      const a = action as actions.RequestModeratorRemoveComment;

      return {
        ...state,
        ids: state.ids.filter((id) => id !== a.payload.commentId),
        entities: a.payload.comments.reduce((accum, current) => {
          if (current.id !== a.payload.commentId) {
            accum[current.id] = current;
          }
          return accum;
        }, {}),
        loading: true,
      };
    }

    case actions.Types.responseModeratorRemoveComment: {
      const a = action as actions.ResponseModeratorRemoveComment;

      return {
        ...state,
        loading: false,
      };
    }

    default:
      return state;
  }
}
