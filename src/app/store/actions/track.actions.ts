export namespace TrackActions {
  export const Types = {
    requestTracksForRelease: '[Track][Request] tracks for release',
    responseTracksForRelease: '[Track][Response] tracks for release',
    errorTracksForRelease: '[Track][Error] tracks for release',
    requestDownload: '[Track][Request] download audio'
  };

  export class RequestDownload {
    readonly type = Types.requestDownload;
    constructor(public payload: { id: number }) {}
  }

  export class RequestTracksForRelease {
    readonly type = Types.requestTracksForRelease;
    constructor(public payload: { releaseId: string }) {}
  }

  export class ResponseTracksForRelease {
    readonly type = Types.responseTracksForRelease;
    constructor(public payload: { releaseId: string; tracks: Array<any> }) {}
  }
  export class ErrorTracksForRelease {
    readonly type = Types.errorTracksForRelease;
    constructor(public payload: any) {}
  }

  export type Actions = RequestTracksForRelease | ResponseTracksForRelease | ErrorTracksForRelease;
}
