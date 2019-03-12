import { Inject, Injectable, InjectionToken, Optional, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { RestartModalComponent } from '../components/restart-modal/restart-modal.component';

@Injectable()
export class AppRestartService {
  ref: MatDialogRef<any>;
  constructor(private dialog: MatDialog, private zone: NgZone) {}
  /**
   * Hard restarts the app immediately
   */
  public restartNow() {
    window.location.reload();
  }

  public requestRestart() {
    this.zone.run(() => {
      this.ref = this.dialog.open(RestartModalComponent);

      this.ref.afterClosed().subscribe(() => {
        console.log('closed');
        window.location.reload();
      });
    });
  }
}
