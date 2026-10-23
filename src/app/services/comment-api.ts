import { Injectable } from "@angular/core";

import { BaseApi } from "./base-api.service";
import { ModelApi } from "./model-api";
import { Comment } from "app/models/comment";
import { EMPTY } from "rxjs";

@Injectable()
export class CommentApi extends ModelApi<Comment> {
  constructor(api: BaseApi) {
    super("comments", api);
  }

  getForRelease(releaseId: string) {
    return this.http.get(`releases/${releaseId}/comments`);
  }

  hideComment(commentId: number) {
    return this.http.patch(`comments/${commentId}`, { visible: false });
  }

  restoreComment(commentId: number) {
    return this.http.patch(`comments/${commentId}`, { visible: true });
  }

  makeComment(input) {
    console.log(input);
    return EMPTY;
  }
}
