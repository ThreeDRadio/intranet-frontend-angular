import { Component, inject, Input, OnInit } from "@angular/core";
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
export class PlaylistPageComponent implements OnInit {
  store = inject(LoggerStore);
  id: number | null = -1;

  constructor(private route: ActivatedRoute) {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
  }

  ngOnInit() {}
}
