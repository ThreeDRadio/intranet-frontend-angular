import * as auth from './auth.reducer';
import * as releases from './release.reducer';
import * as MusicUpload from './music-upload.reducer';

export interface State {
  auth: auth.State;
  musicUpload: MusicUpload.State;
  releases: releases.ReleaseState;
}

export const REDUCER = {
  auth: auth.reducer,
  musicUpload: MusicUpload.reducer,
  releases: releases.reducer
};
