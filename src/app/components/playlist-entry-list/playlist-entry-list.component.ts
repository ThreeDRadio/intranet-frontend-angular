import { Component, input } from "@angular/core";
import { Playlist } from "../../models/playlist";
import { PlaylistEntry } from "../../models/playlist-entry";
import { PlaylistEntryComponent } from "../playlist-entry/playlist-entry.component";

@Component({
  selector: "app-playlist-entry-list",
  imports: [PlaylistEntryComponent],
  templateUrl: "./playlist-entry-list.component.html",
  styleUrl: "./playlist-entry-list.component.scss",
})
export class PlaylistEntryListComponent {
  playlist = input.required<Playlist>();
  entries = input.required<PlaylistEntry[]>();
  action = input<string>("view");
}
