import { Component, inject } from "@angular/core";
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

@Component({
  selector: "app-playlist-catalogue-recent",
  imports: [
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
  templateUrl: "./playlist-catalogue-recent.html",
  styleUrl: "./playlist-catalogue-recent.scss",
})
export class PlaylistCatalogueRecent {
  searchStore = inject(SearchStore);
  pageSizes = [10, 20, 50, 100];
  offset = 0;
  pageSize = 10;
}
