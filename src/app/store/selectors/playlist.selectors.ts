import { State } from "../reducers";

export namespace PlaylistSelectors {
  export const playlistState = (state: State) => state.playlists;
}
