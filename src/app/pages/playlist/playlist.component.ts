import { Component, computed, inject, OnInit } from "@angular/core";
import { LoggerStore } from "../../store";
import { ActivatedRoute } from "@angular/router";
import moment from "moment";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { DomSanitizer } from "@angular/platform-browser";
import { DateService } from "../../services/date.service";

@Component({
  selector: "app-playlist-page",
  imports: [MatTableModule, MatIconModule, MatChipsModule],
  providers: [DateService],
  templateUrl: "./playlist.component.html",
  styleUrl: "./playlist.component.scss",
})
export class PlaylistPageComponent implements OnInit {
  store = inject(LoggerStore);
  dateService = inject(DateService);

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
    this.dateService.getDisplayDate(this.playlist()?.date ?? ""),
  );

  getQuotaCount(type: string): number {
    if (type.toLocaleLowerCase() === "local") {
      return this.entries().filter((e) => e.local).length;
    }
    if (type.toLocaleLowerCase() === "aus") {
      return this.entries().filter((e) => e.australian).length;
    }
    if (type.toLocaleLowerCase() === "female") {
      return this.entries().filter((e) => e.female).length;
    }

    return 0;
  }

  getQuotaMinimum(type: string): number {
    let quota: number = 0;

    if (type.toLocaleLowerCase() === "local") {
      quota = this.playlist()?.localQuota ?? 0;
    }
    if (type.toLocaleLowerCase() === "aus") {
      quota = this.playlist()?.australianQuota ?? 0;
    }
    if (type.toLocaleLowerCase() === "female") {
      quota = this.playlist()?.femaleQuota ?? 0;
    }

    const percentage = quota / 100.0;
    return Math.round(this.entries().length * percentage);
  }

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
