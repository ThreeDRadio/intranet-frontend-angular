import { Component, computed, inject, input, OnInit } from "@angular/core";
import { LoggerStore } from "../../store";
import { PlaylistHeaderComponent } from "../../components/playlist-header/playlist-header.component";

@Component({
  selector: "app-show-playlists",
  imports: [PlaylistHeaderComponent],
  templateUrl: "./show-playlists.html",
  styleUrl: "./show-playlists.scss",
})
export class ShowPlaylistsPage implements OnInit {
  loggerStore = inject(LoggerStore);

  readonly id = input.required<number, string>({
    transform: (value: string) => Number(value),
  });
  readonly show = computed(
    () => this.loggerStore.showById()(this.id()) ?? undefined,
  );
  playlists = computed(() => {
    return this.loggerStore.playlists().filter((p) => p.show === this.id());
  });

  ngOnInit() {
    this.loggerStore.fetchPlaylistsForShow(this.id());
  }
}
