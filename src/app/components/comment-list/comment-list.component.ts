import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from 'app/models/comment';

@Component({
  selector: 'app-comment-list-table',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
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
