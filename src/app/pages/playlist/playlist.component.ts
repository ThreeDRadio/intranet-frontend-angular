import { Component, computed, inject, OnInit } from "@angular/core";
import { LoggerStore } from "../../store";
import { ActivatedRoute } from "@angular/router";
import { CdkDrag, DragDropModule } from "@angular/cdk/drag-drop";
import moment from "moment";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-playlist-page",
  imports: [MatTableModule, MatIconModule, MatChipsModule],
  templateUrl: "./playlist.component.html",
  styleUrl: "./playlist.component.scss",
})
export class PlaylistPageComponent implements OnInit {
  store = inject(LoggerStore);
  displayedColumns: string[] = [
    "index",
    "artist",
    "track",
    "album",
    "duration",
    "local",
    "australian",
    "female",
    "newRelease",
  ];
  private route = inject(ActivatedRoute);

  readonly playlist = computed(() =>
    this.store.playlistById()(Number(this.route.snapshot.paramMap.get("id"))),
  );

  readonly show = computed(
    () => this.store.showById()(this.playlist().show) ?? undefined,
  );

  readonly entries = computed(() =>
    this.store.playlistEntriesById()(this.playlist()?.id),
  );

  readonly formattedDate = computed(() =>
    moment(this.playlist()?.date).format("dddd, MMMM Do YYYY"),
  );

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      "sa-icon",
      sanitizer.bypassSecurityTrustResourceUrl("assets/sa.svg"),
    );
    iconRegistry.addSvgIcon(
      "aus-icon",
      sanitizer.bypassSecurityTrustResourceUrl("assets/aus.svg"),
    );
  }

  ngOnInit() {
    this.store.fetchPlaylistEntries(this.playlist()?.id);
  }
}
