import { Component } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
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
  `,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class RestartModalComponent {
  constructor(private ref: MatDialogRef<RestartModalComponent>) {}

  close() {
    console.log('close');
    this.ref.close();
  }
}
