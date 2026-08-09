import { Component, computed, inject, OnInit } from "@angular/core";
import { LoggerStore } from "../../store";
import { ActivatedRoute } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { DateService } from "../../services/date.service";
import { QuotaService } from "../../services/quota.service";
import { MatDividerModule } from "@angular/material/divider";
import moment from "moment";
import { QuotaDisplayComponent } from "../../components/quota-display/quota-display.component";
import { PlaylistEntryListComponent } from "../../components/playlist-entry-list/playlist-entry-list.component";

@Component({
  selector: "app-playlist-page",
  imports: [
    QuotaDisplayComponent,
    PlaylistEntryListComponent,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
  ],
  providers: [DateService, QuotaService],
  templateUrl: "./playlist.html",
  styleUrl: "./playlist.scss",
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
      localQuota: this.playlist()?.localQuota ?? 0,
      australianQuota: this.playlist()?.australianQuota ?? 0,
      femaleQuota: this.playlist()?.femaleQuota ?? 0,
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

  readonly totalDuration = computed(() => {
    const result = this.entries().reduce((acc, curr) => {
      return acc.add(moment.duration(curr.duration));
    }, moment.duration(0));
    return moment.utc(result.asMilliseconds()).format("HH:mm:ss");
  });

  ngOnInit() {
    this.store.fetchPlaylistEntries(this.playlist()?.id);
  }
}
