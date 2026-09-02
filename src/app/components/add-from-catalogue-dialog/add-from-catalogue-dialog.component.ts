import { Component, inject, input, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { Track } from "../../models/track";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DurationService } from "../../services/duration.service";

@Component({
  selector: "app-add-from-catalogue-dialog",
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [DurationService],
  templateUrl: "./add-from-catalogue-dialog.component.html",
  styleUrl: "./add-from-catalogue-dialog.component.scss",
})
export class AddFromCatalogueDialogComponent implements OnInit {
  track = input<Track>();
  album = input<string>();
  quotas = signal({
    local: false,
    australian: false,
    female: false,
    newRelease: false,
  });
  public data = inject(MAT_DIALOG_DATA);
  durationService = inject(DurationService);

  // Forms
  dialogTrackForm = new FormGroup({
    artistControl: new FormControl("", [Validators.required]),
    titleControl: new FormControl("", [Validators.required]),
    albumControl: new FormControl("", [Validators.required]),
    durationControl: new FormControl(),
  });

  ngOnInit(): void {
    this.dialogTrackForm.controls.artistControl.setValue(
      this.data.track.trackartist || "",
    );
    this.dialogTrackForm.controls.titleControl.setValue(
      this.data.track.tracktitle || "",
    );
    this.dialogTrackForm.controls.albumControl.setValue(this.data.album || "");
    this.dialogTrackForm.controls.durationControl.setValue(
      this.durationService.toReadableFromSeconds(this.data.track.tracklength) ||
        "0:00",
    );

    this.quotas.set({
      local: this.data.quotas.local,
      australian: this.data.quotas.australian,
      female: this.data.quotas.female,
      newRelease: this.data.quotas.newRelease,
    });
  }

  onQuotaChanged(event, type) {
    this.quotas.set({
      ...this.quotas(),
      [type]: event.checked,
    });
  }

  getOutput() {
    return {
      title: this.dialogTrackForm.controls.titleControl.value ?? "",
      artist: this.dialogTrackForm.controls.artistControl.value ?? "",
      album: this.dialogTrackForm.controls.albumControl.value ?? "",
      duration: this.durationService.parse(
        this.dialogTrackForm.controls.durationControl.value ?? "00:00:00",
      ),
      local: this.quotas().local,
      australian: this.quotas().australian,
      female: this.quotas().female,
      newRelease: this.quotas().newRelease,
    };
  }
}
