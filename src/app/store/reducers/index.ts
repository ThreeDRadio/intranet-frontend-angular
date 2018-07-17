import * as auth from './auth.reducer';
import * as MusicUpload from './music-upload.reducer';

export interface State {
  auth: auth.State;
  musicUpload: MusicUpload.State;
}

export const REDUCER = {
  auth: auth.reducer,
  musicUpload: MusicUpload.reducer
};
