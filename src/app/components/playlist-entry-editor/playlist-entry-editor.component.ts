import {
  Component,
  input,
  output,
  OnInit,
  signal,
  inject,
  effect,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
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
import moment from "moment-timezone";

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
  shadow = input<boolean>(true);

  // Outputs
  deletion = output<number>();
  saved = output<PlaylistEntry>();
  cancelled = output<void>();
  undone = output<void>();

  // Form controls (for validation)
  songControl = new FormControl("", [Validators.required]);
  artistControl = new FormControl("", [Validators.required]);
  albumControl = new FormControl("", [Validators.required]);
  durationControl = new FormControl("");
  canBeSaved: boolean = false;
  canBeUndone: boolean = false;
  // Quota checks
  quotas = signal({
    local: false,
    australian: false,
    female: false,
    newRelease: false,
  });

  constructor() {
    effect(() => {
      // Whenever the parent store pushes new input data, reset the save flag
      this.input();

      if (!this.creating()) {
        this.canBeSaved = false;
        this.canBeUndone = false;
      }
    });
  }

  ngOnInit() {
    const initialData = this.input();
    this.setTo(initialData);

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
        this.durationService.validate(this.durationControl.value ?? "");

      if (!this.creating()) {
        // Editing
        const identical = this.isIdenticalTo(this.input(), this.getOutput());
        this.canBeSaved = this.canBeSaved && !identical;
        this.canBeUndone = !identical;
      }
    });
  }

  // Updates the form to match the given input.
  setTo(value) {
    this.songControl.setValue(value.title || "");
    this.artistControl.setValue(value.artist || "");
    this.albumControl.setValue(value.album || "");
    this.durationControl.setValue(value.duration || "");
    this.quotas.set({
      local: value.local,
      australian: value.australian,
      female: value.female,
      newRelease: value.newRelease,
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
      duration: this.durationService.parse(
        this.durationControl.value ?? "00:00:00",
      ),
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

    if (!this.creating()) {
      // Editing
      const identical = this.isIdenticalTo(this.input(), this.getOutput());
      this.canBeSaved = !identical;
      this.canBeUndone = !identical;
    }
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
    // Reset the UI
    if (this.creating()) {
      this.setTo(this.input());
    }
  }

  undo() {
    // Go back to the original input.
    this.setTo(this.input());
    this.undone.emit();
  }

  clear() {
    this.setTo(this.input());
    this.cancelled.emit();
  }
}
