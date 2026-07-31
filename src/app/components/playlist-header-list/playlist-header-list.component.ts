import { Component, input, Input } from "@angular/core";
import { PlaylistsByDate } from "../../models/playlist";
import { PlaylistHeaderComponent } from "../playlist-header/playlist-header.component";
import { MatDivider } from "@angular/material/divider";
import moment from "moment-timezone";

@Component({
  selector: "app-playlist-header-list",
  imports: [PlaylistHeaderComponent, MatDivider],
  templateUrl: "./playlist-header-list.component.html",
  styleUrl: "./playlist-header-list.component.scss",
})
export class PlaylistHeaderListComponent {
  @Input()
  isLoading: boolean;
  @Input()
  playlistsByDate: PlaylistsByDate;

  getFormattedDate(raw: string): string {
    return moment(raw).format("dddd, MMMM Do YYYY");
  }
}
