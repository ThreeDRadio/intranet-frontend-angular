import { Component, Input } from "@angular/core";
import { Playlist } from "../../models/playlist";

@Component({
  selector: "app-playlist.component",
  imports: [],
  templateUrl: "./playlist.component.html",
  styleUrl: "./playlist.component.scss",
})
export class PlaylistComponent {
  @Input()
  playlist: Playlist;
}
