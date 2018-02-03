import { ReadyGuard } from './ready.guard';
import { AuthenticatedGuard } from 'app/guards/authenticated.guard';

export const GUARDS = [ReadyGuard, AuthenticatedGuard];
