import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatOptionModule,
} from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { LoggerStore } from "../../store";
import { MatInputModule } from "@angular/material/input";
import { Show } from "../../models/show";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule, MatHint } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSelectModule } from "@angular/material/select";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import moment from "moment";
import { NewPlaylist, Playlist } from "../../models";
import { Router } from "@angular/router";
import { PlaylistService } from "../../services/playlist.service";
import { DATE_PIPE_DEFAULT_OPTIONS } from "@angular/common";

export const LONG_DATE_FORMAT = {
  parse: {
    dateInput: ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"],
  },
  display: {
    dateInput: "dddd, MMMM Do YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: "app-new-playlist",
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
    ReactiveFormsModule,
  ],
  providers: [
    PlaylistService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: LONG_DATE_FORMAT },
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: {
        timezone: "Australia/Adelaide", // Set component-specific timezone
        dateFormat: "shortTime", // Optional default format
      },
    },
  ],
  templateUrl: "./new-playlist.html",
  styleUrl: "./new-playlist.scss",
})
export class NewPlaylistPage implements OnInit {
  store = inject(LoggerStore);
  router = inject(Router);

  // Services
  playlistService = inject(PlaylistService);
  readonly shows = computed(() =>
    this.store
      .shows()
      .filter((s) => s.active)
      .sort((a, b) => a.name.localeCompare(b.name)),
  );

  // Inputs
  private showInput =
    viewChild.required<ElementRef<HTMLInputElement>>("showInput");
  private hostInput =
    viewChild.required<ElementRef<HTMLInputElement>>("hostInput");
  private dateInput =
    viewChild.required<ElementRef<HTMLInputElement>>("dateInput");

  // Forms
  newShowForm = new FormGroup({
    showControl: new FormControl(),
    hostControl: new FormControl(),
    fillInControl: new FormControl(),
    dateControl: new FormControl(new Date()),
    notesControl: new FormControl(),
  });

  // Filtering
  filteredShows = signal<Show[]>(this.shows().slice());

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

    if (show === null) {
      return false;
    }

    if (show.defaultHost === "") {
      return false;
    }

    return actualHost.toLowerCase() !== show.defaultHost.toLowerCase();
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

  ngOnInit() {
    this.store.fetchAllShows();
  }

  filter(): void {
    const filterValue = this.showInput().nativeElement.value.toLowerCase();
    const startsWith = this.shows().filter((s) =>
      s.name.toLowerCase().startsWith(filterValue),
    );
    const includes = this.shows().filter(
      (s) =>
        !startsWith.includes(s) && s.name.toLowerCase().includes(filterValue),
    );
    this.filteredShows.set([...startsWith, ...includes]);
  }

  showOptionDisplay(show: Show): string {
    return show?.name ?? "";
  }

  onShowSelected(event) {
    const show = event.option.value;

    if (show) {
      this.hostInput().nativeElement.value = show.defaultHost;
    }
  }

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
      actualHost !== null &&
      actualHost !== "" &&
      dateString !== null &&
      dateString !== "" &&
      moment(dateObj).isValid() &&
      fillInValid &&
      !isSubmitting
    );
  });

  onSubmit() {
    if (this.newShowForm.valid) {
      let result: NewPlaylist = {
        show: this.newShowForm.controls.showControl.value.id,
        showname: "",
        host: this.hostInput().nativeElement.value,
        date: moment(this.newShowForm.controls.dateControl.value).format(
          "YYYY-MM-DD",
        ),
        notes: this.newShowForm.controls.notesControl.value,
        complete: false,
        fillin:
          this.newShowForm.controls.fillInControl.value === "yes"
            ? true
            : false,
        femaleQuota:
          this.newShowForm.controls.showControl.value.femaleQuota ?? 0,
        localQuota: this.newShowForm.controls.showControl.value.localQuota ?? 0,
        australianQuota:
          this.newShowForm.controls.showControl.value.australianQuota ?? 0,
      };

      this.store.createNewPlaylist(result);
    }
  }
}
