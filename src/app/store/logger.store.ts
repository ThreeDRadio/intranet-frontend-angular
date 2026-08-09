import { computed, inject } from "@angular/core";
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { tapResponse } from "@ngrx/operators";
import { PlaylistService } from "../services/playlist.service";
import { NewPlaylist, Playlist, PlaylistsByDate } from "../models/playlist";
import { Show } from "../models/show";
import { ShowService } from "../services/show.service";
import {
  catchError,
  EMPTY,
  exhaustMap,
  finalize,
  pipe,
  switchMap,
  tap,
} from "rxjs";
import { PlaylistEntry } from "../models/playlist-entry";

type PlaylistSubmissionState =
  | undefined
  | {
      success: boolean | undefined;
      statusCode: number | undefined;
      state: string;
      id: number | undefined;
    };

type LoggerState = {
  isLoading: boolean;
  // Submission state
  playlistSubmission: PlaylistSubmissionState;
  // Internal state
  shows: Show[];
  playlists: Playlist[];
  playlistEntries: PlaylistEntry[];
};

export const initialState: LoggerState = {
  isLoading: false,
  playlistSubmission: undefined,
  shows: [],
  playlists: [],
  playlistEntries: [],
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
    playlistEntriesById: computed(() => (id: number) => {
      return store.playlistEntries().filter((pe) => pe.playlist === id);
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
      fetchAllShows: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          exhaustMap(() =>
            showService.getAllShows().pipe(
              tapResponse({
                next: (shows) => patchState(store, { shows }),
                error: (err) => patchState(store, { shows: [] }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      ),

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

      fetchPlaylistEntries: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((id) =>
            playlistService.getEntriesForId(id).pipe(
              tap((entries) => {
                patchState(store, { playlistEntries: entries });
              }),
              catchError((err) => {
                patchState(store, { playlistEntries: [] });
                return EMPTY;
              }),
              finalize(() => patchState(store, { isLoading: false })),
            ),
          ),
        ),
      ),

      deletePlaylistEntry: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          exhaustMap((id) =>
            playlistService.deleteEntry(id).pipe(
              tap((response) => {
                patchState(store, (state) => ({
                  playlistEntries: state.playlistEntries.reduce<
                    PlaylistEntry[]
                  >((acc, current) => {
                    if (current.id === id) return acc;

                    acc.push({
                      ...current,
                      index: acc.length + 1,
                    });

                    return acc;
                  }, []),
                }));
              }),
              catchError((err) => {
                return EMPTY;
              }),
              finalize(() => patchState(store, { isLoading: false })),
            ),
          ),
        ),
      ),

      createNewPlaylist: rxMethod<NewPlaylist>(
        pipe(
          tap(() =>
            patchState(store, {
              playlistSubmission: {
                success: undefined,
                statusCode: undefined,
                state: "in-progress",
                id: undefined,
              },
            }),
          ),
          exhaustMap((input) =>
            playlistService.create(input).pipe(
              tap((result) => {
                patchState(store, (state) => ({
                  playlistSubmission: {
                    success: true,
                    statusCode: 201,
                    state: "created",
                    id: result.id,
                  },
                  playlists: [...state.playlists, result],
                }));
                return EMPTY;
              }),
              catchError((err) => {
                patchState(store, {
                  playlistSubmission: {
                    success: false,
                    statusCode: err.status,
                    state: "failed",
                    id: undefined,
                  },
                });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
