import * as auth from './auth.reducer';
import * as comments from './comment.reducer';
import * as player from './player.reducer';
import * as releases from './release.reducer';
import * as tracks from './track.reducer';
import * as MusicUpload from './music-upload.reducer';

export interface State {
  auth: auth.State;
  comments: comments.CommentState;
  musicUpload: MusicUpload.State;
  player: player.State;
  releases: releases.ReleaseState;
  tracks: tracks.TrackState;
}

export const REDUCER = {
  auth: auth.reducer,
  comments: comments.reducer,
  musicUpload: MusicUpload.reducer,
  player: player.reducer,
  releases: releases.reducer,
  tracks: tracks.reducer
};
