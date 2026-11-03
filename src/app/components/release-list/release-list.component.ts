import {
  Component,
  viewChild,
  input,
  output,
  inject,
  computed,
} from "@angular/core";
import { Release } from "app/models/release";
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from "@angular/material/table";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import { MatChipsModule } from "@angular/material/chips";
import { DatePipe } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { SortService } from "../../services/sort.service";

@Component({
  selector: "app-release-list",
  templateUrl: "./release-list.component.html",
  styleUrls: ["./release-list.component.scss"],
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatChipsModule,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    DatePipe,
  ],
})
export class ReleaseListComponent {
  displayedColumns = ["artist", "title", "year", "createwhen", "tags"];
  pageSizes = [10, 20, 50, 100];

  // For manipulating the sort programmatically.
  readonly sortService = inject(SortService);

  // I/O
  readonly releases = input<Release[]>([]);
  readonly order = input<string>();
  readonly sortChange = output<void>();
  readonly releaseListOpen = output<Release>();

  // Help
  readonly inputActive = computed(() => {
    const o = this.order() ?? "";
    return this.sortService.isValid(o, this.displayedColumns)
      ? this.sortService.getColumnId(o)
      : "";
  });

  readonly inputDirection = computed(() => {
    const o = this.order() ?? "desc";
    return this.sortService.isValid(o, this.displayedColumns)
      ? this.sortService.getDirection(o)
      : "desc";
  });
}
