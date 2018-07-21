import { Action } from '@ngrx/store';

export const REQUEST_SUBMIT_RELEASE = '[MusicUpload][Request] submit release';
export const RESPONSE_SUCCESS_SUBMIT_RELEASE = '[MusicUpload][Response][Success] submit release';
export const FILES_SELECTED = '[MusicUpload] files selected';
export const UPDATE_METADATA = '[MusicUpload update metadata';
export const REPORT_UPLOAD_LOG = '[MusicUpload][Progress] log';
export const REPORT_UPLOAD_PROGRESS = '[MusicUpload][Progress] progress';

export class UploadProgressLog implements Action {
  readonly type = REPORT_UPLOAD_LOG;
  constructor(public payload: string) {}
}

export class UploadProgressValue implements Action {
  readonly type = REPORT_UPLOAD_PROGRESS;
  constructor(public payload: number) {}
}

export class FilesSelectedAction implements Action {
  readonly type = FILES_SELECTED;
  constructor(public payload: Array<File>) {}
}

export class UpdateMetadataAction implements Action {
  readonly type = UPDATE_METADATA;
  constructor(public payload: { [id: string]: Object }) {}
}

export class RequestSubmitRelease implements Action {
  readonly type = REQUEST_SUBMIT_RELEASE;
  constructor(
    public payload: {
      album: {
        artist: string;
        company: string;
        compilation: number;
        cpa: string;
        female: number;
        local: number;
        title: string;
        year: number;
      };
      tracks: Array<{
        tracknum: number;
        trackartist: string;
        tracktitle: string;
        tracklength: number;
        file: File;
      }>;
    }
  ) {}
}
export class ResponseSuccessSubmitRelease implements Action {
  readonly type = RESPONSE_SUCCESS_SUBMIT_RELEASE;
  constructor(public payload) {}
}

export type MusicUploadAction =
  | ResponseSuccessSubmitRelease
  | RequestSubmitRelease
  | UpdateMetadataAction
  | FilesSelectedAction
  | UploadProgressLog
  | UploadProgressValue;
