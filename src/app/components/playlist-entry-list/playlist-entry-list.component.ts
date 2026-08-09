import { Component, input } from "@angular/core";
import { Playlist } from "../../models/playlist";
import { PlaylistEntry } from "../../models/playlist-entry";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { QuotaCheckComponent } from "../quota-check/quota-check.component";

@Component({
  selector: "app-playlist-entry-list",
  imports: [MatCardModule, MatIconModule, QuotaCheckComponent],
  templateUrl: "./playlist-entry-list.component.html",
  styleUrl: "./playlist-entry-list.component.scss",
})
export class PlaylistEntryListComponent {
  playlist = input.required<Playlist>();
  entries = input.required<PlaylistEntry[]>();
  action = input<string>();
}
