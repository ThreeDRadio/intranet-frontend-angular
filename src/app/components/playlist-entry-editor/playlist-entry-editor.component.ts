import {
  Component,
  input,
  output,
  OnInit,
  signal,
  inject,
  computed,
} from "@angular/core";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { PlaylistEntry } from "../../models/playlist-entry";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { merge } from "rxjs";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { DurationService } from "../../services/duration.service";

@Component({
  selector: "app-playlist-entry-editor",
  imports: [
    MatInputModule,
    MatInput,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  providers: [DurationService],
  templateUrl: "./playlist-entry-editor.component.html",
  styleUrl: "./playlist-entry-editor.component.scss",
})
export class PlaylistEntryEditorComponent implements OnInit {
  private durationService = inject(DurationService);

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
  canBeSaved: boolean = false;
  canBeUndone: boolean = false;

  // Quota checks
  quotas = signal({
    local: false,
    australian: false,
    female: false,
    newRelease: false,
  });

  ngOnInit() {
    const initialData = this.input();
    this.songControl.setValue(initialData.title || "");
    this.artistControl.setValue(initialData.artist || "");
    this.albumControl.setValue(initialData.album || "");
    this.durationControl.setValue(initialData.duration || "");
    this.quotas.set({
      local: initialData.local,
      australian: initialData.australian,
      female: initialData.female,
      newRelease: initialData.newRelease,
    });

    // Listen to changes across all controls simultaneously
    merge(
      this.songControl.valueChanges,
      this.artistControl.valueChanges,
      this.albumControl.valueChanges,
      this.durationControl.valueChanges,
    ).subscribe(() => {
      // Update our validity flag whenever any field changes
      this.canBeSaved =
        this.songControl.valid &&
        this.artistControl.valid &&
        this.albumControl.valid &&
        this.durationControl.valid &&
        this.durationService.isValidDuration(this.durationControl.value ?? "");

      if (!this.creating()) {
        // Editing
        const identical = this.isIdenticalTo(this.input(), this.getOutput());
        this.canBeSaved = !identical;
        this.canBeUndone = !identical;
      }
    });
  }

  isIdenticalTo(original, current) {
    return (
      original.title.trim() === current.title.trim() &&
      original.artist.trim() === current.artist.trim() &&
      original.album.trim() === current.album.trim() &&
      original.duration.trim() === current.duration.trim() &&
      original.local === current.local &&
      original.australian === current.australian &&
      original.female === current.female &&
      original.newRelease === current.newRelease
    );
  }

  getOutput() {
    return {
      ...this.input(),
      title: this.songControl.value ?? "",
      artist: this.artistControl.value ?? "",
      album: this.albumControl.value ?? "",
      duration: this.durationControl.value ?? "",
      local: this.quotas().local,
      australian: this.quotas().australian,
      female: this.quotas().female,
      newRelease: this.quotas().newRelease,
    };
  }

  onQuotaChanged(event, type) {
    this.quotas.set({
      ...this.quotas(),
      [type]: event.checked,
    });
  }

  creating() {
    return this.action() === "create";
  }

  canSave() {
    return this.canBeSaved;
  }

  canUndo() {
    return this.canBeUndone;
  }

  save() {
    this.saved.emit(this.getOutput());
  }
}
