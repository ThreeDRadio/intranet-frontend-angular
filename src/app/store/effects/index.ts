import { AuthEffects } from 'app/store/effects/auth.effects';
import { RouterEffects } from 'app/store/effects/router.effects';
import { StartupEffects } from 'app/store/effects/startup.effects';
import { MusicUploadEffects } from 'app/store/effects/music-upload.effects';

export const EFFECTS = [AuthEffects, RouterEffects, StartupEffects, MusicUploadEffects];
