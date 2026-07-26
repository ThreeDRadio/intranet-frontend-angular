import { Comment } from "app/models/comment";
import { CommentActions as actions } from "../actions/comment.actions";

type CommentEntities = { [id: number]: Comment };
type ReleaseEntities = { [id: number]: string[] };

export interface CommentState {
  // All the tracks we currently have in the store
  entities: CommentEntities;
  /// Maps a release ID to a list of track ids
  releaseEntities: ReleaseEntities;
  // All the track IDs for what we hav in the store
  ids: number[];

  loading: boolean;

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
      const newIds = state.ids.filter((id) => id !== a.payload.commentId);
      const newReleaseEntities = Object.keys(
        state.releaseEntities,
      ).reduce<ReleaseEntities>((acc, key) => {
        const keyId = Number(key);
        const filtered = state.releaseEntities[keyId].filter(
          (i) => Number(i) !== a.payload.commentId,
        );
        if (filtered.length > 0) {
          acc[keyId] = filtered;
        }
        return acc;
      }, {});
      const newEntities = Object.keys(state.entities)
        .filter((i) => i !== String(a.payload.commentId))
        .reduce<CommentEntities>((acc, key) => {
          acc[Number(key)] = state.entities[Number(key)];
          return acc;
        }, {});

      return {
        ...state,
        loading: true,
        ids: newIds,
        releaseEntities: newReleaseEntities,
        entities: newEntities,
      };
    }

    case actions.Types.responseModeratorRemoveComment: {
      return {
        ...state,
        loading: false,
      };
    }

    default:
      return state;
  }
}
