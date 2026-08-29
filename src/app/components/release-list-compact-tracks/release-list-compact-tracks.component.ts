import { Component, computed, inject, input, OnInit } from "@angular/core";
import { ReleaseStore } from "../../store/release.store";
import { MatListModule } from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({
  selector: "app-release-list-compact-tracks",
  imports: [MatListModule, MatProgressBarModule],
  templateUrl: "./release-list-compact-tracks.component.html",
  styleUrl: "./release-list-compact-tracks.component.scss",
})
export class ReleaseListCompactTracksComponent {
  release = input.required<number>();
  releaseStore = inject(ReleaseStore);

  tracklist = computed(() =>
    this.releaseStore.tracklistForId()(this.release()),
  );
}
