import { Component, computed, inject, input, OnInit } from "@angular/core";
import { ReleaseStore } from "../../store/release.store";
import { MatListModule } from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { QuotaCheckComponent } from "../quota-check/quota-check.component";
import { MatIconModule } from "@angular/material/icon";
import { DurationService } from "../../services/duration.service";

@Component({
  selector: "app-release-list-compact-tracks",
  imports: [
    MatListModule,
    MatProgressBarModule,
    QuotaCheckComponent,
    MatIconModule,
  ],
  providers: [DurationService],
  templateUrl: "./release-list-compact-tracks.component.html",
  styleUrl: "./release-list-compact-tracks.component.scss",
})
export class ReleaseListCompactTracksComponent {
  release = input.required<number>();
  releaseStore = inject(ReleaseStore);
  durationService = inject(DurationService);

  tracklist = computed(() =>
    this.releaseStore.tracklistForId()(this.release()),
  );
}
