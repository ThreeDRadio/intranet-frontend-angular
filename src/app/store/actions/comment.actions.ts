import { Comment } from 'app/models/comment';

export namespace CommentActions {
  export const Types = {
    requestForRelease: '[Comment][Request] for release',
    responseForRelease: '[Comment][Response] for release',
    errorForRelease: '[Comment][Error] for release',
    requestMostRecent: '[Comment][Request] most recent',
    responseList: '[Comment][Response] list',
    errorList: '[Comment][Error] list'
  };

  export class RequestForRelease {
    readonly type = Types.requestForRelease;
    constructor(public payload: { releaseId: string }) {}
  }

  export class ResponseForRelease {
    readonly type = Types.responseForRelease;
    constructor(public payload: { releaseId: string; comments: Array<any> }) {}
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
        results: Array<Comment>;
      }
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

  export type Actions = RequestForRelease | ResponseForRelease | ErrorForRelease;
}
