import {routerReducer} from '@ngrx/router-store';
import * as Auth from './auth/auth.reducer';
import * as Release from './release/release.reducer';


export const REDUCERS = {
  release: Release.reducer,
  auth: Auth.reducer,
  router: routerReducer
};

export const EFFECTS = [];
