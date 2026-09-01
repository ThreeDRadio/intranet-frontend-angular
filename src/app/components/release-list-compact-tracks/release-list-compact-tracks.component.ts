import { Component, computed, inject, input, OnInit } from "@angular/core";
import { ReleaseStore } from "../../store/release.store";
import { MatListModule } from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { DurationService } from "../../services/duration.service";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { QuotaCheckInformationalComponent } from "../quota-check-informational/quota-check-informational.component";

@Component({
  selector: "app-release-list-compact-tracks",
  imports: [
    QuotaCheckInformationalComponent,
    MatListModule,
    MatProgressBarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [DurationService],
  templateUrl: "./release-list-compact-tracks.component.html",
  styleUrl: "./release-list-compact-tracks.component.scss",
})
export class ReleaseListCompactTracksComponent {
  releaseId = input.required<number>();
  releaseStore = inject(ReleaseStore);
  durationService = inject(DurationService);
  trackColumns = [
    "tracknum",
    "tracktitle",
    "trackQuotas",
    "tracklength",
    "actions",
  ];

  release = computed(() => this.releaseStore.releaseForId()(this.releaseId()));

  tracklist = computed(() =>
    this.releaseStore.tracklistForId()(this.releaseId()),
  );
}
