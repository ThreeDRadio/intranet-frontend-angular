import { computed } from "@angular/core";
import {
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";

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
  withMethods((store) => ({})),
);
