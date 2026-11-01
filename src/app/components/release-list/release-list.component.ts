import {
  Component,
  Input,
  Output,
  EventEmitter,
  viewChild,
  AfterViewInit,
  input,
  output,
  inject,
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
import {
  MatChipListbox,
  MatChipOption,
  MatChipsModule,
} from "@angular/material/chips";
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
export class ReleaseListComponent implements AfterViewInit {
  displayedColumns = ["artist", "title", "year", "createwhen", "tags"];
  pageSizes = [10, 20, 50, 100];

  // For manipulating the sort programmatically.
  readonly sort = viewChild(MatSort);
  readonly sortService = inject(SortService);

  // I/O
  readonly releases = input<Release[]>([]);
  readonly order = input<string>();
  readonly sortChange = output<void>();
  readonly releaseListOpen = output<Release>();

  ngAfterViewInit(): void {
    const orderInput = this.order();
    // Guard against invalid state.
    if (orderInput === null || orderInput === undefined) return;
    // If it's not in displayed columns, don't bother.
    if (this.sortService.isValid(orderInput, this.displayedColumns)) {
      this.setProgrammaticSort(
        this.sort(),
        this.sortService.getColumnId(orderInput),
        this.sortService.getDirection(orderInput),
      );
    }
  }

  setProgrammaticSort(
    sort: MatSort | undefined,
    columnId: string,
    direction: "asc" | "desc",
  ) {
    if (sort === null || sort === undefined) return;

    sort.active = columnId;
    sort.direction = direction;
    sort.sortChange.emit({ active: columnId, direction: direction });
  }
}
