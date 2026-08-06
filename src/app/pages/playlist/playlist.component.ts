import { Component, computed, inject, OnInit } from "@angular/core";
import { LoggerStore } from "../../store";
import { ActivatedRoute } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { DomSanitizer } from "@angular/platform-browser";
import { DateService } from "../../services/date.service";
import { QuotaService } from "../../services/quota.service";
import { QuotaIndicatorComponent } from "../../components/quota-indicator/quota-indicator.component";
import { MatDividerModule } from "@angular/material/divider";
import { DurationIndicatorComponent } from "../../components/duration-indicator/duration-indicator.component";

@Component({
  selector: "app-playlist-page",
  imports: [
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    QuotaIndicatorComponent,
    DurationIndicatorComponent,
  ],
  providers: [DateService, QuotaService],
  templateUrl: "./playlist.component.html",
  styleUrl: "./playlist.component.scss",
})
export class PlaylistPageComponent implements OnInit {
  store = inject(LoggerStore);
  dateService = inject(DateService);
  quotaService = inject(QuotaService);

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

  readonly quotas = computed(() => {
    const params = {
      localQuota: this.playlist()?.localQuota ?? -1,
      australianQuota: this.playlist()?.australianQuota ?? -1,
      femaleQuota: this.playlist()?.femaleQuota ?? -1,
    };
    const input = this.entries();

    return {
      local: this.quotaService.getLocalQuota(params, input),
      australian: this.quotaService.getAustralianQuota(params, input),
      female: this.quotaService.getFemaleQuota(params, input),
    };
  });

  readonly formattedDate = computed(() =>
    this.dateService.getDisplayDate(this.playlist()?.date ?? ""),
  );

  ngOnInit() {
    this.store.fetchPlaylistEntries(this.playlist()?.id);
  }
}
