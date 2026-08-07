import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
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
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";

export const LONG_DATE_FORMAT = {
  parse: {
    dateInput: "dddd, MMMM Do YYYY",
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
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: LONG_DATE_FORMAT },
  ],
  templateUrl: "./new-playlist.html",
  styleUrl: "./new-playlist.scss",
})
export class NewPlaylistPage implements OnInit {
  store = inject(LoggerStore);
  private showInput =
    viewChild.required<ElementRef<HTMLInputElement>>("showInput");
  private hostInput =
    viewChild.required<ElementRef<HTMLInputElement>>("hostInput");

  //Forms
  showControl = new FormControl();
  hostControl = new FormControl();
  dateControl = new FormControl(new Date());

  readonly shows = computed(() =>
    this.store
      .shows()
      .filter((s) => s.active)
      .sort((a, b) => a.name.localeCompare(b.name)),
  );
  filteredShows = signal<Show[]>(this.shows().slice());

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
}
