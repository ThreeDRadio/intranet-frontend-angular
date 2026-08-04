import { Component, computed, inject, OnInit } from "@angular/core";
import { LoggerStore } from "../../store";
import moment from "moment";
import { PlaylistHeaderComponent } from "../../components/playlist-header/playlist-header.component";

@Component({
  selector: "app-recent-playlists",
  imports: [PlaylistHeaderComponent],
  //providers: [PlaylistService, ShowService],
  templateUrl: "./recent-playlists.component.html",
  styleUrl: "./recent-playlists.component.scss",
})
export class RecentPlaylistsPageComponent implements OnInit {
  store = inject(LoggerStore);
  page: number = 1;

  getFormattedDate(raw: string): string {
    return moment(raw).format("dddd, MMMM Do YYYY");
  }

  playlistsByDate = computed(() => {
    return this.store.playlistsByDate();
  });

  ngOnInit() {
    this.store.fetchPlaylists(this.page);
  }
}
