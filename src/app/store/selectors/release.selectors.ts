import { createSelector } from '@ngrx/store';
import { State } from '../reducers';

export namespace ReleaseSelectors {
  export const releaseState = (state: State) => state.releases;

  export const isLoading = createSelector(
    releaseState,
    state => state.loading
  );

  export const count = createSelector(
    releaseState,
    state => state.count
  );

  export const getIds = createSelector(
    releaseState,
    state => state.ids
  );
  export const getEntities = createSelector(
    releaseState,
    state => state.entities
  );
  export const getAll = createSelector(
    getIds,
    getEntities,
    (ids, entities) => ids.map(id => entities[id])
  );

  export const hasNext = createSelector(
    releaseState,
    state => state.nextPage != null
  );
  export const hasPrev = createSelector(
    releaseState,
    state => state.previousPage != null
  );
}
