import { Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-recent-playlists",
  imports: [],
  templateUrl: "./recent-playlists.component.html",
  styleUrl: "./recent-playlists.component.scss",
})
export class RecentPlaylistsPageComponent {
  private store: Store<any> = inject(Store);

  constructor() {}
}
