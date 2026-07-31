import { inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { PlaylistService } from "../services/playlist.service";
import { Playlist } from "../models/playlist";
import { Show } from "../models/show";

type PlaylistState = {
  isLoading: boolean;
  shows: Show[];
  playlists: Playlist[];
};

const initialState: PlaylistState = {
  isLoading: false,
  shows: [],
  playlists: [],
};

export const PlaylistStore = signalStore(
  withState(initialState),
  withMethods((store, service = inject(PlaylistService)) => ({
    getPlaylists(page: number) {
      patchState(store, { playlists: [], isLoading: true });
      const thisPage$ = service.getPlaylistPage(page);
      thisPage$.subscribe({
        next: (playlistsResult) => {
          patchState(store, {
            playlists: playlistsResult,
            isLoading: false,
          });
        },
        error: (err) => {
          console.error(err);
          patchState(store, { playlists: [], isLoading: false });
        },
      });
    },
  })),
);
