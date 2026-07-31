import { Component, inject } from "@angular/core";
import { PlaylistStore } from "../../store";
import { PlaylistService } from "../../services/playlist.service";
import { PlaylistHeaderListComponent } from "../../components/playlist-header-list/playlist-header-list.component";

@Component({
  selector: "app-recent-playlists",
  imports: [PlaylistHeaderListComponent],
  providers: [PlaylistStore, PlaylistService],
  templateUrl: "./recent-playlists.component.html",
  styleUrl: "./recent-playlists.component.scss",
})
export class RecentPlaylistsPageComponent {
  store = inject(PlaylistStore);
  page: number = 1;

  ngOnInit() {
    this.store.getPlaylists(this.page);
  }
}
