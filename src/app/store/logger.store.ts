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
import { NewPlaylist, Playlist } from "../models/playlist";
import { Show } from "../models/show";
import { ShowService } from "../services/show.service";
import {
  catchError,
  concatMap,
  EMPTY,
  exhaustMap,
  finalize,
  forkJoin,
  map,
  mergeAll,
  mergeMap,
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

type CatalogueInputState =
  | undefined
  | {
      show: Show;
      playlist: Playlist;
    };

type PlaylistCatalogueInputParams = {
  show: Show;
  playlist: Playlist;
};

type LoggerState = {
  isLoading: boolean;
  // Submission state
  playlistSubmission: PlaylistSubmissionState;
  // Catalogue input state
  catalogueInputState: CatalogueInputState;
  // Internal state
  shows: Show[];
  playlists: Playlist[];
  playlistEntries: PlaylistEntry[];
};

export const initialState: LoggerState = {
  isLoading: false,
  playlistSubmission: undefined,
  catalogueInputState: undefined,
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

      updatePlaylistEntry: rxMethod<PlaylistEntry>(
        pipe(
          exhaustMap((update) => {
            // Optimistic update - rollback if the update fails.
            const before = store.playlistEntries();
            patchState(store, (state) => ({
              playlistEntries: state.playlistEntries.map((entry) =>
                entry.id === update.id ? { ...entry, ...update } : entry,
              ),
            }));

            return playlistService.updateEntry(update).pipe(
              catchError((err) => {
                patchState(store, { playlistEntries: before });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      reorderPlaylist: rxMethod<{ playlist: number; from: number; to: number }>(
        pipe(
          mergeMap((input) => {
            const before = store.playlistEntries();
            // Move the index
            var after = [...before];
            const [item] = after.splice(input.from - 1, 1);
            after.splice(input.to - 1, 0, item);
            // Reindex
            after = after.map((e, idx) => {
              return { ...e, index: idx + 1 };
            });
            // Update state optimistically.
            patchState(store, {
              playlistEntries: after,
            });
            const toUpdate = after.slice(
              Math.min(input.from, input.to) - 1,
              Math.max(input.from, input.to),
            );
            return playlistService.reorderEntries(toUpdate).pipe(
              catchError((err) => {
                patchState(store, { playlistEntries: before });
                return EMPTY;
              }),
            );
          }),
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

      clearPlaylistSubmission: rxMethod<void>(
        pipe(
          tap(() =>
            patchState(store, {
              playlistSubmission: undefined,
            }),
          ),
        ),
      ),

      completePlaylist: rxMethod<number>(
        pipe(
          tap((id) => {
            patchState(store, (state) => ({
              playlists: state.playlists.map((entry) =>
                entry.id === id
                  ? { ...entry, isLoading: true, complete: true }
                  : entry,
              ),
            }));
          }),
          exhaustMap((id) => {
            return playlistService.completePlaylist(id).pipe(
              tap(() => patchState(store, { isLoading: false })),
              catchError((err) => {
                patchState(store, (state) => ({
                  playlists: state.playlists.map((entry) =>
                    entry.id === id
                      ? { ...entry, isLoading: false, complete: false }
                      : entry,
                  ),
                }));
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      fetchPlaylistAndEntries: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((id) => {
            // If all else fails, get everything.
            return playlistService.getPlaylistById(id).pipe(
              switchMap((playlist) => {
                const existingShow = store
                  .shows()
                  .find((s) => s.id === playlist.show);

                if (existingShow) {
                  // Only get the entries
                  return forkJoin({
                    entries: playlistService.getEntriesForId(playlist.id),
                  }).pipe(
                    tap(({ entries }) => {
                      patchState(store, (state) => ({
                        playlists: [...state.playlists, playlist],
                        playlistEntries: entries,
                        isLoading: false,
                      }));
                    }),
                  );
                }

                return forkJoin({
                  show: showService.getShows([playlist.show]),
                  entries: playlistService.getEntriesForId(playlist.id),
                }).pipe(
                  tap(({ show, entries }) => {
                    patchState(store, (state) => ({
                      shows: [...state.shows, ...show],
                      playlists: [...state.playlists, playlist],
                      playlistEntries: entries,
                      isLoading: false,
                    }));
                  }),
                );
              }),
              catchError((err) => {
                console.error(err);
                patchState(store, { isLoading: false });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      setCatalogueInput: rxMethod<PlaylistCatalogueInputParams>(
        pipe(
          map((p) =>
            patchState(store, {
              catalogueInputState: {
                show: p.show,
                playlist: p.playlist,
              },
            }),
          ),
        ),
      ),
    }),
  ),
);
