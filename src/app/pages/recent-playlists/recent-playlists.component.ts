import { Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { PlaylistStore } from "../../store";
import { PlaylistService } from "../../services/playlist.service";

@Component({
  selector: "app-recent-playlists",
  imports: [],
  providers: [PlaylistStore, PlaylistService],
  templateUrl: "./recent-playlists.component.html",
  styleUrl: "./recent-playlists.component.scss",
})
export class RecentPlaylistsPageComponent {
  store = inject(PlaylistStore);

  constructor() {
    this.store.getRecentPlaylists();
  }
}
