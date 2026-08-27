import { computed, inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { ReleaseService } from "../services/release.service";

type SearchState = {
  isSearching: boolean;
};

export const initialState: SearchState = {
  isSearching: false,
};

export const SearchStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withComputed((store) => ({
    hasSearchResults: computed(() => {
      return false;
    }),
  })),
  withMethods((store, releaseService = inject(ReleaseService)) => ({
    quickSearch: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isSearching: true })),
        switchMap((input) => {
          return releaseService.quickSearch(input).pipe();
        }),
      ),
    ),
  })),
);
