import { Component, computed, inject, input } from "@angular/core";
import { Release } from "../../models/release";
import { MatAccordion, MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { ReleaseStore } from "../../store/release.store";
import { ReleaseListCompactTracksComponent } from "../release-list-compact-tracks/release-list-compact-tracks.component";
import { DurationService } from "../../services/duration.service";
import { QuotaCheckInformationalComponent } from "../quota-check-informational/quota-check-informational.component";
import { MatListModule } from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-release-list-compact",
  imports: [
    ReleaseListCompactTracksComponent,
    QuotaCheckInformationalComponent,
    MatAccordion,
    MatExpansionModule,
    MatListModule,
    MatProgressBarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [DurationService],
  templateUrl: "./release-list-compact.component.html",
  styleUrl: "./release-list-compact.component.scss",
})
export class ReleaseListCompactComponent {
  releases = input.required<Release[]>();
  releaseStore = inject(ReleaseStore);
  durationService = inject(DurationService);
  trackColumns = [
    "tracknum",
    "tracktitle",
    "trackQuotas",
    "tracklength",
    "actions",
  ];

  onReleaseOpened(event) {
    this.releaseStore.fetchAllForId(event.id);
  }
}
