import { computed, inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import {
  catchError,
  EMPTY,
  filter,
  mergeMap,
  pipe,
  switchMap,
  tap,
} from "rxjs";
import { ReleaseService } from "../services/release.service";
import { Track } from "../models/track";
import { Release } from "../models/release";

type Tracklist = {
  releaseId: number;
  tracks: Track[];
};

type ReleaseState = {
  isLoading: boolean;
  releases: Release[];
  tracklists: Tracklist[];
};

export const initialState: ReleaseState = {
  isLoading: false,
  releases: [],
  tracklists: [],
};

export const ReleaseStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withComputed((store) => ({
    releaseForId: computed(() => (id: number) => {
      return store.releases().find((r) => r.id === id);
    }),
    tracklistForId: computed(() => (id: number) => {
      return store.tracklists().find((t) => t.releaseId === id);
    }),
  })),
  withMethods((store, releaseService = inject(ReleaseService)) => ({
    fetchAllForId: rxMethod<number>(
      pipe(
        mergeMap((id) => {
          // Check for a release. If it exists, only retrieve the tracklist.
          const existingRelease = store.releases().find((t) => t.id === id);
          const existingTl = store.tracklists().find((t) => t.releaseId === id);
          if (existingRelease && existingTl) return EMPTY;
          // If release exists, only get tracklist
          if (existingRelease && !existingTl) {
            patchState(store, { isLoading: true });
            return releaseService.getTracklist(id).pipe(
              tap((tl) => {
                patchState(store, {
                  isLoading: false,
                  tracklists: [
                    ...store.tracklists(),
                    { releaseId: id, tracks: tl },
                  ],
                });
              }),
              catchError((err) => {
                patchState(store, { isLoading: false });
                return EMPTY;
              }),
            );
          } else if (!existingRelease && existingTl) {
            patchState(store, { isLoading: true });
            return releaseService.getRelease(id).pipe(
              tap((r) => {
                patchState(store, {
                  isLoading: false,
                  releases: [...store.releases(), r],
                });
              }),
              catchError((err) => {
                patchState(store, { isLoading: false });
                return EMPTY;
              }),
            );
          } else {
            // Everything
            patchState(store, { isLoading: true });
            return releaseService.getRelease(id).pipe(
              tap((r) => {
                patchState(store, {
                  releases: [...store.releases(), r],
                });
                return releaseService.getTracklist(id).pipe(
                  tap((tl) => {
                    patchState(store, {
                      isLoading: false,
                      tracklists: [
                        ...store.tracklists(),
                        { releaseId: id, tracks: tl },
                      ],
                    });
                  }),
                  catchError((err) => {
                    patchState(store, { isLoading: false });
                    return EMPTY;
                  }),
                );
              }),
              catchError((err) => {
                patchState(store, { isLoading: false });
                return EMPTY;
              }),
            );
          }
        }),
      ),
    ),
    fetchReleaseForId: rxMethod<number>(
      pipe(
        mergeMap((id) => {
          const existing = store.releases().find((t) => t.id === id);
          // Don't bother with a request if the release is already downloaded.
          if (existing !== null && existing !== undefined) return EMPTY;
          // If nothing found, request the release.
          patchState(store, { isLoading: true });
          return releaseService.getRelease(id).pipe(
            tap((r) => {
              patchState(store, {
                isLoading: false,
                releases: [...store.releases(), r],
              });
            }),
            catchError((err) => {
              patchState(store, { isLoading: false });
              return EMPTY;
            }),
          );
        }),
      ),
    ),
    fetchTracksForId: rxMethod<number>(
      pipe(
        mergeMap((id) => {
          const existing = store.tracklists().find((t) => t.releaseId === id);
          // Don't bother with a request if the tracklist is already downloaded.
          if (existing !== null && existing !== undefined) return EMPTY;
          // If nothing found, request the tracklist.
          patchState(store, { isLoading: true });
          return releaseService.getTracklist(id).pipe(
            tap((tl) => {
              patchState(store, {
                isLoading: false,
                tracklists: [
                  ...store.tracklists(),
                  { releaseId: id, tracks: tl },
                ],
              });
            }),
            catchError((err) => {
              patchState(store, { isLoading: false });
              return EMPTY;
            }),
          );
        }),
      ),
    ),
  })),
);
