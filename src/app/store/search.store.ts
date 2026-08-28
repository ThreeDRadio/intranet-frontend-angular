import { computed, inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, EMPTY, pipe, switchMap, tap } from "rxjs";
import { ReleaseService } from "../services/release.service";
import { Release } from "../models/release";

type QuickSearchParams = {
  term: string;
  size: number;
  offset: number;
};

type SearchState = {
  isSearching: boolean;
  count: number;
  results: Release[];
};

export const initialState: SearchState = {
  isSearching: false,
  count: 0,
  results: [],
};

export const SearchStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withComputed((store) => ({
    hasSearchResults: computed(() => {
      return store.count() > 0;
    }),
  })),
  withMethods((store, releaseService = inject(ReleaseService)) => ({
    quickSearch: rxMethod<QuickSearchParams>(
      pipe(
        tap(() => patchState(store, { isSearching: true })),
        switchMap((input) => {
          return releaseService
            .quickSearch(input.term, input.size, input.offset)
            .pipe(
              tap((response) => {
                patchState(store, {
                  isSearching: false,
                  count: response.count,
                  results: response.results,
                });
              }),
              catchError((err) => {
                patchState(store, {
                  isSearching: false,
                  count: 0,
                  results: [],
                });
                return EMPTY;
              }),
            );
        }),
      ),
    ),
  })),
);
