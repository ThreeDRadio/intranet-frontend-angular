import { Component, input } from "@angular/core";

@Component({
  selector: "app-release-list-compact-tracks",
  imports: [],
  templateUrl: "./release-list-compact-tracks.component.html",
  styleUrl: "./release-list-compact-tracks.component.scss",
})
export class ReleaseListCompactTracksComponent {
  release = input.required<number>();
}
