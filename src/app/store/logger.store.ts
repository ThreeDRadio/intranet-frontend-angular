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
  concatMap,
  EMPTY,
  exhaustMap,
  finalize,
  map,
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

      createPlaylistEntry: rxMethod<PlaylistEntry>(
        pipe(
          concatMap((input) =>
            playlistService.createEntry(input).pipe(
              tapResponse({
                next: (result) => {
                  patchState(store, {
                    playlistEntries: [...store.playlistEntries(), result],
                  });
                },
                error: (err) => {
                  console.error("API Error details:", err);
                },
              }),
            ),
          ),
        ),
      ),

      deletePlaylistEntry: rxMethod<number>(
        pipe(
          exhaustMap((id) => {
            const before = store.playlistEntries();

            patchState(store, (state) => ({
              playlistEntries: state.playlistEntries.filter(
                (entry) => entry.id !== id,
              ),
            }));

            return playlistService.deleteEntry(id).pipe(
              tap(() => {
                // 2. Success step: Now safely recalculate indexes if required.
                patchState(store, (state) => ({
                  playlistEntries: state.playlistEntries.map(
                    (current, idx) => ({
                      ...current,
                      index: idx + 1,
                    }),
                  ),
                }));
              }),
              catchError((err) => {
                // 3. Rollback step: Restore original list if server fails.
                patchState(store, { playlistEntries: before });
                return EMPTY;
              }),
            );
          }),
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
            playlistService.createPlaylist(input).pipe(
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
