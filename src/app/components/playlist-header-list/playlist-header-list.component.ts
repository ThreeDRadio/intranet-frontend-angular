import { Component, input, Input } from "@angular/core";
import { Playlist } from "../../models/playlist";
import { PlaylistHeaderComponent } from "../playlist-header/playlist-header.component";
import { PlaylistsByDate } from "../../store";
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: "app-playlist-header-list",
  imports: [PlaylistHeaderComponent, MatDivider],
  templateUrl: "./playlist-header-list.component.html",
  styleUrl: "./playlist-header-list.component.scss",
})
export class PlaylistHeaderListComponent {
  @Input()
  isLoading: boolean;
  @Input()
  playlistsByDate: PlaylistsByDate;
}
