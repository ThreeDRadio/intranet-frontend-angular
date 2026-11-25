import {
  Component,
  computed,
  signal,
  OnInit,
  inject,
  ElementRef,
  viewChild,
  effect,
  input,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Show } from "../../models/show";
import { Router } from "@angular/router";
import { LoggerStore } from "../../store/logger.store";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import moment from "moment";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatOptionModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatError, MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSelectModule } from "@angular/material/select";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { NewPlaylist } from "../../models/playlist";
import { ShowService } from "../../services/show.service";

@Component({
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule,
    MatError,
    ReactiveFormsModule,
  ],
  selector: "app-playlist-details-form",
  styleUrl: "./playlist-details-form.scss",
  templateUrl: "./playlist-details-form.html",
})
export class PlaylistDetailsFormComponent {
  private fb = inject(FormBuilder);
  private showService = inject(ShowService);
  store = inject(LoggerStore);
  router = inject(Router);

  // Inputs
  show = input<Show>();
  shows = input.required<Show[]>();

  // Inputs
  private hostInput =
    viewChild.required<ElementRef<HTMLInputElement>>("hostInput");
  private dateInput =
    viewChild.required<ElementRef<HTMLInputElement>>("dateInput");

  // Forms
  newShowForm = new FormGroup({
    showControl: new FormControl<Show | undefined>(undefined, [
      Validators.required,
    ]),
    hostControl: new FormControl("", [Validators.required]),
    fillInControl: new FormControl(""),
    dateControl: new FormControl(moment(), [Validators.required]),
    notesControl: new FormControl(),
  });

  // Filtering
  // Handle user input in the show dropdown
  private rawQuery = signal("");

  onShowInput(event: { target: HTMLInputElement }) {
    const value = (event.target as HTMLInputElement).value;
    this.rawQuery.set(value);
  }

  onShowSelected(event: MatAutocompleteSelectedEvent) {
    const show = event.option.value;
    if (show) {
      this.newShowForm.controls.hostControl.setValue(show.defaultHost);
    }
  }

  getShowOptionDisplay = (show: Show | null): string => show?.name ?? "";
  filteredShows = computed(() => {
    return this.showService.filter(
      this.rawQuery().trim().toLowerCase(),
      this.shows(),
    );
  });
  // Fillin logic
  private readonly currentShowValue = toSignal(
    this.newShowForm.controls.showControl.valueChanges,
    {
      initialValue: this.newShowForm.controls.showControl.value,
    },
  );

  private readonly currentHostValue = toSignal(
    this.newShowForm.controls.hostControl.valueChanges,
    {
      initialValue: this.newShowForm.controls.hostControl.value,
    },
  );

  private readonly currentDateValue = toSignal(
    this.newShowForm.controls.dateControl.valueChanges,
    {
      initialValue: this.newShowForm.controls.dateControl.value,
    },
  );

  private readonly currentFillInValue = toSignal(
    this.newShowForm.controls.fillInControl.valueChanges,
    {
      initialValue: this.newShowForm.controls.fillInControl.value,
    },
  );

  // Form state
  readonly currentSubmitButtonText = computed(() => {
    if (this.store.playlistSubmission()?.state === "in-progress") {
      return "Creating...";
    }

    return "Let's go";
  });

  readonly isFillInVisible = computed(() => {
    const show = this.currentShowValue();
    const host = this.currentHostValue(); // This is just here to trigger the signal haha I don't know what I'm doing
    const actualHost = this.hostInput().nativeElement.value;

    if (show === null || show === undefined) return false;

    if (show.defaultHost === "") {
      return false;
    }

    return actualHost.toLowerCase() !== show.defaultHost.toLowerCase();
  });

  readonly isNewShowValid = computed(() => {
    const show = this.currentShowValue();
    const host = this.currentHostValue(); // This is just here to trigger the signal haha I don't know what I'm doing
    const date = this.currentDateValue(); // This is just here to trigger the signal haha I don't know what I'm doing
    const fillIn = this.currentFillInValue(); // This is just here to trigger the signal haha I don't know what I'm doing
    const actualHost = this.hostInput().nativeElement.value;
    const dateString = this.dateInput().nativeElement.value;
    const dateObj = this.newShowForm.controls.dateControl.value;
    const fillInValid =
      !this.isFillInVisible() ||
      (this.isFillInVisible() &&
        this.newShowForm.controls.fillInControl.value !== null &&
        this.newShowForm.controls.fillInControl.value !== "");

    const isSubmitting =
      this.store.playlistSubmission()?.state === "in-progress";

    return (
      show !== null &&
      show !== undefined &&
      actualHost !== null &&
      actualHost !== "" &&
      dateString !== null &&
      dateString !== "" &&
      moment(dateObj).isValid() &&
      fillInValid &&
      !isSubmitting
    );
  });

  constructor() {
    effect(() => {
      const submission = this.store.playlistSubmission();
      if (submission?.state === "created") {
        this.newShowForm.reset();
        // Kick off a clear of the playlist submission and go to the newly created playlist.
        this.store.clearPlaylistSubmission();
        this.router.navigate(["/playlists/edit", submission.id]);
      }
    });
  }

  onSubmit() {
    const show = this.currentShowValue();
    if (show === null || show === undefined) return;
    if (!this.newShowForm.valid) return;

    let result: NewPlaylist = {
      show: show.id,
      showname: "",
      host: this.hostInput().nativeElement.value,
      date: moment(this.newShowForm.controls.dateControl.value).format(
        "YYYY-MM-DD",
      ),
      notes: this.newShowForm.controls.notesControl.value,
      complete: false,
      fillin:
        this.isFillInVisible() &&
        this.newShowForm.controls.fillInControl.value === "yes"
          ? true
          : false,
      femaleQuota: show.femaleQuota ?? 0,
      localQuota: show.localQuota ?? 0,
      australianQuota: show.australianQuota ?? 0,
    };
    this.store.createNewPlaylist(result);
  }
}
