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

type Tracklist = {
  releaseId: number;
  tracks: Track[];
};

type ReleaseState = {
  isLoading: boolean;
  tracklists: Tracklist[];
};

export const initialState: ReleaseState = {
  isLoading: false,
  tracklists: [],
};

export const ReleaseStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withComputed((store) => ({
    tracklistForId: computed(() => (id: number) => {
      return store.tracklists().find((t) => t.releaseId === id);
    }),
  })),
  withMethods((store, releaseService = inject(ReleaseService)) => ({
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
