import { Component, input } from "@angular/core";
import { Playlist } from "../../models/playlist";
import { PlaylistEntry } from "../../models/playlist-entry";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-playlist-entry-list",
  imports: [MatCardModule, MatIconModule],
  templateUrl: "./playlist-entry-list.component.html",
  styleUrl: "./playlist-entry-list.component.scss",
})
export class PlaylistEntryListComponent {
  playlist = input.required<Playlist>();
  entries = input.required<PlaylistEntry[]>();
  action = input<string>();
}
