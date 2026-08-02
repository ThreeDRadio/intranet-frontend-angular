import { Component, inject, Input } from "@angular/core";
import { Playlist } from "../../models/playlist";
import { LoggerStore } from "../../store";
import { ActivatedRoute } from "@angular/router";
import { PlaylistService } from "../../services/playlist.service";
import { ShowService } from "../../services/show.service";

@Component({
  selector: "app-playlist-page",
  imports: [],
  providers: [LoggerStore, PlaylistService, ShowService],
  templateUrl: "./playlist.component.html",
  styleUrl: "./playlist.component.scss",
})
export class PlaylistPageComponent {
  @Input()
  playlist: Playlist;

  private store = inject(LoggerStore);

  constructor(private route: ActivatedRoute) {
    console.log(route);
  }
}
