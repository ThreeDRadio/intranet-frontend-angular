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
  router = inject(Router);

  // Inputs
  show = input<Show>();
  shows = input.required<Show[]>();

  // Forms
  form = this.fb.group({
    showControl: [undefined as Show | undefined, [Validators.required]],
    hostControl: ["", [Validators.required]],
    fillInControl: [""],
    dateControl: [moment(), [Validators.required]],
    notesControl: [null],
  });

  private rawQuery = signal("");
  protected isFillInVisible = signal(false);

  onShowInput(event: { target: HTMLInputElement }) {
    const value = (event.target as HTMLInputElement).value;
    this.rawQuery.set(value);
  }

  onShowSelected(event: MatAutocompleteSelectedEvent): void {
    const show: Show | null = event.option.value;
    if (show) {
      this.rawQuery.set(show.name);
      this.form.controls.hostControl.setValue(show.defaultHost);
    }
  }

  getShowOptionDisplay = (show: Show | null): string => show?.name ?? "";

  filteredShows = computed(() => {
    return this.showService.filter(
      this.rawQuery().trim().toLowerCase(),
      this.shows(),
    );
  });

  constructor() {
    effect(() => {
      this.rawQuery.set("");
      this.syncFillInState(null, "");

      this.form.controls.hostControl.valueChanges.subscribe((host) => {
        this.syncFillInState(this.form.controls.showControl.value, host ?? "");
      });
      // const submission = this.store.playlistSubmission();
      // if (submission?.state === "created") {
      //   this.form.reset();
      //   // Kick off a clear of the playlist submission and go to the newly created playlist.
      //   this.store.clearPlaylistSubmission();
      //   this.router.navigate(["/playlists/edit", submission.id]);
      // }
    });
  }

  private syncFillInState(show: Show | null | undefined, host: string): void {
    const fillInCtrl = this.form.controls.fillInControl;
    const shouldShow = this.showService.isDifferentHost(host, show);
    this.isFillInVisible.set(shouldShow);

    if (shouldShow) {
      fillInCtrl.setValidators([Validators.required]);
    } else {
      fillInCtrl.clearValidators();
      fillInCtrl.setValue(null, { emitEvent: false });
    }
    fillInCtrl.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit() {
    if (this.form.invalid) return;

    // let result: NewPlaylist = {
    //   show: show.id,
    //   showname: "",
    //   host: this.hostInput().nativeElement.value,
    //   date: moment(this.form.controls.dateControl.value).format("YYYY-MM-DD"),
    //   notes: this.form.controls.notesControl.value ?? "",
    //   complete: false,
    //   fillin:
    //     this.isFillInVisible() &&
    //     this.form.controls.fillInControl.value === "yes"
    //       ? true
    //       : false,
    //   femaleQuota: show.femaleQuota ?? 0,
    //   localQuota: show.localQuota ?? 0,
    //   australianQuota: show.australianQuota ?? 0,
    // };
    // this.store.createNewPlaylist(result);
  }
}
