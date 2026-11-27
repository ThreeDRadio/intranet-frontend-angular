import {
  Component,
  computed,
  signal,
  inject,
  effect,
  input,
  output,
  OnInit,
} from "@angular/core";
import { Show } from "../../models/show";
import { Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
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
import { ShowService } from "../../services/show.service";
import { Playlist } from "../../models";

export interface PlaylistDetails {
  show: Show;
  host: string;
  fillIn: boolean;
  date: string;
  notes: string;
}

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
export class PlaylistDetailsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private showService = inject(ShowService);

  // I/O
  show = input<Show>();
  playlist = input<Playlist>();
  shows = input.required<Show[]>();
  submitted = output<PlaylistDetails>();

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
  new = computed(() => !this.show() && !this.playlist());

  filteredShows = computed(() => {
    return this.showService.filter(
      this.rawQuery().trim().toLowerCase(),
      this.shows(),
    );
  });

  constructor() {
    effect(() => {
      this.rawQuery.set("");

      this.form.controls.hostControl.valueChanges.subscribe((host) => {
        this.syncFillInState(this.form.controls.showControl.value, host ?? "");
      });
    });
  }

  ngOnInit(): void {
    const inputShow = this.show();
    const inputPlaylist = this.playlist();

    if (inputShow && inputPlaylist) {
      const inputHost = inputPlaylist?.host ?? "";
      this.form.controls.showControl.setValue(inputShow);
      this.form.controls.hostControl.setValue(inputHost);
      this.form.controls.fillInControl.setValue(
        inputPlaylist?.fillin ? "yes" : "no",
      );
      this.form.controls.dateControl.setValue(moment(inputPlaylist?.date));
      this.form.controls.notesControl.setValue(inputPlaylist?.notes);
      this.syncFillInState(inputShow, inputHost);
    } else {
      this.syncFillInState(null, "");
    }
  }

  private syncFillInState(show: Show | null | undefined, host: string): void {
    const fillInCtrl = this.form.controls.fillInControl;
    const shouldShow =
      show !== null &&
      show !== undefined &&
      host !== "" &&
      this.showService.isDifferentHost(host, show);
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
    this.submitted.emit({
      show: this.form.controls.showControl.value,
      host: this.form.controls.hostControl.value,
      fillIn:
        this.isFillInVisible() &&
        this.form.controls.fillInControl.value === "yes"
          ? true
          : false,
      date: moment(this.form.controls.dateControl.value).format("YYYY-MM-DD"),
      notes: this.form.controls.notesControl.value ?? "",
    });
  }
}
