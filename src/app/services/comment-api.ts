import { Injectable } from "@angular/core";

import { BaseApi } from "./base-api.service";
import { ModelApi } from "./model-api";
import { Comment } from "app/models/comment";

@Injectable()
export class CommentApi extends ModelApi<Comment> {
  constructor(api: BaseApi) {
    super("comments", api);
  }

  getForRelease(releaseId: string) {
    return this.http.get(`releases/${releaseId}/comments`);
  }

  makeComment(input) {
    return this.http.post(`releases/${input.release.id}/comments`, input);
  }

  hideComment(commentId: number) {
    return this.http.patch(`comments/${commentId}`, { visible: false });
  }

  restoreComment(commentId: number) {
    return this.http.patch(`comments/${commentId}`, { visible: true });
  }
}
