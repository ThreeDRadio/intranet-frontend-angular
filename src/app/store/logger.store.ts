import { computed, inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { tapResponse } from "@ngrx/operators";
import { PlaylistService } from "../services/playlist.service";
import { Playlist, PlaylistsByDate } from "../models/playlist";
import { Show } from "../models/show";
import { ShowService } from "../services/show.service";
import {
  catchError,
  concatMap,
  EMPTY,
  exhaustMap,
  filter,
  finalize,
  of,
  pipe,
  switchMap,
  switchScan,
  tap,
} from "rxjs";
import { isLoading } from "./selectors";

type LoggerState = {
  isLoading: boolean;
  shows: Show[];
  playlists: Playlist[];
};

export const initialState: LoggerState = {
  isLoading: false,
  shows: [],
  playlists: [],
};

export const LoggerStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withComputed((store) => ({
    playlistsByDate: computed(() => {
      const uniqueDates = Array.from(
        new Set(store.playlists().map((p) => p.date)),
      );
      return uniqueDates.map((date) => ({
        date,
        playlists: store.playlists().filter((p) => p.date === date),
      }));
    }),
    playlistById: computed(() => (id: number) => {
      return store.playlists().find((p) => p.id === id);
    }),
    showById: computed(() => (id: number) => {
      return store.shows().find((s) => s.id === id);
    }),
  })),
  withMethods(
    (
      store,
      playlistService = inject(PlaylistService),
      showService = inject(ShowService),
    ) => ({
      fetchPlaylists: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((page) =>
            playlistService.getPlaylistPage(page).pipe(
              switchMap((playlists) => {
                let unique = [...new Set(playlists.map((p) => p.show))];
                return showService.getShows(unique).pipe(
                  tap((shows) => {
                    patchState(store, { playlists, shows });
                  }),
                  catchError((err) => {
                    patchState(store, { playlists: [], shows: [] });
                    return EMPTY;
                  }),
                );
              }),
              catchError((err) => {
                patchState(store, { playlists: [] });
                return EMPTY;
              }),
              finalize(() => patchState(store, { isLoading: false })),
            ),
          ),
        ),
      ),
    }),
  ),
);
