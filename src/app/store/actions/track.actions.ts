export namespace TrackActions {
  export const Types = {
    requestForRelease: '[Track][Request] tracks for release',
    responseForRelease: '[Track][Response] tracks for release',
    errorForRelease: '[Track][Error] tracks for release',
    requestDownload: '[Track][Request] download audio'
  };

  export class RequestDownload {
    readonly type = Types.requestDownload;
    constructor(public payload: { id: number }) {}
  }

  export class RequestForRelease {
    readonly type = Types.requestForRelease;
    constructor(public payload: { releaseId: string }) {}
  }

  export class ResponseForRelease {
    readonly type = Types.responseForRelease;
    constructor(public payload: { releaseId: string; tracks: Array<any> }) {}
  }
  export class ErrorForRelease {
    readonly type = Types.errorForRelease;
    constructor(public payload: any) {}
  }

  export type Actions = RequestForRelease | ResponseForRelease | ErrorForRelease;
}
