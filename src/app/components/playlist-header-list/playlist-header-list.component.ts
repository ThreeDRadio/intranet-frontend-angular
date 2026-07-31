import { Component, input, Input } from "@angular/core";
import { Playlist } from "../../models/playlist";
import { PlaylistHeaderComponent } from "../playlist-header/playlist-header.component";

@Component({
  selector: "app-playlist-header-list",
  imports: [PlaylistHeaderComponent],
  templateUrl: "./playlist-header-list.component.html",
  styleUrl: "./playlist-header-list.component.scss",
})
export class PlaylistHeaderListComponent {
  @Input()
  isLoading: boolean;
  @Input()
  playlists: Playlist[];
}
