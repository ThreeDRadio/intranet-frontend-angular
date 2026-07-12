import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-restart-modal',
  template: `
    <h2 mat-dialog-title>An Error has occurred</h2>
    <mat-dialog-content
      >An unexpected error has occurred and the Catalogue needs to reload. We apologise for this
      inconvenience. This error has been reported. Maybe send Michael a message</mat-dialog-content
    >
    <mat-dialog-actions>
      <button mat-button (click)="close()" mat-dialog-close>Reload</button>
    </mat-dialog-actions>
  `
})
export class RestartModalComponent {
  constructor(private ref: MatDialogRef<RestartModalComponent>) {}

  close() {
    console.log('close');
    this.ref.close();
  }
}
