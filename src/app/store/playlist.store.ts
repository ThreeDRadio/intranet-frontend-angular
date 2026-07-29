import { inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { PlaylistService } from "../services/playlist.service";

type PlaylistState = {
  isLoading: boolean;
};
const initialState: PlaylistState = {
  isLoading: false,
};

export const PlaylistStore = signalStore(
  withState(initialState),
  withMethods((store, service = inject(PlaylistService)) => ({
    async getRecentPlaylists(): Promise<void> {
      patchState(store, { isLoading: true });
      //await new Promise((f) => setTimeout(f, 5000));
      patchState(store, { isLoading: false });
    },
  })),
);
