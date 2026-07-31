import { Component, computed, Input } from "@angular/core";
import { Playlist } from "../../models";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
} from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import moment from "moment-timezone";

@Component({
  selector: "app-playlist-header",
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardFooter,
    MatIcon,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: "./playlist-header.component.html",
  styleUrl: "./playlist-header.component.scss",
})
export class PlaylistHeaderComponent {
  @Input()
  playlist: Playlist;

  readonly formattedDate = computed(() =>
    moment(this.playlist.date).format("dddd, MMMM Do YYYY"),
  );
}
