import { Component, inject, input, OnDestroy, output } from "@angular/core";
import { SearchStore } from "../../store/search.store";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { QuotaCheckInformationalComponent } from "../quota-check-informational/quota-check-informational.component";
import { MatAccordion, MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { ReleaseStore } from "../../store/release.store";
import { DurationService } from "../../services/duration.service";
import { Track } from "../../models/track";

@Component({
  selector: "app-playlist-catalogue-finder",
  imports: [
    QuotaCheckInformationalComponent,
    ReactiveFormsModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
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
  templateUrl: "./playlist-catalogue-finder.component.html",
  styleUrl: "./playlist-catalogue-finder.component.scss",
})
export class QuickSearchComponent implements OnDestroy {
  searchStore = inject(SearchStore);
  releaseStore = inject(ReleaseStore);
  durationService = inject(DurationService);
  // Paginator settings
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
  // Actions
  addFromCatalogue = output<Track>();

  form = new UntypedFormGroup({
    search: new UntypedFormControl("", Validators.required),
  });

  quickSearch() {
    if (this.form.valid) {
      this.searchStore.quickSearch({
        term: this.form.controls.search.value,
        size: this.pageSize,
        offset: this.offset,
      });
    }
  }

  paginationChange(event) {
    this.pageSize = event.pageSize;
    this.offset = event.pageIndex * this.pageSize;
    this.quickSearch();
  }

  onReleaseOpened(event) {
    this.releaseStore.fetchAllForId(event.id);
  }

  ngOnDestroy() {
    this.searchStore.clearSearch();
  }
}
