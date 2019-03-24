import { createSelector } from '@ngrx/store';
import { State } from '../reducers';

export namespace CommentSelectors {
  export const commentState = (state: State) => state.comments;

  export const isLoading = createSelector(
    commentState,
    state => state.loading
  );

  export const count = createSelector(
    commentState,
    state => state.count
  );

  export const getIds = createSelector(
    commentState,
    state => state.ids
  );
  export const getEntities = createSelector(
    commentState,
    state => state.entities
  );
  export const getAll = createSelector(
    getIds,
    getEntities,
    (ids, entities) => ids.map(id => entities[id])
  );

  export const hasNext = createSelector(
    commentState,
    state => state.nextPage != null
  );
  export const hasPrev = createSelector(
    commentState,
    state => state.previousPage != null
  );
  export const commentsForRelease = (releaseId: string) => {
    return createSelector(
      commentState,
      state => {
        if (state.releaseEntities[releaseId]) {
          return state.releaseEntities[releaseId].map(id => state.entities[id]);
        }
        return [];
      }
    );
  };
}
