import { Component, computed, inject, Input, OnInit } from "@angular/core";
import { LoggerStore } from "../../store";
import { ActivatedRoute } from "@angular/router";
import { PlaylistService } from "../../services/playlist.service";
import { ShowService } from "../../services/show.service";
import moment from "moment";

@Component({
  selector: "app-playlist-page",
  imports: [],
  templateUrl: "./playlist.component.html",
  styleUrl: "./playlist.component.scss",
})
export class PlaylistPageComponent {
  store = inject(LoggerStore);
  private route = inject(ActivatedRoute);
  readonly playlist = computed(() =>
    this.store.playlistById()(Number(this.route.snapshot.paramMap.get("id"))),
  );
  readonly show = computed(
    () => this.store.showById()(this.playlist().show) ?? undefined,
  );
  readonly formattedDate = computed(() =>
    moment(this.playlist().date).format("dddd, MMMM Do YYYY"),
  );
}
