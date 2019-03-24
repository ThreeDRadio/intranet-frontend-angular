import { State } from '../reducers';
import { createSelector } from '@ngrx/store';

export namespace PlayerSelectors {
  export const playerState = (state: State) => state.player;
  export const playerStatus = createSelector(
    playerState,
    state => state.status
  );
  export const currentTrack = createSelector(
    playerState,
    state => state.currentTrack
  );

  export const trackPosition = createSelector(
    playerState,
    state => state.position
  );
}
