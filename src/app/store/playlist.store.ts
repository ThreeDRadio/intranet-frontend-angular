import { inject } from "@angular/core";
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { PlaylistService } from "../services/playlist.service";
import { Playlist } from "../models/playlist";
import { Show } from "../models/show";
import { ShowService } from "../services/show.service";

type LoggerState = {
  isLoading: boolean;
  shows: Show[];
  playlists: Playlist[];
};

const initialState: LoggerState = {
  isLoading: false,
  shows: [],
  playlists: [],
};

export const LoggerStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      playlistService = inject(PlaylistService),
      showService = inject(ShowService),
    ) => ({
      getShow(id: number) {
        let cachedShows = getState(store).shows;
        // Don't bother downloading a show again.
        if (cachedShows.find((show) => show.id === id)) return;
        const thisShow$ = showService.getShows([id]);
        thisShow$.subscribe({
          next: (showsResult) => {
            patchState(store, {
              shows: [...cachedShows, showsResult[0]],
              isLoading: false,
            });
          },
          error: (err) => {
            console.error(err);
            patchState(store, { isLoading: false });
          },
        });
      },
      getPlaylists(page: number) {
        patchState(store, { playlists: [], isLoading: true });
        const thisPage$ = playlistService.getPlaylistPage(page);
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
    }),
  ),
);
