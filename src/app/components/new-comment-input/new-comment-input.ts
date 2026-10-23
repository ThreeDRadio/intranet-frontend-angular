import { Component, computed, inject, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Release } from "../../models/release";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { UserService } from "../../services/user.service";
import { CommentActions } from "../../store/actions/comment.actions";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-new-comment-input",
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./new-comment-input.html",
  styleUrl: "./new-comment-input.scss",
})
export class NewCommentInputComponent {
  private userService = inject(UserService);
  private legacyStore = inject(Store<any>);
  input = input.required<Release>();
  loggedInUser = computed(() => this.userService.getLoggedInUser());
  gravatar = computed(() =>
    this.userService.getGravatarUrl(this.loggedInUser()),
  );

  makeComment() {
    const user = this.loggedInUser();

    this.legacyStore.dispatch(
      new CommentActions.RequestUserMakeComment({
        comment: "test",
        author: {
          first_name: user.first_name,
          last_name: user.last_name,
        },
        release: {
          id: this.input().id,
          artist: this.input().artist,
          title: this.input().title,
        },
      }),
    );
  }
}
