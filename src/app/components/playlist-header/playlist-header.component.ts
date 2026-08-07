import { Component, computed, inject, input } from "@angular/core";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { RouterLink } from "@angular/router";

import { Playlist } from "../../models";
import { LoggerStore } from "../../store";
import { DateService } from "../../services/date.service";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: "app-playlist-header",
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatCardFooter,
    MatIcon,
    MatButtonModule,
    MatDividerModule,
    RouterLink,
    MatSelectModule,
    MatOptionModule,
    MatMenuModule,
  ],
  providers: [DateService],
  templateUrl: "./playlist-header.component.html",
  styleUrl: "./playlist-header.component.scss",
})
export class PlaylistHeaderComponent {
  store = inject(LoggerStore);
  dateService = inject(DateService);

  readonly playlist = input.required<Playlist>();
  readonly show = computed(() => this.store.showById()(this.playlist().show));

  readonly formattedDate = computed(() =>
    this.dateService.getDisplayDate(this.playlist()?.date ?? ""),
  );
}
