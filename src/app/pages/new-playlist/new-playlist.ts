import { Component, computed, effect, inject, OnInit } from "@angular/core";
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
import { Router } from "@angular/router";
import { NewPlaylist } from "../../models";

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
  router = inject(Router);

  readonly shows = computed(() =>
    this.store
      .shows()
      .filter((s) => s.active)
      .sort((a, b) => a.name.localeCompare(b.name)),
  );

  constructor() {
    effect(() => {
      const submission = this.store.playlistSubmission();
      if (submission?.state === "created") {
        // Kick off a clear of the playlist submission and go to the newly created playlist.
        this.store.clearPlaylistSubmission();
        this.router.navigate(["/playlists/edit", submission.id]);
      }
    });
  }

  ngOnInit(): void {
    this.store.fetchAllShows();
  }

  onSubmitted(event) {
    let result: NewPlaylist = {
      show: event.show.id,
      showname: "",
      host: event.host,
      date: event.date,
      notes: event.notes,
      complete: false,
      fillin: event.fillIn,
      femaleQuota: event.show.femaleQuota ?? 0,
      localQuota: event.show.localQuota ?? 0,
      australianQuota: event.show.australianQuota ?? 0,
    };
    this.store.createNewPlaylist(result);
  }
}
