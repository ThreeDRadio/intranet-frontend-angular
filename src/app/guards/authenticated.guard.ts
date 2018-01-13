import { CanActivate } from '@angular/router/src/interfaces';

export class AuthenticatedGuard implements CanActivate {
  canActivate(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
