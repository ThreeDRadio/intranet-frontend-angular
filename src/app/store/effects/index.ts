import { AuthEffects } from './auth.effects';
import { MusicUploadEffects } from './music-upload.effects';
import { RouterEffects } from './router.effects';
import { StartupEffects } from './startup.effects';
import { ReleaseEffects } from './release.effects';
import { TrackEffects } from './track.effects';

export const EFFECTS = [
  AuthEffects,
  RouterEffects,
  StartupEffects,
  MusicUploadEffects,
  ReleaseEffects,
  TrackEffects
];
