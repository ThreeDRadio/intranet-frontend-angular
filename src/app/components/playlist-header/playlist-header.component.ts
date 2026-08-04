import { Component, computed, inject, input } from "@angular/core";
import { Playlist } from "../../models";
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
import moment from "moment-timezone";
import { LoggerStore } from "../../store";
import { RouterLink } from "@angular/router";

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
  ],
  templateUrl: "./playlist-header.component.html",
  styleUrl: "./playlist-header.component.scss",
})
export class PlaylistHeaderComponent {
  store = inject(LoggerStore);

  readonly playlist = input.required<Playlist>();
  readonly show = computed(() => this.store.showById()(this.playlist().show));

  readonly formattedDate = computed(() =>
    moment(this.playlist().date).format("dddd, MMMM Do YYYY"),
  );
}
