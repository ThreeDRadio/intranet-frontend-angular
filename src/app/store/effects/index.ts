import { AuthEffects } from './auth.effects';
import { MusicUploadEffects } from './music-upload.effects';
import { RouterEffects } from './router.effects';
import { StartupEffects } from './startup.effects';

export const EFFECTS = [AuthEffects, RouterEffects, StartupEffects, MusicUploadEffects];
