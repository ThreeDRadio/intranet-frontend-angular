import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from "@angular/core";
import { LoggerStore } from "../../store";
import { PlaylistHeaderComponent } from "../../components/playlist-header/playlist-header.component";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { ShowService } from "../../services/show.service";
import { BaseChartDirective } from "ng2-charts";
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
import { ChartConfiguration } from "chart.js";

@Component({
  selector: "app-show-playlists",
  imports: [
    PlaylistHeaderComponent,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    BaseChartDirective,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: "./show-playlists.html",
  styleUrl: "./show-playlists.scss",
})
export class ShowPlaylistsPage implements OnInit {
  showService = inject(ShowService);
  loggerStore = inject(LoggerStore);

  readonly id = input.required<number, string>({
    transform: (value: string) => Number(value),
  });
  readonly show = computed(
    () => this.loggerStore.showById()(this.id()) ?? undefined,
  );
  readonly playlists = computed(
    () => this.loggerStore.playlistsByShow()(this.id()) ?? [],
  );

  // Stats
  readonly topArtists = computed(() => {
    return this.loggerStore.statsByShow()(this.id())?.topArtists;
  });
  readonly statsLabels = computed(
    () =>
      this.loggerStore
        .statsByShow()(this.id())
        ?.statistics.map((s) => s.name) ?? [],
  );
  readonly statsValues = computed(
    () =>
      this.loggerStore
        .statsByShow()(this.id())
        ?.statistics.map((s) => s.value) ?? [],
  );

  readonly stats = computed(() => {
    return {
      labels: this.statsLabels(),
      datasets: [
        {
          data: this.statsValues(),
          label: "Tracks",
          backgroundColor: "#3f51b5", // Angular Material Primary Indigo
        },
      ],
    };
  });

  // Bar charts for stats
  public statsOptions: ChartConfiguration<"bar">["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: { min: 0 },
    },
  };

  ngOnInit() {
    const showId = this.id();
    this.loggerStore.fetchShow(showId);
    this.loggerStore.fetchShowStatistics(showId);
    this.loggerStore.fetchPlaylistsForShow(showId);
  }
}
