import { Comment } from "app/models/comment";

export namespace CommentActions {
  export const Types = {
    requestForRelease: "[Comment][Request] for release",
    responseForRelease: "[Comment][Response] for release",
    errorForRelease: "[Comment][Error] for release",
    requestMostRecent: "[Comment][Request] most recent",
    responseList: "[Comment][Response] list",
    errorList: "[Comment][Error] list",
    requestModeratorRemoveComment: "[Comment][Request] remove comment",
    responseModeratorRemoveComment: "[Comment][Response] remove comment",
    requestModeratorRestoreComment: "[Comment][Request] restore comment",
    responseModeratorRestoreComment: "[Comment][Response] restore comment",
  };

  export class RequestForRelease {
    readonly type = Types.requestForRelease;
    constructor(public payload: { releaseId: string }) {}
  }

  export class ResponseForRelease {
    readonly type = Types.responseForRelease;
    constructor(public payload: { releaseId: string; comments: Array<any> }) {}
  }

  export class RequestModeratorRemoveComment {
    readonly type = Types.requestModeratorRemoveComment;
    constructor(public payload: { commentId: number; comments: Array<any> }) {}
  }

  export class ResponseModeratorRemoveComment {
    readonly type = Types.responseModeratorRemoveComment;
    constructor(public payload: { commentId: number; comments: Array<any> }) {}
  }

  export class RequestModeratorRestoreComment {
    readonly type = Types.requestModeratorRestoreComment;
    constructor(public payload: { commentId: number; comments: Array<any> }) {}
  }

  export class ResponseModeratorRestoreComment {
    readonly type = Types.responseModeratorRestoreComment;
    constructor(public payload: { commentId: number; comments: Array<any> }) {}
  }

  export class RequestMostRecent {
    readonly type = Types.requestMostRecent;
  }
  export class ResponseList {
    readonly type = Types.responseList;
    constructor(
      public payload: {
        count: number;
        next: string;
        previous: string;
        results: Comment[];
      },
    ) {}
  }
  export class ErrorList {
    readonly type = Types.errorList;
    constructor(public payload: any) {}
  }
  export class ErrorForRelease {
    readonly type = Types.errorForRelease;
    constructor(public payload: any) {}
  }

  export type Actions =
    | RequestForRelease
    | ResponseForRelease
    | ErrorForRelease
    | RequestModeratorRemoveComment
    | ResponseModeratorRemoveComment
    | RequestModeratorRestoreComment
    | ResponseModeratorRestoreComment;
}
