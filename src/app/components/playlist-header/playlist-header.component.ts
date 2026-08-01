import { Component, computed, inject, input, Input } from "@angular/core";
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
  ],
  providers: [LoggerStore],
  templateUrl: "./playlist-header.component.html",
  styleUrl: "./playlist-header.component.scss",
})
export class PlaylistHeaderComponent {
  store = inject(LoggerStore);

  @Input()
  playlist: Playlist;

  readonly formattedDate = computed(() =>
    moment(this.playlist.date).format("dddd, MMMM Do YYYY"),
  );

  ngOnInit() {
    this.store.fetchShow(this.playlist.show);
  }
}
