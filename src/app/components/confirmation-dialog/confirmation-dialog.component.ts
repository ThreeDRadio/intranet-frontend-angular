import { Component, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: "app-confirmation-dialog",
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: "./confirmation-dialog.component.html",
  styleUrl: "./confirmation-dialog.component.scss",
})
export class ConfirmationDialogComponent {
  title = input.required<string>();
  message = input.required<string>();
  public data = inject(MAT_DIALOG_DATA);
}
