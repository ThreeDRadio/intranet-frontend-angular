import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: "app-new-playlist",
  imports: [MatMenuModule, MatButtonModule],
  templateUrl: "./new-playlist.html",
  styleUrl: "./new-playlist.scss",
})
export class NewPlaylistPage {}
