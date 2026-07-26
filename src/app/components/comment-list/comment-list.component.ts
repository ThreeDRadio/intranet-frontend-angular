import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  effect,
} from "@angular/core";
import { Comment } from "app/models/comment";
import { getLoggedInUser } from "app/store/selectors";
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
import { Store } from "@ngrx/store";
import { Groups } from "../../constants";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CommentActions } from "../../store/actions/comment.actions";

@Component({
  selector: "app-comment-list-table",
  templateUrl: "./comment-list.component.html",
  styleUrls: ["./comment-list.component.scss"],
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatIcon,
    MatButtonModule,
  ],
})
export class CommentListComponent {
  private store: Store<any> = inject(Store<any>);

  commentColumns = ["author", "comment"];
  @Input()
  comments: Array<Comment> = [];

  @Input()
  truncate = false;

  @Output()
  commentSelected = new EventEmitter<Comment>();

  public groups = Groups;
  private readonly userGroups = this.store.selectSignal(
    (state) => getLoggedInUser(state)?.groups ?? [],
  );
  isModerator: boolean = false;

  constructor() {
    effect(() => {
      let moderator = this.userGroups().includes(this.groups.CommentModerators);
      this.isModerator = moderator;
      if (moderator) {
        this.commentColumns = ["author", "comment", "tools"];
      }
    });
  }

  onVisibilityClicked(event: Event, element: any) {
    // Don't take us to the release.
    event.stopPropagation();
    // Change the comment
    if (element.visible) {
      this.store.dispatch(
        new CommentActions.RequestModeratorRemoveComment({
          commentId: element.id,
        }),
      );
    }
  }
}
