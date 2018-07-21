import { ReadyGuard } from './ready.guard';
import { AuthenticatedGuard } from './authenticated.guard';

export const GUARDS = [ReadyGuard, AuthenticatedGuard];
