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
import { UserService } from "../../services/user.service";
import { Groups } from "../../constants";

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
  private _userService = inject(UserService);

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

  readonly stats = computed(() => {
    const fromData = this.loggerStore.statsByShow()(this.id());
    if (fromData?.isLoading) return;
    if (fromData?.statistics === undefined) return;

    const user = this._userService.getLoggedInUser();
    const targets = user?.groups?.includes(Groups.ProgrammingCommittee);

    // Build up the lists of data
    var labels = fromData.statistics.map((s) => s.name) ?? [];
    var datasets: any = [
      {
        data: fromData.statistics.map((s) => s.value) ?? [],
        label: "Tracks",
        backgroundColor: "#3f51b5", // Angular Material Primary Indigo
        order: 1,
      },
    ];

    if (targets) {
      datasets.push({
        label: "Targets",
        data: fromData.statistics.map((s) => s.target) ?? [],
        backgroundColor: "rgba(92, 184, 92, 0.5)",
        borderColor: "rgba(92, 184, 92, 1)",
        borderWidth: 2,
        borderDash: [2, 8], // Dotted border
        grouped: false, // Overlaps at the same X position
        order: 2, // Higher order draws first (behind)
        barPercentage: 0.8, // Optional: slightly wider so the border frames the front bar
      });
    }

    return {
      labels,
      datasets,
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
