import { TrackActions } from '../actions/track.actions';

export interface TrackState {
  // All the tracks we currently have in the store
  entities: { [id: string]: any };

  // All the track IDs for what we hav in the store
  ids: Array<string>;

  loading: boolean;

  /// Maps a release ID to a list of track ids
  releaseTracks: { [id: string]: Array<string> };
}

export const initialState: TrackState = {
  entities: {},
  ids: [],
  loading: false,
  releaseTracks: {}
};

export function reducer(
  state: TrackState = initialState,
  action: TrackActions.Actions
): TrackState {
  switch (action.type) {
    case TrackActions.Types.requestTracksForRelease:
      return { ...state, loading: true };
    case TrackActions.Types.responseTracksForRelease: {
      const a = action as TrackActions.ResponseTracksForRelease;
      const releaseId = a.payload.releaseId;
      const releaseIds = a.payload.tracks.map(track => track.id);
      const ids = Array.from(new Set([...state.ids, ...releaseIds]));
      const entities = a.payload.tracks.reduce((accum, current) => {
        accum[current.id] = current;
        return accum;
      }, {});
      return {
        ...state,
        loading: false,
        ids,
        entities: { ...state.entities, ...entities },
        releaseTracks: { ...state.releaseTracks, [releaseId]: releaseIds }
      };
    }
    default:
      return state;
  }
}
