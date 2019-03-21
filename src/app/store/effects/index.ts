import { AuthEffects } from './auth.effects';
import { MusicUploadEffects } from './music-upload.effects';
import { RouterEffects } from './router.effects';
import { StartupEffects } from './startup.effects';
import { ReleaseEffects } from './release.effects';
import { TrackEffects } from './track.effects';
import { CommentEffects } from './comment.effects';

export const EFFECTS = [
  AuthEffects,
  CommentEffects,
  RouterEffects,
  StartupEffects,
  MusicUploadEffects,
  ReleaseEffects,
  TrackEffects
];
