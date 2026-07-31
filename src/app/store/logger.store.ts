import { computed, inject } from "@angular/core";
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

export class PlaylistsByDate {
  date: string;
  playlists: Playlist[];
}

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
      // Getters
      getShowById(id: number) {
        return computed(() => store.shows().find((s) => s.id === id));
      },
      getPlaylistsByDate(): PlaylistsByDate[] {
        return Array.from(new Set(store.playlists().map((p) => p.date))).map(
          (d) => {
            const playlistsForThisDate = store
              .playlists()
              .filter((p) => p.date === d);
            console.log(playlistsForThisDate);
            return {
              date: d,
              playlists: playlistsForThisDate,
            };
          },
        );
      },

      // Fetching from services
      fetchShow(id: number) {
        let cachedShows = getState(store).shows;
        // Don't bother downloading a show again.
        if (cachedShows.find((show) => show.id === id)) return;
        patchState(store, { isLoading: true });
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
      fetchPlaylists(page: number) {
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
