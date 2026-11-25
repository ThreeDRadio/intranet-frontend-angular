import { Component, computed, inject, OnInit } from "@angular/core";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { PlaylistService } from "../../services/playlist.service";
import { DATE_PIPE_DEFAULT_OPTIONS } from "@angular/common";
import { LONG_DATE_FORMAT } from "../../constants";
import { PlaylistDetailsFormComponent } from "../../components/playlist-details-form/playlist-details-form";
import { LoggerStore } from "../../store";

@Component({
  selector: "app-new-playlist",
  imports: [PlaylistDetailsFormComponent],
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

  readonly shows = computed(() =>
    this.store
      .shows()
      .filter((s) => s.active)
      .sort((a, b) => a.name.localeCompare(b.name)),
  );

  ngOnInit(): void {
    this.store.fetchAllShows();
  }
}
