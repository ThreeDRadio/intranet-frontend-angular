import { Component, inject, input, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { Track } from "../../models/track";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

@Component({
  selector: "app-add-from-catalogue-dialog",
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatButtonModule,
  ],
  templateUrl: "./add-from-catalogue-dialog.component.html",
  styleUrl: "./add-from-catalogue-dialog.component.scss",
})
export class AddFromCatalogueDialogComponent {
  track = input<Track>();
  quotas = signal({
    local: false,
    australian: false,
    female: false,
    newRelease: false,
  });
  public data = inject(MAT_DIALOG_DATA);

  onQuotaChanged(event, type) {
    this.quotas.set({
      ...this.quotas(),
      [type]: event.checked,
    });
  }
}
