import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Release } from 'app/models/release';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-release-list',
    templateUrl: './release-list.component.html',
    styleUrls: ['./release-list.component.scss'],
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, MatChipListbox, MatChipOption, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DatePipe]
})
export class ReleaseListComponent {
  displayedColumns = ['artist', 'title', 'year', 'createwhen', 'tags'];
  pageSizes = [10, 20, 50, 100];

  @Input()
  releases: Array<Release>;

  @Output()
  sortChange = new EventEmitter();

  @Output()
  releaseListOpen = new EventEmitter<Release>();
}
