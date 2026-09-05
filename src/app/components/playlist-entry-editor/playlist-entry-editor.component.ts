import {
  Component,
  input,
  output,
  OnInit,
  signal,
  inject,
  effect,
  computed,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { PlaylistEntry } from "../../models/playlist-entry";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { map, merge } from "rxjs";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { DurationService } from "../../services/duration.service";
import moment from "moment-timezone";
import { CdkDrag, CdkDragHandle } from "@angular/cdk/drag-drop";
import { toSignal } from "@angular/core/rxjs-interop";

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
    CdkDrag,
    CdkDragHandle,
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
  form = new FormGroup({
    song: new FormControl("", [Validators.required]),
    artist: new FormControl("", [Validators.required]),
    album: new FormControl("", [Validators.required]),
    duration: new FormControl(""),
  });

  // Convert the above to signals.
  private formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  // Signals
  readonly canBeSaved = computed(() => {
    // Just trigger on any value change.
    const current = this.formValue();

    const valid =
      this.form.valid && this.durationService.validate(current.duration ?? "");

    if (!valid) return false;
    // Valid and not identical.
    return !this.isIdenticalTo(this.input(), this.getOutput());
  });

  readonly canBeUndone = computed(() => {
    this.formValue();
    return !this.isIdenticalTo(this.input(), this.getOutput());
  });

  readonly canBeCleared = computed(() => {
    this.formValue();
    return !this.isIdenticalTo(this.input(), this.getOutput());
  });

  // Quota checks
  quotas = signal({
    local: false,
    australian: false,
    female: false,
    newRelease: false,
  });

  getOutput() {
    return {
      ...this.input(),
      title: this.form.controls.song.value ?? "",
      artist: this.form.controls.artist.value ?? "",
      album: this.form.controls.album.value ?? "",
      duration: this.durationService.parse(
        this.form.controls.duration.value ?? "00:00:00",
      ),
      local: this.quotas().local,
      australian: this.quotas().australian,
      female: this.quotas().female,
      newRelease: this.quotas().newRelease,
    };
  }

  ngOnInit() {
    const initialData = this.input();
    this.setTo(initialData);
  }

  // Updates the form to match the given input.
  setTo(value) {
    this.form.controls.song.setValue(value.title || "");
    this.form.controls.artist.setValue(value.artist || "");
    this.form.controls.album.setValue(value.album || "");
    this.form.controls.duration.setValue(value.duration || "");
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

  onQuotaChanged(event, type) {
    this.quotas.set({
      ...this.quotas(),
      [type]: event.checked,
    });
  }

  creating() {
    return this.action() === "create";
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
