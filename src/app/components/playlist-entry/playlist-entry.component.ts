import { Component, input } from "@angular/core";
import { PlaylistEntry } from "../../models/playlist-entry";
import { QuotaCheckComponent } from "../quota-check/quota-check.component";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-playlist-entry",
  imports: [MatCardModule, MatIconModule, QuotaCheckComponent],
  templateUrl: "./playlist-entry.component.html",
  styleUrl: "./playlist-entry.component.scss",
})
export class PlaylistEntryComponent {
  input = input.required<PlaylistEntry>();
  action = input<string>("view");
}
