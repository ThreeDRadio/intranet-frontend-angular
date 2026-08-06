import { Component, computed, inject, OnInit } from "@angular/core";
import { LoggerStore } from "../../store";
import moment from "moment";
import { PlaylistHeaderComponent } from "../../components/playlist-header/playlist-header.component";
import { DateService } from "../../services/date.service";

@Component({
  selector: "app-recent-playlists",
  imports: [PlaylistHeaderComponent],
  providers: [DateService],
  templateUrl: "./recent-playlists.component.html",
  styleUrl: "./recent-playlists.component.scss",
})
export class RecentPlaylistsPageComponent implements OnInit {
  store = inject(LoggerStore);
  dateService = inject(DateService);
  page: number = 1;

  playlistsByDate = computed(() => {
    return this.store.playlistsByDate();
  });

  ngOnInit() {
    this.store.fetchPlaylists(this.page);
  }
}
