import { Component, inject, OnInit } from "@angular/core";
import { LoggerStore } from "../../store";
import { PlaylistService } from "../../services/playlist.service";
import { PlaylistHeaderListComponent } from "../../components/playlist-header-list/playlist-header-list.component";
import { ShowService } from "../../services/show.service";

@Component({
  selector: "app-recent-playlists",
  imports: [PlaylistHeaderListComponent],
  providers: [LoggerStore, PlaylistService, ShowService],
  templateUrl: "./recent-playlists.component.html",
  styleUrl: "./recent-playlists.component.scss",
})
export class RecentPlaylistsPageComponent implements OnInit {
  store = inject(LoggerStore);
  page: number = 1;

  ngOnInit() {
    this.store.fetchPlaylists(this.page);
  }
}
