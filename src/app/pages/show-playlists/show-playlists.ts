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

  // Bar charts for stats
  public statsOptions: ChartConfiguration<"bar">["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: { min: 0 },
    },
  };

  // return {
  //   labels: [
  //     "Total tracks",
  //     "Unique Artists",
  //     "Local",
  //     "Australian",
  //     "Female",
  //   ],
  //   datasets: [
  //     {
  //       data: [65, 59, 80, 81, 1],
  //       backgroundColor: "#3f51b5", // Angular Material Primary Indigo
  //     },
  //   ],
  // };

  ngOnInit() {
    this.loggerStore.fetchPlaylistsForShow(this.id());
  }
}
