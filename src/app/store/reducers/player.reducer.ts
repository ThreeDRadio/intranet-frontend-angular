import { Track } from 'app/models';
import { PlayerActions } from '../actions/player.actions';

export enum PlayerStatus {
  IDLE,
  LOADING,
  PLAYING,
  PAUSED
}

export interface State {
  status: PlayerStatus;
  currentTrack?: Track;
  position?: number;
}

export const INITIAL_STATE: State = {
  status: PlayerStatus.IDLE
};

export function reducer(state: State = INITIAL_STATE, action: PlayerActions.Actions) {
  switch (action.type) {
    case PlayerActions.Types.RequestPlay:
      return {
        ...state,
        currentTrack: (action as PlayerActions.RequestPlay).payload.track,
        position: 0,
        status: PlayerStatus.LOADING
      };

    case PlayerActions.Types.RequestPause:
      return { ...state, status: PlayerStatus.LOADING };

    case PlayerActions.Types.Playing:
      const currentTrack = (action as any).payload
        ? (action as any).payload.track
        : state.currentTrack;
      return {
        ...state,
        status: PlayerStatus.PLAYING,
        currentTrack
      };
    case PlayerActions.Types.Paused:
      return {
        ...state,
        status: PlayerStatus.PAUSED
      };
    case PlayerActions.Types.Completed:
      return {
        ...state,
        status: PlayerStatus.IDLE,
        track: null
      };

    case PlayerActions.Types.UpdatePosition:
      return {
        ...state,
        position: (action as PlayerActions.UpdatePosition).payload
      };

    default:
      return state;
  }
}
