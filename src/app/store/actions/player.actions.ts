import { Track } from 'app/models';

export namespace PlayerActions {
  export const Types = {
    RequestPlay: '[Player][Request] play',
    RequestPause: '[Player][Request] pause',
    RequestResume: '[Player][Request] continue',
    RequestSeek: '[Player][Request] seek',

    Playing: '[Player][Response] play',
    Paused: '[Player][Response] paused',
    Completed: '[Player][Response] complated',
    SeekSuccess: '[Player][Response] seek',
    UpdatePosition: '[Player][Update] position'
  };

  export class RequestPlay {
    readonly type = Types.RequestPlay;
    constructor(
      public payload: {
        track: Track;
      }
    ) {}
  }
  export class RequestPause {
    readonly type = Types.RequestPause;
  }
  export class RequestResume {
    readonly type = Types.RequestResume;
  }
  export class RequestSeek {
    readonly type = Types.RequestSeek;
    constructor(public payload: number) {}
  }

  export class Playing {
    readonly type = Types.Playing;
    constructor(
      public payload?: {
        track: Track;
      }
    ) {}
  }
  export class Paused {
    readonly type = Types.Paused;
  }
  export class SeekSuccess {
    readonly type = Types.SeekSuccess;
  }
  export class Completed {
    readonly type = Types.Completed;
  }

  export class UpdatePosition {
    readonly type = Types.UpdatePosition;
    constructor(public payload: number) {}
  }
  export type Actions =
    | RequestPause
    | RequestPlay
    | RequestResume
    | RequestSeek
    | Playing
    | Paused
    | Completed
    | SeekSuccess
    | UpdatePosition;
}
