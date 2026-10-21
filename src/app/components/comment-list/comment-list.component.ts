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
import {} from "@angular/material/table";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import { Store } from "@ngrx/store";
import { Groups } from "../../constants";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CommentActions } from "../../store/actions/comment.actions";
import { AsyncPipe } from "@angular/common";
import { Observable } from "rxjs";
import { isLoading } from "../../store/selectors";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";

@Component({
  selector: "app-comment-list-table",
  templateUrl: "./comment-list.component.html",
  styleUrls: ["./comment-list.component.scss"],
  imports: [
    MatSort,
    MatSortHeader,
    MatIcon,
    MatButtonModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
  ],
})
export class CommentListComponent {
  private store: Store<any> = inject(Store<any>);
  public loading$: Observable<boolean>;
  commentColumns = ["author", "comment"];

  @Input()
  comments: Comment[] = [];

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
    this.loading$ = this.store.select(isLoading);
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
    this.store.dispatch(
      new CommentActions.RequestModeratorRemoveComment({
        commentId: element.id,
      }),
    );
  }
}
