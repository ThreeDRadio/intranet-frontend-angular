import { createSelector } from '@ngrx/store';
import { State } from '../../store';

export namespace SupporterSelectors {
  export const supporterState = (state: { supporters: any }) => state.supporters.supporters;

  export const isLoading = createSelector(
    supporterState,
    state => state.loading
  );

  export const count = createSelector(
    supporterState,
    state => state.count
  );

  export const getIds = createSelector(
    supporterState,
    state => state.ids
  );
  export const getEntities = createSelector(
    supporterState,
    state => state.entities
  );
  export const getAll = createSelector(
    getIds,
    getEntities,
    (ids, entities) => ids.map(id => entities[id])
  );

  export const hasNext = createSelector(
    supporterState,
    state => state.nextPage != null
  );
  export const hasPrev = createSelector(
    supporterState,
    state => state.previousPage != null
  );
}
