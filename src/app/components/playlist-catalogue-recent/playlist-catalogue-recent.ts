import { Component, inject, OnInit, output } from "@angular/core";
import { SearchStore } from "../../store/search.store";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatAccordion, MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { ReleaseStore } from "../../store/release.store";
import { DurationService } from "../../services/duration.service";
import { QuotaCheckInformationalComponent } from "../quota-check-informational/quota-check-informational.component";

@Component({
  selector: "app-playlist-catalogue-recent",
  imports: [
    QuotaCheckInformationalComponent,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatAccordion,
    MatExpansionModule,
    MatListModule,
    MatProgressBarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [DurationService],
  templateUrl: "./playlist-catalogue-recent.html",
  styleUrl: "./playlist-catalogue-recent.scss",
})
export class PlaylistCatalogueRecent implements OnInit {
  searchStore = inject(SearchStore);
  releaseStore = inject(ReleaseStore);
  durationService = inject(DurationService);
  // Pagination
  pageSizes = [10, 20, 50, 100];
  offset = 0;
  pageSize = 10;
  // Table
  trackColumns = [
    "tracknum",
    "tracktitle",
    "trackQuotas",
    "tracklength",
    "actions",
  ];
  trackColumnsCompilation = [
    "tracknum",
    "trackartist",
    "tracktitle",
    "trackQuotas",
    "tracklength",
    "actions",
  ];
  // Actions
  addFromCatalogue = output();

  ngOnInit() {
    this.recentUploads();
  }

  recentUploads() {
    this.searchStore.recentlyUploaded({
      size: this.pageSize,
      offset: this.offset,
    });
  }

  paginationChange(event) {
    this.pageSize = event.pageSize;
    this.offset = event.pageIndex * this.pageSize;
    this.recentUploads();
  }

  onReleaseOpened(event) {
    this.releaseStore.fetchAllForId(event.id);
  }
}
