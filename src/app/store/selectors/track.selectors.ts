import { createSelector } from '@ngrx/store';
import { State } from '../reducers';

export namespace TrackSelectors {
  export const trackState = (state: State) => state.tracks;

  export const isLoading = createSelector(
    trackState,
    state => state.loading
  );

  export const getIds = createSelector(
    trackState,
    state => state.ids
  );
  export const getEntities = createSelector(
    trackState,
    state => state.entities
  );
  export const getAll = createSelector(
    getIds,
    getEntities,
    (ids, entities) => ids.map(id => entities[id])
  );

  export const tracksForRelease = (releaseId: string) => {
    return createSelector(
      trackState,
      state => {
        if (state.releaseTracks[releaseId]) {
          return state.releaseTracks[releaseId].map(id => state.entities[id]);
        }
        return [];
      }
    );
  };
}
