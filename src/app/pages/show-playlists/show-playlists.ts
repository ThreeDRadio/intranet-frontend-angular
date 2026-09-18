import { Component, computed, inject, input, OnInit } from "@angular/core";
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
  playlists = computed(() => {
    return this.loggerStore.playlists().filter((p) => p.show === this.id());
  });
  readonly topArtists = computed(() => {
    return this.loggerStore.showStats()?.topArtists;
  });
  readonly stats = computed(() => {
    const fromStore = this.loggerStore.showStats()?.statistics;
    const labels = fromStore?.map((s) => s.name);
    const values = fromStore?.map((s) => s.value);
    return {
      labels,
      datasets: [
        {
          data: values,
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
    this.loggerStore.fetchShowStatistics(this.id());
    this.loggerStore.fetchPlaylistsForShow(this.id());
  }
}
