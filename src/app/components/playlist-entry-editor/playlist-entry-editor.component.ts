import { Component, input, output, OnInit, signal } from "@angular/core";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { PlaylistEntry } from "../../models/playlist-entry";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { merge } from "rxjs";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

@Component({
  selector: "app-playlist-entry-editor",
  imports: [
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatIconButton,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: "./playlist-entry-editor.component.html",
  styleUrl: "./playlist-entry-editor.component.scss",
})
export class PlaylistEntryEditorComponent implements OnInit {
  input = input.required<PlaylistEntry>();
  action = input.required<string>();

  // Outputs
  deletion = output<number>();
  saved = output<PlaylistEntry>();
  cancelled = output<void>();
  undone = output<void>();

  // Form controls (for validation)
  songControl = new FormControl("", [Validators.required]);
  artistControl = new FormControl("", [Validators.required]);
  albumControl = new FormControl("", [Validators.required]);
  durationControl = new FormControl("", [Validators.required]);
  quotas = { local: false, aus: false, fem: false, nr: false };
  isFormValid: boolean = false;

  ngOnInit() {
    const initialData = this.input();
    this.songControl.setValue(initialData.title || "");
    this.artistControl.setValue(initialData.artist || "");
    this.albumControl.setValue(initialData.album || "");
    this.durationControl.setValue(initialData.duration || "");
    this.quotas = {
      local: initialData.local,
      aus: initialData.australian,
      fem: initialData.female,
      nr: initialData.newRelease,
    };

    // Listen to changes across all controls simultaneously
    merge(
      this.songControl.valueChanges,
      this.artistControl.valueChanges,
      this.albumControl.valueChanges,
      this.durationControl.valueChanges,
    ).subscribe(() => {
      // Update our validity flag whenever any field changes
      this.isFormValid =
        this.songControl.valid &&
        this.artistControl.valid &&
        this.albumControl.valid &&
        this.durationControl.valid;
    });
  }

  creating() {
    return this.action() === "create";
  }

  canSave() {
    return this.isFormValid;
  }

  save() {
    this.saved.emit({
      ...this.input(),
      title: this.songControl.value ?? "",
      artist: this.artistControl.value ?? "",
      album: this.albumControl.value ?? "",
      duration: this.durationControl.value ?? "",
      local: this.quotas.local,
      australian: this.quotas.aus,
      female: this.quotas.fem,
      newRelease: this.quotas.nr,
    });
  }

  onQuotaChanged(event, name: string) {
    switch (name.toLocaleLowerCase()) {
      case "local":
        this.quotas.local = !this.quotas.local;
        break;
      case "aus":
        this.quotas.aus = !this.quotas.aus;
        break;
      case "fem":
        this.quotas.fem = !this.quotas.fem;
        break;
      case "nr":
        this.quotas.nr = !this.quotas.nr;
        break;
    }
  }

  canUndo() {
    return false;
  }
}
