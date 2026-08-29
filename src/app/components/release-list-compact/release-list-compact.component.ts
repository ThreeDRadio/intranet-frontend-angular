import { Component, computed, inject, input } from "@angular/core";
import { Release } from "../../models/release";
import { MatAccordion, MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { ReleaseStore } from "../../store/release.store";
import { ReleaseListCompactTracksComponent } from "../release-list-compact-tracks/release-list-compact-tracks.component";

@Component({
  selector: "app-release-list-compact",
  imports: [
    ReleaseListCompactTracksComponent,
    MatAccordion,
    MatExpansionModule,
    MatIconModule,
  ],
  templateUrl: "./release-list-compact.component.html",
  styleUrl: "./release-list-compact.component.scss",
})
export class ReleaseListCompactComponent {
  releases = input.required<Release[]>();
  releaseStore = inject(ReleaseStore);

  onReleaseOpened(event) {
    this.releaseStore.fetchTracksForId(event.id);
  }
}
