import { createSelector } from 'reselect';

import { State as RootState } from '../reducers';
import { State } from '../reducers/auth.reducer';

export const rootReducer = (state: RootState) => state.auth;

export const getLoggedIn = createSelector(
  rootReducer,
  (state: State): boolean => state.auth && typeof state.auth.id === 'string'
);
export const getAuth = createSelector(rootReducer, (state: State) => state.auth);
export const getAuthToken = createSelector(
  rootReducer,
  (state: State) => (state.auth ? state.auth.id : null)
);
export const getError = createSelector(rootReducer, (state: State) => state.error);
export const getLoading = createSelector(rootReducer, (state: State) => state.loading);
export const getPersisted = createSelector(rootReducer, (state: State) => {
  const persisted = { ...state };
  delete persisted.ready;
  return persisted;
});
export const getResetPassword = createSelector(rootReducer, (state: State) => state.resetPassword);
export const getLoggedInUser = createSelector(rootReducer, (state: State) => state.user);
export const getRoles = createSelector(rootReducer, (state: State) => state.roles);
export const isReady = createSelector(rootReducer, (state: State) => (state ? state.ready : false));
