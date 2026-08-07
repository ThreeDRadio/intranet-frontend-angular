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
import { MatOptionModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { LoggerStore } from "../../store";
import { MatInputModule } from "@angular/material/input";
import { Show } from "../../models/show";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-new-playlist",
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule,
  ],
  templateUrl: "./new-playlist.html",
  styleUrl: "./new-playlist.scss",
})
export class NewPlaylistPage implements OnInit {
  input = viewChild.required<ElementRef<HTMLInputElement>>("showInput");
  control = new FormControl("");
  store = inject(LoggerStore);

  readonly shows = computed(() =>
    this.store
      .shows()
      .filter((s) => s.active)
      .sort((a, b) => a.name.localeCompare(b.name)),
  );
  filteredShows = signal<Show[]>(this.shows().slice());

  filter(): void {
    const filterValue = this.input().nativeElement.value.toLowerCase();
    const startsWith = this.shows().filter((s) =>
      s.name.toLowerCase().startsWith(filterValue),
    );
    const includes = this.shows().filter(
      (s) =>
        !startsWith.includes(s) && s.name.toLowerCase().includes(filterValue),
    );
    this.filteredShows.set([...startsWith, ...includes]);
  }

  ngOnInit() {
    this.store.fetchAllShows();
  }
}
