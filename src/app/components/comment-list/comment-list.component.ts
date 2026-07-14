import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from 'app/models/comment';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';

@Component({
    selector: 'app-comment-list-table',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.scss'],
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class CommentListComponent {
  commentColumns = ['author', 'comment'];
  @Input()
  comments: Array<Comment> = [];

  @Input()
  truncate = false;

  @Output()
  commentSelected = new EventEmitter<Comment>();
}
